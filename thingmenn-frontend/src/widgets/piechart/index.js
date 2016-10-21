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
      pointFormat: '<b>{point.y:.2f}% {point.name}</b> ({point.amount} atkvæði)<br/>'
    },
    series: [{
      name: voteSummary.name,
      data: [{
        amount: parseInt(voteSummary.voteSummary.numberOfStandsTaken, 10),
        color: 'lightgreen',
        name: 'Afstaða tekin',
        y: parseFloat(voteSummary.votePercentages.standsTaken)
      }, {
        amount: parseInt(voteSummary.voteSummary.numberOfIdleVotes, 10),
        color: 'lightgrey',
        name: 'Afstöðuleysi',
        y: parseFloat(voteSummary.votePercentages.idle)
      }, {
        amount: parseInt(voteSummary.voteSummary.numberOfAway, 10),
        color: 'salmon',
        name: 'Fjarverandi',
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
      <div className="Chart-heading heading">{voteSummary.voteSummary.numberOfVotes} Atkvæði</div>
      <div className="Chart-pie">
        <ReactHighcharts config={ chartConfig(voteSummary) }></ReactHighcharts>
      </div>
    </div>
  )
}

Piechart.propTypes = {
  voteSummary: React.PropTypes.object
}

export default Piechart
