export const mockedScheduleData = new Array(22).fill(null).map((_, index) => ({
  activityName: {
    content: () => `Pediatric Screener #${index}`,
    value: `Pediatric Screener ${index}`,
  },
  date: {
    content: () => '07 Dec 2022',
    value: '07 Dec 2022',
  },
  startTime: {
    content: () => '8:00',
    value: '8:00',
  },
  endTime: {
    content: () => '19:00',
    value: '19:00',
  },
  notificationTime: {
    content: () => '19:00',
    value: '19:00',
  },
  repeats: {
    content: () => (index % 2 ? 'Yes' : 'No'),
    value: index % 2 ? 'Yes' : 'No',
  },
  frequency: {
    content: () => (index % 2 ? 'Daily' : 'Weekday'),
    value: index % 2 ? 'Daily' : 'Weekday',
  },
}));
