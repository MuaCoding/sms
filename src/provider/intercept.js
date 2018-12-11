import axios from 'axios'
import store from '@/store'
import iView from 'iview';
import router from "../router";

axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/x-www=form-urlencoded'

// axios.defaults.baseURL = "http://127.0.0.1:3000";
// axios.defaults.baseURL = "http://10.32.5.204:3000";

// 请求拦截
axios.interceptors.request.use(config => {

  if (store.state.token) {
    config.headers = {
      "User-Token": store.state.token
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

// // 返回状态判断(添加响应拦截器)
axios.interceptors.response.use(
  response => {
    if (response.data.Code != 0) {
      iView.Modal.error({
        title: "错误提示",
        content: response.data.Message,
        onOk: function () {
          response.status && 200 === response.status && router.push({
            name: "login"
          })
        }
      });
    }
    store.state.spinner.isLoading && store.commit("SET_LOADING", !1)
    return response
  },
  error => {
    if (error.isEject = !1, error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '错误请求'
          break;
        case 401:
          error.message = '未授权，请重新登录'
          break;
        case 403:
          error.message = '拒绝访问'
          break;
        case 404:
          error.message = '请求错误,未找到该资源'
          break;
        case 405:
          error.message = '请求方法未允许'
          break;
        case 408:
          error.message = '请求超时'
          break;
        // case 500:
        //   error.message = '服务器端出错'
        //   break;
        case 501:
          error.message = '网络未实现'
          break;
        case 502:
          error.message = '网络错误'
          break;
        case 503:
          error.message = '服务不可用'
          break;
        case 504:
          error.message = '网络超时'
          break;
        case 505:
          error.message = 'http版本不支持该请求'
          break;
        default:
          // error.message = `连接错误${error.response.status}`
          null !== error.response.data.code && 0 !== error.response.data.code ? error.message = error.response.data.msg : error.message = error.response.data.Message
      }
    }
    window.setTimeout(function () {
      error.isEject || iView.Modal.error({
        title: "错误提示",
        content: error.message,
        onOk: function () {
          error.response.status && 401 === error.response.status && router.push({
            name: "login"
          })
        }
      })
    }, 20)
    store.state.spinner.isLoading && store.commit("SET_LOADING", !1)
    return Promise.resolve(error.response)  //这里把错误信息扶正, 后面就不需要写 catch 了
  }
)

export default {
  get(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: params
      }).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  post(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.post(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}
