import React from "react";
import { TabBar } from "antd-mobile";
import MyInfo from "./page/myInfo/MyInfo";
import InfoBoard from "./page/infoBoard";
import Submit from "./page/submit/Submit";
import Advertising from "./page/advertising"
import Help from "./page/help/index"
import Grade from "./page/grade/index";
import MyGrade from "./page/myGrade/index"
import Mylist from "./page/mylist/index";
import Review from "./page/review/index";
import ReviewAD from "./page/reviewAD/index"
import Attention from "./page/attention/index"
import Comments from "./page/comments/index"
import { Route } from "react-router";
import infoboard from "./source/infoboard.png";
// import OrderDetail from "./page/orderDetails"
import infoboardSelect from "./source/infoboard-select.png";
import my from "./source/my.png";
import mySelect from "./source/my-select.png";
import submit from "./source/submit.png";
import submitSelect from "./source/submit-select.png";

export default class MainLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "blueTab",
      hidden: false
    };
  }

  //抽象出跳转方法
  navTo(e) {
    // debugger
    window.location = `#/${e}`;
  }

  render() {
    const hash = window.location.hash;
    let selectedTab = hash.substr(2, hash.length).split("/")[0];
    switch (selectedTab) {
      case "a":
      case "w":
      case "s":
        selectedTab = "";
        break;
      case "mylist":
      case "review":
      case "attention":
      case "help":
      case "advertising":
      case "reviewAD":
      case "comments":
        selectedTab = "my";
        break;
      case "grade":
      case "myGrade":
        selectedTab = "grade";
        break;
      default:
        break;
    }

    return (
      <div style={{ position: "fixed", height: "100%", width: "100%", top: 0 }}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          tabBarPosition="bottom"
          hidden={this.state.hidden}
          prerenderingSiblingsNumber={0}
        >
          <TabBar.Item
            title="公告栏"
            key="Life"
            icon={
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  background: `url(${infoboard}) center center /  21px 21px no-repeat`
                }}
              />
            }
            selectedIcon={
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  background: `url(${infoboardSelect}) center center /  21px 21px no-repeat`
                }}
              />
            }
            selected={selectedTab === ""}
            // badge={1}
            dot
            onPress={this.navTo.bind(this, "")}
            data-seed="logId"
          >
            <Route path="/" exact component={InfoBoard} />
            <Route path="/a/:id" exact component={InfoBoard} />
            <Route path="/s/:id" exact component={InfoBoard} />
            <Route path="/w/:id" exact component={InfoBoard} />
          </TabBar.Item>
          <TabBar.Item
            icon={
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  background: `url(${submit}) center center /  21px 21px no-repeat`
                }}
              />
            }
            selectedIcon={
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  background: `url(${submitSelect}) center center /  21px 21px no-repeat`
                }}
              />
            }
            title="发布"
            key="Friend"
            // dot
            selected={selectedTab === "submit"}
            onPress={this.navTo.bind(this, 'submit')}
          >
            <Route path="/user" component={Submit} />
            <Route path="/submit" component={Submit} />
          </TabBar.Item>
          {/* <TabBar.Item
            icon={
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  background: `url(${submit}) center center /  21px 21px no-repeat`
                }}
              />
            }
            selectedIcon={
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  background: `url(${submitSelect}) center center /  21px 21px no-repeat`
                }}
              />
            }
            title="查成绩"
            key="Grade"
            // dot
            selected={selectedTab === "grade"}
            onPress={this.navTo.bind(this, 'grade')}
          >
            <Route path="/grade" component={Grade} />
            <Route path="/myGrade" component={MyGrade} />
          </TabBar.Item> */}
          <TabBar.Item
            icon={
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  background: `url(${my}) center center /  21px 21px no-repeat`
                }}
              />
            }
            selectedIcon={
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  background: `url(${mySelect}) center center /  21px 21px no-repeat`
                }}
              />
            }
            title="我的"
            key="Friend"
            // dot
            selected={selectedTab === "my"}
            onPress={this.navTo.bind(this, 'my')}
          >
            <Route path="/my/:id" exact component={MyInfo} />
            <Route path="/my" exact component={MyInfo} />
            <Route path="/help" exact component={Help} />
            <Route path="/attention" exact component={Attention} />
            <Route path="/review" exact component={Review} />
            <Route path="/mylist/:id" exact component={Mylist} />
            <Route path="/mylist" exact component={Mylist} />
            <Route path="/advertising" exact component={Advertising} />
            <Route path="/reviewAD" exact component={ReviewAD} />
            <Route path="/comments" exact component={Comments} />
            
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}
