import React from "react";
import "./TabBar.css";
import classNames from "classnames";

const MAX_ITEMS = 5;

const demoTabs = [
  { title: "Þing 51 (2016-2017)", url: "/bla", active: true },
  { title: "Þing 50 (2015-2016)", url: "/bla2", active: false },
  { title: "Þing 49 (2015-2016)", url: "/bla3", active: false },
  { title: "Þing 48 (2014-2015)", url: "/bla4", active: false },
  { title: "Þing 47 (2014-2015)", url: "/bla5", active: false }
];

const visibleTabs = demoTabs.slice(0, MAX_ITEMS);

const TabBar = () => (
  <div className="TabBar">
    {visibleTabs &&
      visibleTabs.map((tab, index) => (
        <a
          className={classNames("TabBar-item", tab.active && "is-active")}
          key={`Tab${index}`}
          href={tab.url}
        >
          <span className="TabBar-itemTitle">{tab.title}</span>
        </a>
      ))}
  </div>
);

export default TabBar;
