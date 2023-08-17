export enum SearchAcross {
  All = 'all',
  Selected = 'selected',
  Unselected = 'unselected',
}

export const options = [
  { label: SearchAcross.All, value: SearchAcross.All },
  { label: SearchAcross.Selected, value: SearchAcross.Selected },
  { label: SearchAcross.Unselected, value: SearchAcross.Unselected },
];
