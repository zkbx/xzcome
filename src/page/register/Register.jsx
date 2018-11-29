import React from "react";
import {
  WhiteSpace,
  Picker,
  List,
  Button,
  InputItem,
  WingBlank,
  Checkbox,
  Flex
} from "antd-mobile";
import { createForm } from "rc-form";

class BasicInput extends React.Component {
  render() {
    const school = [
      {
        value: "0010",
        label: "西北工业大学"
      },
      {
        value: "0020",
        label: "明德学院"
      },
      {
        value: "0030",
        label: "西安石油大学"
      },
      {
        value: "0040",
        label: "西安工程大学"
      },
      {
        value: "0051",
        label: "西安科技大学"
      },
      {
        value: "0052",
        label: "西建大·草堂"
      },
      {
        value: "0060",
        label: "西建大·本部"
      },
      {
        value: "0070",
        label: "西安电子科技大学"
      }
    ];
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <div>
        <WhiteSpace size="lg" />
        <List>
          <Picker
            data={school}
            cols={1}
            {...getFieldProps("district3")}
            className="forss"
          >
            <List.Item arrow="horizontal">学校</List.Item>
          </Picker>
          <InputItem
            {...getFieldProps("nickname", {
              // initialValue: 'little ant',
              rules: [
                { required: true, message: "请填写昵称" },
                { validator: this.validateAccount }
              ]
            })}
            clear
            error={!!getFieldError("nickname")}
            onErrorClick={() => {
              alert(getFieldError("nickname").join("、"));
            }}
            placeholder="展示昵称"
          >
            昵称
          </InputItem>
          <InputItem
            {...getFieldProps("qq", {
              // initialValue: 'little ant',
              rules: [
                { required: true, message: "请输入QQ" },
                { validator: this.validateAccount }
              ]
            })}
            clear
            error={!!getFieldError("qq")}
            onErrorClick={() => {
              alert(getFieldError("qq").join("、"));
            }}
            placeholder="填写QQ，方便联系"
          >
            QQ
          </InputItem>
          <InputItem
            {...getFieldProps("account", {
              // initialValue: 'little ant',
              rules: [
                { required: true, message: "Please input account" },
                { validator: this.validateAccount }
              ]
            })}
            clear
            error={!!getFieldError("account")}
            onErrorClick={() => {
              alert(getFieldError("account").join("、"));
            }}
            placeholder="选填"
          >
            微信
          </InputItem>
          <InputItem
            {...getFieldProps("phone", {
              // initialValue: 'little ant',
              rules: [
                { required: true, message: "Please input account" },
                { validator: this.validateAccount }
              ]
            })}
            clear
            error={!!getFieldError("account")}
            onErrorClick={() => {
              alert(getFieldError("account").join("、"));
            }}
            placeholder="选填"
          >
            电话
          </InputItem>
        </List>
        <Flex>
          <Flex.Item>
            <Checkbox.AgreeItem
              data-seed="logId"
              onChange={e => console.log("checkbox", e)}
            >
              阅读并同意{" "}
              <a
                onClick={e => {
                  e.preventDefault();
                  alert("agree it");
                }}
              >
                《免责声明》
              </a>
            </Checkbox.AgreeItem>
          </Flex.Item>
        </Flex>
        <WingBlank size="lg">
          <Button type="primary" onClick={this.submit}>
            提交
          </Button>
        </WingBlank>
      </div>
    );
  }
}

export default class Register extends React.Component {
  render() {
    const BasicInputWrapper = createForm()(BasicInput);
    return <BasicInputWrapper />;
  }
}
