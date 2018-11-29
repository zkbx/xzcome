import React from "react";
import { NavBar, Icon } from "antd-mobile";

export default class MyBar extends React.Component {
  render() {
    return (
      <NavBar
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={() => window.history.back()}
      >
        {this.props.title}
      </NavBar>
    );
  }
}
