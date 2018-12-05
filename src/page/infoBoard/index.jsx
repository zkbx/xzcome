import React from "react";
import { Tabs, Modal } from "antd-mobile";
import parseUrl from "../../utlis/parseUrl";

import ContentList from "./component/contentList"
import { kindMap } from "../../Data"
import Gallery from "../../component/Gallery";
import { showQQ } from "../../utlis/utlis"
import getDateDiff from "../../utlis/getDateDiff";
import instance from "../../utlis/api";


//默认主页面
class InfoBoard extends React.Component {
  constructor(props) {
    super(props);

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
      tabs: kindArr
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
    // if(this.props.match.path) {
    //   this.setState({
    //     ID : this.props.match.params.id
    //   })
    // }
    if (this.props.match.path) {
      // console.log(this.props.match.path)
      const remoteURL = "/infoboard/" + this.props.match.params.id;

      instance.get(remoteURL).then(response => {
        this.setState({
          modal: true
        })
        var title = "";
        var msg = "";
        // console.log('lolol', response.data.data)
        this.setState({
          showData:response.data.data
        },()=>{
          console.log(this.state.showData)
        })
        // if (response.data.code === 0) {
        //   if (response.data.data.info.anonymous) {
        //     title = "提示";
        //     msg = "他/她很害羞，没有公开联系方式";
        //   } else {
        //     switch (response.data.data.status) {
        //       case 0:
        //         title = "提示";
        //         msg = "正在审核，请稍候";
        //         break;
        //       case 1:
        //         switch (response.data.data.info.contact_kind) {
        //           case "0010":
        //             title = "请联系QQ";
        //             break;
        //           case "0020":
        //             title = "请联系微信";
        //             break;
        //           case "0030":
        //             title = "请联系电话";
        //             break;
        //           default:
        //             break;
        //         }
        //         msg = response.data.data.info.contact;
        //         break;
        //       default:
        //         title = "提示";
        //         //提示信息不同
        //         msg = "表白信息不存在，或已删除";
        //         break;
        //     }
        //   }
        // } else {
        //   title = "提示";
        //   msg = "任务不存在，或已删除";
        // }
        // alert(1)

      });
    }

  }

  onClose = key => () => {
    this.setState({
      [key]: false,
    });
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
    return (
      <div
        className="am-list-body my-body"
        style={{ height: '100%' }}
        ref={el => (this.lv = el)}
      >
        <Tabs
          initialPage={this.state.selectTab}
          tabs={this.state.tabs}
          renderTabBar={props => <Tabs.DefaultTabBar {...props} page={4} />}
        >
          {
            this.state.tabs.map((v) => {
              return (
                <ContentList
                  school_id={this.state.school_id}
                  selectID={this.state.ID}
                  kind={v.value}
                />
              )
            })
          }

        </Tabs>
        {this.state.showData?<Modal
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
                <img src={this.state.showData.user.avatar} alt="" style={{ display: 'inline-block', width: '32px', height: '32px' ,borderRadius:'50%'}} />
                <span style={{  textAlign: 'left',fontSize:'0.9em',lineHeight:'1.2em',marginLeft:4}}>
                  {this.state.showData.user.nickname}<br/>{getDateDiff(this.state.showData.created_at)}
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
        </Modal>:''}
        
      
      </div>
    );
  }
}

export default InfoBoard;
