import React from 'react'
import { changeWords } from './changeWords.js'

import './styles.css'

const Words = ({
  title,
  words,
  divider
}) => {
  const wordList = words
    .map(function(word) {
      word.noun = changeWords[word.noun] || word.noun
      return word
    })
  return (
    <div className="Words">
     <h3 className='Words-heading heading'>{title}</h3>
     <dl className="Words-list">
       {wordList.map((word) => (
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
  title: React.PropTypes.string,
  words: React.PropTypes.array,
}

export default Words
