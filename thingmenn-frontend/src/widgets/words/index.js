import React from 'react'
import PropTypes from 'prop-types'
import { changeWords } from './changeWords.js'

import './styles.css'

const Words = ({
  title,
  words,
  divider
}) => {
  const wordSubstitution = words
    .map(function(word) {
      word.noun = changeWords[word.noun] || word.noun
      return word
    })
  return (
    <div className="Words">
     <h3 className='Words-heading heading'>{title}</h3>
     <dl className="Words-list">
       {wordSubstitution.map((word) => (
         [
           <dt>{word.noun}</dt>,
           <dd><div style={{width: `${word.occurance/divider}px`}}>&nbsp;</div><span className="bottom-to-top"><span>{word.occurance}</span></span></dd>
         ]
       ))}
     </dl>
   </div>
  )
}

Words.propTypes = {
  title: PropTypes.string,
  words: PropTypes.array,
}

export default Words
