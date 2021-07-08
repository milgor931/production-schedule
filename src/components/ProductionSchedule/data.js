export const sources = [
    { value: 'units', name: 'Units' },
    { value: 'emps', name: 'Employees' },
  ];
  
  export const sharingStatisticsInfo = [{
    month: 1997,
    units: 263,
    emps: 226,
  }, {
    year: 1999,
    units: 23,
    emps: 26,
  }, {
    year: 2001,
    units: 212,
    emps: 6,
  }
];
// create JSON data ---> work for the chart
// commit!!! every 3:)

// documentation for map function (don't use for loop)

export const shopData = [
  [
    {
      'name': 'Shop A',
      'week': '7/14/2021',

      'units': 99,
      'emps': 29
    },
    {
      'name': 'Shop A',
      'week': '7/28/2021',
      'units': 123,
      'emps': 12
    },
    {
      'name': 'Shop A',
      'week': '8/6/2021',
      'units': 13,
      'emps': 22
    },
    {
      'name': 'Shop A',
      'week': '9/8/2021',
      'units': 420,
      'emps': 22
    },
    {
      'name': 'Shop A',
      'week': '8/20/2021',
      'units': 10,
      'emps': 8
    }
  ],
  [
    {
      'name': 'Shop B',
      'week': '5/5/2021',
      'units': 240,
      'emps': 2
    },
    {
      'name': 'Shop B',
      'week': '7/28/2021',
      'units': 29,
      'emps': 58
    },
    {
      'name': 'Shop B',
      'week': '8/6/2021',
      'units': 88,
      'emps': 98
    },
    {
      'name': 'Shop B',
      'week': '9/8/2021',
      'units': 13,
      'emps': 22
    },
    {
      'name': 'Shop B',
      'week': '8/20/2021',
      'units': 10,
      'emps': 8
    }
  ],
  [
    {
      'name': 'Shop C',
      'week': '5/14/2021',
      'units': 99,
      'emps': 29
    },
    {
      'name': 'Shop C',
      'week': '3/28/2021',
      'units': 123,
      'emps': 12
    },
    {
      'name': 'Shop C',
      'week': '2/6/2021',
      'units': 13,
      'emps': 22
    },
    {
      'name': 'Shop C',
      'week': '9/1/2021',
      'units': 13,
      'emps': 22
    },
    {
      'name': 'Shop C',
      'week': '8/20/2021',
      'units': 10,
      'emps': 8
    }
  ]
]

export const tasks = [
  {
    'id': 1,
    'parentId': 0,
    // 'start': '',
    'jobName': 'Shop B Units',
    "title": "Shop B Units",
    "booked": true,
    "header": true
  }, {
    'id': 3,
    'parentId': 1,
    'start': '7/20/21',
    'end': '7/25/21',
    'shopStart': '8/31/20',
    'fieldStart': '7/31/20',
    'progress': 100,
    "jobNumber": "10-752",
    "jobName": "George Shultz Bldg.",
    "title": "George Shultz Bldg.",
    "wallType": "Unitized CW Custom",
    "customer": "Devcon",
    "emps": 12,
    "units": 752,
    "booked": true,
    "unitsPerWeek": 40
  }, {
    'id': 4,
    'parentId': 1,
    'start': '6/2/21',
    'end': '6/15/21',
    'shopStart': '8/31/20',
    'fieldStart': '7/31/20',
    'progress': 31,
    "jobNumber": "10-713",
    "jobName": "Stevens Creek Phase 2",
    "title": "Stevens Creek Phase 2",
    "wallType": "Unitized CW Custom",
    "customer": "Vance Brown",
    "emps": 12,
    "units": 752,
    "booked": true,
    "unitsPerWeek": 30
  },
  {
    'id': 5,
    'parentId': 1,
    'start': '8/2/21',
    'end': '8/15/21',
    'shopStart': '8/31/20',
    'fieldStart': '7/31/20',
    'progress': 60,
    "jobNumber": "10-738",
    "jobName": "Mathilda Commons Parking",
    "title": "Mathilda Commons Parking",
    "wallType": "Unitized CW Custom",
    "customer": "Level 10",
    "emps": 12,
    "units": 752,
    "booked": true,
    "unitsPerWeek": 10
  },

  {
    'id': 6,
    'parentId': 0,
    // 'start': '',
    'jobName': 'Shop A Units',
    "title": "Shop A Units",
    "booked": true,
    "header": true
  }, {
    'id': 7,
    'parentId': 6,
    'start': '7/2/21',
    'end': '7/15/21',
    'shopStart': '8/31/20',
    'fieldStart': '7/31/20',
    'progress': 100,
    "jobNumber": "10-752",
    "jobName": "George Shultz Bldg.",
    "title": "George Shultz Bldg.",
    "wallType": "Unitized CW Custom",
    "customer": "Devcon",
    "emps": 12,
    "units": 752,
    "booked": true,
    "unitsPerWeek": 400
  }, {
    'id': 8,
    'parentId': 6,
    'start': '7/2/21',
    'end': '7/15/21',
    'shopStart': '8/31/20',
    'fieldStart': '7/31/20',
    'progress': 31,
    "jobNumber": "10-713",
    "jobName": "Stevens Creek Phase 2",
    "title": "Stevens Creek Phase 2",
    "wallType": "Unitized CW Custom",
    "customer": "Vance Brown",
    "emps": 12,
    "units": 752,
    "booked": false,
    "unitsPerWeek": 120
  },
  {
    'id': 9,
    'parentId': 6,
    'start': '7/2/21',
    'end': '7/15/21',
    'shopStart': '8/31/20',
    'fieldStart': '7/31/20',
    'progress': 60,
    "jobNumber": "10-738",
    "jobName": "Mathilda Commons Parking",
    "title": "Mathilda Commons Parking",
    "wallType": "Unitized CW Custom",
    "customer": "Level 10",
    "emps": 12,
    "units": 752,
    "booked": false,
    "unitsPerWeek": 10
  }

];
  