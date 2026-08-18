const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      unique: true,
      trim: true,
      minlength: [3, 'User ID must be at least 3 characters'],
      maxlength: [30, 'User ID cannot exceed 30 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'User ID can only contain letters, numbers, and underscores'],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    // Cycle profile fields
    averageCycleLength: {
      type: Number,
      default: 28,
      min: [15, 'Cycle length must be at least 15 days'],
      max: [60, 'Cycle length cannot exceed 60 days'],
    },
    averagePeriodDuration: {
      type: Number,
      default: 5,
      min: [1, 'Period duration must be at least 1 day'],
      max: [14, 'Period duration cannot exceed 14 days'],
    },
    lastPeriodStartDate: {
      type: Date,
      default: null,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    profileSetupComplete: {
      type: Boolean,
      default: false,
    },
    // Hydration goal
    dailyHydrationGoal: {
      type: Number,
      default: 8,
      min: [1, 'Hydration goal must be at least 1 glass'],
      max: [20, 'Hydration goal cannot exceed 20 glasses'],
    },
    // Notification preferences (embedded)
    notificationPreferences: {
      periodReminder: { type: Boolean, default: false },
      hydrationReminder: { type: Boolean, default: false },
      cycleUpdateReminder: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
