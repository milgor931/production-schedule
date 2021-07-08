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
  
  export const dependencies = [
    // {
  //   'id': 1,
  //   'predecessorId': 3,
  //   'successorId': 4,
  //   'type': 0
  // }, {
  //   'id': 2,
  //   'predecessorId': 4,
  //   'successorId': 5,
  //   'type': 0
  // }, {
  //   'id': 3,
  //   'predecessorId': 5,
  //   'successorId': 6,
  //   'type': 0
  // }, {
  //   'id': 4,
  //   'predecessorId': 6,
  //   'successorId': 7,
  //   'type': 0
  // }, {
  //   'id': 5,
  //   'predecessorId': 7,
  //   'successorId': 9,
  //   'type': 0
  // }, {
  //   'id': 6,
  //   'predecessorId': 9,
  //   'successorId': 10,
  //   'type': 0
  // }, {
  //   'id': 7,
  //   'predecessorId': 10,
  //   'successorId': 11,
  //   'type': 0
  // }, {
  //   'id': 8,
  //   'predecessorId': 11,
  //   'successorId': 12,
  //   'type': 0
  // }, {
  //   'id': 9,
  //   'predecessorId': 12,
  //   'successorId': 13,
  //   'type': 0
  // }, {
  //   'id': 10,
  //   'predecessorId': 13,
  //   'successorId': 14,
  //   'type': 0
  // }, {
  //   'id': 11,
  //   'predecessorId': 14,
  //   'successorId': 15,
  //   'type': 0
  // }, {
  //   'id': 12,
  //   'predecessorId': 15,
  //   'successorId': 16,
  //   'type': 0
  // }, {
  //   'id': 13,
  //   'predecessorId': 16,
  //   'successorId': 17,
  //   'type': 0
  // }, {
  //   'id': 14,
  //   'predecessorId': 17,
  //   'successorId': 19,
  //   'type': 0
  // }, {
  //   'id': 15,
  //   'predecessorId': 19,
  //   'successorId': 20,
  //   'type': 0
  // }, {
  //   'id': 16,
  //   'predecessorId': 20,
  //   'successorId': 21,
  //   'type': 0
  // }, {
  //   'id': 17,
  //   'predecessorId': 21,
  //   'successorId': 22,
  //   'type': 0
  // }, {
  //   'id': 18,
  //   'predecessorId': 22,
  //   'successorId': 23,
  //   'type': 0
  // }, {
  //   'id': 19,
  //   'predecessorId': 23,
  //   'successorId': 24,
  //   'type': 0
  // }, {
  //   'id': 20,
  //   'predecessorId': 24,
  //   'successorId': 25,
  //   'type': 0
  // }, {
  //   'id': 21,
  //   'predecessorId': 25,
  //   'successorId': 27,
  //   'type': 0
  // }, {
  //   'id': 22,
  //   'predecessorId': 27,
  //   'successorId': 28,
  //   'type': 0
  // }, {
  //   'id': 23,
  //   'predecessorId': 28,
  //   'successorId': 29,
  //   'type': 0
  // }, {
  //   'id': 24,
  //   'predecessorId': 29,
  //   'successorId': 30,
  //   'type': 0
  // }, {
  //   'id': 25,
  //   'predecessorId': 31,
  //   'successorId': 32,
  //   'type': 0
  // }, {
  //   'id': 26,
  //   'predecessorId': 37,
  //   'successorId': 38,
  //   'type': 0
  // }, {
  //   'id': 27,
  //   'predecessorId': 38,
  //   'successorId': 39,
  //   'type': 0
  // }, {
  //   'id': 28,
  //   'predecessorId': 39,
  //   'successorId': 40,
  //   'type': 0
  // }, {
  //   'id': 29,
  //   'predecessorId': 40,
  //   'successorId': 41,
  //   'type': 0
  // }, {
  //   'id': 30,
  //   'predecessorId': 41,
  //   'successorId': 42,
  //   'type': 0
  // }, {
  //   'id': 31,
  //   'predecessorId': 42,
  //   'successorId': 44,
  //   'type': 0
  // }, {
  //   'id': 32,
  //   'predecessorId': 44,
  //   'successorId': 45,
  //   'type': 0
  // }, {
  //   'id': 33,
  //   'predecessorId': 45,
  //   'successorId': 46,
  //   'type': 0
  // }, {
  //   'id': 34,
  //   'predecessorId': 46,
  //   'successorId': 47,
  //   'type': 0
  // }, {
  //   'id': 35,
  //   'predecessorId': 47,
  //   'successorId': 48,
  //   'type': 0
  // }, {
  //   'id': 36,
  //   'predecessorId': 53,
  //   'successorId': 54,
  //   'type': 0
  // }, {
  //   'id': 37,
  //   'predecessorId': 54,
  //   'successorId': 55,
  //   'type': 0
  // }, {
  //   'id': 38,
  //   'predecessorId': 55,
  //   'successorId': 56,
  //   'type': 0
  // }, {
  //   'id': 39,
  //   'predecessorId': 56,
  //   'successorId': 57,
  //   'type': 0
  // }, {
  //   'id': 40,
  //   'predecessorId': 59,
  //   'successorId': 60,
  //   'type': 0
  // }, {
  //   'id': 41,
  //   'predecessorId': 60,
  //   'successorId': 61,
  //   'type': 0
  // }, {
  //   'id': 42,
  //   'predecessorId': 61,
  //   'successorId': 62,
  //   'type': 0
  // }, {
  //   'id': 43,
  //   'predecessorId': 63,
  //   'successorId': 64,
  //   'type': 0
  // }, {
  //   'id': 44,
  //   'predecessorId': 64,
  //   'successorId': 65,
  //   'type': 0
  // }, {
  //   'id': 45,
  //   'predecessorId': 65,
  //   'successorId': 66,
  //   'type': 0
  // }, {
  //   'id': 46,
  //   'predecessorId': 66,
  //   'successorId': 67,
  //   'type': 0
  // }, {
  //   'id': 47,
  //   'predecessorId': 69,
  //   'successorId': 70,
  //   'type': 0
  // }, {
  //   'id': 48,
  //   'predecessorId': 70,
  //   'successorId': 71,
  //   'type': 0
  // }, {
  //   'id': 49,
  //   'predecessorId': 71,
  //   'successorId': 72,
  //   'type': 0
  // }, {
  //   'id': 50,
  //   'predecessorId': 72,
  //   'successorId': 73,
  //   'type': 0
  // }, {
  //   'id': 51,
  //   'predecessorId': 73,
  //   'successorId': 74,
  //   'type': 0
  // }, {
  //   'id': 52,
  //   'predecessorId': 74,
  //   'successorId': 76,
  //   'type': 0
  // }, {
  //   'id': 53,
  //   'predecessorId': 76,
  //   'successorId': 77,
  //   'type': 0
  // }, {
  //   'id': 54,
  //   'predecessorId': 77,
  //   'successorId': 78,
  //   'type': 0
  // }, {
  //   'id': 55,
  //   'predecessorId': 78,
  //   'successorId': 79,
  //   'type': 0
  // }, {
  //   'id': 56,
  //   'predecessorId': 79,
  //   'successorId': 80,
  //   'type': 0
  // }, {
  //   'id': 57,
  //   'predecessorId': 80,
  //   'successorId': 81,
  //   'type': 0
  // }, {
  //   'id': 58,
  //   'predecessorId': 81,
  //   'successorId': 83,
  //   'type': 0
  // }, {
  //   'id': 59,
  //   'predecessorId': 83,
  //   'successorId': 84,
  //   'type': 0
  // }, {
  //   'id': 60,
  //   'predecessorId': 84,
  //   'successorId': 85,
  //   'type': 0
  // }, {
  //   'id': 61,
  //   'predecessorId': 85,
  //   'successorId': 86,
  //   'type': 0
  // }, {
  //   'id': 62,
  //   'predecessorId': 86,
  //   'successorId': 87,
  //   'type': 0
  // }
];
  
  export const resources = [
  // {
  //   'id': 1,
  //   'text': 'Management'
  // }, {
  //   'id': 2,
  //   'text': 'Project Manager'
  // }, {
  //   'id': 3,
  //   'text': 'Analyst'
  // }, {
  //   'id': 4,
  //   'text': 'Developer'
  // }, {
  //   'id': 5,
  //   'text': 'Testers'
  // }, {
  //   'id': 6,
  //   'text': 'Trainers'
  // }, {
  //   'id': 7,
  //   'text': 'Technical Communicators'
  // }, {
  //   'id': 8,
  //   'text': 'Deployment Team'
  // }
];
  
  export const resourceAssignments = [
    // {
  //   'id': 0,
  //   'taskId': 3,
  //   'resourceId': 1
  // }, {
  //   'id': 1,
  //   'taskId': 4,
  //   'resourceId': 1
  // }, {
  //   'id': 2,
  //   'taskId': 5,
  //   'resourceId': 2
  // }, {
  //   'id': 3,
  //   'taskId': 6,
  //   'resourceId': 2
  // }, {
  //   'id': 4,
  //   'taskId': 9,
  //   'resourceId': 3
  // }, {
  //   'id': 5,
  //   'taskId': 10,
  //   'resourceId': 3
  // }, {
  //   'id': 6,
  //   'taskId': 11,
  //   'resourceId': 2
  // }, {
  //   'id': 7,
  //   'taskId': 12,
  //   'resourceId': 2
  // }, {
  //   'id': 8,
  //   'taskId': 12,
  //   'resourceId': 3
  // }, {
  //   'id': 9,
  //   'taskId': 13,
  //   'resourceId': 3
  // }, {
  //   'id': 10,
  //   'taskId': 14,
  //   'resourceId': 2
  // }, {
  //   'id': 11,
  //   'taskId': 15,
  //   'resourceId': 1
  // }, {
  //   'id': 12,
  //   'taskId': 15,
  //   'resourceId': 2
  // }, {
  //   'id': 13,
  //   'taskId': 16,
  //   'resourceId': 2
  // }, {
  //   'id': 14,
  //   'taskId': 19,
  //   'resourceId': 3
  // }, {
  //   'id': 15,
  //   'taskId': 20,
  //   'resourceId': 3
  // }, {
  //   'id': 16,
  //   'taskId': 21,
  //   'resourceId': 3
  // }, {
  //   'id': 17,
  //   'taskId': 22,
  //   'resourceId': 1
  // }, {
  //   'id': 18,
  //   'taskId': 23,
  //   'resourceId': 1
  // }, {
  //   'id': 19,
  //   'taskId': 24,
  //   'resourceId': 1
  // }, {
  //   'id': 20,
  //   'taskId': 24,
  //   'resourceId': 2
  // }, {
  //   'id': 21,
  //   'taskId': 27,
  //   'resourceId': 4
  // }, {
  //   'id': 22,
  //   'taskId': 28,
  //   'resourceId': 4
  // }, {
  //   'id': 23,
  //   'taskId': 29,
  //   'resourceId': 4
  // }, {
  //   'id': 24,
  //   'taskId': 30,
  //   'resourceId': 4
  // }, {
  //   'id': 25,
  //   'taskId': 31,
  //   'resourceId': 4
  // }, {
  //   'id': 26,
  //   'taskId': 34,
  //   'resourceId': 5
  // }, {
  //   'id': 27,
  //   'taskId': 35,
  //   'resourceId': 5
  // }, {
  //   'id': 28,
  //   'taskId': 37,
  //   'resourceId': 5
  // }, {
  //   'id': 29,
  //   'taskId': 38,
  //   'resourceId': 5
  // }, {
  //   'id': 30,
  //   'taskId': 39,
  //   'resourceId': 5
  // }, {
  //   'id': 31,
  //   'taskId': 40,
  //   'resourceId': 5
  // }, {
  //   'id': 32,
  //   'taskId': 41,
  //   'resourceId': 5
  // }, {
  //   'id': 33,
  //   'taskId': 44,
  //   'resourceId': 5
  // }, {
  //   'id': 34,
  //   'taskId': 45,
  //   'resourceId': 5
  // }, {
  //   'id': 35,
  //   'taskId': 46,
  //   'resourceId': 5
  // }, {
  //   'id': 36,
  //   'taskId': 47,
  //   'resourceId': 5
  // }, {
  //   'id': 37,
  //   'taskId': 50,
  //   'resourceId': 6
  // }, {
  //   'id': 38,
  //   'taskId': 51,
  //   'resourceId': 6
  // }, {
  //   'id': 39,
  //   'taskId': 52,
  //   'resourceId': 6
  // }, {
  //   'id': 40,
  //   'taskId': 53,
  //   'resourceId': 6
  // }, {
  //   'id': 41,
  //   'taskId': 54,
  //   'resourceId': 6
  // }, {
  //   'id': 42,
  //   'taskId': 55,
  //   'resourceId': 6
  // }, {
  //   'id': 43,
  //   'taskId': 56,
  //   'resourceId': 6
  // }, {
  //   'id': 44,
  //   'taskId': 59,
  //   'resourceId': 7
  // }, {
  //   'id': 45,
  //   'taskId': 60,
  //   'resourceId': 7
  // }, {
  //   'id': 46,
  //   'taskId': 61,
  //   'resourceId': 7
  // }, {
  //   'id': 47,
  //   'taskId': 62,
  //   'resourceId': 7
  // }, {
  //   'id': 48,
  //   'taskId': 63,
  //   'resourceId': 7
  // }, {
  //   'id': 49,
  //   'taskId': 64,
  //   'resourceId': 7
  // }, {
  //   'id': 50,
  //   'taskId': 65,
  //   'resourceId': 7
  // }, {
  //   'id': 51,
  //   'taskId': 66,
  //   'resourceId': 7
  // }, {
  //   'id': 52,
  //   'taskId': 69,
  //   'resourceId': 2
  // }, {
  //   'id': 53,
  //   'taskId': 71,
  //   'resourceId': 8
  // }, {
  //   'id': 54,
  //   'taskId': 72,
  //   'resourceId': 8
  // }, {
  //   'id': 55,
  //   'taskId': 73,
  //   'resourceId': 8
  // }, {
  //   'id': 56,
  //   'taskId': 76,
  //   'resourceId': 8
  // }, {
  //   'id': 57,
  //   'taskId': 77,
  //   'resourceId': 8
  // }, {
  //   'id': 58,
  //   'taskId': 78,
  //   'resourceId': 8
  // }, {
  //   'id': 59,
  //   'taskId': 79,
  //   'resourceId': 8
  // }, {
  //   'id': 60,
  //   'taskId': 80,
  //   'resourceId': 8
  // }, {
  //   'id': 61,
  //   'taskId': 83,
  //   'resourceId': 2
  // }, {
  //   'id': 62,
  //   'taskId': 84,
  //   'resourceId': 2
  // }, {
  //   'id': 63,
  //   'taskId': 85,
  //   'resourceId': 2
  // }
];