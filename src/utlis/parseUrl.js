const parseUrl = () => {
    var regex = /[^&=?]+=[^&]*/g;
    var res = []
    var res1 = window.location.hash.match(regex);
    var res2 = ("/login" + window.location.search).match(regex);
    if (res1 !== null) {
        res = res.concat(res1)
    }
    if (res2 !== null) {
        res = res.concat(res2)
    }
    if (res.length === 0) {
        return Object.create(null)
    }
    let obj = Object.create(null)
    for (let index = 0; index < res.length; index++) {
        const element = res[index].split("=");
        obj[element[0]] = element[1]
    }
    //返回一个有用户信息的对象
    return obj
}

export default parseUrl