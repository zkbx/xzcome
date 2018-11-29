import React from 'react';
import { Grid,Carousel,WhiteSpace } from 'antd-mobile';

//未被调用
class ImgDisplay extends React.Component {
    state = {
      data: ['1', '2', '3'],
      imgHeight: 176,
    }
    componentDidMount() {
      // simulate img loading
      setTimeout(() => {
        this.setState({
          data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
        });
      }, 100);
    }
    render() {
      return (
        <Carousel
          autoplay={true}
          infinite
          beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
          afterChange={index => console.log('slide to', index)}
        >
          {this.state.data.map(val => (
            <a
              key={val}
              href="http://www.alipay.com"
              style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
            >
              <img
                src={`https://zos.alipayobjects.com/rmsportal/${val}.png`}
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'));
                  this.setState({ imgHeight: 'auto' });
                }}
              />
            </a>
          ))}
        </Carousel>
      );
    }
  }
  
class Campus extends React.Component {
    render() {
      const data = [
        { icon: "https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png", text: "成绩" },
        { icon: "https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png", text: "课表" },
        { icon: "https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png", text: "公告" },];
  
      return (
        <div>
          <ImgDisplay />
          <Grid style={{ "box-shadow": "0 3px 5px 0 rgba(0,0,0,0.2), 0 3px 5px 0 rgba(0,0,0,0.05)" }} data={data} activeStyle={false} columnNum={3} />
          <WhiteSpace size="lg" />
        </div>
      )
    }
  }
  
export default Campus;