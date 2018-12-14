import React from "react";
import { List, Modal, Picker, Toast } from "antd-mobile";
import parseUrl from "../../utlis/parseUrl";
import { Login } from "../../utlis/qqLogin";
import getUserInfo from "../../utlis/getUserInfo";
import instance from "../../utlis/api";
import { schoolMap, kindMap } from "../../Data";
import { showQQ, copyAndShow, checkMobile, toLogin, soonOnline } from "../../utlis/utlis";

const Item = List.Item;

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

class MyInfo extends React.Component {
  constructor(props) {
    checkMobile();
    super(props);

    let kindArr = [];
    kindMap.forEach((v, i) => {
      let kindObj = {}
      kindObj.title = v.label
      kindObj.value = v.value
      kindArr.push(kindObj)
    })

    this.state = {
      disabled: false,
      token: "",
      userinfo: {
        nickname: "未登录",
        avatar:
          "https://cdn.iconscout.com/icon/premium/png-256-thumb/anonymous-17-623658.png",
        unlogin: true,
        kindArr: kindArr,
        modal: false,
      }

    };



    const args = parseUrl();
    // console.info(args);
    if ("code" in args) {
      let postData = {};
      if ("state" in args && args.state == "wx") {
        postData = {
          wx_code: args.code
        };
      } else {
        postData = {
          qq_code: args.code
        };
      }
      Login(postData, token => {

        window.localStorage.removeItem("userinfo");
        window.localStorage.removeItem("token");
        window.localStorage.setItem("token", token);

        getUserInfo(window.localStorage.getItem('token'), userinfo => {
          window.localStorage.setItem("userinfo", JSON.stringify(userinfo));

        });

        window.location.href = window.location.origin + "/#/my";
      });
    } else if ("token" in window.localStorage) {
      this.state.token = window.localStorage.token;
    }
    instance.get("/self/strtoken").then(response => {
      if (response.data.code == 0) {
        this.setState({ strToken: "$" + response.data.data + "$" });
      }
    });
  }
  componentWillMount() {
    if ("userinfo" in window.localStorage) {
      this.setState({ userinfo: JSON.parse(window.localStorage["userinfo"]) });
    } else if (this.state.token !== "") {
      getUserInfo(this.state.token, userinfo => {
        this.setState({
          userinfo: userinfo
        });
        window.localStorage.setItem("userinfo", JSON.stringify(userinfo));
        // console.log(userinfo)
      });
    }
  }

