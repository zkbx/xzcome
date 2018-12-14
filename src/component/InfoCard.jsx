import React from "react";
import { WingBlank, Card, WhiteSpace, Button, Modal, Badge } from "antd-mobile";
import instance from "../utlis/api";
import Gallery from "./Gallery";
import { showQQ } from "../utlis/utlis";
import { schoolMap } from "../Data"

let message = [
  {
    id: 1,
    infoboard_id: 1,
    user: {
      id: 1,
      nickname: '啊是大',
      avatar: '',
      school_id: ''
    },
    content: 'alallala'
  }, {
    id: 1,
    infoboard_id: 1,
    user: {
      id: 1,
      nickname: '啊是大',
      avatar: '',
      school_id: ''
    },
    content: 'alallala'
  }, {
    id: 1,
    infoboard_id: 1,
    user: {
      id: 1,
      nickname: '啊是大',
      avatar: '',
      school_id: ''
    },
    content: 'alallala'
  }, {
    id: 1,
    infoboard_id: 1,
    user: {
      id: 1,
      nickname: '啊是大',
      avatar: '',
      school_id: ''
    },
    content: 'alallala'
  }, {
    id: 1,
    infoboard_id: 1,
    user: {
      id: 1,
      nickname: '啊是大',
      avatar: '',
      school_id: ''
    },
    content: 'alallala'
  },
]


export default class InfoCard extends React.Component {
  constructor(props) {
    super(props);
    // console.info(props);
    let user_id, role
    if ("userinfo" in window.localStorage) {
      const userinfo = JSON.parse(window.localStorage["userinfo"]);
      user_id = userinfo["id"];
      role = userinfo["role"]
    }
    this.state = {
      hidden: false,
      status: this.props.status,
      kind: this.props.kind,
      user_id: user_id,
      role: role,
      showhidden: 1,
      newData: []
    };
  }
  componentWillMount() {
    instance
      .post('/message/query',
        {
          infoboard_id: this.props.id,
          school_id: this.props.school_id,
        }
      )
      .then(response => {
        this.setState({
          messageList: response.data.data.reverse()
        }, () => {
          let newData = []
          let len = this.state.messageList.length > 3 ? 3 : this.state.messageList.length
          for (let i = 0; i < len; i++) {
            newData.push(this.state.messageList[i])
          }
          this.setState({
            newData: newData.reverse()
          })
        })
      })
  }

