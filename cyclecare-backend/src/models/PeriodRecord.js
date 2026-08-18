const mongoose = require('mongoose');

const periodRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Period start date is required'],
    },
    endDate: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number,
      default: null, // Calculated when endDate is set
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Validate dates & auto-calculate duration before saving
periodRecordSchema.pre('save', function () {
  if (this.endDate && this.startDate && new Date(this.endDate) < new Date(this.startDate)) {
    throw new Error('End date cannot be before start date');
  }
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(new Date(this.endDate) - new Date(this.startDate));
    this.duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
  }
});

// Index for efficient queries by userId and startDate
periodRecordSchema.index({ userId: 1, startDate: -1 });

module.exports = mongoose.model('PeriodRecord', periodRecordSchema);
