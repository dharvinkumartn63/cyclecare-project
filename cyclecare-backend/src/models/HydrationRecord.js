const mongoose = require('mongoose');

const hydrationRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String, // Store as YYYY-MM-DD string for easy daily lookup
      required: true,
    },
    completedGlasses: {
      type: Number,
      default: 0,
      min: [0, 'Completed glasses cannot be negative'],
    },
    dailyGoal: {
      type: Number,
      default: 8,
      min: [1, 'Daily goal must be at least 1'],
      max: [20, 'Daily goal cannot exceed 20'],
    },
  },
  {
    timestamps: true,
  }
);

// Unique constraint: one record per user per day
hydrationRecordSchema.index({ userId: 1, date: 1 }, { unique: true });

// Virtual for completion percentage
hydrationRecordSchema.virtual('completionPercentage').get(function () {
  if (!this.dailyGoal) return 0;
  return Math.min(Math.round((this.completedGlasses / this.dailyGoal) * 100), 100);
});

hydrationRecordSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('HydrationRecord', hydrationRecordSchema);
