import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router'
import './styles.css'

const testMenu = [
  {
    name: 'Samtölur',
    url: '/thingmenn/1158/test',
  },
  {
    thing: '148',
    year: '2017',
    url: '/asd',
  },
  {
    thing: '147',
    year: '2017',
    url: '/asd',
  },
  {
    thing: '146',
    year: '2016',
    url: '/asd',
  },
  {
    thing: '145',
    year: '2016',
    url: '/asd',
  },
  {
    thing: '144',
    year: '2015',
    url: '/asd',
  },
  {
    thing: '143',
    year: '2015',
    url: '/asd',
  },
  {
    thing: '142',
    year: '2014',
    url: '/asd',
  },
  {
    thing: '141',
    year: '2014',
    url: '/asd',
  },
]

const DetailsMenu = ({ menuItems = testMenu }) => (
  <nav className="DetailsMenu">
    <ul>
      {menuItems.map((item, index) => {
        const isFirst = index === 0
        return (
          <li className={classNames('DetailsMenu-item')} key={isFirst ? 'overview' : item.thing}>
            <Link
              to={item.url}
              className="DetailsMenu-itemLink"
              activeClassName="is-active"
            >
              {isFirst ? 'Allt' : `Þing ${item.thing}`}
              <span className="DetailsMenu-year">{item.year && ` (${item.year})`}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  </nav>
)

DetailsMenu.propTypes = {
  menuItems: PropTypes.array,
}

export default DetailsMenu
