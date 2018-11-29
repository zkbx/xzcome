import React from "react";
import { WingBlank, Card, WhiteSpace, Badge, Modal, Button } from "antd-mobile";
import Gallery from "./Gallery";
import instance from "../utlis/api";

export default class InfoCard extends React.Component {
  constructor(props) {
    super(props);
    console.info(props);
    this.state = {
      hidden: false,
      status: this.props.status,
      kind: this.props.kind
    };
  }
  componentWillMount() {
    let text = "";
    let color = "";
    switch (this.state.status) {
      case 0:
        text = "待审核";
        color = "#f57665";
        break;
      case 1:
        text = "已发布";
        color = "#8b4c8c";
        break;
      case 2:
        text = "已完成";
        color = "#45b7b7";
        break;
      case 3:
        text = "已驳回";
        color = "#05004e";
        break;
      default:
        break;
    }
    let extra = null;
    switch (this.state.kind) {
      case "310000":
        extra = (
          <span
            style={{
              fontSize: "2em",
              fontWeight: "bold",
              float: "right",
              color: "#1DA57A"
            }}
          >
            {"￥" + this.props.amount}
          </span>
        );
        break;
      case "320000":
        extra = (
          <span
            style={{
              fontSize: "2em",
              fontWeight: "bold",
              float: "right",
              color: "#1DA57A"
            }}
          >
            {"￥" + this.props.amount}
          </span>
        );
        break;
      case "330000":
        extra = (
          <span
            style={{
              fontSize: "2em",
              fontWeight: "bold",
              float: "right",
              color: "#ffc4d0"
            }}
          >
            {this.props.askfor}
          </span>
        );
        break;

      default:
        break;
    }
    this.setState({
      extra: extra,
      badge: (
        <Badge
          text={text}
          style={{
            marginLeft: 12,
            padding: "0 3px",
            backgroundColor: color,
            borderRadius: 2
          }}
        />
      )
    });
  }
  componentWillUpdate() {
    this.componentWillMount();
  }
  render() {
    return (
      <WingBlank size="lg">
        <WhiteSpace size="lg" />
        <Card
          style={{
            boxShadow:
              "0 3px 5px 0 rgba(0,0,0,0.2), 0 3px 5px 0 rgba(0,0,0,0.05)"
          }}
        >
          <Card.Header
            title={
              <div>
                <div style={{ float: "left" }}>
                  <img
                    alt=""
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "16px"
                    }}
                    src={this.props.avatar}
                  />
                </div>
                <div style={{ flexDirection: "column", display: "flex" }}>
                  <span style={{ fontSize: "0.9em" }}>
                    {this.props.nickname}
                  </span>
                  <span style={{ color: "grey", "font-size": "0.5em" }}>
                    {this.props.time}
                  </span>{" "}
                </div>
              </div>
            }
            // thumb="https://gw.alipayobjects.com/zos/rmsportal/MRhHctKOineMbKAZslML.jpg"
            extra={
              <div>
                {this.state.badge}
                {this.state.status === 1 && (
                  <Button
                    size="small"
                    inline
                    onClick={() => {
                      Modal.alert("提示", "任务是否完成？", [
                        {
                          text: "否"
                        },
                        {
                          text: "是",
                          onPress: () => {
                            console.log("第0个按钮被点击了");
                            const data = {
                              status: 2
                            };
                            const remoteURL =
                              "/self/infoboard/" + this.props.id + "/update";
                            instance.post(remoteURL, data).then(response => {
                              this.setState({
                                status: 2
                              });
                            });
                          }
                        }
                      ]);
                    }}
                  >
                    已完成
                  </Button>
                )}
              </div>
            }
          />
          <Gallery photos={this.props.photos} />
          <Card.Body>
            <div>
              <span>{this.props.description}</span>
              {this.state.extra}
            </div>
            <WhiteSpace size="xs" />
            {/* <ImgDisplay /> */}
          </Card.Body>
          <Card.Footer />
        </Card>
      </WingBlank>
    );
  }
}
