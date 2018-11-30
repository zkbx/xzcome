import React from "react";
import ReactDOM from "react-dom";
import { ListView, WhiteSpace, Modal } from "antd-mobile";
import urlEncode from "../../utlis/urlEncode";
import getDateDiff from "../../utlis/getDateDiff";
import instance from "../../utlis/api";
import InfoCard from "../../component/MylistCard";
import MyBar from "../../component/MyBar";
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
      <div>
        <ContentList
            school_id={this.state.school_id}
            // selectID={this.state.WID}
            title='我的发布'
          />
      </div>
    );
  }
}
