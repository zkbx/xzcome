import React from "react";
import ReactDOM from "react-dom";
import { ListView, WhiteSpace, Modal } from "antd-mobile";
import urlEncode from "../../../utlis/urlEncode";
import getDateDiff from "../../../utlis/getDateDiff";
import instance from "../../../utlis/api";
import InfoCard from "../../../component/InfoCard";
import Gallery from "../../../component/Gallery";
import {showQQ} from "../../../utlis/utlis"

const anonymous = {
  nickname: "匿名",
  avatar:
    "https://cdn.iconscout.com/icon/premium/png-256-thumb/anonymous-17-623658.png"
};
//

function MyBody(props) {
  return (
    <div
      className="am-list-body my-body"
    //       style="overflow-x: hidden;overflow-y: scroll;
    // "
    >
      {/* <span style={{ display: "none" }}>you can custom body wrap element</span> */}
      {props.children}
      <WhiteSpace size="lg" />
    </div>
  );
}

let data = {
  created_at: 1543543484657,
  id: 2216,
  user: {
    id: 1813,
    nickname: "兔兔不太居",
    avatar: "http://qzapp.qlogo.cn/qzapp/101507500/247AC4D5A59D187E40071CC26CDCDE63/100",
    school_id: "0010"
  },
  kind: "310000",
  school_id: "0010",
  status: 1,
  info: {
    amount: "400",
    contact: "1404914638",
    contact_kind: "0010",
    descipt: "400出一辆永久山地车，全新，买完以后不想要了", school_id: "0010",
    id: 1813,
    imgs: [{ height: 400, src: "5668096.png", width: 300 }]
  }
}

