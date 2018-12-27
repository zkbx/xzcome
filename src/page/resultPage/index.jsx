import React from "react";
import { Button } from "antd-mobile"
import instance from "../../utlis/api";

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

  componentWillMount(){
    instance
    .post('/wx/js-sdk', { url: window.location.href })
    .then(response => {
      const wx = window.wx
      if (response.data.code == 0) {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: response.data.data.app_id, // 必填，公众号的唯一标识
          timestamp: response.data.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: response.data.data.nonce_str, // 必填，生成签名的随机串
          signature: response.data.data.signature,// 必填，签名
          jsApiList: ['updateTimelineShareData', 'updateAppMessageShareData','onMenuShareAppMessage','onMenuShareTimeline'] // 必填，需要使用的JS接口列表
        });
        
        wx.ready(function () {
          var link = "https://xzyanwu.com/#/share"
          var shareData = {
              title: '大学生的社区\n找人跑腿，零食团购，快来加入吧',
              desc: '找人跑腿，零食团购，快来加入吧',//这里请特别注意是要去除html
              link: link,
              imgUrl: 'http://img.xzllo.com/static/logo.png',
              success: function () {
                // that.setState({
                //   showMask:'none'
                // },()=>{
                  
                //   that.showModal('modal1')
                // })
              }
          };
          var shareData1 = {
            title: '大学生的社区',
            desc: '找人跑腿，零食团购，快来加入吧',//这里请特别注意是要去除html
            link: link,
            imgUrl: 'http://img.xzllo.com/static/logo.png',
            success: function () {
              // that.setState({
              //   showMask:'none'
              // },()=>{
                
              //   that.showModal('modal1')
              // })
            }
        };
          if(!wx.updateTimelineShareData){ //微信文档中提到这两个接口即将弃用，故判断
           
              wx.onMenuShareAppMessage(shareData1);//1.0 分享到朋友
              wx.onMenuShareTimeline(shareData);//1.0分享到朋友圈
          }else{
           
              wx.updateAppMessageShareData(shareData1);//1.4 分享到朋友
              wx.updateTimelineShareData(shareData);//1.4分享到朋友圈
          }
          
      });
      }


    })
  }

  render() {

    return (
      <div style={{ height: '100%', width: '100%', paddingTop: '100px' }}>
        <span style={{ display: 'block', margin: '0 auto', textAlign: 'center', fontSize: '1.6em', marginBottom: '20px' }}>
          发布成功
        </span>
        <span style={{ display: 'block', margin: '0 auto', textAlign: 'center', fontSize: '1.2em', lineHeight: '1.5em' }}>
          想要快速审核请在此页面进行分享，<br />
          把内容分享到朋友圈后请联系下方客服
        </span>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '30px' }}>
          <div>
            <img src={require('../../source/QQqcode.png')} style={{ width: '100px', height: '100px', display: 'block', marginBottom: '10px' }} alt="" />
            <span style={{ textAlign: 'center', display: 'block', fontSize: '1.2em' }}>
              QQ
          </span>
          </div>
          <div>
            <img src={require('../../source/weixinqcode.png')} style={{ width: '100px', height: '100px', display: 'block', marginBottom: '10px' }} alt="" />
            <span style={{ textAlign: 'center', display: 'block', fontSize: '1.2em' }}>
              微信
          </span>
          </div>

        </div>

        <div style={{ padding:'0 30px',marginTop:'30px' }}>
          <Button onClick={()=>{ window.location = "#/mylist/" + String(this.props.match.params.id)}} type="primary">返回</Button>
        </div>
      </div>
    );
  }
}
