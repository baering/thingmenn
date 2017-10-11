import React, { Component } from "react";

class Tab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0
    };
  }

  render() {
    const { children } = this.props;

    return <div className="Tab">{children}</div>;
  }
}

export default Tab;
