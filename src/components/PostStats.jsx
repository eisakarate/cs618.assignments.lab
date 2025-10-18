import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import {
  getTotalViews,
  getDailyViews,
  getDailyDurations,
} from '../api/events.js'
import {
  VictoryChart,
  VictoryTooltip,
  VictoryBar,
  VictoryLine,
  VictoryVoronoiContainer,
} from 'victory'

//setup the PostStats Component
export function PostStats({ postId }) {
  //run the query to get Total Views
  const totalViews = useQuery({
    queryKey: ['totalViews', postId],
    queryFn: () => getTotalViews(postId),
  })
  //run the query to get Daily Views
  const dailyViews = useQuery({
    queryKey: ['dailyViews', postId],
    queryFn: () => getDailyViews(postId),
  })
  //run the query to get Daily Durations
  const dailyDurations = useQuery({
    queryKey: ['dailyDurations', postId],
    queryFn: () => getDailyDurations(postId),
  })

  //render the data, if any are loading (any one of them), then show loading
  if (
    totalViews.isLoading ||
    dailyViews.isLoading ||
    dailyDurations.isLoading
  ) {
    return <div>loading stats...</div>
  }
  return (
    <div>
      <b>{totalViews.data?.views} total views</b>
      <div style={{ width: 512 }}>
        <h3>Daily Views</h3>
        <VictoryChart domainPadding={16}>
          <VictoryBar
            labelComponent={<VictoryTooltip />}
            data={dailyViews.data?.map((d) => ({
              x: new Date(d._id),
              y: d.views,
              label: `${new Date(d._id).toLocaleDateString()}: ${
                d.views
              } views`,
            }))}
          />
        </VictoryChart>
      </div>
      <div style={{ width: 512 }}>
        <h4>Daily Average Viewing Duration</h4>
        <VictoryChart
          domainPadding={16}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension='x'
              labels={({ datum }) =>
                `${datum.x.toLocaleDateString()}: ${datum.y.toFixed(2)} minutes`
              }
              labelComponent={<VictoryTooltip />}
            />
          }
        >
          <VictoryLine
            data={dailyDurations.data?.map((d) => ({
              x: new Date(d._id),
              y: d.averageDuration / (60 * 1000),
            }))}
          />
        </VictoryChart>
      </div>
    </div>
  )
}

PostStats.propTypes = {
  postId: PropTypes.string.isRequired,
}
