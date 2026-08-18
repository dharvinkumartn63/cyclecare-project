/**
 * Shared date utility helpers
 */
import { format, formatDistanceToNow, differenceInDays, parseISO } from 'date-fns';

export const formatDate = (date, fmt = 'MMM d, yyyy') => {
  if (!date) return '—';
  try {
    return format(typeof date === 'string' ? parseISO(date) : date, fmt);
  } catch {
    return '—';
  }
};

export const formatRelative = (date) => {
  if (!date) return '—';
  try {
    return formatDistanceToNow(typeof date === 'string' ? parseISO(date) : date, { addSuffix: true });
  } catch {
    return '—';
  }
};

export const daysFromToday = (date) => {
  if (!date) return null;
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return differenceInDays(d, new Date());
  } catch {
    return null;
  }
};

export const todayStr = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getInitials = (name = '') => {
  if (!name) return '?';
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
