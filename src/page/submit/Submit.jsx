import React from "react";
import {
  WhiteSpace,
  Button,
  Picker,
  List,
  TextareaItem,
  InputItem,
  WingBlank,
  Checkbox,
  Flex,
  Toast,
  Modal,
  Switch
} from "antd-mobile";
import { createForm } from "rc-form";
import instance from "../../utlis/api";
import { kindMap, contact_kind, schoolMap } from "../../Data";
import { toLogin } from "../../utlis/utlis";
import ImagePickerExample from './component/imagePick'

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

const isIPhone = new RegExp("\\biPhone\\b|\\biPod\\b", "i").test(
  window.navigator.userAgent
);
let moneyKeyboardWrapProps;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault()
  };
}

let OSS = require("ali-oss");

let client = new OSS({
  region: "oss-cn-beijing",
  //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
  accessKeyId: "LTAI68pgBZdcr6vj",
  accessKeySecret: "9v7Dcsfb9ouexd6Ugu2jG4vT9P5l9m",
  bucket: "xzcome"
});




class BasicInput extends React.Component {
  state = {
    choosedContact: false,
    kind: "",
    checked: false,
    modal1: false,
    showMask: 'none'
  };
  componentWillMount() {
    let that = this
    if (window.localStorage.getItem('userinfo')) {
      this.setState({ userinfo: JSON.parse(window.localStorage["userinfo"]) });
    } else {
      toLogin(1);
      this.setState({ userinfo: {} });
    }
    instance
      .post('/wx/js-sdk', { url: window.location.href })
      .then(response => {
        const wx = window.wx
        if (response.data.code == 0) {
          wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: response.data.data.app_id, // 必填，公众号的唯一标识
            timestamp: response.data.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: response.data.data.nonce_str, // 必填，生成签名的随机串
            signature: response.data.data.signature,// 必填，签名
            jsApiList: ['updateTimelineShareData', 'updateAppMessageShareData','onMenuShareAppMessage','onMenuShareTimeline'] // 必填，需要使用的JS接口列表
          });

          wx.ready(function () {
            var imgUrl ="http://192.168.0.151/1.jpg",
                link = "http://192.168.0.151/1.jpg"
            var shareData = {
                title: '好东西',
                desc: '一起分享~',//这里请特别注意是要去除html
                link: link,
                imgUrl: imgUrl
            };
            if(!wx.updateAppMessageShareData){ //微信文档中提到这两个接口即将弃用，故判断
              alert("old")
                wx.onMenuShareAppMessage(shareData);//1.0 分享到朋友
                wx.onMenuShareTimeline(shareData);//1.0分享到朋友圈
            }else{
              alert("new")
                wx.updateAppMessageShareData(shareData);//1.4 分享到朋友
                wx.updateTimelineShareData(shareData);//1.4分享到朋友圈
            }
            
        });
        }


      })

  }

  FuckJsCallbackIWantImg(imgFiles, info, ispush) {
    if (imgFiles.length === 0) {
      const kind = info.kind[0];
      const school_id = info["school_id"][0];
      delete info.kind;
      delete info["school_id"];
      const infoData = {
        user_id: info["id"],
        school_id: school_id,
        info: JSON.stringify(info),
        status: 1,
        kind: kind
      };
      const remoteURL = "/infoboard";
      // console.info(infoData);
      instance
        .post(remoteURL, infoData, {
          headers: {
            Authorization: "Bearer " + window.localStorage.getItem('token')
          }
        })
        .then(response => {
          if (response.data.code == 0) {
            // Toast.success('发布成功!', 1);
            this.setState({
              urlId: response.data.data.id
            })

            if (ispush) {
              instance
                .post("/ispush", {
                  user_id: info["id"],
                  school_id: school_id,
                  infoboard_id: response.data.data.id
                }, {
                    headers: {
                      Authorization: "Bearer " + window.localStorage.getItem('token')
                    }
                  }).then(response => {
                    // Toast.success("发布成功", 1, () => {
                    //   window.location = "#/mylist/" + String(response.data.data.id);
                    // });

                    if (response.data.code == 0) {
                      Toast.hide()
                      Modal.alert('发布成功', <span>想要快速审核<br />请点击"去分享按钮"，<br />把内容分享到朋友圈</span>, [
                        {
                          text: '取消',
                          onPress: () =>
                            window.location = "#/mylist/" + String(response.data.data.id)
                        },
                        {
                          text: '去分享页',
                          onPress: () => {
                            this.setState({
                              showMask: 'block'
                            })
                          }
                        }
                      ])
                    } else {
                      Modal.alert(
                        "提示",
                        "网络出了点小差，请稍后重新请求页面..."
                      );
                    }
                  }).catch(function (error) {
                    console.log(error);
                    Toast.fail("发布失败");
                  });
            } else {
              Toast.hide()
              Modal.alert('发布成功', <span>想要快速审核<br />请点击"去分享按钮"，<br />把内容分享到朋友圈</span>, [
                {
                  text: '取消',
                  onPress: () =>
                    window.location = "#/mylist/" + String(response.data.data.id)
                },
                {
                  text: '去分享', onPress: () => {
                    this.setState({
                      showMask: 'block'
                    })
                  }
                }
              ])
            }
          } else {
            Modal.alert(
              "提示",
              "网络出了点小差，请稍后重新请求页面..."
            );
          }
        })
        .catch(function (error) {
          console.log(error);
          Toast.fail("发布失败");
        });
    } else {
      var img = new Image();
      img.src = imgFiles[0].url;
      img.onload = function () {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        var originWidth = img.width;
        var originHeight = img.height;
        // 最大尺寸限制
        var maxWidth = 400,
          maxHeight = 400;
        // 目标尺寸
        var targetWidth = originWidth,
          targetHeight = originHeight;
        // 图片尺寸超过400x400的限制
        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > maxWidth / maxHeight) {
            // 更宽，按照宽度限定尺寸
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
          } else {
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
          }
        }
        // canvas对图片进行缩放
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        // 清除画布
        context.clearRect(0, 0, targetWidth, targetHeight);
        // 图片压缩
        context.drawImage(img, 0, 0, targetWidth, targetHeight);
        // canvas 转file
        var dataurl = canvas.toDataURL("image/png");
        var arr = dataurl.split(","),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        var file = new File(
          [u8arr],
          parseInt(Math.random() * 10000000, 10).toString() + ".png",
          {
            type: mime
          }
        );
        client.put(file.name, file).then(r1 => {
          info.imgs.push({
            src: file.name,
            width: targetWidth,
            height: targetHeight
          });
          let ispushll = ispush
          this.FuckJsCallbackIWantImg(imgFiles.slice(1), info, ispushll);
        });
      };
    }
  };

  showModal = key => (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      [key]: true,
    });
  }
  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }

  submit = () => {
    this.props.form.validateFields((error, value) => {

      if (error) {
        console.log(error)

        // switch (this.state.kind) {
        //   case "310000":
        //   case "320000":
        //   case "340000":
        //     delete error.askfor;
        //     break;
        //   // case "330000":
        //     delete error.contact;
        //     delete error.contact_kind;
        //     break;
        //   default:
        //     break;
        // }
        if (error.kind) {
          Modal.alert("提示", error.kind.errors[0].message);
          return;
        }

        for (const err in error) {
          // console.log(error[err].errors[0].message);
          Modal.alert("提示", error[err].errors[0].message);
          return;
        }

        if (error.amount) {
          Modal.alert("提示", error.amount.errors[0].message);
          return;
        }
      }
      if (!value.school_id[0]) {
        Modal.alert("提示", '请选择学校');
        return
      }


      if (!this.state.agree) {
        Modal.alert("提示", "请同意免责声明");
        return;
      }
      Toast.loading("请稍等");
      const imgs = value.photo;
      delete value.photo;
      value.imgs = [];
      if (value.contact_kind) {
        value.contact_kind = value.contact_kind[0];
      }
      if (value.anonymous) {
        value.anonymous = value.anonymous[0];
      }
      value.id = this.state.userinfo.id;
      this.FuckJsCallbackIWantImg(imgs, value, this.state.checked);
    });
  };

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
    const { getFieldProps, getFieldError } = this.props.form;
    //根据用户选择联系方式类型，展示不同的联系方式的正则和提示
    let contactPlaceholder, setPattern, setTip;
    let contactkind = this.state.setContact;
    if (typeof contactkind !== "undefined") {
      switch (contactkind[0]) {
        case "0010":
          contactPlaceholder = "请填写正确规格的QQ号";
          setTip = "请填写QQ号";
          setPattern = /^[1-9][0-9]{4,9}$/
          break;
        case "0020":
          contactPlaceholder = "请填写正确规格的微信号";
          setTip = "请填写微信号";
          setPattern = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/
          break;
        case "0030":
          contactPlaceholder = "请填写正确规格的手机号码";
          setTip = "请填写手机号码";
          setPattern = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
          break;

        default:
          contactPlaceholder = "请填写联系方式1111";
          setTip = "请填写联系方式";
          setPattern = /\S/
          break;
      }
    }
    const contactInfo = (
      <div>
        <Picker
          data={contact_kind}
          cols={1}
          {...getFieldProps("contact_kind", {
            // initialValue: 'little ant',
            rules: [{ required: true, message: "请选择联系方式" }]
          })}
          onChange={k => {
            console.info(k);
            this.setState({ choosedContact: true, setContact: k });
            this.props.form.setFieldsValue({
              contact_kind: k
            });
          }}
        >
          <List.Item arrow="horizontal">联系方式</List.Item>
        </Picker>
        {this.state.choosedContact &&
          <InputItem
            {...getFieldProps("contact", {
              // normalize: (v, prev) => {
              //   if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
              //     if (v === ".") {
              //       return "0.";
              //     }
              //     return prev;
              //   }
              //   return v;
              // },
              rules: [{ required: true, message: contactPlaceholder, pattern: setPattern }]
            })}
            placeholder={setTip}
            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          >
            联系方式
      </InputItem>}
      </div>
    );

    //根据用户选择不同的发布类型，展示不同的内容
    var desPlaceholder;
    var extraInfo;
    switch (this.state.kind) {
      case "310000":
        desPlaceholder =
          "简要描述任务，例如：我需要人去超市帮我领快递，小件。请勿直接填写取件码的关键信息！";
        // extraInfo = (
        //   <div>
        //     <InputItem
        //       {...getFieldProps("amount", {
        //         // initialValue: 'little ant',
        //         rules: [{ required: true, message: "请输入金额" }]
        //       })}
        //       clear
        //       error={!!getFieldError("amount")}
        //       onErrorClick={() => {
        //         alert(getFieldError("amount").join("、"));
        //       }}
        //       placeholder="5、5元、面议，均可"
        //     >
        //       订单金额
        //     </InputItem>
        //   </div>
        // );
        break;
      case "320000":
        desPlaceholder =
          "简要描述物品，例如：小米手环3，7月底在京东买的，发票还在";
        // extraInfo = (
        //   <div>

        //     <InputItem
        //       {...getFieldProps("amount", {
        //         // initialValue: 'little ant',
        //         rules: [{ required: true, message: "请输入金额" }]
        //       })}
        //       clear
        //       error={!!getFieldError("amount")}
        //       onErrorClick={() => {
        //         alert(getFieldError("amount").join("、"));
        //       }}
        //       placeholder="5、5元、面议，均可"
        //     >
        //       转让价格
        //     </InputItem>
        //   </div>
        // );
        break;

      default:
        desPlaceholder = "请填写您的需求";
        break;
    }

    // console.log(window.localStorage.getItem('token'))



    return (
      <div style={{ position: 'relative', height: '100%' }}>
        {/* <div className={styles.ywheader}>
          <div className={styles.ywtitle}>信息发布</div>
        </div> */}
        {/* <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <WingBlank mode={20} className="stepsExample">
                    <Steps current={0} direction="horizontal" size="small">{steps}</Steps>
                </WingBlank> */}
        <div style={{ display: `${this.state.showMask}`, position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: '5' }}>
          <img src={require('./images/arrow.png')} style={{ width: '40px', position: 'absolute', top: '10px', right: '40px' }} alt="" />
          <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.4em', position: 'absolute', top: '60px', right: '40px' }}>
            分享到朋友圈
          </span>
        </div>
        <List renderHeader={() => "基本信息"}>
          <Picker
            data={kindMap}
            cols={1}
            {...getFieldProps("kind", {
              rules: [{ required: true, message: "选择种类" }],
              // initialValue: ["310000"]
            })}
            className="forss"
            onChange={kind => {
              this.setState({ kind: kind[0] });
              this.props.form.setFieldsValue({
                kind: kind
              });
            }}
          >
            <List.Item arrow="horizontal">类别</List.Item>
          </Picker>
          <Picker
            data={schoolMap}
            cols={1}
            {...getFieldProps("school_id", {
              initialValue: [this.state.userinfo["school_id"]],
              rules: [{ required: true, message: "请选择学校" }]
            })}
            className="forss"
          >
            <List.Item arrow="horizontal">学校</List.Item>
          </Picker>
          {contactInfo}
          {/* {extraInfo} */}

          <InputItem
            {...getFieldProps("amount", {
              // initialValue: 'little ant',
              rules: [{ required: true, message: "请输入金额" }]
            })}
            clear
            error={!!getFieldError("amount")}
            onErrorClick={() => {
              alert(getFieldError("amount").join("、"));
            }}
            maxLength={6}
            placeholder="5,5元,面议...(长度限制6位)"
          // moneyKeyboardAlign="right"

          >
            订单金额
            </InputItem>

          <List.Item
            extra={<Switch
              checked={this.state.checked}
              onChange={() => {
                this.setState({
                  checked: !this.state.checked,
                });
              }}
            />}
          >是否接受留言推送
          </List.Item>


        </List>

        <List renderHeader={() => "描述"}>
          <ImagePickerExample form={this.props.form} />

          <TextareaItem
            {...getFieldProps("descipt", {
              rules: [{ required: true, message: "请输入简要描述" }]
            })}
            rows={5}
            count={100}
            error={!!getFieldError("descipt")}
            onErrorClick={() => {
              alert(getFieldError("descipt").join("、"));
            }}
            placeholder={desPlaceholder}
          />
        </List>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>

          <Checkbox.AgreeItem
            data-seed="logId"
            onChange={e => {
              console.log("checkbox", e);
              this.setState({ agree: e.target.checked });
            }}
          >
            阅读并同意&nbsp;
              <a
              onClick={e => {
                e.preventDefault();
                alert("agree it");
                this.setState({ agree: e.target.checked });
              }}
            >《免责声明》
              </a>
          </Checkbox.AgreeItem>
        </div>
        <WhiteSpace size="lg" />
        <WingBlank size="lg">
          <Button type="primary" onClick={this.submit}>
            提交
          </Button>
        </WingBlank>
        <WhiteSpace size="lg" />
        <Modal
          visible={this.state.modal1}
          transparent
          maskClosable={false}
          onClose={this.onClose('modal1')}
          footer={[{ text: '确定', onPress: () => { this.onClose('modal1')(); window.location = `#/mylist/${this.state.urlId}` } }]}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
          <div style={{ height: 'auto', textAlign: 'center' }}>
            分享成功<br />请添加下方客服后<br />把朋友圈截图发送给客服
           <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
              <div>
                <img
                  src={require('../../source/QQqcode.png')}
                  style={{ display: 'block', width: '85px', height: '85px' }}
                  alt="" />
                <span style={{ display: 'block', textAlign: 'center' }}>
                  QQ
                </span>
              </div>
              <div>
                <img
                  src={require('../../source/weixinqcode.png')}
                  style={{ display: 'block', width: '85px', height: '85px' }}
                  alt="" />
                <span style={{ display: 'block', textAlign: 'center' }}>
                  微信
                </span>
              </div>

            </div>
          </div>
        </Modal>
      </div >
    );
  }
}

export default class Submit extends React.Component {
  render() {
    const BasicInputWrapper = createForm()(BasicInput);
    return <BasicInputWrapper />;
  }
}
