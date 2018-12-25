import React from "react";

import ContentList from "../infoBoard/component/contentList"


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
        <ContentList
          school_id={this.state.school_id}
          // selectID={this.state.WID}
          title='广告管理'
          reviewAD={true}
        />
      </div>
    );
  }
}
