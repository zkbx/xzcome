import React from "react";
import ReactDOM from "react-dom";
import { ListView, WhiteSpace, Modal } from "antd-mobile";
import urlEncode from "../../../utlis/urlEncode";
import getDateDiff from "../../../utlis/getDateDiff";
import instance from "../../../utlis/api";
import InfoCard from "../../../component/InfoCard";
// import React from "react";
// import ReactDOM from "react-dom";
// import { ListView, WhiteSpace, Modal } from "antd-mobile";
// import instance from "../../../utlis/api";
// import urlEncode from "../../../utlis/urlEncode";
// import getDateDiff from "../../../utlis/getDateDiff";
// import InfoCard from "../../../component/InfoCard";

// //不同，表白设定头像，姓名
// const anonymous = {
//   nickname: "匿名",
//   avatar:
//     "https://cdn.iconscout.com/icon/premium/png-256-thumb/anonymous-17-623658.png"
// };
// //
// function MyBody(props) {
//   return (
//     <div
//       className="am-list-body my-body"
//       //       style="overflow-x: hidden;overflow-y: scroll;
//       // "
//     >
//       {/* <span style={{ display: "none" }}>you can custom body wrap element</span> */}
//       {props.children}
//       <WhiteSpace size="lg" />
//     </div>
//   );
// }

// let pageIndex = 0;

// const myData = {};
// let myRowIDs = [];
// let sectionIDs = [];
// const getData = (query, filter, pIndex = 0, callback) => {
//   const remoteURL = "/query/infoboard?" + urlEncode(filter);
//   instance.post(remoteURL, query).then(response => {
//     if (response.data.code == 0) {
//       myData[pIndex] = response.data.data;
//       sectionIDs.push(pIndex);
//       let f = length => [...Array.from({ length }).keys()];
//       myRowIDs.push(f(myData[pIndex].length));
//       if (typeof callback === "function") {
//         callback();
//       }
//     }
//   });
// };

// export default class AskLove extends React.Component {
//   constructor(props) {
//     super(props);
//     const getRowData = (dataBlob, sectionID, rowID) => {
//       console.info(dataBlob, sectionID, rowID);
//       return dataBlob[sectionID][rowID];
//     };

//     const dataSource = new ListView.DataSource({
//       getRowData,
//       //   getSectionHeaderData: getSectionData,
//       rowHasChanged: (row1, row2) => row1 !== row2,
//       sectionHeaderHasChanged: (s1, s2) => s1 !== s2
//     });

//     this.state = {
//       dataSource,
//       isLoading: true,
//       // height: (document.documentElement.clientHeight * 3) / 4,
//       school_id: this.props.school_id,
//       kind: this.props.kind
//     };
//   }

//   componentDidMount() {
//     // you can scroll to the specified position
//     // setTimeout(() => this.lv.scrollTo(0, 120), 800);
//     const hei =
//       document.documentElement.clientHeight -
//       ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
//     //   genData();

// //传递数值不同
// console.log(this.props.kind)
//     const query = {
//       school_id: this.state.school_id,
//       status: 1,
//       kind: this.state.kind
//     };

//     const filter = {
//       page: pageIndex,
//       per_page: 7
//     };
//     getData(query, filter, pageIndex++, () => {
//       // console.info(myRowIDs.length);
//       // console.info(myData);
//       // console.info(sectionIDs.length);
//       this.setState({
//         dataSource: this.state.dataSource.cloneWithRowsAndSections(
//           myData,
//           sectionIDs,
//           myRowIDs
//         ),
//         isLoading: false,
//         // height: hei - 93.5
//       });
//     });
//     if (this.props.selectID) {
//       const remoteURL = "/infoboard/" + this.props.selectID;
//       instance.get(remoteURL).then(response => {
//         var title = "";
//         var msg = "";
//         if (response.data.code === 0) {
//           if (response.data.data.info.anonymous) {
//             title = "提示";
//             msg = "他/她很害羞，没有公开联系方式";
//           } else {
//             switch (response.data.data.status) {
//               case 0:
//                 title = "提示";
//                 msg = "正在审核，请稍候";
//                 break;
//               case 1:
//                 switch (response.data.data.info.contact_kind) {
//                   case "0010":
//                     title = "请联系QQ";
//                     break;
//                   case "0020":
//                     title = "请联系微信";
//                     break;
//                   case "0030":
//                     title = "请联系电话";
//                     break;
//                   default:
//                     break;
//                 }
//                 msg = response.data.data.info.contact;
//                 break;
//               default:
//                 title = "提示";
//                 //提示信息不同
//                 msg = "表白信息不存在，或已删除";
//                 break;
//             }
//           }
//         } else {
//           title = "提示";
//           //提示信息不同
//           msg = "表白信息不存在，或已删除";
//         }
//         Modal.alert(title, msg, [
//           {
//             text: "Ok"
//           }
//         ]);
//       });
//     }
//   }

