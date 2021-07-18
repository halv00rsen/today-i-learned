export const getFormattedDateWithTime = (date: Date): string => {
  return date.toLocaleDateString(['no', 'en'], {
    day: '2-digit',
    year: 'numeric',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h24',
  });
};
