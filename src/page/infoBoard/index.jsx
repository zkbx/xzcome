import React from "react";
import { Tabs, Modal, Icon, Badge, InputItem } from "antd-mobile";
import parseUrl from "../../utlis/parseUrl";

import { Login } from "../../utlis/qqLogin";
import getUserInfo from "../../utlis/getUserInfo";
import ContentList from "./component/contentList"
import { kindMap } from "../../Data"
import Gallery from "../../component/Gallery";
import { showQQ, toLogin, isWeiXin } from "../../utlis/utlis"
import getDateDiff from "../../utlis/getDateDiff";
import instance from "../../utlis/api";

let data = ['310000', '320000']
//默认主页面
class InfoBoard extends React.Component {
  constructor(props) {
    super(props);

    var user_id, tags;
    if ("userinfo" in window.localStorage) {
      const userinfo = JSON.parse(window.localStorage["userinfo"]);
      user_id = userinfo["id"];
      tags = userinfo["tags"]
      if (!userinfo["qq"]) {
      }
    }
    console.log(user_id)

    let attentionArr = [];
    if (tags) {

      tags.forEach((v) => {
        for (let i = 0; i < kindMap.length; i++) {
          if (kindMap[i].value == v) {
            let kindObj = {}
            kindObj.title = kindMap[i].label
            kindObj.value = kindMap[i].value
            attentionArr.push(kindObj)
          }
        }
      })
    }



    let kindArr = [];
    kindMap.forEach((v, i) => {
      let kindObj = {}
      kindObj.title = v.label
      kindObj.value = v.value
      kindArr.push(kindObj)
    })
    let kindObj1 = { title: '全部' }

    //随机头部的内容数组
    kindArr.sort(function () { return Math.random() - 0.5; })
    kindArr.unshift(kindObj1)
    this.state = {
      school_id: 0,
      selectID: null,
      modal: false,
      tabs: kindArr,
      showDown: false,
      attentionTabs: attentionArr,
      user_id: user_id,
      flesh: true
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



  }

  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }

  


 


  render() {

    // if (isWeiXin()) {
    // console.log(" 是来自微信内置浏览器")
    // alert(" 是来自微信内置浏览器")


    // if ("code" in args) {

    // if (window.localStorage.getItem('token')) {
    //   window.location = "#/";
    // } else {
    //   window.localStorage.setItem('url','')
    //   toLogin(1)

    // }


    // } else if ("token" in window.localStorage) {
    //   this.state.token = window.localStorage.token;
    // }
    // } else {
    //   console.log("不是来自微信内置浏览器")
    // }

    const tabs = [
      { title: <span style={{ fontSize: '18px' }}>所有</span> },
      { title: <span style={{ fontSize: '18px' }}>接单</span> }
    ];
    return (
      <div
        className="am-list-body my-body"
        style={{ height: '100%' }}
        ref={el => (this.lv = el)}
      >
        <Tabs
          initialPage={this.state.selectTabH}
          tabs={tabs}
          tabBarBackgroundColor='#fafafa'
          renderTabBar={props =>
            <div style={{ zIndex: 1, backgroundColor: "#ccc", height: "50px", lineHeight: '50px' }}><Tabs.DefaultTabBar {...props} /></div>
          }
          tabBarTextStyle={{ height: '50px', lineHeight: '50px' }}
          abBarInactiveTextColor='#ccc'
          swipeable={false}
          onChange={(tab, index) => {
            if (index == 1) {
              if (!window.localStorage["userinfo"]) {
                toLogin(1)
              } else {

                if (this.state.attentionTabs.length == 0) {
                  Modal.alert("提示", '请在 我的->接单管理->关注 中进行设置后再进行查看', [
                    {
                      text: "取消"
                    },
                    {
                      text: "前往",
                      onPress: () => {
                        window.location = "#/attention";
                      }
                    }
                  ]);
                }
              }
            }


          }}
        >
          <Tabs
            initialPage={this.state.selectTab}
            tabs={this.state.tabs}

            renderTabBar={props => <div style={{ height: "36px", lineHeight: '36px' }}><Tabs.DefaultTabBar {...props} page={4} /></div>}
            tabBarTextStyle={{ height: '36px', lineHeight: '36px' }}
            tabBarActiveTextColor='#000'
            tabBarInactiveTextColor='#ccc'
            tabBarUnderlineStyle={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
          >
            {
              this.state.tabs.map((v) => {
                return (
                  <ContentList
                    school_id={this.state.school_id}
                    selectID={this.state.ID}
                    kind={v.value}
                    message={true}
                    flesh={this.state.flesh}
                    onRef={this.onRef}
                  />
                )
              })
            }

          </Tabs>
          <Tabs
            initialPage={this.state.selectTab}
            tabs={this.state.attentionTabs}
            renderTabBar={props => <div style={{ height: "36px", lineHeight: '36px' }}><Tabs.DefaultTabBar {...props} page={4} /></div>}
            tabBarTextStyle={{ height: '36px', lineHeight: '36px' }}
            tabBarActiveTextColor='#000'
            tabBarInactiveTextColor='#ccc'
            tabBarUnderlineStyle={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
          >
            {
              this.state.attentionTabs.map((v) => {
                return (
                  <ContentList
                    school_id={this.state.school_id}
                    selectID={this.state.ID}
                    kind={v.value}
                    message={true}

                    flesh={this.state.flesh}
                    onRef={this.onRef}
                  />
                )
              })
            }
          </Tabs>

        </Tabs>

        {/* {this.state.showData ? <Modal
          visible={this.state.modal}
          transparent
          maskClosable={true}
          onClose={this.onClose('modal')}
          title="详情"
          footer={[
            {
              text: '联系',
              onPress:
                () => {
                  var title = "";
                  switch (this.state.showData.info.contact_kind) {
                    case "0010":
                      title = "请联系QQ";
                      showQQ(this.state.showData.info.contact);
                      this.onClose('modal')();
                      return;
                    case "0020":
                      title = "请联系微信";
                      this.onClose('modal')();
                      break;
                    case "0030":
                      title = "请联系电话";
                      this.onClose('modal')();
                      break;
                    default:
                      this.onClose('modal')();
                      break;
                  }
                  Modal.alert(title, this.state.showData.info.contact, [
                    {
                      text: "Ok"
                    }
                  ]);

                }

            }]}

        >
          <div >
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 2px' }}>
              <div style={{ display: 'flex' }}>
                <img src={this.state.showData.user.avatar} alt="" style={{ display: 'inline-block', width: '32px', height: '32px', borderRadius: '50%' }} />
                <span style={{ textAlign: 'left', fontSize: '0.9em', lineHeight: '1.2em', marginLeft: 4 }}>
                  {this.state.showData.user.nickname}<br />{getDateDiff(this.state.showData.created_at)}
                </span>
              </div>
              <span style={{ fontSize: '24px', fontWeight: 'bold', lineHeight: '32px' }}>
                ￥{this.state.showData.info.amount}
              </span>
            </div>
            {this.state.showData.info.imgs.length ?
              <div style={{ display: 'block', width: '100%', marginTop: '5px' }}>
                <Gallery photos={this.state.showData.info.imgs} />
              </div>
              : ''
            }
            <span style={{ textAlign: 'left' }}>
              {this.state.showData.info.descipt}
            </span>
          </div>
        </Modal> : ''} */}
        

      </div>
    );
  }
}

export default InfoBoard;
