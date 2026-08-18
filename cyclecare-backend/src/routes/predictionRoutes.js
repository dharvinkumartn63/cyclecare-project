const express = require('express');
const { getPrediction, getCycleStats } = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getPrediction);

module.exports = router;