  showModal = key => (e) => {
    if(this.state.userinfo.unlogin){
      toLogin(1)
    }else if (!this.state.userinfo.wx_openid) {
      e.preventDefault(); // 修复 Android 上点击穿透
      this.setState({
        [key]: true,
      });
    }
    
  }
  onClose = key => () => {
    this.setState({
      modal: false,
    });
  }
  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  }

  render() {
    return (
      <div>
        <List className="my-list" style={{ paddingTop: '15px' }}>
          <Item
            arrow="horizontal"
            onClick={() => {
              if (!("unlogin" in this.state.userinfo && this.state.userinfo.unlogin)) {
                Modal.alert("提示", "是否退出", [
                  {
                    text: "否"
                  },
                  {
                    text: "是",
                    onPress: () => {
                      window.localStorage.removeItem("token");
                      window.localStorage.removeItem("userinfo");
                      window.location.href = window.location.origin + "/#/my";
                      this.setState({
                        userinfo: {
                          nickname: "未登录",
                          avatar:
                            "https://cdn.iconscout.com/icon/premium/png-256-thumb/anonymous-17-623658.png",
                          unlogin: true
                        }
                      })
                    }
                  }
                ]);
              } else {
                toLogin()
              }
            }}
          >
            {<div>
              <div style={{ float: "left" }}>
                <img
                  alt=""
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "32px"
                  }}
                  src={this.state.userinfo.avatar}
                />
              </div>
              <div
                style={{
                  flexDirection: "column",
                  display: "flex",
                  marginLeft: 80,
                  padding: "3% 0"
                }}
              >
                <span style={{ fontSize: "0.9em" }}>
                  {this.state.userinfo.nickname}
                </span>
                {"unlogin" in this.state.userinfo &&
                  this.state.userinfo.unlogin ? (
                    <div>
                      <span style={{ fontSize: "0.5em", color: "grey" }}>
                        未登陆
                      </span>
                    </div>
                  ) : (
                    <div>
                      <img
                        alt=""
                        style={{ width: "16px", height: "16px" }}
                        src={require('./source/renzhen.svg')}
                      />
                      <span style={{ fontSize: "0.5em", color: "grey" }}>
                        已登陆
                      </span>
                    </div>
                  )}
              </div>
            </div>
            }
          </Item>
          <Picker
            data={schoolMap}
            cols={1}
            className="forss"
            extra="未绑定"
            value={
              this.state.showSchool ? this.state.showSchool : this.state.userinfo.school_id && [this.state.userinfo.school_id]
            }


            onChange={v => {
              Toast.loading();
              const remoteURL = "/self/update";
              const data = {
                school_id: v[0]
              };
              console.info(v);
              instance.post(remoteURL, data).then(response => {
                let userData = JSON.parse(window.localStorage["userinfo"]);
                userData.school_id = v[0]
                window.localStorage.setItem("userinfo", JSON.stringify(userData));
                Toast.hide();
                this.forceUpdate();
                this.setState({ showSchool: v })
                
              });
            }}
          >
            <List.Item arrow="horizontal" thumb={require('./source/school.svg')}>
              学校
            </List.Item>
          </Picker>

          <Item
            arrow="horizontal"
            multipleLine
            onClick={() => {
              if (this.state.userinfo.unlogin) {
                toLogin(1)
              } else {
                window.location = "#/mylist";
              }

            }}
            thumb={require('./source/list.png')}
          >
            我的发布
          </Item>
          <Item
            arrow="horizontal"
            multipleLine
            onClick={() => {
              if (this.state.userinfo.unlogin) {
                toLogin(1)
              } else {
                window.location = "#/attention";
              }

            }}
            thumb={require('./source/attention.png')}
          >
            接单管理
          </Item>

          {this.state.userinfo.role > 0 && (
            <Item
              arrow="horizontal"
              multipleLine
              onClick={() => {
                window.location = "#/review";
              }}
              thumb={require('./source/review.png')}
            >
              审核
            </Item>
          )}
          {/*<Item
            arrow="horizontal"
            multipleLine
            onClick={() => {}}
            extra={"2012302611"}
            thumb="https://oryxschool.qa/images/icons/_icon/admission-process.svg"
          >
            学号
          </Item> */}

        </List>

        <List renderHeader={() => "联系方式"} className="my-list">
          <Item
            arrow="horizontal"
            multipleLine
            onClick={() => {
              if (this.state.userinfo.unlogin) {
                toLogin(1)
              } else {
                copyAndShow(
                  this.state.strToken,
                  "验证码" +
                  this.state.strToken +
                  "已复制，请发送给小助手QQ(189981230)，完成绑定，绑定后请重新登陆"
                );
              }
            }}
            extra={this.state.userinfo.qq ? this.state.userinfo.qq : "未绑定"}
            thumb={require('./source/qq.svg')}
          >
            QQ
          </Item>
          {/* <Item
            arrow="horizontal"
            multipleLine
            onClick={() => {}}
            extra={"17671301180"}
            thumb="https://support.aa.net.uk/images/f/fe/Menu-voip.svg"
          >
            电话
          </Item> */}
          <Item
            arrow="horizontal"
            multipleLine
            onClick={this.showModal('modal')}
  
            extra={this.state.userinfo.wx_openid ? "已绑定" : "未绑定"}
            thumb={require('./source/wx.svg')}
          >
            微信
          </Item>
        </List>

        <List renderHeader={() => ""} className="my-list">
          <Item
            arrow="horizontal"
            multipleLine
            onClick={() => { window.location = "#/help"; }}
            thumb={require('./source/help.svg')}
          >
            帮助中心
          </Item>
          <Item
            arrow="horizontal"
            multipleLine
            onClick={() => {
              window.location.href =
                "mqqwpa://im/chat?chat_type=wpa&uin=" +
                "3432232421" +
                "&version=1&src_type=web&web_src=oicqzone.com";
              showQQ("3432232421", "客服QQ已复制，快去添加她为好友吧");
            }}
            thumb={require('./source/support.svg')}
          >
            联系客服
          </Item>
          <Item
            arrow="horizontal"
            multipleLine
            onClick={() => {
              soonOnline()
            }}
            thumb={require('./source/info.svg')}
          >
            关于学长来啦
          </Item>
        </List>
        <Modal
          visible={this.state.modal}
          transparent
          maskClosable={false}
          onClose={this.onClose()}
          title="提示"
          footer={[{ text: '确定', onPress: () => { this.onClose()(); } }]}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
          <div style={{ height: 'auto'}}>
            QQ用户请在微信端关注公众号 学长来咯 后进行绑定<br />
             <img src={require('./source/qcode.jpg')} style={{width:'60%'}} alt=""/>
          </div>
        </Modal>
      </div>
    );
  }
}

export default MyInfo;
