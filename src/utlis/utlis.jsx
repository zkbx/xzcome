import { Modal,Toast } from "antd-mobile";

//弹窗提醒
export const showQQ = (qq, msg) => {
  window.location.href =
    "mqqwpa://im/chat?chat_type=wpa&uin=" +
    qq +
    "&version=1&src_type=web&web_src=oicqzone.com";
  copyToClipboard(qq);
  if (!msg) {
    msg = "QQ已复制，快去添加Ta为好友吧";
  }
  Modal.alert("提示", msg, [
    {
      text: "Ok"
    }
  ]);
};

export const showPhone = (phone, msg) => {
  copyToClipboard(phone);
  if (!msg) {
    msg = "电话已复制，快和Ta联系吧";
  }
  Modal.alert("提示", msg, [
    {
      text: "Ok"
    }
  ]);
};

export const copyAndShow = (text, msg) => {
  copyToClipboard(text);
  console.info(text);
  if (!msg) {
    msg = "电话已复制，快和Ta联系吧";
  }
  Modal.alert("提示", msg, [
    {
      text: "Ok"
    }
  ]);
};

//复制到剪贴板
export const copyToClipboard = (function initClipboardText() {
  const textarea = document.createElement("textarea");
  // Move it off screen.
  textarea.style.cssText = "position: absolute; left: -99999em";

  // Set to readonly to prevent mobile devices opening a keyboard when
  // text is .select()'ed.
  textarea.setAttribute("readonly", true);

  document.body.appendChild(textarea);

  return function setClipboardText(text) {
    textarea.value = text;

    // Check if there is any content selected previously.
    const selected =
      document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;

    // iOS Safari blocks programmtic execCommand copying normally, without this hack.
    // https://stackoverflow.com/questions/34045777/copy-to-clipboard-using-javascript-in-ios
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      const editable = textarea.contentEditable;
      textarea.contentEditable = true;
      const range = document.createRange();
      range.selectNodeContents(textarea);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      textarea.setSelectionRange(0, 999999);
      textarea.contentEditable = editable;
    } else {
      textarea.select();
    }

    try {
      const result = document.execCommand("copy");

      // Restore previous selection.
      if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }

      return result;
    } catch (err) {
      return false;
    }
  };
})();

//检查用什么设备进行访问
export const checkMobile = () => {
  var browser = {
    versions: (function() {
      var u = navigator.userAgent,
        app = navigator.appVersion;
      return {
        //移动终端浏览器版本信息
        trident: u.indexOf("Trident") > -1, //IE内核
        presto: u.indexOf("Presto") > -1, //opera内核
        webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
        gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或uc浏览器
        iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf("iPad") > -1, //是否iPad
        webApp: u.indexOf("Safari") == -1 //是否web应该程序，没有头部与底部
      };
    })(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
  };
  if (browser.versions.mobile) {
    //判断是否是移动设备打开。browser代码在下面
    var ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      return 2;
    }
    if (ua.match(/WeiBo/i) == "weibo") {
      //在新浪微博客户端打开
      return 2;
    }
    if (ua.match(/QQ/i) == "qq") {
      return 1;
    }
    if (browser.versions.ios) {
      //是否在IOS浏览器打开
      return 1;
    }
    if (browser.versions.android) {
      //是否在安卓浏览器打开
      return 1;
    }
  } else {
    //否则就是PC浏览器打开
    return 0;
  }
};

export const toQQlogin = (e) => {
  if(e){
    Modal.alert("提示", "请登陆", [
      {
        text: "OK",
        onPress: () => {
          const parms = {
            response_type: "code",
            client_id: "101507500",
            redirect_uri: encodeURIComponent(
              window.location.origin + "/#/my/login"
            ),
            state: "qq"
          };
          window.location.href =
            "https://graph.qq.com/oauth2.0/authorize?" +
            urlEncode(parms).slice(1);
        }
      }
    ])
  }else{
    const parms = {
      response_type: "code",
      client_id: "101507500",
      redirect_uri: encodeURIComponent(
        window.location.origin + "/#/my/login"
      ),
      state: "qq"
    };
    window.location.href =
      "https://graph.qq.com/oauth2.0/authorize?" +
      urlEncode(parms).slice(1);
  }
};

const urlEncode = (param, key, encode) => {
  if (param === null) return "";
  var paramStr = "";
  var t = typeof param;
  if (t === "string" || t === "number" || t === "boolean") {
    paramStr +=
      "&" +
      key +
      "=" +
      (encode === null || encode ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      // var k = key === null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += urlEncode(param[i], i, encode);
    }
  }
  return paramStr;
};

export const toWXlogin = () => {
  Modal.alert("提示", "请登陆", [
    {
      text: "OK",
      onPress: () => {
        const parms = {
          response_type: "code",
          appid: "wxb6b7f29fac6794c6",
          redirect_uri: encodeURIComponent(
            window.location.origin + "/#/my/login"
          ),
          scope: "snsapi_userinfo",
          state: "wx"
        };
        window.location.href =
          "https://open.weixin.qq.com/connect/oauth2/authorize?" +
          urlEncode(parms).slice(1);
      }
    }
  ]);
};

export const toLogin = (e) => {
  switch (checkMobile()) {
    case 0:

    case 1:
      toQQlogin(e);
      break;
    case 2:
      toWXlogin(e);
      break;
    default:
      break;
  }
};

export const isWeiXin=()=> {
  var ua = window.navigator.userAgent.toLowerCase();
  // console.log(ua);//mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true;
  } else {
    return false;
  }
}

export const soonOnline=()=>{
  Toast.info('即将上线，敬请期待！', 2);
}
