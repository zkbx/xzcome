import React from "react";
import { WingBlank, Card, WhiteSpace, Button, Modal, Badge } from "antd-mobile";
import instance from "../utlis/api";
import Gallery from "./Gallery";
export default class InfoCard extends React.Component {
  constructor(props) {
    super(props);
    let extra = null;
    switch (this.props.kind) {
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
    this.state = {
      review: true,
      status: 0,
      extra: extra
    };
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
              this.state.review && (
                <Button
                  size="small"
                  inline
                  maskClosable="true"
                  onClick={() =>
                    Modal.alert("提示", <div>处理结果</div>, [
                      {
                        text: "拒绝",
                        onPress: () => {
                          console.log("第0个按钮被点击了");
                          Modal.prompt("原因", "填写拒绝原因", [
                            { text: "Cancel" },
                            {
                              text: "Submit",
                              onPress: value => {
                                console.log(`输入的内容:${value}`);
                                const data = {
                                  status: 3,
                                  reason: value
                                };
                                const remoteURL =
                                  "/infoboard/" + this.props.id + "/update";
                                instance
                                  .post(remoteURL, data)
                                  .then(response => {
                                    this.setState({
                                      status: 3,
                                      review: false
                                    });
                                  });
                              }
                            }
                          ]);
                        }
                      },
                      {
                        text: "通过",
                        onPress: () => {
                          console.log("第0个按钮被点击了");
                          const data = {
                            status: 1
                          };
                          const remoteURL =
                            "/infoboard/" + this.props.id + "/update";
                          instance.post(remoteURL, data).then(response => {
                            this.setState({
                              status: 1,
                              review: false
                            });
                          });
                        }
                      }
                    ])
                  }
                >
                  审核
                </Button>
              )
            }
          />
          <Gallery photos={this.props.photos} />

          <Card.Body>
            <div>
              {this.state.status === 0 && (
                <Badge
                  text={"待审核"}
                  style={{
                    backgroundColor: "#ffba5a",
                    borderRadius: 2
                  }}
                />
              )}
              {this.state.status === 1 && (
                <Badge
                  text={"已通过"}
                  style={{
                    backgroundColor: "#ff7657",
                    borderRadius: 2
                  }}
                />
              )}
              {this.state.status === 3 && (
                <Badge
                  text={"已拒绝"}
                  style={{
                    backgroundColor: "#665c84",
                    borderRadius: 2
                  }}
                />
              )}
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
