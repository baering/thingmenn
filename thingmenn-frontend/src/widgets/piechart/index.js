import React from 'react'
import PropTypes from 'prop-types'
import ReactHighcharts from 'react-highcharts'
import { formatPercentage } from '../../utils'

import './styles.css'

// drilldown WIP
const buildDrillDown = () => {
  return {
    series: [],
  }
}

const chartConfig = (voteSummary) => {
  return {
    chart: {
      backgroundColor: 'transparent',
      type: 'pie',
    },
    title: {
      text: '',
    },
    subtitle: {
      text: '',
    },
    lang: {
      decimalPoint: ',',
      thousandsSep: '.',
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: false,
          format: '{point.name}: {point.y:.1f}%',
        },
      },
    },
    tooltip: {
      formatter: function () {
        return `<b>${formatPercentage(this.point.y)} ${this.point.name}</b> (${
          this.point.amount
        } atkvæði)`
      },
    },
    series: [
      {
        name: voteSummary.name,
        data: [
          {
            amount: parseInt(voteSummary.voteSummary.numberOfStandsTaken, 10),
            color: 'lightgreen',
            name: 'Afstaða tekin',
            y: parseFloat(voteSummary.votePercentages.standsTaken),
          },
          {
            amount: parseInt(voteSummary.voteSummary.numberOfIdleVotes, 10),
            color: 'lightgrey',
            name: 'Afstöðuleysi',
            y: parseFloat(voteSummary.votePercentages.idle),
          },
          {
            amount: parseInt(voteSummary.voteSummary.numberOfAbsent, 10),
            color: '#DD673C',
            name: 'Fjarvist',
            y: parseFloat(voteSummary.votePercentages.absent),
          },
          {
            amount: parseInt(voteSummary.voteSummary.numberOfAway, 10),
            color: 'salmon',
            name: 'Fjarverandi',
            y: parseFloat(voteSummary.votePercentages.away),
          },
        ],
      },
    ],
    drilldown: buildDrillDown(),
  }
}

const Piechart = ({ voteSummary }) => {
  return (
    <div className="Chart">
      <div className="Chart-heading heading">
        {voteSummary.voteSummary.numberOfVotes} Atkvæði
      </div>
      <div className="Chart-pie">
        <ReactHighcharts config={chartConfig(voteSummary)}></ReactHighcharts>
      </div>
    </div>
  )
}

Piechart.propTypes = {
  voteSummary: PropTypes.object,
}

export default Piechart
