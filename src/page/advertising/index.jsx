import React from "react";
import {
  WhiteSpace,
  Button,
  Picker,
  List,
  TextareaItem,
  InputItem,
  WingBlank,
  ImagePicker,
  Flex,
  Toast,
  Modal,
  Accordion,
  Checkbox
} from "antd-mobile";
import { createForm } from "rc-form";
import instance from "../../utlis/api";
import { kindMap, contact_kind, schoolMap } from "../../Data";
import { toLogin } from "../../utlis/utlis";


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
    files: [],
    files1: [],
    multiple: false,
    showImg: [],
    school: []
  };
  componentWillMount() {
    if (window.localStorage.getItem('userinfo')) {
      this.setState({ userinfo: JSON.parse(window.localStorage["userinfo"]) });
    } else {
      toLogin(1);
      this.setState({ userinfo: {} });
    }
  }

  FuckJsCallbackIWantImg = function (imgFiles, stateName) {
    let that = this
    let imginfo = []
    if (imgFiles.length > 0) {

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
          imginfo.push({
            src: file.name,
            width: targetWidth,
            height: targetHeight
          });
          console.log(imginfo)
          that.setState({
            [stateName]: imginfo
          })
        });
      };
    } else {
      that.setState({
        [stateName]: imginfo
      })
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
    if (this.state.userinfo.role !== 100) {
      Modal.alert("提示", '仅限管理员操作');
      return
    }
    this.props.form.validateFields((error, value) => {
      value.avatar = this.state.avatar

      console.log(value)
      if (error) {
        for (const err in error) {
          // console.log(error[err].errors[0].message);
          Modal.alert("提示", error[err].errors[0].message);
          return;
        }

      }
      if (this.state.school.length == 0) {
        Modal.alert("提示", '请选择学校');
        return
      }
      if (value.avatar.length == 0) {
        Modal.alert("提示", '请选择头像');
        return
      }
      if (this.state.showImg.length == 0) {
        Modal.alert("提示", '请选择广告图片');
        return
      }
      Toast.loading("请稍等");
      let info = {}
      info.descipt = value.descipt
      info.imgs = this.state.showImg
      let avatar = {}
      avatar.img = value.avatar
      const infoData = {
        user_id: this.state.userinfo.id,
        avatar: JSON.stringify(avatar),
        link: value.link,
        nickname: value.nickName,

        school_id: this.state.school,
        info: JSON.stringify(info)
      };
      const remoteURL = "/stick";
      instance
        .post(remoteURL, infoData, {
          headers: {
            Authorization: "Bearer " + window.localStorage.getItem('token')
          }
        })
        .then(response => {
          if (response.data.code == 0) {
            Toast.success("发布成功", 1);
            window.location = "#/reviewAD";
          } else {
            Toast.hide()
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

      //
      // const imgs = value.photo;
      // delete value.photo;
      // value.imgs = [];
      // value.id = this.state.userinfo.id;
      // FuckJsCallbackIWantImg(imgs, value, this.state.checked);
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

  onChange = (files, type, index) => {
    console.log(files, type, index);
    this.setState({
      files
    }, () => {
      console.log(11, this.state.files)
      this.FuckJsCallbackIWantImg(this.state.files, 'avatar')
    });


  };
  onChange1 = (files, type, index) => {
    console.log(files, type, index);
    this.setState({
      files1: files
    }, () => {
      console.log(22, this.state.files1)
      this.FuckJsCallbackIWantImg(this.state.files1, 'showImg')
    });


  };

  componentDidMount() {
    this.props.form.setFieldsValue({ photo: this.state.files, photo1: this.state.files1 });
  }

  schoolChange = (key) => {
    let schoolList = this.state.school
    if (schoolList.length !== 0) {
      if (schoolList.some(function (x) {
        return x == key;
      })) {
        schoolList.splice(schoolList.indexOf(key), 1)
      } else {
        schoolList.push(key)
      }
    } else {
      schoolList.push(key)
    }
    this.setState({
      school: schoolList
    })
    // console.log()

  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const data = [
      { value: 0, label: 'Ph.D.' },
      { value: 1, label: 'Bachelor' },
      { value: 2, label: 'College diploma' },
    ];

    const { files, files1 } = this.state;

    return (
      <div>
        <List renderHeader={() => "基本信息"}>
          <List.Item>
            <Flex justify="between">
              <span style={{ float: 'left', marginRight: '50px' }}>
                选择头像
              </span>
              <div style={{ width: '70px' }}>
                {/* <ImagePickerExample form={this.props.form} length={1} /> */}
                <ImagePicker
                  {...this.props.form.getFieldProps("avatar")}
                  files={files}
                  onChange={this.onChange}
                  onImageClick={(index, fs) => {
                    console.log(index, fs);
                    //   put(fs);
                  }}
                  length={1}
                  selectable={files.length < 1}
                  multiple={this.state.multiple}
                />
              </div>


            </Flex>


          </List.Item>

          <InputItem
            {...getFieldProps("nickName", {
              // initialValue: 'little ant',
              rules: [{ required: true, message: "请输入金额" }]
            })}
            clear
            error={!!getFieldError("amount")}
            onErrorClick={() => {
              alert(getFieldError("amount").join("、"));
            }}
            maxLength={6}
            placeholder="请输入昵称"
          // moneyKeyboardAlign="right"

          >
            昵称
            </InputItem>

          {/* <Picker
            data={schoolMap}
            cols={1}
            {...getFieldProps("school_id", {
              initialValue: [this.state.userinfo["school_id"]],
              rules: [{ required: true, message: "请选择学校" }]
            })}
            className="forss"
          >
            <List.Item arrow="horizontal">学校</List.Item>
          </Picker> */}
          <InputItem
            {...getFieldProps("link", {
              // initialValue: 'little ant',
              rules: [{ required: true, message: "请输入金额" }]
            })}
            clear
            error={!!getFieldError("amount")}
            onErrorClick={() => {
              alert(getFieldError("amount").join("、"));
            }}
            placeholder="请输入跳转链接"
          // moneyKeyboardAlign="right"

          >
            跳转链接
            </InputItem>
          <Accordion className="my-accordion">
            <Accordion.Panel header="学校选择">
              <List>
                {schoolMap.map(i => (
                  <Checkbox.CheckboxItem key={i.value} onChange={() => this.schoolChange(i.value)}>
                    {i.label}
                  </Checkbox.CheckboxItem>
                ))}
              </List>
            </Accordion.Panel>
          </Accordion>
        </List>
        <List renderHeader={() => "广告语"}>
          <div style={{ width: '200px' }}>
            <ImagePicker
              {...this.props.form.getFieldProps("content")}
              files={files1}
              onChange={this.onChange1}
              onImageClick={(index, fs) => {
                console.log(index, fs);
                //   put(fs);
              }}
              length={1}
              selectable={files1.length < 1}
              multiple={this.state.multiple}
            />
          </div>


          <TextareaItem
            {...getFieldProps("descipt", {
              rules: [{ required: true, message: "请输入广告语" }]
            })}
            rows={5}
            count={100}
            error={!!getFieldError("descipt")}
            onErrorClick={() => {
              alert(getFieldError("descipt").join("、"));
            }}
            placeholder={'请输入广告语'}
          />
        </List>
        <div style={{ marginTop: '10px' }}>
          <WingBlank size="lg">
            <Button type="primary" onClick={this.submit}>
              提交
          </Button>
          </WingBlank>
        </div>

        <WhiteSpace size="lg" />
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
