export const getScreens = (
  type: 'individual' | 'default',
  components: Record<'individual' | 'default', JSX.Element[]>,
) => [
  {
    component: components[type][0],
    btnText: 'continue',
    hasSecondBtn: true,
    secondBtnText: 'cancel',
    submitBtnColor: type === 'default' ? 'error' : 'primary',
  },
  { component: components[type][1], btnText: 'import', hasSecondBtn: false },
  {
    component: components[type][2],
    btnText: 'updateSchedule',
    hasSecondBtn: true,
    secondBtnText: 'cancel',
    submitBtnColor: type === 'default' ? 'error' : 'primary',
  },
];
