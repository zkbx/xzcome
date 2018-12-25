import React from "react";
import {
    WhiteSpace,
    Card,
    Button,
    Modal,
    InputItem,
    ActivityIndicator
} from "antd-mobile";
import getDateDiff from "../../utlis/getDateDiff";
import instance from "../../utlis/api";
import { schoolMap } from "../../Data";
import { toLogin, showQQ } from "../../utlis/utlis";
import Gallery from "../../component/Gallery";
import MyBar from "../../component/MyBar";


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
    constructor(props) {
        super(props);

        let user_id, role
        if ("userinfo" in window.localStorage) {
            const userinfo = JSON.parse(window.localStorage["userinfo"]);
            user_id = userinfo["id"];
            role = userinfo["role"]
            if (!userinfo["qq"]) {
            }
        }

        this.state = {
            content: '',
            user_id: user_id,
            role: role,
            userinfo: window.localStorage["userinfo"],
            animating: false
        };
    }

    componentWillMount() {
        let that = this
        if ("userinfo" in window.localStorage) {
            this.setState({ userinfo: JSON.parse(window.localStorage["userinfo"]) });
        } else {
            // toLogin(1);
            this.setState({ userinfo: {} });
        }

        const remoteURL = "/infoboard/" + this.props.match.params.id;

        instance.get(remoteURL).then(response => {
            if (response.data.code == 0) {
                that.setState({
                    showData: response.data.data
                }, () => {
                    that.setAll()
                })
            } else {
                Modal.alert(
                    "提示",
                    "网络出了点小差，请稍后重新请求页面..."
                );
            }

        });

    }

    setAll() {
        instance
            .post('/message/query',
                {
                    infoboard_id: this.state.showData.id,
                    school_id: this.state.showData.school_id,
                }
            )
            .then(response => {
                if (response.data.code == 0) {
                    // console.log(response.data.data)
                    this.setState({
                        messageList: response.data.data
                    })
                } else {
                    Modal.alert(
                        "提示",
                        "网络出了点小差，请稍后重新请求页面..."
                    );
                }

            })
    }

    showSchool(e) {
        if (e) {
            let schoolName = schoolMap.filter((v, i) => {
                return v.value == e
            })
            return (schoolName[0].label)
        }

    }

    submit() {
        let reg = /^\s*$/g
        if (!window.localStorage.getItem('token')) {
            toLogin(1)
            return
        }

        if (reg.test(this.state.content)) {
            Modal.alert("提示", "输入内容不得为空！", [
                {
                    text: "确定",
                }
            ]);
            return
        } else {
            this.setState({ animating: true });
            instance
                .post('/message',
                    {
                        user_id: this.state.user_id,
                        infoboard_id: this.state.showData.id,
                        school_id: this.state.showData.school_id,
                        content: this.state.content
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + window.localStorage["token"]
                        }
                    }
                )
                .then(response => {
                    if (response.data.code == 0) {
                        this.setState({ animating: false });
                        this.setAll()



                        // let userArr = []
                        // response.data.data.forEach(element => {
                        //     userArr.push(element.kind)
                        // });
                        // let kindMapp = that.state.dataMap
                        // userArr.forEach((v) => {
                        //     kindMapp.map(value => {

                        //         if (v !== value.value) {
                        //             value.active = false
                        //         }
                        //     })
                        // })
                        // userArr.forEach((v) => {
                        //     kindMapp.map(value => {
                        //         if (v == value.value) {
                        //             value.active = true
                        //         }
                        //     })
                        this.setState({
                            content: ''
                        })
                    } else {
                        Modal.alert(
                            "提示",
                            "网络出了点小差，请稍后重新请求页面..."
                        );
                    }

                })
        }
    }
    delete(e) {
        instance
            .post(`/message/delete/${e}`,
                {
                    user_id: this.state.user_id,
                    infoboard_id: this.state.showData.id,
                    school_id: this.state.showData.school_id,

                },
                {
                    headers: {
                        Authorization: "Bearer " + window.localStorage["token"]
                    }
                }
            )
            .then(response => {
                if (response.data.code == 0) {
                    this.setAll()
                } else {
                    Modal.alert(
                        "提示",
                        "网络出了点小差，请稍后重新请求页面..."
                    );
                }

            })
    }

    showDelete(a, b) {
        if (this.state.role && this.state.role !== 0) {
            return (
                <a onClick={this.delete.bind(this, a)} style={{ fontSize: '0.9em' }}>
                    删除
                </a>
            )
        } else if (this.state.showData.user.id == this.state.user_id) {
            return (
                <a onClick={this.delete.bind(this, a)} style={{ fontSize: '0.9em' }}>
                    删除
                    </a>
            )

        } else if (b == this.state.user_id) {
            return (
                <a onClick={this.delete.bind(this, a)} style={{ fontSize: '0.9em' }}>
                    删除
                </a>
            )
        } else {
            return
        }
        // return (
        //     <span>
        //         {this.state.showData.user.id}  {this.state.user_id}  {this.state.role}
        //     </span>
        // )
    }

    render() {

        return (
            <div style={{ height: '100%', position: 'relative' }}>
                <MyBar title='订单详情' />
                <div style={{ position: 'relative' }}>
                    {this.state.showData && this.state.showData.status > 1 ?
                        <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.2)', zIndex: 3 }}>
                            <span style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: '-85px', marginTop: '-45px', fontSize: '30px', fontWeight: 'bold', display: 'block', lineHeight: '2.5em', width: '150px', border: '3px solid #000', borderRadius: '10px', textAlign: 'center', transform: 'rotate(14deg)' }}>
                                已失效
                        </span>
                        </div> : ''
                    }
                    <ActivityIndicator
                        toast
                        text="Loading..."
                        animating={this.state.animating}
                    />
                    <WhiteSpace size="lg" />
                    {this.state.showData ? <Card full>
                        <Card.Header
                            title={<div>
                                <div style={{ float: "left", marginRight: 8 }}>
                                    <img
                                        alt=""
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%"
                                        }}
                                        src={this.state.showData.user.avatar}
                                    />
                                </div>
                                <div style={{ flexDirection: "column", display: "flex" }}>
                                    <span style={{ fontSize: "0.8em", marginTop: 4 }}>
                                        {this.state.showData.user.nickname}
                                    </span>
                                    <span style={{ color: "grey", fontSize: "0.6em", marginTop: 6 }}>
                                        {getDateDiff(this.state.showData.created_at)}
                                    </span>{" "}
                                </div>
                            </div>
                            }
                            // thumb={data.user.avatar}
                            extra={this.state.showData.status == 1 ? <Button
                                size="small"
                                inline
                                onClick={() => {
                                    var title = "";
                                    switch (this.state.showData.info.contact_kind) {
                                        case "0010":
                                            title = "请联系QQ";
                                            showQQ(this.state.showData.info.contact);
                                            return;
                                        case "0020":
                                            title = "请联系微信";
                                            break;
                                        case "0030":
                                            title = "请联系电话";
                                            break;
                                        default:
                                            break;
                                    }
                                    Modal.alert(title, this.state.showData.info.contact, [
                                        {
                                            text: "Ok"
                                        }
                                    ]);
                                }}
                            >
                                联系
                          </Button> : ''}
                        />
                        <Card.Body>
                            {/* <div>This is content of `Card`</div> */}

                            <div >

                                {this.state.showData.info.imgs.length ?
                                    <div style={{ display: 'block', width: '100%', marginTop: '', marginBottom: '5px' }}>
                                        <Gallery photos={this.state.showData.info.imgs} />
                                    </div>
                                    : ''
                                }
                                <span style={{ display: 'block', lineHeight: '1.5' }}>{this.state.showData.description}</span>
                                <span style={{ textAlign: 'left' }}>
                                    {this.state.showData.info.descipt}
                                </span>
                                <span
                                    style={{
                                        fontSize: "2em",
                                        fontWeight: "bold",
                                        display: 'block',
                                        color: "#1DA57A"
                                    }}
                                >
                                    {"￥" + this.state.showData.info.amount}
                                </span>

                            </div>
                        </Card.Body>

                    </Card> : ''}
                    <WhiteSpace size="md" />
                    {this.state.messageList && this.state.showData && this.state.showData.status == 1 ?
                        <div>
                            <div style={{ width: '100%', borderTop: '1px solid #ddd', padding: '10px', backgroundColor: '#fff', boxSizing: 'border-box' }}>
                                留言{this.state.messageList.length}条
                        </div>
                            <ul style={{ listStyle: 'none', padding: '0 10px', backgroundColor: '#fff', margin: 0, borderTop: '1px solid #ddd', marginBottom: '44px' }}>

                                {this.state.messageList.map(v => {
                                    return (
                                        <li style={{ padding: '10px 0', borderBottom: '1px solid #ddd', wordWrap: 'break-word', wordBreak: 'break-all', overflow: 'hidden' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#59647E', fontSize: '0.8em' }}>
                                                    {v.user_info.nickname}
                                                </span>
                                                {this.showDelete(v.id, v.user_info.id)}

                                            </div>
                                            <span style={{ lineHeight: 2, display: 'block' }}>
                                                {v.content}
                                            </span>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#888', lineHeight: '1.2', display: 'block', textAlign: 'right', fontSize: '0.8em' }}>
                                                    {this.showSchool(v.user_info.school_id)}
                                                </span>
                                                <span style={{ color: '#888', lineHeight: '1.2', display: 'block', textAlign: 'right', fontSize: '0.8em' }}>
                                                    {getDateDiff(new Date(v.create_at).getTime())}
                                                </span>
                                            </div>

                                        </li>

                                    )
                                })}

                            </ul>  </div> : ''}
                    {
                        this.state.showData && this.state.showData.status == 1 ? <div style={{ position: 'fixed', bottom: '0', width: '100%' }}>
                            <InputItem
                                placeholder="请输入内容"
                                onChange={(v) => { this.setState({ content: v }) }}
                                value={this.state.content}
                                extra={<a

                                    onClick={
                                        this.submit.bind(this)
                                    }

                                >留言</a>}
                            />
                        </div> : ''
                    }

                </div>
            </div>
        );
    }
}

export default BasicInput;