  showExtra() {
    if (this.props.title) {
      if (this.props.review) {
        console.log(this.state.status)
        if (this.state.status == 0) {
          return (
            <Button
              size="small"
              inline
              // maskClosable="true"
              onClick={(event) => {
                event.stopPropagation();
                Modal.alert("提示", <div>处理结果</div>, [
                  {
                    text: "拒绝",
                    onPress: () => {
                      // console.log("第0个按钮被点击了");
                      Modal.prompt("原因", "填写拒绝原因", [
                        { text: "Cancel" },
                        {
                          text: "Submit",
                          onPress: value => {
                            // console.log(`输入的内容:${value}`);
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
                                  review: false,
                                  // showhidden: 3
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
                      // console.log("第0个按钮被点击了");
                      const data = {
                        status: 1
                      };
                      const remoteURL =
                        "/infoboard/" + this.props.id + "/update";
                      instance.post(remoteURL, data).then(response => {
                        this.setState({
                          status: 1,
                          review: false,
                          // showhidden: 1
                        });
                      });
                    }
                  }
                ])

              }
              }
            >
              审核
          </Button>
          )

        } else {
          return
        }

      } else {
        if (this.state.status === 1) {
          return (
            <div>
              <Button
                size="small"
                inline
                onClick={(event) => {
                  event.stopPropagation();
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
                        instance.post(remoteURL, data,{
                          headers: {
                            Authorization: "Bearer " + window.localStorage.getItem('token')
                          }
                        }).then(response => {
                          this.setState({
                            status: 2
                          });
                        });
                      }
                    }
                  ]);
                }}
              >
                完成
              </Button>
            </div>
          )
        }
      }


    } else {
      // console.log(this.props.id)
      if (this.state.role !== 0 && this.state.role) {
        return (<Button
          size="small"
          inline
          // maskClosable="true"
          onClick={(event) => {
            event.stopPropagation();
            Modal.prompt("原因", "填写隐藏原因", [
              { text: "取消" },
              {
                text: "提交",
                onPress: value => {
                  console.log(`输入的内容:${value}`);
                  const data = {
                    status: 4,
                    reason: value
                  };
                  const remoteURL =
                    "/infoboard/" + this.props.id + "/update";
                  instance
                    .post(remoteURL, data)
                    .then(response => {
                      this.setState({
                        status: 4,
                        review: false,
                        showhidden: 3
                      });
                    });
                }
              }
            ]);
          }
          }
        >
          隐藏
            </Button>)

      } else {
        if (this.state.user_id == this.props.user_id) {
          return (
            <div>
              <Button
                size="small"
                inline
                onClick={(event) => {
                  event.stopPropagation();
                  Modal.alert("提示", "任务是否完成？", [
                    {
                      text: "否"
                    },
                    {
                      text: "是",
                      onPress: () => {
                        const data = {
                          status: 2
                        };
                        const remoteURL =
                          "/self/infoboard/" + this.props.id + "/update";
                        instance.post(remoteURL, data).then(response => {
                          this.setState({
                            status: 2,
                            showhidden: 3,
                            complete: true
                          });
                        });
                      }
                    }
                  ]);
                }}
              >
                完成
            </Button>
            </div>
          )
        }
      }

      return (
        <Button
          size="small"
          inline
          onClick={(event) => {
            event.stopPropagation();
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
        </Button>
      )
    }
  }

  showSchool(e) {
    if (e) {
      let schoolName = schoolMap.filter((v, i) => {
        return v.value == e
      })
      return (schoolName[0].label)
    }

  }

  showBadge(e) {
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
      case 4:
        text = "已下架";
        color = "#05004e";
        break;
      default:
        break;
    }
    return (
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

  }

  render() {




    return (
      <div onClick={() => { 
        window.location = `#/w/${this.props.id}`;
        }}>
        <WingBlank size="lg" >
          <WhiteSpace size="lg" />
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: '5px', position: 'absolute', width: '100%', height: '100%', top: '0', left: '0', backgroundColor: 'rgba(0,0,0,0.2)', zIndex: `${this.state.showhidden}` }}>
              <span style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: '-85px', marginTop: '-40px', fontSize: '30px', fontWeight: 'bold', display: 'block', lineHeight: '2.5em', width: '150px', border: '3px solid #000', borderRadius: '10px', textAlign: 'center', transform: 'rotate(14deg)' }}>
                {this.state.complete ? '已完成' : '已失效'}
              </span>
            </div>
            <Card
              style={{
                boxShadow:
                  "0 3px 5px 0 rgba(0,0,0,0.2), 0 3px 5px 0 rgba(0,0,0,0.05)", position: 'relative', zIndex: '2'
              }}
            >
              <Card.Header
                title={
                  <div>
                    <div style={{ float: "left", marginRight: 4 }}>
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
                      <span style={{ color: "grey", fontSize: "0.5em", marginTop: 4 }}>
                        {this.props.time}
                      </span>{" "}
                    </div>
                  </div>
                }
                // thumb="https://gw.alipayobjects.com/zos/rmsportal/MRhHctKOineMbKAZslML.jpg"
                extra={this.showExtra()}
              />
              <Gallery photos={this.props.photos} />
              <Card.Body>
                <div>
                  <div >
                    <span style={{ lineHeight: '1.5' }}>{this.props.description}</span>
                    <span
                      style={{
                        fontSize: "1.8em",
                        fontWeight: "bold",
                        float: "right",
                        color: "#1DA57A"
                      }}
                    >
                      {"￥" + this.props.amount}
                    </span>
                  </div>
                  <div style={{clear:"both"}}>

                  </div>
                  {
                    (!this.props.message) || (this.state.newData.length == 0)
                      ? ''
                      : <div style={{ marginTop: '6px' }}>
                        <div style={{
                          width: 0, height: 0,
                          borderWidth: '0 8px 8px',
                          borderStyle: 'solid',
                          borderColor: 'transparent transparent #EEE',
                          marginLeft: '10px',
                          position: 'relative'
                        }}></div>
                        <span style={{ display: 'block', height: 'auto', backgroundColor: '#eee', padding: '4px 0', paddingLeft: '8px' }}>
                          {
                            this.state.newData.map(v => {
                              return (
                                <span style={{ display: 'block', fontSize: '0.8em', lineHeight: '1.5' }}>
                                  <span style={{ color: '#59647E' }}>
                                    {v.user_info.nickname}
                                  </span>：{v.content}
                                </span>
                              )
                            })
                          }
                        </span>
                      </div>
                  }

                </div>
                <WhiteSpace size="xs" />
                {/* <ImgDisplay /> */}
              </Card.Body>
              <Card.Footer content={this.props.title ? this.showSchool(this.props.school_id) : ''} extra={this.props.title ? this.showBadge(this.state.status) : ''} />
            </Card>
          </div>

        </WingBlank>

      </div>
    );
  }
}
