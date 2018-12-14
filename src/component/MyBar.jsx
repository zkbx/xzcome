import React from "react";
import { NavBar, Icon } from "antd-mobile";

export default class MyBar extends React.Component {
  render() {
    return (
      <NavBar
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={
          () =>{
            if(window.history.length>1){
              window.history.back()
            }else{
              window.location='#/'
            }
          } 
        }
      >
        {this.props.title}
      </NavBar>
    );
  }
}
