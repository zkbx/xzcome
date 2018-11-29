import axios from "axios";


//自定义配置新建axios
var token = ""
if ("token" in window.localStorage) {
    token = window.localStorage.token;
}
var instance = axios.create({
    baseURL: 'https://api.xzllo.com/v1',
    headers: {
        Authorization: "Bearer " + token
    }
});

export default instance