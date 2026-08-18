const express = require('express');
const { body } = require('express-validator');
const { getPeriods, createPeriod, updatePeriod, deletePeriod } = require('../controllers/periodController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getPeriods);

router.post(
  '/',
  [
    body('startDate').notEmpty().withMessage('Start date is required.').isISO8601().withMessage('Invalid start date format.'),
    body('endDate').optional({ nullable: true }).isISO8601().withMessage('Invalid end date format.'),
  ],
  createPeriod
);

router.put(
  '/:id',
  [
    body('startDate').optional().isISO8601().withMessage('Invalid start date format.'),
    body('endDate').optional({ nullable: true }).isISO8601().withMessage('Invalid end date format.'),
  ],
  updatePeriod
);

router.delete('/:id', deletePeriod);

module.exports = router;