//   onEndReached = event => {
//     // load new data
//     // hasMore: from backend data, indicates whether it is the last page, here is false
//     if (this.state.isLoading && !this.state.hasMore) {
//       return;
//     }
//     console.log("reach end", event);
//     this.setState({ isLoading: true },() => {
//       // console.info("hell22");
//       //   genData();

//       console.log(this.props.kind)
//       const query = {
//         school_id: this.state.school_id,
//         status: 1,
//         //发送参数不同
//         kind:  this.props.kind
//       };
//       const filter = {
//         page: pageIndex,
//         per_page: 5
//       };
//       getData(query, filter, ++pageIndex, () => {
//         console.info(myRowIDs);
//         this.setState({
//           dataSource: this.state.dataSource.cloneWithRowsAndSections(
//             myData,
//             sectionIDs,
//             myRowIDs
//           ),
//           isLoading: false
//         });
//       });
//     });

//   };

//   render() {
//     const row = (rowData, sectionID, rowID) => {
//       console.info(rowData, rowID);
//       return (
//         <InfoCard
//           nickname={
//             rowData.info.anonymous ? anonymous.nickname : rowData.user.nickname
//           }
//           time={getDateDiff(rowData.created_at)}
//           buttonText={"联系"}
//           avatar={
//             rowData.info.anonymous ? anonymous.avatar : rowData.user.avatar
//           }
//           description={rowData.info.descipt}
//           amount={rowData.info.amount}
//           //传递的props不同，前两个有联系方式
//           askfor={rowData.info.askfor}
//           photos={rowData.info.imgs}
//         />
//       );
//     };

//     return (
//       <ListView
//         ref={el => (this.lv = el)}
//         dataSource={this.state.dataSource}
//         // renderHeader={() => <span>header</span>}
//         renderFooter={() => (
//           <div style={{ padding: 30, textAlign: "center" }}>
//             {this.state.isLoading ? "正在加载..." : "没有更多了~"}
//           </div>
//         )}
//         // renderSectionHeader={sectionData => (
//         //   <div>{`Task ${sectionData.split(" ")[1]}`}</div>
//         // )}
//         renderBodyComponent={() => <MyBody />}
//         renderRow={row}
//         // renderSeparator={separator}
//         style={{
//           height: "100%",
//           overflow: "auto"
//         }}
//         pageSize={4}
//         onScroll={() => {
//           console.log("scroll");
//         }}
//         scrollRenderAheadDistance={500}
//         onEndReached={this.onEndReached}
//         onEndReachedThreshold={10}
//       />
//     );
//   }
// }



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
      school_id: this.props.school_id
    };


    let pageIndex = 0;

    const myData = {};
    let myRowIDs = [];
    let sectionIDs = [];
  }
  

  getData = (query, filter, pIndex = 0, callback) => {
    
    const remoteURL = "/query/infoboard?" + urlEncode(filter);
    instance.post(remoteURL, query).then(response => {
      if (response.data.code == 0) {
        myData[pIndex] = response.data.data;
        sectionIDs.push(pIndex);
        let f = length => [...Array.from({ length }).keys()];
        myRowIDs.push(f(myData[pIndex].length));
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
      page: this.pageIndex,
      per_page: 7
    };
    this.getData(query, filter, pageIndex++, () => {
      // console.info(myRowIDs.length);
      // console.info(myData);
      // console.info(sectionIDs.length);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(
          myData,
          sectionIDs,
          myRowIDs
        ),
        isLoading: false,
        // height: hei - 93.5
      });
    });
    if (this.props.selectID) {
      const remoteURL = "/infoboard/" + this.props.selectID;
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
              switch (response.data.data.info.contact_kind) {
                case "0010":
                  title = "请联系QQ";
                  break;
                case "0020":
                  title = "请联系微信";
                  break;
                case "0030":
                  title = "请联系电话";
                  break;
                default:
                  break;
              }
              msg = response.data.data.info.contact;
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
        page: pageIndex,
        per_page: 5
      };
      this.getData(query, filter, ++pageIndex, () => {
        // console.info(myRowIDs);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(
            myData,
            sectionIDs,
            myRowIDs
          ),
          isLoading: false
        });
      });
    });
    // setTimeout(, 1000);s
  };

  render() {
    const row = (rowData, sectionID, rowID) => {
      if (rowData) {
        console.info(rowData, rowID);
        return (
          <InfoCard
            nickname={rowData.user.nickname}
            time={getDateDiff(rowData.created_at)}
            buttonText={"联系"}
            avatar={rowData.user.avatar}
            description={rowData.info.descipt}
            amount={rowData.info.amount}
            contackKind={rowData.info.contact_kind}
            contact={rowData.info.contact}
            photos={rowData.info.imgs}
          />
        );
      }
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
          height: "100%",
          overflow: "auto"
        }}
        pageSize={4}
        onScroll={() => {
          // console.log("scroll");
        }}
        scrollRenderAheadDistance={500}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={100}
      />
    );
  }
}
