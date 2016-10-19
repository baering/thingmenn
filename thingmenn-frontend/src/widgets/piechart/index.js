import React from 'react'
import ReactHighcharts from 'react-highcharts';

import './styles.css'

// drilldown WIP
const buildDrillDown = () => {
  return {
    series: []
  }
}

const chartConfig = (voteSummary) => {
    return {
    chart: {
        backgroundColor: 'transparent',
        type: 'pie'
    },
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: false,
          format: '{point.name}: {point.y:.1f}%'
        }
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<b>{point.y:.2f}% {point.name}</b> ({point.amount})<br/>'
    },
    series: [{
      name: voteSummary.name,
      data: [{
        amount: parseInt(voteSummary.voteSummary.numberOfStandsTaken),
        color: 'lightgreen',
        name: 'afstaða tekin',
        y: parseFloat(voteSummary.votePercentages.standsTaken)
      }, {
        amount: parseInt(voteSummary.voteSummary.numberOfIdleVotes),
        color: 'lightgrey',
        name: 'hlutleysi',
        y: parseFloat(voteSummary.votePercentages.idle)
      }, {
        amount: parseInt(voteSummary.voteSummary.numberOfAway),
        color: 'salmon',
        name: 'fjarverandi',
        y: parseFloat(voteSummary.votePercentages.away)
      }]
    }],
    drilldown: buildDrillDown()
  };
};

const Piechart = ({
  voteSummary
}) => {
  return (
    <div className="Chart">
      <div className="Chart-heading">{voteSummary.voteSummary.numberOfVotes} atkvæði</div>
      <div className="Chart-pie">
        <ReactHighcharts config={ chartConfig(voteSummary) }></ReactHighcharts>
      </div>
      <div className="Chart-legend">
        <div>◼ afstaða tekin</div>
        <div>◼ hlutleysi</div>
        <div>◼︎ fjarverandi</div>
      </div>
    </div>
  )
}

Piechart.propTypes = {
  voteSummary: React.PropTypes.object
}

export default Piechart
