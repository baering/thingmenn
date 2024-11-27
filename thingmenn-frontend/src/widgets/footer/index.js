import React from 'react'
import './styles.css'

const Footer = () => {
  return (
    <div className="Footer">
      Gögn birt með fyrirvara um villur í úrvinnslu. <br />
      Athugasemdir vel þegnar á{' '}
      <a className="u-link" href="mailto:baering@aranja.com">
        baering@aranja.com
      </a>
      .
    </div>
  )
}

Footer.propTypes = {}

export default Footer
