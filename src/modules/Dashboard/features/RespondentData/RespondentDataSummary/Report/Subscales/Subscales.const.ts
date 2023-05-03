export const enum SubscalesTypes {
  Table = 'Table',
}

export const subscales = [
  {
    id: '1',
    name: 'Subscale One',
    items: [
      {
        id: '11',
        type: SubscalesTypes.Table,
      },
      {
        id: '22',
        name: 'Subscale two',
        items: [
          {
            id: '111',
            type: SubscalesTypes.Table,
          },
        ],
      },
    ],
  },
];
