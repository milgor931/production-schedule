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

// export const shopData = [
//   [
//     {
//       'name': 'Shop A',
//       'week': '7/14/2021',

//       'units': 99,
//       'emps': 29
//     },
//     {
//       'name': 'Shop A',
//       'week': '7/28/2021',
//       'units': 123,
//       'emps': 12
//     },
//     {
//       'name': 'Shop A',
//       'week': '8/6/2021',
//       'units': 13,
//       'emps': 22
//     },
//     {
//       'name': 'Shop A',
//       'week': '9/8/2021',
//       'units': 420,
//       'emps': 22
//     },
//     {
//       'name': 'Shop A',
//       'week': '8/20/2021',
//       'units': 10,
//       'emps': 8
//     }
//   ],
//   [
//     {
//       'name': 'Shop B',
//       'week': '5/5/2021',
//       'units': 240,
//       'emps': 2
//     },
//     {
//       'name': 'Shop B',
//       'week': '7/28/2021',
//       'units': 29,
//       'emps': 58
//     },
//     {
//       'name': 'Shop B',
//       'week': '8/6/2021',
//       'units': 88,
//       'emps': 98
//     },
//     {
//       'name': 'Shop B',
//       'week': '9/8/2021',
//       'units': 13,
//       'emps': 22
//     },
//     {
//       'name': 'Shop B',
//       'week': '8/20/2021',
//       'units': 10,
//       'emps': 8
//     }
//   ],
//   [
//     {
//       'name': 'Shop C',
//       'week': '5/14/2021',
//       'units': 99,
//       'emps': 29
//     },
//     {
//       'name': 'Shop C',
//       'week': '3/28/2021',
//       'units': 123,
//       'emps': 12
//     },
//     {
//       'name': 'Shop C',
//       'week': '2/6/2021',
//       'units': 13,
//       'emps': 22
//     },
//     {
//       'name': 'Shop C',
//       'week': '9/1/2021',
//       'units': 13,
//       'emps': 22
//     },
//     {
//       'name': 'Shop C',
//       'week': '8/20/2021',
//       'units': 10,
//       'emps': 8
//     }
//   ]
// ]

export const jobs = [
  {
    'id': 1,
    'start': '7/1/2021',
    'end': '',
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
    "unitsPerWeek": 40,
    "shop": "Shop A",
    "offset": 0
  }, {
    'id': 2, 
    'start': '7/8/2021',
    'end': '',
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
    "unitsPerWeek": 30,
    "shop": "Shop A",
    "offset": 1
  },
  {
    'id': 3,
    'start': '8/5/2021',
    'end': '',
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
    "unitsPerWeek": 10,
    "shop": "Shop A",
    "offset": 5
  },
  {
    'id': 4,
    'start': '9/9/2021',
    'end': '',
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
    "unitsPerWeek": 400,
    "shop": "Shop B",
    "offset": 10
  }, 
  {
    'id': 5,
    'start': '10/14/2021',
    'end': '',
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
    "unitsPerWeek": 120,
    "shop": "Shop B",
    "offset": 15
  },
  {
    'id': 6,
    'start': '10/28/2021',
    'end': '',
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
    "unitsPerWeek": 10,
    "shop": "Shop B",
    "offset": 17
  }

];
  