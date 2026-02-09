import express from 'express';
import { query, body } from 'express-validator';
import {
  submitContact,
  getAllContacts,
  getContactById,
  updateContact,
  addContactNote,
  deleteContact,
  getContactStats,
  handleValidationErrors
} from '../controllers/contactController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// POST /api/contacts - Submit contact form
router.post('/', [
  body('name').notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
  body('phone').optional().isLength({ min: 10, max: 20 }).withMessage('Phone number must be between 10 and 20 characters'),
  body('subject').notEmpty().withMessage('Subject is required').isLength({ min: 3, max: 200 }).withMessage('Subject must be between 3 and 200 characters'),
  body('message').notEmpty().withMessage('Message is required').isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  body('category').optional().isIn(['general', 'job-inquiry', 'partnership', 'support', 'complaint', 'feedback']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority')
], handleValidationErrors, submitContact);

// GET /api/contacts - Get all contacts (protected)
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'in-progress', 'resolved', 'closed']).withMessage('Invalid status'),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  query('category').optional().isIn(['general', 'job-inquiry', 'partnership', 'support', 'complaint', 'feedback']).withMessage('Invalid category'),
  query('search').optional().isLength({ min: 2 }).withMessage('Search term must be at least 2 characters'),
  query('sortBy').optional().isIn(['createdAt', 'name', 'email', 'priority', 'status']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], handleValidationErrors, getAllContacts);

// GET /api/contacts/stats - Get contact statistics (protected)
router.get('/stats', auth, getContactStats);

// GET /api/contacts/:id - Get single contact (protected)
router.get('/:id', auth, getContactById);

// PUT /api/contacts/:id - Update contact (protected)
router.put('/:id', auth, [
  body('status').optional().isIn(['pending', 'in-progress', 'resolved', 'closed']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('category').optional().isIn(['general', 'job-inquiry', 'partnership', 'support', 'complaint', 'feedback']).withMessage('Invalid category'),
  body('notes').optional().isLength({ max: 2000 }).withMessage('Notes cannot exceed 2000 characters')
], handleValidationErrors, updateContact);

// POST /api/contacts/:id/notes - Add note to contact (protected)
router.post('/:id/notes', auth, [
  body('note').notEmpty().withMessage('Note content is required').isLength({ min: 1, max: 1000 }).withMessage('Note must be between 1 and 1000 characters')
], handleValidationErrors, addContactNote);

// DELETE /api/contacts/:id - Delete contact (protected)
router.delete('/:id', auth, deleteContact);

export default router;
