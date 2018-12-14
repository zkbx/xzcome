import React from "react";
import ReactDOM from "react-dom";
import { ListView, WhiteSpace, Modal } from "antd-mobile";
import urlEncode from "../../../utlis/urlEncode";
import getDateDiff from "../../../utlis/getDateDiff";
import instance from "../../../utlis/api";
import InfoCard from "../../../component/InfoCard";
import Gallery from "../../../component/Gallery";
import { showQQ } from "../../../utlis/utlis"
import MyBar from "../../../component/MyBar";

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


export default class ComtentList extends React.Component {
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

    var school_id = null;
    var user_id = null;

    if ("userinfo" in window.localStorage) {
      const userinfo = JSON.parse(window.localStorage["userinfo"]);
      // console.info(userinfo);
      school_id = userinfo["school_id"];
      user_id = userinfo["id"];
      if (!userinfo["qq"]) {
      }
    }

    this.state = {
      dataSource,
      isLoading: true,
      // height: (document.documentElement.clientHeight * 3) / 4,
      school_id: school_id ? school_id : this.props.school_id,
      user_id: user_id,
      pageIndex: 0,
      modal: false,
      myData: {},
      myRowIDs: [],
      sectionIDs: [],
      selectID: this.props.match ? this.props.match.params.id : ''
    };
  }

  getData1 = (filter, pIndex = 0, callback) => {
    const remoteURL = this.props.review ? "/self/reviewinfo?" + urlEncode(filter) : "/self/infoboard?" + urlEncode(filter)
    instance.get(remoteURL, {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem('token')
      }
    }).then(response => {
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
    });
  }

  getData = (query, filter, pIndex = 0, callback) => {
    // console.log(filter)
    const remoteURL = `/query/infoboard?` + urlEncode(filter);

    // console.log(remoteURL)

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

  componentWillMount() {

    // you can scroll to the specified position
    // setTimeout(() => this.lv.scrollTo(0, 120), 800);

    //   genData();
    // alert(2)

    let filter = {
      page: this.state.pageIndex,
      per_page: 5
    };
    let setPageIndex = this.state.pageIndex

    if (!this.props.title) {
      const query = {
        school_id: this.state.school_id,
        status: 1,
        kind: this.props.kind
      };
      // console.log(filter)

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
    } else {
      const query = {
        school_id: this.state.school_id,
        status: 1,
      };
      console.log(filter)
      this.getData1(filter, setPageIndex++, () => {
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
        page: this.state.pageIndex,
        per_page: 5
      };
      let setPageIndex = this.state.pageIndex
      if (!this.props.title) {
        const query = {
          school_id: this.state.school_id,
          status: 1,
          kind: this.props.kind
        };
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
      } else {
        this.getData1(filter, ++setPageIndex, () => {
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
      }
    }, 1000);
  };



  render() {
    const row = (rowData, sectionID, rowID) => {
      if (rowData) {
        console.info(rowData);
        return (
          <InfoCard
            nickname={
              rowData.user.nickname
            }
            time={getDateDiff(rowData.created_at)}
            buttonText={"联系"}
            avatar={
              rowData.user.avatar
            }
            description={rowData.info.descipt}
            amount={rowData.info.amount}
            contackKind={rowData.info.contact_kind}
            contact={rowData.info.contact}
            askfor={rowData.info.askfor}
            photos={rowData.info.imgs}
            kind={rowData.kind}
            status={rowData.status}
            id={rowData.id}
            title={this.props.title}
            review={this.props.review}
            school_id={rowData.school_id}
            user_id={rowData.user.id}
            message={this.props.message}
          />
        );
      }
    };

    return (
      <div style={{
        height: "100%",
        overflow: "auto",
        display: 'flex',
        flexDirection: 'column',
      }}>
        {this.props.title ? <MyBar title={this.props.title} /> : ''}
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
            overflow: "auto",
            flexGrow: 1,
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
