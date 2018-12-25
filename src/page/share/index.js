import React from "react";

export default class Submit extends React.Component {
  render() {
    
    return(
        <div style={{position:'relative'}}>
            <img src={require('../../source/share.png')} style={{width:'100%'}} alt=""/>
            <div onClick={()=> window.location = "#/"} style={{color:'#fff',position:'absolute',bottom:'110px',left:'50%',marginLeft:'-110px',width:'220px',height:'40px',lineHeight:'40px',textAlign:'center',borderRadius:'31px',background:'linear-gradient(to right,#fb94ff,#4d3fff)',fontSize:'1.2em'}}>
              去首页
            </div>
        </div>
    )
  }
}
