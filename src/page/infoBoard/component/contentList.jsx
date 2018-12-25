import React from "react";
import ReactDOM from "react-dom";
import { ListView, WhiteSpace, Modal } from "antd-mobile";
import urlEncode from "../../../utlis/urlEncode";
import getDateDiff from "../../../utlis/getDateDiff";
import instance from "../../../utlis/api";
import InfoCard from "../../../component/InfoCard";
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
      selectID: this.props.match ? this.props.match.params.id : '',
      number: 0,
    };
  }

  getData1 = (filter, pIndex = 0, callback) => {

    if (this.props.reviewAD) {
      let school_id = []
      school_id[0] = window.localStorage["userinfo"] ? JSON.parse(window.localStorage["userinfo"]).school_id : '0010'
      instance.post('/stick/query', { school_id: school_id }).then(response => {
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
        } else {
          Modal.alert(
            "提示",
            "网络出了点小差，请稍后重新请求页面..."
          );
        }

      })
    } else {

      const remoteURL = this.props.review ? "/self/reviewinfo?" + urlEncode(filter) : "/self/infoboard?" + urlEncode(filter)
      instance.get(remoteURL, {
        headers: {
          Authorization: "Bearer " + window.localStorage.getItem('token')
        }
      }).then(response => {
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
        } else {
          Modal.alert(
            "提示",
            "网络出了点小差，请稍后重新请求页面..."
          );
        }

      });
    }

  }

  //数组去重
  dedupe(array) {
    return Array.from(new Set(array));
  }

  getData = (query, filter, pIndex = 0, callback) => {
    // console.log(filter)

    // console.log(remoteURL)
    if (this.props.ispush) {
      const remoteURL = `/ispush/query?` + urlEncode(filter);

      let userinfo = JSON.parse(window.localStorage["userinfo"])
      instance.post(remoteURL, { user_id: userinfo.id, school_id: userinfo.school_id }).then(response => {
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
    } else if(this.props.comments){
      let school_id
      const userinfo = JSON.parse(window.localStorage["userinfo"]);
      school_id = userinfo.school_id
      let user_id=userinfo.id
      const remoteURL ='/message/my'
      instance.post(remoteURL, { user_id:user_id,school_id: school_id }).then(response => {
        if (response.data.code == 0) {

          let setData = this.state.myData
          setData[pIndex] = response.data.data.reverse();
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
      })
    }else{
      let school_id = []
      school_id[0] = window.localStorage["userinfo"] ? JSON.parse(window.localStorage["userinfo"]).school_id : '0010'
      //请求广告
      instance.post('/stick/query', { school_id: school_id }).then(response => {

        if (response.data.code == 0) {
          //数据处理
          let setData = this.state.myData
          response.data.data.sort(function () { return Math.random() - 0.5; })
          let dataList = []
          if (response.data.data.length > this.state.number) {
            dataList.push(
              response.data.data[this.state.number]
            )
          }
          setData[pIndex] = dataList;
          this.setState({ myData: setData }, () => {
            console.log(this.state.myData)
          });


          let setSectionIDs = this.state.sectionIDs;
          setSectionIDs.push(pIndex);
          this.setState({ sectionIDs: setSectionIDs })

          let f = length => [...Array.from({ length }).keys()];
          let setMyRowIDs = this.state.myRowIDs
          setMyRowIDs.push(f(this.state.myData[pIndex].length));
          this.setState({ myRowIDs: setMyRowIDs },
            // console.log(this.state.myRowIDs)
          )
          // if (this.state.myData[0].length > 11) {

          //请求订单列表
          const remoteURL = `/query/infoboard?` + urlEncode(filter);
          instance.post(remoteURL, query).then(response => {

            // let myData = this.state.myData
            // myData[this.state.number].push()


            //数据处理
            if (response.data.code == 0) {
              //需根据数组具体长度而定，重新遍历数组，或者用本来setMyRowIDs的方法
              // let numList = this.state.myData.length !== 0?[0,1,2,3,4,5,6,7,8,9,10,11]:[1,2,3,4,5,6,7,8,9,10,11,12]

              let myData = this.state.myData
              // console.log('11',myData[pIndex])
              myData[pIndex] = myData[pIndex].concat(response.data.data)
              // console.log('11',myData[pIndex])
              this.setState({
                myData: myData
              }, console.log(this.state.myData))


              
              let f = length => [...Array.from({ length }).keys()];
              let setMyRowIDs = this.state.myRowIDs
              console.log(setMyRowIDs)
              console.log(setMyRowIDs[this.state.number])
              setMyRowIDs[this.state.number] = setMyRowIDs[this.state.number].concat(f(this.state.myData[pIndex].length));
              setMyRowIDs[this.state.number] = this.dedupe(setMyRowIDs[this.state.number])
              console.log(setMyRowIDs[this.state.number])
              this.setState({ myRowIDs: setMyRowIDs },
                console.log(this.state.myRowIDs)
              )

              // this.setState({ myRowIDs: myRowIDs, myData: myData },
              //   console.log('22',this.state.myData,this.state.myRowIDs)
              //   )
              // myData[this.state.number].push(
              //   response.data.data[this.state.number]
              // )
              if (typeof callback === "function") {
                callback();
              }


            }else{
              Modal.alert(
                "提示",
                "网络出了点小差，请稍后重新请求页面..."
              );
            }

          })

          

        }else{
          Modal.alert(
            "提示",
            "网络出了点小差，请稍后重新请求页面..."
          );
        }
      });
    }



  };

  componentWillMount() {


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
          isLoading: false
        });
      });
    } else {
      const query = {
        school_id: this.state.school_id,
        status: 1,
      };
      // console.log(filter)
      this.getData1(filter, setPageIndex++, () => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(
            this.state.myData,
            this.state.sectionIDs,
            this.state.myRowIDs,

          ),
          pageIndex: setPageIndex,
          isLoading: false
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
    // console.log("reach end", event);
    let number = this.state.number
    number++
    this.setState({ isLoading: true, number: number },
      // console.log(this.state.number)
    );
    setTimeout(() => {
      // console.info("hell22");
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
        // let isPush=false
        // this.state.pushList.foreach(v=>{
        //   if(v.infoboard_id==rowData.id){
        //     isPush=true
        //   }
        // })
        // console.log(this.props.ispush)
        // console.log(rowData)
         if (this.props.comments) {
          // console.log(rowData)
          return (
            <InfoCard
              nickname={
                rowData.infoboard.user.nickname
              }
              time={getDateDiff( rowData.infoboard.created_at)}
              buttonText={"联系"}
              avatar={
                rowData.infoboard.user.avatar
              }
              description={ rowData.infoboard.info.descipt}
              amount={ rowData.infoboard.info.amount}
              contackKind={ rowData.infoboard.info.contact_kind}
              contact={ rowData.infoboard.info.contact}
              askfor={ rowData.infoboard.info.askfor}
              photos={ rowData.infoboard.info.imgs}
              kind={ rowData.infoboard.kind}
              status={ rowData.infoboard.status}
              id={ rowData.infoboard.id}
              messageId={rowData.id}
              title={true}
              review={this.props.review}
              school_id={rowData.infoboard.school_id}
              user_id={rowData.infoboard.user.id}
              message={true}
              ispush={this.props.ispush}
              messageList={rowData.messages}
              adv={rowData.link}
              adData={rowData.link ? rowData : ''}
              comments={this.props.comments}
            />
          );

        }else if (!rowData.link) {
          // console.log(rowData)
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
              ispush={this.props.ispush}
              messageList={rowData.message}
              adv={rowData.link}
              adData={rowData.link ? rowData : ''}
            />
          );

        } else {
          // console.log(rowData)
          let messageList = []
          return (
            <InfoCard
              description={JSON.parse(rowData.info).descipt}
              photos={JSON.parse(rowData.info).imgs}
              status={rowData.status}
              id={rowData.id}
              school_id={rowData.school_id}
              user_id={rowData.user_id}
              adv={rowData.link}
              avatar={JSON.parse(rowData.avatar).img}
              nickname={rowData.nickname}
              link={rowData.link}
              message={this.props.message}
              messageList={messageList}
            />
          );
        }

      }
    };

    return (
      <div style={{
        height: "100%",
        overflow: "auto",
        display: 'flex',
        flexDirection: 'column',
      }}>
        {this.props.title == '信息审核' ? <MyBar title={this.props.title} /> : ''}
        {this.props.reviewAD||this.props.comments ? <ListView
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
            // console.log("scroll");
          }}
          scrollRenderAheadDistance={500}
        /> : <ListView
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
              // console.log("scroll");
            }}
            scrollRenderAheadDistance={500}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={100}
          />}


      </div>

    );
  }
}
