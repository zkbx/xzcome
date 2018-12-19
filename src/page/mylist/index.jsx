import React from "react";
import ContentList from "../infoBoard/component/contentList"
import instance from "../../utlis/api";
import {Tabs} from "antd-mobile";
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
    const tabs = [
      { title: '所有订单' },
      { title: '留言推送' }
    ];
    return (
      <div style={{ height: '100%' }}>
      <MyBar title='我的发布' />
        <Tabs tabs={tabs}
          initialPage={0}
          onChange={(tab, index) => { console.log('onChange', index, tab); }}
          onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
        >
          <ContentList
            school_id={this.state.school_id}
            // selectID={this.state.WID}
            title='我的发布'
          />
          <ContentList
            school_id={this.state.school_id}
            // selectID={this.state.WID}
            ispush={true}
          />
        </Tabs>

      </div>
    );
  }
}
