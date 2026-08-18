const express = require('express');
const { getTodayHydration, updateHydration, resetHydration, getHydrationHistory } = require('../controllers/hydrationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getTodayHydration);
router.put('/', updateHydration);
router.post('/reset', resetHydration);
router.get('/history', getHydrationHistory);

module.exports = router;
