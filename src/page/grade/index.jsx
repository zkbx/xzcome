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
    Modal
} from "antd-mobile";
import { createForm } from "rc-form";

import { schoolMap } from "../../Data";
import { toLogin } from "../../utlis/utlis";


const isIPhone = new RegExp("\\biPhone\\b|\\biPod\\b", "i").test(
    window.navigator.userAgent
);
let moneyKeyboardWrapProps;
if (isIPhone) {
    moneyKeyboardWrapProps = {
        onTouchStart: e => e.preventDefault()
    };
}


class BasicInput extends React.Component {
    state = {
        choosedContact: false,
        kind: ""
    };
    componentWillMount() {
        if ("userinfo" in window.localStorage) {
            this.setState({ userinfo: JSON.parse(window.localStorage["userinfo"]) });
        } else {
            toLogin(1);
            this.setState({ userinfo: {} });
        }
    }

    submit = () => {
        // this.props.form.validateFields((error, value) => {

        //     if (error) {
        //         console.log(error)


        //         if (error.kind) {
        //             Modal.alert("提示", error.kind.errors[0].message);
        //             return;
        //         }

        //         for (const err in error) {
        //             // console.log(error[err].errors[0].message);
        //             Modal.alert("提示", error[err].errors[0].message);
        //             return;
        //         }

        //         if (error.amount) {
        //             Modal.alert("提示", error.amount.errors[0].message);
        //             return;
        //         }
        //     }
        //     if (!value.school_id[0]) {
        //         Modal.alert("提示", '请选择学校');
        //         return
        //     }


        //     if (!this.state.agree) {
        //         Modal.alert("提示", "请同意免责声明");
        //         return;
        //     }
        //     Toast.loading("请稍等");
        //     const imgs = value.photo;
        //     delete value.photo;
        //     value.imgs = [];
        //     if (value.contact_kind) {
        //         value.contact_kind = value.contact_kind[0];
        //     }
        //     if (value.anonymous) {
        //         value.anonymous = value.anonymous[0];
        //     }
        //     value.id = this.state.userinfo.id;

        // });
        window.location = "#/myGrade"
    };

    render() {
        const { getFieldProps, getFieldError } = this.props.form;

        return (
            <div>

                <WhiteSpace size="lg" />
                <List>

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

                    <InputItem
                        {...getFieldProps("account", {
                            // initialValue: 'little ant',
                            rules: [{ required: true, message: "请输入学号" }]
                        })}
                        clear
                        error={!!getFieldError("account")}
                        onErrorClick={() => {
                            alert(getFieldError("account").join("、"));
                        }}
                        placeholder="请输入您的学号"
                    // moneyKeyboardAlign="right"
                    >
                        账户
                    </InputItem>
                    <InputItem
                        {...getFieldProps("password", {
                            // initialValue: 'little ant',
                            rules: [{ required: true, message: "请输入密码" }]
                        })}
                        clear
                        error={!!getFieldError("password")}
                        type="password"
                        onErrorClick={() => {
                            alert(getFieldError("password").join("、"));
                        }}
                        placeholder="请输入您的密码"
                    // moneyKeyboardAlign="right"
                    >
                        密码
                    </InputItem>

                </List>

                <Flex>
                    <Flex.Item>
                        <Checkbox.AgreeItem
                            data-seed="logId"
                            onChange={e => {
                                console.log("checkbox", e);
                                this.setState({ agree: e.target.checked });
                            }}
                        >
                            阅读并同意&nbsp;
              <a onClick={e => {
                                e.preventDefault();
                                alert("agree it");
                                this.setState({ agree: e.target.checked });
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
                <WhiteSpace size="lg" />
            </div>
        );
    }
}

export default class Submit extends React.Component {
    render() {
        const BasicInputWrapper = createForm()(BasicInput);
        return <BasicInputWrapper />;
    }
}
