import express from 'express';
import mongoose from 'mongoose';
import Course from '../models/Course.js';

const router = express.Router();

// Helper — returns true if id is a valid MongoDB ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get all courses
router.get('/', async (req, res) => {
  try {
    // $ne: false includes courses where isActive is true OR not set at all
    const courses = await Course.find({ isActive: { $ne: false } }).sort({ createdAt: -1 });
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single course by ID or slug
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let course;

    if (isValidId(id)) {
      // Valid MongoDB ObjectId — query by _id
      course = await Course.findById(id);
    } else {
      // Not a valid ObjectId (e.g. "2", "python-programming") — try slug lookup
      course = await Course.findOne({ slug: id });
    }

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create course (admin)
router.post('/', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json({ success: true, message: 'Course created', data: course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update course (admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Guard against invalid ObjectId — prevents CastError → 400
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: `Invalid course ID: "${id}". Use a valid MongoDB ObjectId.` });
    }

    // runValidators: false allows partial updates (e.g. curriculum-only saves)
    // without failing on other required fields that aren't being updated
    const course = await Course.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: false,
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({ success: true, message: 'Course updated', data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete course (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: `Invalid course ID: "${id}"` });
    }

    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
