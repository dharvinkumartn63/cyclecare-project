/**
 * Shared date utility helpers
 */
import { format, formatDistanceToNow, differenceInDays, parseISO } from 'date-fns';

export const formatDate = (date, fmt = 'MMM d, yyyy') => {
  if (!date) return '—';
  try {
    let parsed = date;
    if (typeof date === 'string') {
      // Clean up duplicate ISO formats if any
      const cleaned = date.includes('T') && date.indexOf('T') !== date.lastIndexOf('T')
        ? date.substring(0, date.lastIndexOf('T'))
        : date;
      parsed = parseISO(cleaned);
    }
    if (!parsed || isNaN(new Date(parsed).getTime())) return '—';
    return format(parsed, fmt);
  } catch {
    return '—';
  }
};

export const formatRelative = (date) => {
  if (!date) return '—';
  try {
    let parsed = date;
    if (typeof date === 'string') {
      const cleaned = date.includes('T') && date.indexOf('T') !== date.lastIndexOf('T')
        ? date.substring(0, date.lastIndexOf('T'))
        : date;
      parsed = parseISO(cleaned);
    }
    if (!parsed || isNaN(new Date(parsed).getTime())) return '—';
    return formatDistanceToNow(parsed, { addSuffix: true });
  } catch {
    return '—';
  }
};

export const daysFromToday = (date) => {
  if (!date) return null;
  try {
    let parsed = date;
    if (typeof date === 'string') {
      const cleaned = date.includes('T') && date.indexOf('T') !== date.lastIndexOf('T')
        ? date.substring(0, date.lastIndexOf('T'))
        : date;
      parsed = parseISO(cleaned);
    }
    if (!parsed || isNaN(new Date(parsed).getTime())) return null;
    return differenceInDays(parsed, new Date());
  } catch {
    return null;
  }
};

export const todayStr = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getInitials = (name = '') => {
  if (!name || typeof name !== 'string') return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
};

export const confidenceColor = (level) => {
  switch (level) {
    case 'high': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    case 'moderate': return 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30';
    case 'low': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
    default: return 'text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-800';
  }
};
