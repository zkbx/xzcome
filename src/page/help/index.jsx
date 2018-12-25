import React from "react";
import MyBar from "../../component/MyBar"
import { Accordion } from 'antd-mobile'

export default class BasicInput extends React.Component {

    render() {

        return (
            <div style={{ height: '100%', position: 'relative' }}>
                <MyBar title='帮助中心' />
                <Accordion className="my-accordion" onChange={this.onChange}>
                    <Accordion.Panel header={<b>1.页面功能解析</b>} className="pad">
                        <div style={{ padding: '10px 18px', fontSize: '1.2em', lineHeight: '1.5' }}>
                            <img src={require('./images/help17.png')} style={{ display: 'block', width: '100%', margin: '10px auto' }} alt="" /><br />
                            <img src={require('./images/help18.png')} style={{ display: 'block', width: '100%', margin: '10px auto' }} alt="" /><br />
                            <img src={require('./images/help19.png')} style={{ display: 'block', width: '100%', margin: '10px auto' }} alt="" />
                        </div>
                    </Accordion.Panel>
                    <Accordion.Panel header={<b>2.如何发布信息</b>} className="pad">
                        <div style={{ padding: '10px 18px', fontSize: '1.2em', lineHeight: '1.5' }}>
                            <div>
                                <b>第一步</b><br />在登录后选择发布按钮
                            </div>
                            <img src={require('./images/help8.png')} style={{ display: 'block', width: '100%', margin: '10px auto' }} alt="" />
                            <br />
                            <div>
                                <b>第二步</b><br />填写完你要发布的信息点击提交就发布成功啦
                                <div style={{ color: 'rgb(232,0,0)' }}>
                                    （注：要选好类别和学校，联系方式要选择方便联系的类别哦）
                                </div>

                            </div>
                            <img src={require('./images/help9.png')} style={{ display: 'block', width: '100%', margin: '10px auto' }} alt="" />
                        </div>
                    </Accordion.Panel>
                    <Accordion.Panel header={<b>3.如何发布信息</b>} className="pad">
                        <div style={{ padding: '10px 18px', fontSize: '1.2em', lineHeight: '1.5' }}>
                            <div>
                                <b>第一步</b><br />在登录后选择发布按钮
                            </div>
                            <img src={require('./images/help8.png')} style={{ display: 'block', width: '100%', margin: '10px auto' }} alt="" />
                            <br />
                            <div>
                                <b>第二步</b><br />填写完你要发布的信息点击提交就发布成功啦
                                <div style={{ color: 'rgb(232,0,0)' }}>
                                    （注：要选好类别和学校，联系方式要选择方便联系的类别哦）
                                </div>

                            </div>
                            <img src={require('./images/help9.png')} style={{ display: 'block', width: '100%', margin: '10px auto' }} alt="" />
                        </div>
                    </Accordion.Panel>
                    <Accordion.Panel header={<b>4.想要接受推送消息怎么设置</b>} className="pad">
                        <div style={{ padding: '10px 18px', fontSize: '1.2em', lineHeight: '1.5' }}>
                            <div>
                                在我的界面中选择联系方式
                            </div>
                            <img src={require('./images/help14.png')} style={{ display: 'block', width: '100%', margin: '10px auto' }} alt="" />
                            <br />
                            <div>
                                点击要绑定的QQ或者微信，点击弹窗的OK就复制成功啦 ，然后添加小助手QQ为好友，把验证码粘贴到聊天窗口就可以绑定啦
                            <div style={{ color: 'rgb(232,0,0)' }}>（注：一定要记得先加小助手QQ哦）
                            </div>

                            </div>
                            <img src={require('./images/help15.png')} style={{ display: 'block', width: '100%', margin: '10px auto' }} alt="" />
                        </div>
                    </Accordion.Panel>
                    <Accordion.Panel header={<b>5.如何选择要接单的类别</b>} className="pad">
                        <div style={{ padding: '10px 18px', fontSize: '1.2em', lineHeight: '1.5' }}>
                            <div>
                                <b>第一步</b><br />点开接单管理选择关注按钮
                        </div>
                            <img src={require('./images/help6.png')} style={{ display: 'block', width: '100%', margin: '10px auto' }} alt="" />
                            <br />
                            <div>
                                <b>第二步</b><br />选择自己想要接单的类别就可以啦
                        </div>
                            <img src={require('./images/help7.png')} style={{ display: 'block', width: '100%', margin: '10px auto' }} alt="" />
                            <br />
                            <div style={{ color: 'rgb(232,0,0)' }}>
                                如没有帮到您，您可以联系客服为您解答。
                        </div>
                        </div>
                    </Accordion.Panel>
                    <Accordion.Panel header={<b>6.如何获取接单推送消息</b>} className="pad">
                        <div style={{ padding: '10px 18px', fontSize: '1.2em', lineHeight: '1.5' }}>
                            <div>
                                <b>第一步</b> <br />我们需要在我的界面中绑定QQ或者微信
                       </div>
                            <img src={require('./images/help3.png')} style={{ display: 'block', width: '100%', margin: '10px auto' }} alt="" />
                            <br />
                            <div>
                                <b>第二步</b> <br />点开接单管理<br />
                                <img src={require('./images/help4.png')} style={{ display: 'block', width: '100%', margin: '10px auto' }} alt="" />
                                选择推送按钮从中选择要关注的类别后就可以在绑定的QQ或者微信中收到推送消息啦。
                        </div>
                            <img src={require('./images/help5.png')} style={{ display: 'block', width: '100%', margin: '10px auto' }} alt="" />
                            <br />
                            <div style={{ color: 'rgb(232,0,0)' }}>
                                如没有帮到您，您可以联系客服为您解答。
                                </div>
                        </div>
                    </Accordion.Panel>
                    <Accordion.Panel header={<b>7.如何换绑联系方式</b>}>
                        <div style={{ padding: '10px 18px', fontSize: '1.2em', lineHeight: '1.5' }}>

                            <div>
                                已经绑定了联系方式的用户换绑只需两步
                        </div>
                            <br />
                            <div>
                                <b>第一步</b><br />在我的界面点击QQ或者微信，弹出验证码已复制
                        </div>
                            <img src={require('./images/help1.png')} style={{ display: 'block', width: '100%', margin: '10px auto' }} alt="" />
                            <br />
                            <div>
                                <b>第二步</b><br />用你想绑定的QQ或者微信发送给小助手，待小助手提示成功绑定，即表示您换绑成功
                        </div>
                            <img src={require('./images/help2.png')} style={{ display: 'block', width: '100%', margin: '10px auto' }} alt="" />
                            <br />
                            <div>
                                （注：1.微信登陆学长来咯后，微信默认绑定所登陆的微信账号，想换绑微信需更换登录账号。2.浏览器QQ登录用户想绑定微信需到微信公众号中）
                                <br />
                                <div style={{ color: 'rgb(232,0,0)' }}>
                                    如没有帮到您，您可以联系客服为您解答。
                                </div>
                            </div>
                        </div>
                    </Accordion.Panel>
                    <Accordion.Panel header={<b>8.如何让首页推送自己想要了解学校的内容</b>} className="pad">
                        <div style={{ padding: '10px 18px', fontSize: '1.2em', lineHeight: '1.5' }}>
                            <div>
                                在我的界面中 选择学校，就可以啦！
                            </div>
                            <img src={require('./images/help16.png')} style={{ display: 'block', width: '100%', margin: '10px auto' }} alt="" />
                        </div>
                    </Accordion.Panel> 
                    <Accordion.Panel header={<b>9.如何管理评论</b>} className="pad">
                        <div style={{ padding: '10px 18px', fontSize: '1.2em', lineHeight: '1.5' }}>
                            <div>
                                <b>第一种</b><br />进入我的界面选择我的发布，然后选择发布内容查看订单详情，可以管理下面的全部评论。
                            </div>
                            <br />
                            <div>
                                <b>第二种</b><br />在别人发布信息的详情页中可以删除自己的评论。
                            </div>
                            <br />
                            <div>
                                <b>第三种</b><br />在首页选择自己发布的内容 可以管理下面的全部评论。
                            </div>
                        </div>
                    </Accordion.Panel>                  
                    <Accordion.Panel header={<b>10.发布成功的订单交易完成后怎么下架</b>} className="pad">
                        <div style={{ padding: '10px 18px', fontSize: '1.2em', lineHeight: '1.5' }}>
                            <div>
                                在我的界面—点击我的发布
                            </div>
                            <img src={require('./images/help10.png')} style={{ display: 'block', width: '100%', margin: '10px auto' }} alt="" />
                            <br />
                            <div>
                                进入后点击想要关闭信息的右上角完成按钮 即可完成下架。
                            </div>
                            <img src={require('./images/help11.png')} style={{ display: 'block', width: '100%', margin: '10px auto' }} alt="" />
                        </div>
                    </Accordion.Panel>
                </Accordion>
            </div>
        );
    }
}
