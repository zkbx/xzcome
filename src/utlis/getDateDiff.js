var minute = 1000 * 60;
var hour = minute * 60;
var day = hour * 24;
var month = day * 30;

//显示时间处理
export default function getDateDiff(dateTimeStamp) {
    let result = ""
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
        //若日期不符则弹出窗口告之
        //alert("结束日期不能小于开始日期！");
    }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (monthC >= 1) {
        result = "" + parseInt(monthC, 10) + "个月前";
    } else if (weekC >= 1) {
        result = "" + parseInt(weekC, 10) + "周前";
    } else if (dayC >= 1) {
        result = "" + parseInt(dayC, 10) + "天前";
    } else if (hourC >= 1) {
        result = "" + parseInt(hourC, 10) + "个小时前";
    } else if (minC >= 1) {
        result = "" + parseInt(minC, 10) + "分钟前";
    } else
        result = "刚刚发表";
    return result;
}