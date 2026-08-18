/**
 * Prediction Service
 * Calculates estimated next period date based on historical cycle data.
 * This is an ESTIMATE only — not a medical diagnosis.
 */

/**
 * Calculate standard deviation of an array of numbers
 */
const stdDev = (arr) => {
  if (arr.length < 2) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
  return Math.sqrt(variance);
};

/**
 * Weighted average — more recent cycles weighted more heavily
 */
const weightedAverage = (cycleLengths) => {
  if (!cycleLengths || cycleLengths.length === 0) return null;
  const n = cycleLengths.length;
  let totalWeight = 0;
  let weightedSum = 0;
  cycleLengths.forEach((len, i) => {
    const weight = i + 1; // more recent = higher index after sort = higher weight
    weightedSum += len * weight;
    totalWeight += weight;
  });
  return Math.round((weightedSum / totalWeight) * 10) / 10;
};

/**
 * Determine confidence level based on record count and cycle consistency
 */
const getConfidence = (recordCount, cycleLengths) => {
  if (recordCount < 2 || cycleLengths.length < 1) {
    return {
      level: 'limited',
      label: 'Limited Data',
      explanation: 'Add at least one more period record to improve your estimate.',
    };
  }

  const sd = stdDev(cycleLengths);

  if (recordCount >= 4 && sd <= 3) {
    return {
      level: 'high',
      label: 'Higher Confidence',
      explanation:
        'Your cycle history is consistent. This estimate is based on a regular pattern.',
    };
  }

  if (recordCount >= 2 && sd <= 7) {
    return {
      level: 'moderate',
      label: 'Moderate Confidence',
      explanation:
        'Based on a few cycle records. Adding more history will improve the accuracy.',
    };
  }

  return {
    level: 'low',
    label: 'Moderate Confidence',
    explanation:
      'Your cycle appears variable, so this estimate may be less accurate. Track more cycles for a better prediction.',
  };
};

/**
 * Main prediction function
 * @param {Array} periodRecords - Array of PeriodRecord documents, sorted by startDate ascending
 * @param {Object} userProfile - User object with averageCycleLength
 * @returns {Object} prediction result
 */
const calculatePrediction = (periodRecords, userProfile) => {
  const disclaimer =
    'This prediction is an estimate based on the cycle information you provide and may not always be accurate. It is not a medical diagnosis.';

  // No records at all
  if (!periodRecords || periodRecords.length === 0) {
    return {
      hasData: false,
      estimatedDate: null,
      estimatedDateFormatted: null,
      daysRemaining: null,
      averageCycleLength: userProfile?.averageCycleLength || 28,
      recentCycleLengths: [],
      confidence: {
        level: 'none',
        label: 'No Data',
        explanation: 'Start tracking your cycle to receive predictions.',
      },
      explanation: 'No period records found. Add your period history to get a prediction.',
      disclaimer,
    };
  }

  // Sort records by startDate ascending
  const sorted = [...periodRecords].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );

  // Calculate cycle lengths between consecutive period start dates
  const cycleLengths = [];
  for (let i = 1; i < sorted.length; i++) {
    const diffMs =
      new Date(sorted[i].startDate) - new Date(sorted[i - 1].startDate);
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays > 0 && diffDays <= 90) {
      // Sanity check
      cycleLengths.push(diffDays);
    }
  }

  const lastPeriod = sorted[sorted.length - 1];
  const confidence = getConfidence(sorted.length, cycleLengths);

  let avgCycleLength;
  let explanation;

  if (cycleLengths.length === 0) {
    // Only one record — use user's profile average cycle length
    avgCycleLength = userProfile?.averageCycleLength || 28;
    explanation = `Based on your profile setting of ${avgCycleLength} days average cycle, your next period is estimated from your last recorded period start date.`;
  } else {
    avgCycleLength = weightedAverage(cycleLengths) || userProfile?.averageCycleLength || 28;
    const recentLabel = cycleLengths.slice(-3).join(', ');
    explanation = `Based on your recent cycle lengths (${recentLabel} days), your estimated average cycle is ${avgCycleLength} days.`;
  }

  // Estimate next period start date
  const lastStartDate = new Date(lastPeriod.startDate);
  const estimatedDate = new Date(lastStartDate);
  estimatedDate.setDate(estimatedDate.getDate() + Math.round(avgCycleLength));

  // Days remaining
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  estimatedDate.setHours(0, 0, 0, 0);
  const diffDaysRemaining = Math.round(
    (estimatedDate - today) / (1000 * 60 * 60 * 24)
  );

  return {
    hasData: true,
    estimatedDate: estimatedDate.toISOString(),
    estimatedDateFormatted: estimatedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    daysRemaining: diffDaysRemaining,
    averageCycleLength: avgCycleLength,
    lastPeriodDate: lastPeriod.startDate,
    recentCycleLengths: cycleLengths.slice(-5), // Last 5 cycle lengths
    confidence,
    explanation,
    disclaimer,
  };
};

module.exports = { calculatePrediction };
