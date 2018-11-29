import instance from "../utlis/api";

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
            if (response.data.data != null) {
                if (typeof callback === "function") {
                    callback(response.data.data);
                }
            }
        });
};

export default getUserInfo;