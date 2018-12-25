import instance from "../utlis/api";
import {Modal} from "antd-mobile"

export const Login = (postData, callback) => {
    const remoteURL = "/login";
    instance.post(remoteURL, postData).then(response => {
        if (response.data.code == 0) {
            if (typeof callback === "function") {
                callback(response.data.data.token);
            }
        } else{
            Modal.alert(
              "提示",
              "网络出了点小差，请稍后重新请求页面..."
            );
          }
    });
};

export const qqLogin = (code, callback) => {
    const postData = {
        qq_code: code
    };
    Login(postData, callback)
}

export const wxLogin = (code, callback) => {
    const postData = {
        wx_code: code
    };
    Login(postData, callback)
}