export default class WeHelpList extends React.Component {
  constructor(props) {
    super(props);
    // console.info(props);

    const getRowData = (dataBlob, sectionID, rowID) => {
      // console.info(dataBlob, sectionID, rowID);
      return dataBlob[sectionID][rowID];
    };


    //下拉懒加载数据赋值
    const dataSource = new ListView.DataSource({
      getRowData,
      // getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });

    this.state = {
      dataSource,
      isLoading: true,
      // height: (document.documentElement.clientHeight * 3) / 4,
      school_id: this.props.school_id,
      pageIndex: 0,
      modal: false,
      myData: {},
      myRowIDs: [],
      sectionIDs: []
    };
  }

  getData = (query, filter, pIndex = 0, callback) => {
    const remoteURL = "/query/infoboard?" + urlEncode(filter);
    instance.post(remoteURL, query).then(response => {
      if (response.data.code == 0) {

        let setData = this.state.myData
        setData[pIndex] = response.data.data;
        this.setState({ myData: setData });

        let setSectionIDs = this.state.sectionIDs;
        setSectionIDs.push(pIndex);
        this.setState({ sectionIDs: setSectionIDs })
        let f = length => [...Array.from({ length }).keys()];

        let setMyRowIDs = this.state.myRowIDs
        setMyRowIDs.push(f(this.state.myData[pIndex].length));
        this.setState({ myRowIDs: setMyRowIDs })

        if (typeof callback === "function") {
          callback();
        }

      }
    });
  };

  componentDidMount() {

    // you can scroll to the specified position
    // setTimeout(() => this.lv.scrollTo(0, 120), 800);
    const hei =
      document.documentElement.clientHeight -
      ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
    //   genData();
    const query = {
      school_id: this.state.school_id,
      status: 1,
      kind: this.props.kind
    };
    const filter = {
      page: this.state.pageIndex,
      per_page: 7
    };
    let setPageIndex = this.state.pageIndex
    this.getData(query, filter, setPageIndex++, () => {
      // console.info(myRowIDs);
      // console.info(myData);
      // console.info(sectionIDs);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(
          this.state.myData,
          this.state.sectionIDs,
          this.state.myRowIDs,

        ),
        pageIndex: setPageIndex,
        isLoading: false,
        // height: hei - 93.5
      });
    });
    if (this.props.selectID) {
      const remoteURL = "/infoboard/" + this.props.selectID;

      instance.get(remoteURL).then(response => {
        this.setState({
          modal: true
        }, () => console.log('lalal', this.state.modal))
        var title = "";
        var msg = "";
        console.log('lolol', response.data)
        // if (response.data.code === 0) {
        //   if (response.data.data.info.anonymous) {
        //     title = "提示";
        //     msg = "他/她很害羞，没有公开联系方式";
        //   } else {
        //     switch (response.data.data.status) {
        //       case 0:
        //         title = "提示";
        //         msg = "正在审核，请稍候";
        //         break;
        //       case 1:
        //         switch (response.data.data.info.contact_kind) {
        //           case "0010":
        //             title = "请联系QQ";
        //             break;
        //           case "0020":
        //             title = "请联系微信";
        //             break;
        //           case "0030":
        //             title = "请联系电话";
        //             break;
        //           default:
        //             break;
        //         }
        //         msg = response.data.data.info.contact;
        //         break;
        //       default:
        //         title = "提示";
        //         //提示信息不同
        //         msg = "表白信息不存在，或已删除";
        //         break;
        //     }
        //   }
        // } else {
        //   title = "提示";
        //   msg = "任务不存在，或已删除";
        // }
        // alert(1)

      });
    }
  }

  onEndReached = event => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    // console.log("reach end", event);
    this.setState({ isLoading: true }, () => {
      // console.info("hell22");
      //   genData();
      const query = {
        school_id: this.state.school_id,
        status: 1,
        kind: this.props.kind
      };
      const filter = {
        page: this.state.pageIndex,
        per_page: 5
      };
      let setPageIndex = this.state.pageIndex
      this.getData(query, filter, ++setPageIndex, () => {
        // console.info(myRowIDs);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(
            this.state.myData,
            this.state.sectionIDs,
            this.state.myRowIDs
          ),
          pageIndex: setPageIndex,
          isLoading: false
        });
      });
    });
    // setTimeout(, 1000);s
  };

  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }

  render() {
    const row = (rowData, sectionID, rowID) => {
      if (rowData) {
        console.info(rowData, rowID);
        return (
          <InfoCard
            nickname={
              rowData.info.anonymous ? anonymous.nickname : rowData.user.nickname
            }
            time={getDateDiff(rowData.created_at)}
            buttonText={"联系"}
            avatar={
              rowData.info.anonymous ? anonymous.avatar : rowData.user.avatar
            }
            description={rowData.info.descipt}
            amount={rowData.info.amount}
            contackKind={rowData.info.contact_kind}
            contact={rowData.info.contact}
            //传递的props不同，前两个有联系方式
            askfor={rowData.info.askfor}
            photos={rowData.info.imgs}
          />
        );
      }
    };

    return (
      <div style={{
        height: "100%",
        overflow: "auto"
      }}>
        <ListView
          ref={el => (this.lv = el)}
          dataSource={this.state.dataSource}
          // renderHeader={() => <span>header</span>}
          renderFooter={() => (
            <div style={{ padding: 30, textAlign: "center" }}>
              {this.state.isLoading ? "正在加载..." : "没有更多了~"}
            </div>
          )}
          // renderSectionHeader={sectionData => (
          //   <div>{`Task ${sectionData.split(" ")[1]}`}</div>
          // )}
          renderBodyComponent={() => <MyBody />}
          renderRow={row}
          // renderSeparator={separator}
          style={{
            height: "100%",
            overflow: "auto"
          }}
          pageSize={4}
          onScroll={() => {
            console.log("scroll");
          }}
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={100}
        />
        <Modal
          visible={this.state.modal}
          transparent
          maskClosable={true}
          onClose={this.onClose('modal')}
          title="详情"
          footer={[
            {
              text: '联系',
              onPress:
                () => {
                  var title = "";
                  switch (data.info.contact_kind) {
                    case "0010":
                      title = "请联系QQ";
                      showQQ(data.info.contact);
                      this.onClose('modal')();
                      return;
                    case "0020":
                      title = "请联系微信";
                      this.onClose('modal')();
                      break;
                    case "0030":
                      title = "请联系电话";
                      this.onClose('modal')();
                      break;
                    default:
                      this.onClose('modal')();
                      break;
                  }
                  Modal.alert(title, data.info.contact, [
                    {
                      text: "Ok"
                    }
                  ]);

                }

            }]}

        >
          <div >
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 2px' }}>
              <div style={{ display: 'flex' }}>
                <img src={data.user.avatar} alt="" style={{ display: 'inline-block', width: '32px', height: '32px' }} />
                <span style={{ lineHeight: 1, textAlign: 'left', marginLeft: '3px' }}>
                  {data.user.nickname}<br />{getDateDiff(data.created_at)}
                </span>
              </div>
              <span style={{ fontSize: '24px', fontWeight: 'bold', lineHeight: '32px' }}>
                ￥{data.info.amount}
              </span>
            </div>
            {data.info.imgs.length ?
              <div style={{ display: 'block', width: '100%', marginTop: '5px' }}>
                <Gallery photos={data.info.imgs} />
              </div>
              : ''
            }
            <p style={{ textAlign: 'left' }}>
              {data.info.descipt}
            </p>
          </div>
        </Modal>
      </div>

    );
  }
}
