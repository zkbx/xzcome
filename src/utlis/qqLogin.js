import instance from "../utlis/api";

export const Login = (postData, callback) => {
    const remoteURL = "/login";
    instance.post(remoteURL, postData).then(response => {
        if (response.data.data != null) {
            if (typeof callback === "function") {
                callback(response.data.data.token);
            }
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