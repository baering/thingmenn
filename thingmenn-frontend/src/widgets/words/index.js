import React from 'react'
import './styles.css'

const Words = ({
  title,
  words,
}) => {
  return (
    <div className="Words">
     <h3 className='Words-heading heading'>{title}</h3>
     <dl className="Words-list">
       {words.map((word) => (
         [
           <dt>{word.noun}</dt>,
           <dd><div style={{width: word.occurance + 'px'}}>&nbsp;</div><span className="bottom-to-top"><span>{word.occurance}</span></span></dd>
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
