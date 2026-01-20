// config/timeline.js - Single source of truth for all timeline events
// v7.1: Ensures launch plan and financial model stay synchronized
// NOTE: This file uses ES6 exports and is not loaded by index.html
// Kept for potential future use with build step

export const TIMELINE = {
  // Foundation dates - EDIT THESE to change everything
  modelStartDate: '2024-08-01',
  fundLaunchDate: '2026-02-01',
  lewisStartDate: '2025-09-01',
  projectionMonths: 36,
  
  // Milestones with triggers
  milestones: [
    { id: 'model_start', name: 'Model Start', date: '2024-08-01', editable: false },
    { id: 'lewis_start', name: 'Lewis Starts (COO)', date: '2025-09-01', editable: true },
    { id: 'chairman_prepaid_end', name: 'Chairman Prepaid Ends', date: '2026-03-31', editable: true },
    { id: 'fund_launch', name: 'Fund Launch', date: '2026-02-01', editable: true, critical: true },
    { id: 'bdm_start', name: 'BDM Raise Begins', relativeMonth: 7, editable: true },
    { id: 'lewis_end', name: 'Lewis Tenure Ends', relativeMonth: 12, editable: true },
    { id: 'first_redemption', name: 'First Redemption Window', relativeMonth: 25, editable: true },
  ],
};

// Calculate months between two dates
export function monthsBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.round((end - start) / (30.44 * 24 * 60 * 60 * 1000));
}

// Derive fund launch month from dates
export function getFundLaunchMonth(timeline = TIMELINE) {
  return monthsBetween(timeline.modelStartDate, timeline.fundLaunchDate) + 1;
}

// Get chairman prepaid end month
export function getChairmanPrepaidEndMonth(timeline = TIMELINE) {
  const prepaidEnd = timeline.milestones.find(m => m.id === 'chairman_prepaid_end');
  return prepaidEnd ? monthsBetween(timeline.modelStartDate, prepaidEnd.date) + 1 : 8;
}

// Convert timeline to model assumptions
export function deriveAssumptionsFromTimeline(timeline = TIMELINE) {
  return {
    modelStartDate: timeline.modelStartDate,
    fundLaunchDate: timeline.fundLaunchDate,
    lewisStartDate: timeline.lewisStartDate,
    fundLaunchMonth: getFundLaunchMonth(timeline),
    chairmanPrepaidEndMonth: getChairmanPrepaidEndMonth(timeline),
    bdmStartMonth: timeline.milestones.find(m => m.id === 'bdm_start')?.relativeMonth || 7,
    lewisMonths: timeline.milestones.find(m => m.id === 'lewis_end')?.relativeMonth || 12,
    redemptionStartMonth: timeline.milestones.find(m => m.id === 'first_redemption')?.relativeMonth || 25,
  };
}

// Get month label (e.g., "Feb 2026")
export function getMonthLabel(monthNumber, timeline = TIMELINE) {
  const start = new Date(timeline.modelStartDate);
  start.setMonth(start.getMonth() + monthNumber - 1);
  return start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// Validate timeline for conflicts
export function validateTimeline(timeline = TIMELINE) {
  const warnings = [];
  const fundLaunchMonth = getFundLaunchMonth(timeline);
  
  const bdm = timeline.milestones.find(m => m.id === 'bdm_start');
  if (bdm && bdm.relativeMonth < fundLaunchMonth) {
    warnings.push({ level: 'error', message: 'BDM raise cannot start before fund launch' });
  }
  
  const lewis = timeline.milestones.find(m => m.id === 'lewis_end');
  if (lewis && lewis.relativeMonth < fundLaunchMonth) {
    warnings.push({ level: 'warning', message: 'Lewis tenure ends before fund launch' });
  }
  
  const redemption = timeline.milestones.find(m => m.id === 'first_redemption');
  if (redemption && redemption.relativeMonth < 24) {
    warnings.push({ level: 'warning', message: 'Redemption window earlier than typical 24-month lockup' });
  }
  
  return warnings;
}
