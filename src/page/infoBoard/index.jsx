import React from "react";
import { Tabs, Modal } from "antd-mobile";
import parseUrl from "../../utlis/parseUrl";
import WeHelpList from "./component/WeHelpList";
import SecondHandList from "./component/SecondHandList";
import AskLove from "./component/AskLove";
import ContentList from "./component/contentList"


//默认主页面
class InfoBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      school_id: 0,
      selectID: null
    };

    // console.info(this.state.selectTab, this.state.selectID);
  }

  componentWillMount() {
    //拿到用户的相关信息，然后进行判断
    const args = parseUrl();
    if ("school_id" in args) {
      this.state.school_id = args["school_id"];
    } else if ("userinfo" in window.localStorage) {
      const userinfo = JSON.parse(window.localStorage["userinfo"]);
      // console.info(userinfo);
      if (userinfo["school_id"] == "") {
        Modal.alert("提示", "请在 我的->学校 选择对应学校", [
          {
            text: "是",
            onPress: () => {
              window.location = "#/my";
            }
          }
        ]);
      } else {
        this.state.school_id = userinfo["school_id"];
      }
    } else {
      this.state.school_id = "0010";
      Modal.alert(
        "通告",
        "学长来咯，是一家为大学提供互助服务的信息平台，本站不收集用户信息，不收取服务费用，请大家放心使用"
      );
    }
    // console.info(this.props);
    //对路由进行判断，进入相应的tab栏
    switch (this.props.match.path) {
      case "/w/:id":
        this.state.selectTab = 0;
        this.state.WID = this.props.match.params.id;
        break;
      case "/s/:id":
        this.state.selectTab = 1;
        this.state.SID = this.props.match.params.id;
        break;
      case "/a/:id":
        this.state.selectTab = 2;
        this.state.AID = this.props.match.params.id;
        break;
      default:
        this.state.selectTab = 0;
        break;
    }
  }
  renderContent = tab => (
    <div
      className="am-list-body my-body"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "150px",
        backgroundColor: "#fff"
      }}
    >
      <p>Content of {tab.title}</p>
    </div>
  );

  render() {
    const tabs = [
      { title: "帮帮忙" },
      { title: "二手市场" },
      // { title: "表白墙" },
      // { title: "兼职" }
    ];
    const hei = document.documentElement.clientHeight - 50;
    return (
      <div
        className="am-list-body my-body"
        style={{ height: hei }}
        ref={el => (this.lv = el)}
      >
        <Tabs
          initialPage={this.state.selectTab}
          tabs={tabs}
          renderTabBar={props => <Tabs.DefaultTabBar {...props} page={4} />}
        >
          <ContentList
            school_id={this.state.school_id}
            selectID={this.state.WID}
            kind='310000'
          />
          <ContentList
            school_id={this.state.school_id}
            selectID={this.state.SID}
            kind='320000'
          />
          <ContentList
            school_id={this.state.school_id}
            selectID={this.state.AID}
            kind='330000'
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "250px",
              backgroundColor: "#fff"
            }}
          >
            即将上线，敬请期待...
          </div>
        </Tabs>
      </div>
    );
  }
}

export default InfoBoard;
