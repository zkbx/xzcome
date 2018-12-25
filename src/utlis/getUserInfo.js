import instance from "../utlis/api";
import {Modal} from "antd-mobile"

function unique(arr) {
    var res = [];
    var json = {};
    for (var i = 0; i < arr.length; i++) {
        if (!json[arr[i]]) {
            res.push(arr[i]);
            json[arr[i]] = 1;
        }
    }
    return res;
}

//获取用户信息
const getUserInfo = (token, callback) => {


    const remoteURL = "/getself/";
    instance
        .get(remoteURL, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then(response => {
            if (response.data.code == 0) {
                let userself = response.data.data;

                instance
                    .post('/tags/query',
                        {
                            user_id: response.data.data.id
                        },
                        {
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        }
                    )
                    .then(response => {
                        if (response.data.code == 0) {
                            userself.tags = []
                            response.data.data.forEach(element => {
                                // console.log(element.kind)
                                userself.tags.push(element.kind)
                            });

                            userself.tags = unique(userself.tags)
                            // userself.tags = response.data.data

                            if (typeof callback === "function") {
                                callback(userself);
                            }
                        } else {
                            Modal.alert(
                                "提示",
                                "网络出了点小差，请稍后重新请求页面..."
                            );
                        }

                    })




            } else {
                Modal.alert(
                    "提示",
                    "网络出了点小差，请稍后重新请求页面..."
                );
            }

        });
};

export default getUserInfo;