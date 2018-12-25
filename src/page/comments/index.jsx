import React from "react";
import ContentList from "../infoBoard/component/contentList"
import instance from "../../utlis/api";
import { Tabs } from "antd-mobile";
import MyBar from "../../component/MyBar"

export default class Mylist extends React.Component {
  constructor(props) {
    super(props);
    var school_id = null;
    var user_id = null;

    if ("userinfo" in window.localStorage) {
      const userinfo = JSON.parse(window.localStorage["userinfo"]);
      // console.info(userinfo);
      school_id = userinfo["school_id"];
      user_id = userinfo["id"];
      if (!userinfo["qq"]) {
      }
    }
    this.state = {
      school_id: school_id
    };


  }

  render() {

    return (
      <div style={{ height: '100%' }}>
        <MyBar title='我的评论' />

        <ContentList
          school_id={this.state.school_id}
          // selectID={this.state.WID}
          comments={true}
        />

      </div>
    );
  }
}
