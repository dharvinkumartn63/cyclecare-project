import { periodApi } from './periodApi';

export const predictionApi = {
  getPrediction: async () => {
    const res = await periodApi.getPeriods();
    const periods = res.data?.data || [];
    const latest = periods[0] || { startDate: new Date(Date.now() - 15 * 86400000).toISOString() };

    const lastStart = new Date(latest.startDate);
    const nextPeriodStart = new Date(lastStart);
    nextPeriodStart.setDate(nextPeriodStart.getDate() + 28);

    const fertileStart = new Date(nextPeriodStart);
    fertileStart.setDate(fertileStart.getDate() - 16);

    const fertileEnd = new Date(nextPeriodStart);
    fertileEnd.setDate(fertileEnd.getDate() - 11);

    const ovulationDate = new Date(nextPeriodStart);
    ovulationDate.setDate(ovulationDate.getDate() - 14);

    return {
      data: {
        success: true,
        data: {
          predictedStartDate: nextPeriodStart.toISOString(),
          predictedEndDate: new Date(nextPeriodStart.getTime() + 5 * 86400000).toISOString(),
          fertileWindowStart: fertileStart.toISOString(),
          fertileWindowEnd: fertileEnd.toISOString(),
          ovulationDate: ovulationDate.toISOString(),
          cyclePhase: 'Luteal Phase',
          daysUntilNextPeriod: Math.max(0, Math.ceil((nextPeriodStart - new Date()) / 86400000)),
        },
      },
    };
  },

  getCycleStats: async () => {
    return {
      data: {
        success: true,
        data: {
          averageCycleLength: 28,
          averagePeriodDuration: 5,
          totalCyclesTracked: 5,
          regularityScore: '95%',
        },
      },
    };
  },
};
