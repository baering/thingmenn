import React from 'react'
import ReactHighcharts from 'react-highcharts';

import './styles.css'

const chartConfig = (voteSummary) => {
  return {
    chart: {
        backgroundColor: 'transparent',
        type: 'pie'
    },
    title: {
        text: voteSummary.voteSummary.numberOfVotes
    },
    subtitle: {
        text: 'atkvæði'
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.y:.1f}%'
        }
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<b>{point.y:.2f}%</b> {point.name}<br/>'
    },
    series: [{
      name: name,
      data: [{
        name: 'afstaða tekin',
        y: parseFloat(voteSummary.votePercentages.standsTaken),
        color: 'lightgreen'
      }, {
        name: 'hlutleysi',
        y: parseFloat(voteSummary.votePercentages.idle),
        color: 'lightgrey'
      }, {
        name: 'fjarverandi',
        y: parseFloat(voteSummary.votePercentages.away),
        color: 'salmon'
      }]
    }]
  };
};

const Piechart = ({
  voteSummary
}) => {
  return (
    <div>
      <ReactHighcharts config={ chartConfig(voteSummary) }></ReactHighcharts>
    </div>
  )
}

Piechart.propTypes = {
  voteSummary: React.PropTypes.object
}

export default Piechart
