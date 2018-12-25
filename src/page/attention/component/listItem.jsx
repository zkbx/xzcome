import React from "react";
import { Button } from 'antd-mobile';
import instance from "../../../utlis/api";
import {Modal} from "antd-mobile"

export default class AttentionLi extends React.Component {
    constructor(props) {
        super(props);

        let userself = JSON.parse(window.localStorage["userinfo"])

        this.state = {
            userself: userself,
            isLoad: false,
            showButton: this.props.active
        };
    }

    //数组去重
    unique(arr) {
        var res = [];
        var json = {};
        for (var i = 0; i < arr.length; i++) {
            if (!json[arr[i]]) {
                res.push(arr[i]);
                json[arr[i]] = 1;
            }
        }
        return res;
    }

    tapAttention = () => {
        this.setState({ isLoad: true })
        if (this.props.push) {
            if (this.state.showButton) {
                //取消推送
                instance.post('/push/delete',
                    {
                        user_id: this.props.user_id, kind: this.props.kind
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + window.localStorage.getItem('token')
                        }
                    }
                ).then(response => {
                    if (response.data.code == 0) {
                        this.setState({ isLoad: false })
                        this.setState({ showButton: !this.state.showButton })
                    } else {
                        Modal.alert(
                            "提示",
                            "网络出了点小差，请稍后重新请求页面..."
                        );
                    }


                })

            } else {
                //推送
                instance.post('/push',
                    {
                        user_id: this.props.user_id, kind: this.props.kind
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + window.localStorage.getItem('token')
                        }
                    }).then(response => {
                        if (response.data.code == 0) {
                            this.setState({ isLoad: false })
                            this.setState({ showButton: !this.state.showButton })
                        } else {
                            Modal.alert(
                                "提示",
                                "网络出了点小差，请稍后重新请求页面..."
                            );
                        }


                    })
            }
        } else {
            if (this.state.showButton) {
                //取消关注
                instance.post('/tags/delete',
                    {
                        user_id: this.props.user_id, kind: this.props.kind
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + window.localStorage.getItem('token')
                        }
                    }
                ).then(response => {
                    if (response.data.code == 0) {
                        this.setState({ isLoad: false })
                        this.setState({ showButton: !this.state.showButton })

                        let tagArr = []

                        instance
                            .post('/tags/query',
                                {
                                    user_id: this.state.userself.id
                                },
                                {
                                    headers: {
                                        Authorization: "Bearer " + window.localStorage["token"]
                                    }
                                }
                            )
                            .then(response => {
                                if (response.data.code == 0) {
                                    response.data.data.forEach(element => {
                                        tagArr.push(element.kind)
                                    });

                                    let userData = JSON.parse(window.localStorage["userinfo"]);

                                    userData.tags = this.unique(tagArr)
                                    window.localStorage.setItem("userinfo", JSON.stringify(userData));
                                } else {
                                    Modal.alert(
                                        "提示",
                                        "网络出了点小差，请稍后重新请求页面..."
                                    );
                                }

                            })
                    } else {
                        Modal.alert(
                            "提示",
                            "网络出了点小差，请稍后重新请求页面..."
                        );
                    }


                })

            } else {
                //关注
                instance.post('/tags',
                    {
                        user_id: this.props.user_id, kind: this.props.kind
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + window.localStorage.getItem('token')
                        }
                    }).then(response => {
                        if (response.data.code == 0) {
                            this.setState({ isLoad: false })
                            this.setState({ showButton: !this.state.showButton })
                            let userData = JSON.parse(window.localStorage["userinfo"]);
                            response.data.data.forEach(v => {
                                userData.tags.push(v.kind)
                            })
                            userData.tags = this.unique(userData.tags)
                            window.localStorage.setItem("userinfo", JSON.stringify(userData));
                        } else {
                            Modal.alert(
                                "提示",
                                "网络出了点小差，请稍后重新请求页面..."
                            );
                        }

                    })
            }
        }



    }

    render() {
        const word = this.props.push ? '推送' : '关注'
        return (

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px', backgroundColor: '#fff', marginBottom: '1px', height: '50px' }}>
                <span style={{ lineHeight: '50px', fontSize: '18px' }}>
                    {this.props.title}
                </span>
                <Button type={this.state.showButton ? 'warning' : ''} loading={this.state.isLoad} onClick={this.tapAttention.bind()} style={{ height: '36px', lineHeight: '36px', fontSize: '12px', width: '80px', marginTop: '7px' }}>{this.state.showButton ? `取消${word}` : `${word}`}</Button>
            </div>

        );
    }
}
