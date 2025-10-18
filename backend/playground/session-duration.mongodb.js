/* global use, db */
use('blog-simulated')
db.getCollection('events').aggregate([
  {
    //step 1 - project session to add a start-date and end date
    $project: {
      session: '$session',
      //define a new start date
      //    if the action is start-view, then use the date value
      //        otherwise undefined
      startDate: {
        $cond: [{ $eq: ['$action', 'startView'] }, '$date', undefined],
      },
      endDate: { $cond: [{ $eq: ['$action', 'endView'] }, '$date', undefined] },
    },
  },
  {
    //group by session id,
    $group: {
      _id: '$session',
      //aggregate by min of start date (not null, skip undefined)
      startDate: { $min: '$startDate' },
      //aggregate by max of end date (not null, skips undefined!)
      endDate: { $max: '$endDate' },
    },
  },
  {
    //project again to calculate the duration
    $project: {
      session: '$_id',
      duration: { $subtract: ['$endDate', '$startDate'] },
    },
  },
])
