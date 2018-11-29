import React from "react";
import { WingBlank, Card, WhiteSpace, Button } from "antd-mobile";
import Gallery from "./Gallery";

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
            extra={
              <Button size="small" inline>
                {this.props.buttonText}
              </Button>
            }
          />
          <Gallery photos={this.props.photos} />

          <Card.Body>
            <div className="cute">
              <span>{this.props.description}</span>
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
