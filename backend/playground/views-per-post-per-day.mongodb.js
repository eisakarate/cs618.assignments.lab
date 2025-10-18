/* global use, db */
use('blog-simulated')
db.getCollection('events').aggregate([
  //filter by start view
  {
    $match: { action: 'startView' },
  },
  {
    //project "post" extract days as new field (day)
    $project: {
      post: '$post',
      day: { $dateTrunc: { date: '$date', unit: 'day' } },
    },
  },
  {
    //gropu by day and post
    $group: {
      _id: { post: '$post', day: '$day' },
      views: { $count: {} },
    },
  },
])
