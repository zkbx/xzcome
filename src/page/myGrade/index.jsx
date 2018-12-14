import React from "react";
import {
    WhiteSpace,
    Card,
    Button,
    Modal
} from "antd-mobile";
import getDateDiff from "../../utlis/getDateDiff";
import instance from "../../utlis/api";
import { kindMap, contact_kind, schoolMap } from "../../Data";
import { toLogin,showQQ } from "../../utlis/utlis";



const isIPhone = new RegExp("\\biPhone\\b|\\biPod\\b", "i").test(
    window.navigator.userAgent
);
let moneyKeyboardWrapProps;
if (isIPhone) {
    moneyKeyboardWrapProps = {
        onTouchStart: e => e.preventDefault()
    };
}

let data = {
    "id": 3700,
    "user": {
        "id": 1503,
        "nickname": "飘絮",
        "avatar": "http://qzapp.qlogo.cn/qzapp/101507500/57E2ADF5CE1BD433757F0C72FDAC3A91/100",
        "school_id": "0010"
    },
    "school_id": "0010",
    "info": {
        "amount": "30",
        "contact": "549545364",
        "contact_kind": "0010",
        "descipt": "OPPO Q9蓝牙音响，比较小巧，携带很方便，应该是苹果安卓都能用的，可以放音乐接打电话，新的一直没用，说明书包装盒都在的。价格可议。",
        "id": 1503,
        "imgs": [{ "height": 400, "src": "1724917.png", "width": 300 }]
    },
    "status": 1,
    "kind": "320000",
    "created_at": 1544490511749
}

class BasicInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            choosedContact: false,
            kind: ""
        };
    }

    componentWillMount() {
        if ("userinfo" in window.localStorage) {
            this.setState({ userinfo: JSON.parse(window.localStorage["userinfo"]) });
        } else {
            // toLogin(1);
            this.setState({ userinfo: {} });
        }
    }



    render() {

        return (
            <div style={{ height: '100%' }}>
                <WhiteSpace size="lg" />
                <Card full>
                    <Card.Header
                        title={<div>
                            <div style={{ float: "left", marginRight: 8 }}>
                              <img
                                alt=""
                                style={{
                                  width: "48px",
                                  height: "48px",
                                  borderRadius: "50%"
                                }}
                                src={data.user.avatar}
                              />
                            </div>
                            <div style={{ flexDirection: "column", display: "flex" }}>
                              <span style={{ fontSize: "1.2em" , marginTop: 4}}>
                                {data.user.nickname}
                              </span>
                              <span style={{ color: "grey", fontSize: "0.9em", marginTop: 6 }}>
                                {getDateDiff(data.created_at)}
                              </span>{" "}
                            </div>
                          </div>
                        }
                        // thumb={data.user.avatar}
                        extra={<Button
                            size="large"
                            inline
                            onClick={() => {
                              var title = "";
                              switch (data.info.contact_kind) {
                                case "0010":
                                  title = "请联系QQ";
                                  showQQ(data.info.contact);
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
                              Modal.alert(title, data.info.contact, [
                                {
                                  text: "Ok"
                                }
                              ]);
                            }}
                          >
                            联系
                          </Button>}
                    />
                    <Card.Body>
                        <div>This is content of `Card`</div>
                    </Card.Body>
                    <Card.Footer content="footer content" extra={<div>extra footer content</div>} />
                </Card>
            </div>
        );
    }
}

export default BasicInput;
