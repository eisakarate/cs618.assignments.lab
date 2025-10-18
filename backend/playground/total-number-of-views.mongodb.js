/* global use, db */
use('blog-simulated')
db.getCollection('events').aggregate([
  {
    $match: { action: 'startView' }, //filter
  },
  {
    //group by
    $group: {
      _id: '$post',
      views: { $count: {} }, //count
    },
  },
])
