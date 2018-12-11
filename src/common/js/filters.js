/*
*
*全局使用
*
*
* */


let title = t => {
  t = t ? t + " - XXX后台管理平台" : "XXX后台管理平台",
    window.document.title = t
}

let formatDate = t => {
  if (!t)
    return "";
  let n = new Date(t).toJSON();
  return new Date(+new Date(n) + 288e5).toISOString().replace(/T/g, " ").replace(/\.[\d]{3}Z/, "")
}

let formatPrice = (t, n) => {
  0 !== n && (n = n > 0 && n <= 20 ? n : 2),
    t = parseFloat((t + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
  for (var e = t.split(".")[0].split("").reverse(), r = t.split(".")[1], o = "", i = 0; i < e.length; i++)
    o += e[i] + ((i + 1) % 3 == 0 && i + 1 !== e.length ? "," : "");
  return 0 === n ? o.split("").reverse().join("") : o.split("").reverse().join("") + "." + r
}


export {title, formatDate, formatPrice}

/*
*
* 独立使用
*
*
* */

export function set_title(t) {
  t = t ? t + " - XXX后台管理平台" : "XXX后台管理平台",
    window.document.title = t
}

//时间格式化
export function patternDate(t) {
  if (!t)
    return "";
  let n = new Date(t).toJSON();
  return new Date(+new Date(n) + 288e5).toISOString().replace(/T/g, " ").replace(/\.[\d]{3}Z/, "")
}


//获取URL参数
export function getUrlParam(a) {
  a = new RegExp("(^|\x26)" + a + "\x3d([^\x26]*)(\x26|$)");
  a = window.location.search.substr(1).match(a);
  return null != a ? unescape(a[2]) : null
}

// //金额格式化
export function formatPrix(t, n) {
  0 !== n && (n = n > 0 && n <= 20 ? n : 2),
    t = parseFloat((t + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
  for (var e = t.split(".")[0].split("").reverse(), r = t.split(".")[1], o = "", i = 0; i < e.length; i++)
    o += e[i] + ((i + 1) % 3 == 0 && i + 1 !== e.length ? "," : "");
  return 0 === n ? o.split("").reverse().join("") : o.split("").reverse().join("") + "." + r
}

//时间转毫秒数
export function FormatMsec(t) {
  let result = new Date(t).getTime();       //起始时间
  return result;
}

//今天开始时间毫秒数
export function TodayStart() {
  let result = "", date = new Date(), year = date.getFullYear(), month = date.getMonth() + 1,
    day = date.getDate();
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;
  result = new Date(year + "/" + month + "/" + day + " 00:00:00").getTime();       //起始时间
  return result;
}

//今天结束时间毫秒数
export function TodayEnd() {
  let result = "", date = new Date(), year = date.getFullYear(), month = date.getMonth() + 1,
    day = date.getDate();
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;
  result = new Date(year + "/" + month + "/" + day + " 23:59:59").getTime();       //结束时间
  return result;
}

//昨天开始时间毫秒数
export function YesterDayStart() {
  let result = "", date = GetDate(1, 1), year = date.getFullYear(), month = date.getMonth() + 1,
    day = date.getDate();
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;
  result = new Date(year + "/" + month + "/" + day + " 00:00:00").getTime();       //起始时间
  return result;
}

//昨天结束时间毫秒数
export function YesterDayEnd() {
  let result = "", date = GetDate(1, 1), year = date.getFullYear(), month = date.getMonth() + 1,
    day = date.getDate();
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;
  result = new Date(year + "/" + month + "/" + day + " 23:59:59").getTime();       //结束时间
  return result;
}


/*
* min：本月月初
* max：本月月底
* */

//本月开始时间毫秒数
export function MonthStart() {
  let result = "", date = new Date(), year = date.getFullYear(), month = date.getMonth(),
    min = new Date(year, month, 1), startYear = min.getFullYear(), startMonth = min.getMonth() + 1,
    startDay = min.getDate();

  //处理起始时间小于10的追加"0"在前面
  startMonth = startMonth < 10 ? "0" + startMonth : startMonth;
  startDay = startDay < 10 ? "0" + startDay : startDay;

  result = new Date(startYear + "/" + startMonth + "/" + startDay + " 00:00:00").getTime();       //起始时间

  return result;
}

//本月结束时间毫秒数
export function MonthEnd() {
  let result = "", date = new Date(), year = date.getFullYear(), month = date.getMonth(),
    max = new Date(year, month + 1, 0),
    endYear = max.getFullYear(), endMonth = max.getMonth() + 1, endDay = max.getDate();
  //处理结束时间小于10的追加"0"在前面
  endMonth = endMonth < 10 ? "0" + endMonth : endMonth;
  endDay = endDay < 10 ? "0" + endDay : endDay;
  result = new Date(endYear + "/" + endMonth + "/" + endDay + " 23:59:59").getTime();      //结束时间
  return result;
}

/*
*获取当前日期前N天或后N日期(N = day)
*type:1：前；2：后
*/
function GetDate(day, type) {
  let zdate = new Date(), edate;
  if (type === 1) {
    edate = new Date(zdate.getTime() - (day * 24 * 60 * 60 * 1000));
  } else {
    edate = new Date(zdate.getTime() + (day * 24 * 60 * 60 * 1000));
  }
  return edate;
}



