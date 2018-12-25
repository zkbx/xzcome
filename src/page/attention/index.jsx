import React from "react";
import MyBar from "../../component/MyBar"
// import { kindMap } from "../../Data"
import AttentionLi from './component/listItem'
import instance from "../../utlis/api";
import { Tabs, Badge,Modal } from "antd-mobile";



export default class Attention extends React.Component {
    constructor(props) {
        super(props);
        let userself = JSON.parse(window.localStorage["userinfo"])

        var user_id, tags;
        if ("userinfo" in window.localStorage) {
            const userinfo = JSON.parse(window.localStorage["userinfo"]);
            user_id = userinfo["id"];
            tags = userinfo["tags"]
            if (!userinfo["qq"]) {
            }
        }

        // console.log(user_id)
        this.state = {
            user_id: user_id,
            attMap: [],
            pushMap: []
        };
    }

    componentDidMount() {
        let that = this
        //获取关注列表
        instance
            .post('/tags/query',
                {
                    user_id: this.state.user_id
                },
                {
                    headers: {
                        Authorization: "Bearer " + window.localStorage["token"]
                    }
                }
            )
            .then(response => {
                if (response.data.code == 0) {
                    let userArr = []
                    response.data.data.forEach(element => {
                        userArr.push(element.kind)
                    });
                    let kindMapp = [
                        {
                            value: "310000",
                            label: "跑腿",
                            active: false
                        },
                        {
                            value: "320000",
                            label: "出售",
                            active: false
                        },
                        {
                            value: "330000",
                            label: "求购",
                            active: false
                        },
                        {
                            value: "340000",
                            label: "表白",
                            active: false
                        },
                        {
                            value: "350000",
                            label: "兼职",
                            active: false
                        },
                        {
                            value: "360000",
                            label: "租借",
                            active: false
                        },
                        {
                            value: "370000",
                            label: "答疑",
                            active: false
                        },
                        {
                            value: "380000",
                            label: "资料",
                            active: false
                        },
                        {
                            value: "390000",
                            label: "选课",
                            active: false
                        },
                        {
                            value: "400000",
                            label: "拼车",
                            active: false
                        },
                        {
                            value: "420000",
                            label: "其他",
                            active: false
                        }
                    ]
                    console.log(1, kindMapp)

                    userArr.forEach((v) => {
                        kindMapp.map(value => {
                            if (v == value.value) {
                                value.active = true
                            }
                        })
                    })
                    console.log(3, kindMapp)
                    that.setState({
                        attMap: kindMapp
                    })
                } else {
                    Modal.alert(
                        "提示",
                        "网络出了点小差，请稍后重新请求页面..."
                    );
                }

            })


        //获取推送列表
        instance
            .post('/push/query',
                {
                    user_id: this.state.user_id
                },
                {
                    headers: {
                        Authorization: "Bearer " + window.localStorage["token"]
                    }
                }
            )
            .then(response => {
                if (response.data.code == 0) {
                    let userArr = []
                    response.data.data.forEach(element => {
                        userArr.push(element.kind)
                    });

                    let kindMappp = [
                        {
                            value: "310000",
                            label: "跑腿",
                            active: false
                        },
                        {
                            value: "320000",
                            label: "出售",
                            active: false
                        },
                        {
                            value: "330000",
                            label: "求购",
                            active: false
                        },
                        {
                            value: "340000",
                            label: "表白",
                            active: false
                        },
                        {
                            value: "350000",
                            label: "兼职",
                            active: false
                        },
                        {
                            value: "360000",
                            label: "租借",
                            active: false
                        },
                        {
                            value: "370000",
                            label: "答疑",
                            active: false
                        },
                        {
                            value: "380000",
                            label: "资料",
                            active: false
                        },
                        {
                            value: "390000",
                            label: "选课",
                            active: false
                        },
                        {
                            value: "400000",
                            label: "拼车",
                            active: false
                        },
                        {
                            value: "420000",
                            label: "其他",
                            active: false
                        }
                    ]

                    console.log(5, kindMappp)
                    userArr.forEach((v) => {
                        kindMappp.map(value => {
                            if (v == value.value) {
                                value.active = true
                            }
                        })
                    })
                    console.log(6, kindMappp)
                    that.setState({
                        pushMap: kindMappp
                    })
                } else {
                    Modal.alert(
                        "提示",
                        "网络出了点小差，请稍后重新请求页面..."
                    );
                }


            })
    }

    render() {
        const tabs = [
            { title: <Badge >关注</Badge> },
            { title: <Badge >推送</Badge> },
        ];
        return (
            <div style={{ height: '100%' }}>

                {/* <MyBar title='关注管理' /> */}
                <Tabs tabs={tabs}
                    initialPage={0}

                >
                    <div style={{ paddingTop: '1px' }}>
                        {
                            this.state.attMap.map((v) => {
                                return <AttentionLi title={v.label} kind={v.value} active={v.active} user_id={this.state.user_id} />
                            })
                        }
                    </div>
                    <div style={{ paddingTop: '1px' }}>
                        {
                            this.state.pushMap.map((v) => {
                                return <AttentionLi title={v.label} kind={v.value} active={v.active} push={true} user_id={this.state.user_id} />
                            })
                        }
                    </div>
                </Tabs>
            </div >
        );
    }
}
