/**
 * Demo seed script — populates the database with one test user and sample data.
 * Run: npm run seed
 * NOTE: Only for development. Do not use in production.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const PeriodRecord = require('../models/PeriodRecord');
const HydrationRecord = require('../models/HydrationRecord');

const seed = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cyclecare';
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB');

  // Clean up existing demo user
  const existing = await User.findOne({ userId: 'demo_user' });
  if (existing) {
    await PeriodRecord.deleteMany({ userId: existing._id });
    await HydrationRecord.deleteMany({ userId: existing._id });
    await User.deleteOne({ _id: existing._id });
    console.log('🗑  Removed existing demo data');
  }

  // Create demo user
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash('Demo@1234', salt);

  const user = await User.create({
    name: 'Demo User',
    email: 'demo@cyclecare.app',
    userId: 'demo_user',
    passwordHash,
    averageCycleLength: 28,
    averagePeriodDuration: 5,
    profileSetupComplete: true,
    dailyHydrationGoal: 8,
  });

  console.log(`👤 Created demo user: demo_user / Demo@1234`);

  // Seed 5 period records (roughly monthly)
  const today = new Date();
  const periodDates = [
    { monthsBack: 4, durationDays: 5 },
    { monthsBack: 3, durationDays: 6 },
    { monthsBack: 2, durationDays: 4 },
    { monthsBack: 1, durationDays: 5 },
    { monthsBack: 0, daysBack: 15, durationDays: 5 },
  ];

  for (const pd of periodDates) {
    const start = new Date(today);
    if (pd.monthsBack) start.setMonth(start.getMonth() - pd.monthsBack);
    if (pd.daysBack) start.setDate(start.getDate() - pd.daysBack);
    start.setDate(1);

    const end = new Date(start);
    end.setDate(end.getDate() + pd.durationDays - 1);

    await PeriodRecord.create({ userId: user._id, startDate: start, endDate: end });
  }

  console.log('🌸 Created 5 sample period records');

  // Update user lastPeriodStartDate
  const latest = await PeriodRecord.findOne({ userId: user._id }).sort({ startDate: -1 });
  await User.findByIdAndUpdate(user._id, { lastPeriodStartDate: latest?.startDate });

  // Seed hydration records (last 7 days)
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const glasses = i === 0 ? 3 : Math.floor(Math.random() * 9);
    await HydrationRecord.create({ userId: user._id, date: dateStr, completedGlasses: glasses, dailyGoal: 8 });
  }

  console.log('💧 Created 7 days of hydration history');
  console.log('\n✅ Seed complete!');
  console.log('   Login: demo_user / Demo@1234');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((e) => { console.error(e); process.exit(1); });
