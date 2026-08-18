const express = require('express');
const { getCycleStats } = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', getCycleStats);

module.exports = router;
