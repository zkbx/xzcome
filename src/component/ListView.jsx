import React from "react";
import ReactDOM from "react-dom";
import { ListView, WingBlank, Card, WhiteSpace, Button } from "antd-mobile";
import instance from "../utlis/api";
import InfoCard from "./InfoCard";
import urlEncode from "../utlis/urlEncode";
import getDateDiff from "../utlis/getDateDiff";

function MyBody(props) {
  return (
    <div
      className="am-list-body my-body"
      //       style="overflow-x: hidden;overflow-y: scroll;
      // "
    >
      {/* <span style={{ display: "none" }}>you can custom body wrap element</span> */}
      {props.children}
    </div>
  );
}

const data = [
  {
    nickname: "细雨湿流光",
    time: "两分钟前",
    buttonText: "联系",
    avatar: "https://team.weui.io/avatar/bear.jpg",
    description: "本周五晚租一个老校区女生床位，请救救孩子吧"
  },
  {
    nickname: "细雨湿流光",
    time: "两分钟前",
    buttonText: "联系",
    avatar: "https://team.weui.io/avatar/bear.jpg",

    description: "本周五晚租一个老校区女生床位，请救救孩子吧"
  },
  {
    nickname: "细雨湿流光",
    time: "两分钟前",
    buttonText: "联系",
    avatar: "https://team.weui.io/avatar/bear.jpg",
    description: "本周五晚租一个老校区女生床位，请救救孩子吧"
  }
];
let pageIndex = 0;

const myData = {};
let myRowIDs = [];
let sectionIDs = [];
const getData = (query, filter, pIndex = 0, callback) => {
  const remoteURL = "/query/infoboard?" + urlEncode(filter);
  instance.post(remoteURL, query).then(response => {
    myData[pIndex] = response.data.data;
    sectionIDs.push(pIndex);
    let f = length => [...Array.from({ length }).keys()];
    myRowIDs.push(f(myData[pIndex].length));
    if (typeof callback === "function") {
      callback();
    }
  });
};

export default class Demo extends React.Component {
  constructor(props) {
    super(props);
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

    this.state = {
      dataSource,
      isLoading: true,
      height: (document.documentElement.clientHeight * 3) / 4
    };
  }

  componentDidMount() {
    // you can scroll to the specified position
    // setTimeout(() => this.lv.scrollTo(0, 120), 800);
    const hei =
      document.documentElement.clientHeight -
      ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
    console.info(this.state.kind);
    //   genData();
    const query = {
      user_id: 35,
      school_id: 1,
      status: 1,
      kind: this.props.kind
    };
    const filter = {
      page: pageIndex,
      per_page: 7
    };
    getData(query, filter, pageIndex++, () => {
      console.info(myRowIDs.length);
      console.info(myData);
      console.info(sectionIDs.length);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(
          myData,
          sectionIDs,
          myRowIDs
        ),
        isLoading: false,
        height: hei
      });
    });
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
      const query = {
        user_id: 35,
        school_id: 1,
        status: 1,
        kind: this.props.kind
      };
      const filter = {
        page: pageIndex,
        per_page: 5
      };
      getData(query, filter, ++pageIndex, () => {
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
    let index = data.length - 1;
    const row = (rowData, sectionID, rowID) => {
      console.info(rowData, rowID);
      return (
        <InfoCard
          nickname={rowData.user.nickname}
          time={getDateDiff(rowData.created_at)}
          buttonText={"联系"}
          avatar={rowData.user.avatar}
          description={rowData.info.descipt}
        />
      );
    };

    return (
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
        onEndReachedThreshold={10}
      />
    );
  }
}
