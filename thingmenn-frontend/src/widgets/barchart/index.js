import React from 'react'
import ReactHighcharts from 'react-highcharts';

import './styles.css'

const chartConfig = (nouns) => {
  const noundata = nouns.slice(0, 10).map((noun) => {
    return {name: noun.noun, y: noun.occurance}
  });
  return {
    chart: {
      backgroundColor: 'transparent',
      type: 'column'
    },
    title: {
      text: ''
    },
    xAxis: {
      type: 'category',
      labels: {
        rotation: -90,
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif'
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: ''
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      pointFormat: '<b>{point.y}</b>'
    },
    series: [{
      name: '',
      data: noundata,
      dataLabels: {
        enabled: true,
        color: '#333',
        align: 'bottom',
        inside: false,
        format: '{point.name}', // one decimal
        y: 0, // 10 pixels down from the top
        style: {
            fontSize: '10px',
            fontFamily: 'Verdana, sans-serif'
        }
      }
    }]
  };
};

const Barchart = ({
  nouns
}) => {
  return (
    <div className="Chart-bar">
      <ReactHighcharts config={ chartConfig(nouns) }></ReactHighcharts>
    </div>
  )
}

Barchart.propTypes = {
  nouns: React.PropTypes.array
}

export default Barchart
