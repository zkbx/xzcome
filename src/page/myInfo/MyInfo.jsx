import React from "react";
import { List, Modal, Picker, Toast } from "antd-mobile";
import parseUrl from "../../utlis/parseUrl";
import { Login } from "../../utlis/qqLogin";
import getUserInfo from "../../utlis/getUserInfo";
import instance from "../../utlis/api";
import { schoolMap } from "../../Data";
import { showQQ, copyAndShow, checkMobile, toLogin,soonOnline } from "../../utlis/utlis";

const Item = List.Item;

class MyInfo extends React.Component {
  constructor(props) {
    checkMobile();
    super(props);
    this.state = {
      disabled: false,
      token: "",
      userinfo: {
        nickname: "未登录",
        avatar:
          "https://cdn.iconscout.com/icon/premium/png-256-thumb/anonymous-17-623658.png",
        unlogin: true
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
      });
    } 
  }

  render() {
    return (
      <div>
        <List className="my-list" style={{paddingTop:'15px'}}>
          <Item
            arrow="horizontal"
            onClick={() => {
              if (!("unlogin" in this.state.userinfo &&this.state.userinfo.unlogin)) {
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
                    }
                  }
                ]);
              } else {
                toLogin();
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
              this.state.userinfo.school_id && [this.state.userinfo.school_id]
            }
            onChange={v => {
              Toast.loading();
              const remoteURL = "/self/update";
              const data = {
                school_id: v[0]
              };
              console.info(v);
              instance.post(remoteURL, data).then(response => {
                window.localStorage.removeItem("userinfo");
                Toast.hide();
                this.forceUpdate();
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
              // if(this.state.userinfo.unlogin){
              //   toLogin(1)
              // }else{
                window.location = "#/mylist";
              // }
              
            }}
            thumb={require('./source/list.png')}
          >
            我的发布
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
              copyAndShow(
                this.state.strToken,
                "验证码" +
                  this.state.strToken +
                  "已复制，请发送给小助手QQ，完成绑定"
              );
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
            onClick={() => {}}
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
            onClick={() => {soonOnline()}}
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
                "9152471" +
                "&version=1&src_type=web&web_src=oicqzone.com";
              showQQ("9152471", "客服QQ已复制，快去添加她为好友吧");
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
      </div>
    );
  }
}

export default MyInfo;
