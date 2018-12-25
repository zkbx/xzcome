import React from "react";
import { WingBlank, Card, WhiteSpace, Button, Modal, Badge, InputItem } from "antd-mobile";
import instance from "../utlis/api";
import Gallery from "./Gallery";
import { showQQ, toLogin } from "../utlis/utlis";
import { schoolMap } from "../Data"

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

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
      newshowhidden: 1,
      newData: this.props.messageList ? this.props.messageList : [],
      showContact: false,
      height: this.props.adv ? '32px' : 'auto',
      modal1: false,
      toLink: true
    };
  }

  showModal = key => (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    console.log(22)
    this.setState({
      [key]: true,
    });
  }
  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }

  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  }

  flesh() {
    instance
      .post('/message/query',
        {
          infoboard_id: this.props.id,
          school_id: this.props.school_id,
        }
      )
      .then(response => {
        if (response.data.code == 0) {
          this.setState({
            messageList: response.data.data.reverse()
          }, () => {
            let newData = []
            // let len = this.state.messageList.length > 3 ? 3 : this.state.messageList.length
            for (let i = 0; i < this.state.messageList.length; i++) {
              newData.push(this.state.messageList[i])
            }
            this.setState({
              newData: newData.reverse()
            })
          })
        }

      })
  }
  componentWillMount() {
    // instance
    //   .post('/message/query',
    //     {
    //       infoboard_id: this.props.id,
    //       school_id: this.props.school_id,
    //     }
    //   )
    //   .then(response => {
    //     this.setState({
    //       messageList: response.data.data.reverse()
    //     }, () => {
    //       let newData = []
    //       // let len = this.state.messageList.length > 3 ? 3 : this.state.messageList.length
    //       for (let i = 0; i < this.state.messageList.length; i++) {
    //         newData.push(this.state.messageList[i])
    //       }
    //       this.setState({
    //         newData: newData.reverse()
    //       })
    //     })
    //   })
  }

  showExtra(e) {
    let that = this
    console.log(this.props.comments)
    if (this.props.title) {
      if (this.props.review) {
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
                        if (response.data.code == 0) {
                          this.setState({
                            status: 1,
                            review: false,
                            // showhidden: 1
                          });
                        } else {
                          Modal.alert(
                            "提示",
                            "网络出了点小差，请稍后重新请求页面..."
                          );
                        }

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

      } else if (this.props.comments) {
        console.log(12131)
        return (
          <Button
            size="small"
            inline
            // maskClosable="true"
            onClick={(event) => {
              event.stopPropagation();
              Modal.alert("提示", <div>是否确定删除</div>, [
                {
                  text: "取消",
                  onPress: () => {
                    
                    }
                },
                {
                  text: "通过",
                  onPress: () => {
                    // console.log("第0个按钮被点击了");

                    const remoteURL =
                      `/message/deleted`;
                    instance.post(remoteURL,{infoboard_id:this.props.id,}).then(response => {
                      if (response.data.code == 0) {
                        this.setState({
                          complete: false,
                          showhidden:3
                        });
                      } else {
                        Modal.alert(
                          "提示",
                          "网络出了点小差，请稍后重新请求页面..."
                        );
                      }

                    });
                  }
                }
              ])

            }
            }
          >
            删除
          </Button>
        )
      } else if (this.state.status == 1) {

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
                      instance.post(remoteURL, data, {
                        headers: {
                          Authorization: "Bearer " + window.localStorage.getItem('token')
                        }
                      }).then(response => {
                        if (response.data.code == 0) {
                          this.setState({
                            status: 2
                          });
                        } else {
                          Modal.alert(
                            "提示",
                            "网络出了点小差，请稍后重新请求页面..."
                          );
                        }

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

    } else {
      // console.log(this.props.id)
      if (this.props.adv) {
        if (this.state.role !== 0 && this.state.role) {
          return (
            <div>
              <Button
                size="small"
                inline
                onClick={(event) => {
                  event.stopPropagation();
                  instance.delete(`/stick/${this.props.id}`, {
                    headers: {
                      Authorization: "Bearer " + window.localStorage.getItem('token')
                    }
                  }).then(response => {
                    if (response.data.code == 0) {
                      this.setState({
                        newshowhidden: 3,
                        toLink: false
                      })
                    } else {
                      Modal.alert(
                        "提示",
                        "网络出了点小差，请稍后重新请求页面..."
                      );
                    }

                  })
                }}
              >
                下架
            </Button>
            </div>
          )
        } else {
          return (
            <div>
              <Button
                size="small"
                inline
                onClick={(event) => {
                  event.stopPropagation();
                  this.setState({
                    modal1: true,
                  });
                }}
              >
                广告
            </Button>
            </div>
          )
        }


      } else if (this.state.role !== 0 && this.state.role) {
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
                      if (response.data.code == 0) {
                        this.setState({
                          status: 4,
                          review: false,
                          showhidden: 3
                        });
                      } else {
                        Modal.alert(
                          "提示",
                          "网络出了点小差，请稍后重新请求页面..."
                        );
                      }

                    });
                }
              }
            ]);
          }
          }
        >
          隐藏
            </Button>)

      } else if (this.state.user_id == this.props.user_id) {
        if (this.props.ispush) {
          return (
            <div>
              <Button
                size="small"
                inline
                onClick={(event) => {
                  event.stopPropagation();
                  Modal.alert("提示", "是否取消留言推送？", [
                    {
                      text: "否"
                    },
                    {
                      text: "是",
                      onPress: () => {
                        // console.log("第0个按钮被点击了");
                        const data = {
                          infoboard_id: this.props.id,
                          school_id: this.props.school_id,
                          user_id: JSON.parse(window.localStorage["userinfo"]).id
                        };
                        const remoteURL =
                          "/self/infoboard/" + this.props.id + "/update";
                        instance.post('/ispush/delete', data, {
                          headers: {
                            Authorization: "Bearer " + window.localStorage.getItem('token')
                          }
                        }).then(response => {
                          if (response.data.code) {
                            this.setState({
                              newshowhidden: 3
                            });
                          } else {
                            Modal.alert(
                              "提示",
                              "网络出了点小差，请稍后重新请求页面..."
                            );
                          }

                        });
                      }
                    }
                  ]);
                }}
              >
                取消推送
        </Button>
            </div>
          )

        }
        else {
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
                          if (response.data.code == 0) {
                            this.setState({
                              status: 2,
                              showhidden: 3,
                              complete: true
                            });
                          } else {
                            Modal.alert(
                              "提示",
                              "网络出了点小差，请稍后重新请求页面..."
                            );
                          }

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

      } else {
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
            infoboard_id: this.props.id,
            school_id: this.props.school_id,
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
            this.setState({
              showContact: false,
              flesh: true,
              content: ''
            })
            this.flesh()
          } else {
            Modal.alert(
              "提示",
              "网络出了点小差，请稍后重新请求页面..."
            );
          }

        })
    }
  }

  render() {
    return (
      <div onClick={() => {

        if (this.props.adv) {
          if (this.state.toLink) {
            window.open(this.props.link);
          }

        }
      }}>
        <WingBlank size="lg" >
          <WhiteSpace size="lg" />
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: '5px', position: 'absolute', width: '100%', height: '100%', top: '0', left: '0', backgroundColor: 'rgba(0,0,0,0.2)', zIndex: `${this.state.showhidden}` }}>
              <span style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: '-85px', marginTop: '-40px', fontSize: '30px', fontWeight: 'bold', display: 'block', lineHeight: '2.5em', width: '150px', border: '3px solid #000', borderRadius: '10px', textAlign: 'center', transform: 'rotate(14deg)' }}>
                {this.state.complete ? '已完成' : '已失效'}
              </span>
            </div>
            <div style={{ borderRadius: '5px', position: 'absolute', width: '100%', height: '100%', top: '0', left: '0', backgroundColor: 'rgba(0,0,0,0.2)', zIndex: `${this.state.newshowhidden}` }}>
              <span style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: '-85px', marginTop: '-40px', fontSize: '30px', fontWeight: 'bold', display: 'block', lineHeight: '2.5em', width: '150px', border: '3px solid #000', borderRadius: '10px', textAlign: 'center', transform: 'rotate(14deg)' }}>
                已取消
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
                      {this.props.adv ? <div style={{
                        width: "32px",
                        height: "32px",
                      }}><Gallery photos={this.props.avatar} width={32} /></div> : <img
                          alt=""
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "16px"
                          }}
                          src={this.props.avatar}
                        />}

                    </div>
                    <div style={{ flexDirection: "column", display: "flex", justifyContent: 'center', height: `${this.state.height}` }}>
                      <span style={{ fontSize: "0.9em" }}>
                        {this.props.nickname}
                      </span>
                      <span style={{ color: "grey", fontSize: "0.5em", marginTop: 4 }}>
                        {this.props.adv ? '' : this.props.time}
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
                    {this.props.adv ? '' : <span
                      style={{
                        fontSize: "1.8em",
                        fontWeight: "bold",
                        float: "right",
                        color: "#1DA57A"
                      }}
                    >
                      {"￥" + this.props.amount}
                    </span>
                    }

                  </div>
                  <div style={{ clear: "both" }}>

                  </div>
                  {this.props.adv||this.props.comments?  '' :
                    <span style={{ display: 'block', height: '16px', marginTop: '10px' }}>
                      <img onClick={(event) => {
                        event.stopPropagation();
                        this.setState({
                          showContact: true
                        })
                      }} style={{ height: '16px', float: 'right' }} src={require('../source/comment.png')} alt="" />
                    </span>
                  }
                  {
                    (!this.props.message) || (this.state.newData.length == 0)
                      ? ''
                      : <div style={{ marginTop: '6px', width: '100%' }}>
                        <div style={{
                          width: 0, height: 0,
                          borderWidth: '0 8px 8px',
                          borderStyle: 'solid',
                          borderColor: 'transparent transparent #EEE',
                          marginLeft: '10px',
                          position: 'relative'
                        }}></div>

                        <span style={{ display: 'block', width: '100%', height: 'auto', backgroundColor: '#eee', padding: '4px 0', paddingLeft: '8px' }}>
                          {
                            this.state.newData.map(v => {
                              return (
                                <div style={{ fontSize: '0.8em', lineHeight: '1.5', wordWrap: 'break-word', wordBreak: 'break-all', overflow: 'hidden' }}>
                                  <span style={{ color: '#59647E' }
                                  } >
                                    {v.user_info ? v.user_info.nickname : v.user.nickname}
                                  </span>：
                                  <span>
                                    {v.content}
                                  </span>
                                </div>
                              )
                            })
                          }
                        </span>
                      </div>
                  }

                </div>
                {/* <ImgDisplay /> */}
              </Card.Body>
              {this.props.comments?<Card.Footer content={<div onClick={ ()=> window.location = `#/order/${this.props.id}`} style={{textAlign:'center'}}>查看留言</div>}  />:<Card.Footer content={this.props.title || this.props.ispush ? this.showSchool(this.props.school_id) : ''} extra={this.props.title ? this.showBadge(this.state.status) : ''} />}
              
            </Card>
          </div>

        </WingBlank>

        {
          this.state.showContact ? <div onClick={(event) => {
            event.stopPropagation();
          }} style={{ position: 'fixed', bottom: '0', width: '100%', zIndex: 5 }}>
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

        <Modal
          visible={this.state.modal1}
          transparent
          maskClosable={true}
          onClose={this.onClose('modal1')}
          footer={[{ text: '确定', onPress: () => { this.onClose('modal1')(); } }]}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
          <div style={{ height: 'auto', textAlign: 'center', paddingTop: '10px' }}>
            请联系下方客服具体详谈
           <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
              <div>
                <img
                  src={require('../source/QQqcode.png')}
                  style={{ display: 'block', width: '85px', height: '85px' }}
                  alt="" />
                <span style={{ display: 'block', textAlign: 'center' }}>
                  QQ
                </span>
              </div>
              <div>
                <img
                  src={require('../source/weixinqcode.png')}
                  style={{ display: 'block', width: '85px', height: '85px' }}
                  alt="" />
                <span style={{ display: 'block', textAlign: 'center' }}>
                  微信
                </span>
              </div>

            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
