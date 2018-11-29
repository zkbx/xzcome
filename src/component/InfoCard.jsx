import React from "react";
import { WingBlank, Card, WhiteSpace, Button, Modal } from "antd-mobile";

import Gallery from "./Gallery";
import { showQQ } from "../utlis/utlis";

export default class InfoCard extends React.Component {
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
            extra={this.props.contackKind?
              <Button
                size="small"
                inline
                onClick={() => {
                  var title = "";
                  switch (this.props.contackKind) {
                    case "0010":
                      title = "请联系QQ";
                      showQQ(this.props.contact);
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
                  Modal.alert(title, this.props.contact, [
                    {
                      text: "Ok"
                    }
                  ]);
                }}
              >
                {this.props.buttonText}
              </Button>:''
            }
          />
          <Gallery photos={this.props.photos} />
          <Card.Body>
            <div>
              <span>{this.props.description}</span>
              {this.props.askfor? <span
                style={{
                  fontSize: "2em",
                  fontWeight: "bold",
                  float: "right",
                  color: "#ffc4d0"
                }}
              >
                {this.props.askfor}
              </span>:<span
                style={{
                  fontSize: "2em",
                  fontWeight: "bold",
                  float: "right",
                  color: "#1DA57A"
                }}
              >
                {"￥" + this.props.amount}
              </span>}
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
