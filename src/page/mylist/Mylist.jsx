import React from "react";
import ReactDOM from "react-dom";
import { ListView, WhiteSpace, Modal } from "antd-mobile";
import urlEncode from "../../utlis/urlEncode";
import getDateDiff from "../../utlis/getDateDiff";
import instance from "../../utlis/api";
import InfoCard from "../../component/MylistCard";
import MyBar from "../../component/MyBar";

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

let pageIndex = 0;

const myData = {};
let myRowIDs = [];
let sectionIDs = [];
const getData = (filter, pIndex = 0, callback) => {
  const remoteURL = "/self/infoboard?" + urlEncode(filter);
  instance.get(remoteURL).then(response => {
    myData[pIndex] = response.data.data;
    sectionIDs.push(pIndex);
    let f = length => [...Array.from({ length }).keys()];
    myRowIDs.push(f(myData[pIndex].length));
    if (typeof callback === "function") {
      callback();
    }
  });
};

export default class Mylist extends React.Component {
  constructor(props) {
    super(props);
    console.info(props);
    const getRowData = (dataBlob, sectionID, rowID) => {
      console.info(dataBlob, sectionID, rowID);
      return dataBlob[sectionID][rowID];
    };

    const dataSource = new ListView.DataSource({
      getRowData,
      //   getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });
    var school_id = null;
    var user_id = null;
    if ("userinfo" in window.localStorage) {
      const userinfo = JSON.parse(window.localStorage["userinfo"]);
      console.info(userinfo);
      school_id = userinfo["school_id"];
      user_id = userinfo["id"];
      if (!userinfo["qq"]) {
      }
    }

    this.state = {
      dataSource,
      isLoading: true,
      height: (document.documentElement.clientHeight * 3) / 4,
      school_id: school_id,
      user_id: user_id,
      selectID: this.props.match.params.id
    };
  }

  componentDidMount() {
    // you can scroll to the specified position
    // setTimeout(() => this.lv.scrollTo(0, 120), 800);
    const hei =
      document.documentElement.clientHeight -
      ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
    //   genData();
    const query = {
      // school_id: this.state.school_id
      // status: 1,
      // kind: "310000"
    };
    const filter = {
      page: pageIndex,
      per_page: 7
    };
    getData(filter, pageIndex++, () => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(
          myData,
          sectionIDs,
          myRowIDs
        ),
        isLoading: false,
        height: hei - 50
      });
    });
    if (this.state.selectID) {
      const remoteURL = "/infoboard/" + this.state.selectID;
      instance.get(remoteURL).then(response => {
        var title = "";
        var msg = "";
        if (response.data.code === 0) {
          switch (response.data.data.status) {
            case 0:
              title = "提示";
              msg = "正在审核，请稍候";
              break;
            case 1:
              title = "提示";
              msg = "已发布";
              break;
            case 2:
              title = "提示";
              msg = "已完成";
              break;

            default:
              title = "提示";
              msg = "任务不存在，或已删除";
              break;
          }
        } else {
          title = "提示";
          msg = "任务不存在，或已删除";
        }
        Modal.alert(title, msg, [
          {
            text: "Ok"
          }
        ]);
      });
    }
  }

  onEndReached = event => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    console.log("reach end", event);
    this.setState({ isLoading: true });
    setTimeout(() => {
      console.info("hell22");
      //   genData();
      const filter = {
        page: pageIndex,
        per_page: 5
      };
      getData(filter, ++pageIndex, () => {
        console.info(myRowIDs);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(
            myData,
            sectionIDs,
            myRowIDs
          ),
          isLoading: false
        });
      });
    }, 1000);
  };

  render() {
    const row = (rowData, sectionID, rowID) => {
      console.info(rowData, rowID);
      if (rowData) {
        return (
          <InfoCard
            nickname={rowData.user.nickname}
            time={getDateDiff(rowData.created_at)}
            buttonText={"联系"}
            avatar={rowData.user.avatar}
            description={rowData.info.descipt}
            amount={rowData.info.amount}
            kind={rowData.kind}
            askfor={rowData.info.askfor}
            status={rowData.status}
            id={rowData.id}
            photos={rowData.info.imgs}
          />
        );
      }
    };

    return (
      <div>
        <MyBar title="我的发布" />
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
            height: this.state.height,
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
      </div>
    );
  }
}
