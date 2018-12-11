import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store';

import iView from 'iview';
import {Base64} from 'js-base64';

import {set_title} from "common/js/filters";

//路由懒加载
const Layout = r => require.ensure([], () => r(require('pages/layout/layout')), 'layout')
const Login = r => require.ensure([], () => r(require('pages/login/login')), 'login')
const Logout = r => require.ensure([], () => r(require('pages/logout/logout')), 'logout')
const MarketingQuery = r => require.ensure([], () => r(require('pages/marketing-query/marketing-query')), 'marketing')
const RecordBoard = r => require.ensure([], () => r(require('pages/record-board/record-board')), 'board')
const RecordQuery = r => require.ensure([], () => r(require('pages/record-query/record-query')), 'query')
const SendingPlatform = r => require.ensure([], () => r(require('pages/sending-platform/sending-platform')), 'platform')
const ReceiptQuery = r => require.ensure([], () => r(require('pages/receipt-query/receipt-query')), 'receipt')

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes: [{
    path: '/',
    redirect: '/app/recordBoard',
  },
    {
      path: '/login',
      name: "login",
      meta: {
        title: "用户登录"
      },
      component: Login,
    },
    {
      path: '/logout',
      name: "logout",
      meta: {
        title: "用户注销"
      },
      component: Logout,
    },
    {
      path: '/app',
      name: 'app',
      component: Layout,
      meta: {
        requireAuth: true // 表示进入这个路由是需要登录的
      },
      children: [
        {
          path: 'recordBoard',
          name: "recordBoard",
          meta: {
            title: "数据看板管理"
          },
          component: RecordBoard,
        },
        {
          path: 'recordQuery',
          name: "recordQuery",
          meta: {
            title: "数据查询管理"
          },
          component: RecordQuery,
        },
        {
          path: 'marketingQuery',
          name: "marketingQuery",
          meta: {
            title: "营销查询管理"
          },
          component: MarketingQuery,
        },
        {
          path: 'sendingPlatform',
          name: "sendingPlatform",
          meta: {
            title: "发送平台管理"
          },
          component: SendingPlatform,
        },
        {
          path: 'receiptQuery',
          name: "receiptQuery",
          meta: {
            title: "回执查询管理"
          },
          component: ReceiptQuery,
        },
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  /**
   * 1.判断该路由是否需要登录权限
   * 2.判断登录信息是否过期
   */
  set_title(to.meta.title); //设置窗口页标题

  let flag;
  try {
    var a = store.state.token.split(".")[1],
      h = new Date(1e3 * JSON.parse(Base64.decode(a)).exp);
    flag = h > new Date
  } catch (t) {
    flag = !1
  }

  // if (!flag && to.path !== '/login' && "/logout" !== to.path) { // 判断该路由是否需要登录权限
  //   iView.LoadingBar.finish();
  //   iView.Modal.error({
  //     title: "错误信息",
  //     content: "您的用户状态已失效，请前往登录页面重新登录",
  //     onOk: function () {
  //       router.push({
  //         path: "/login"
  //       });
  //     }
  //   });
  //   // -1 === to.path.indexOf(i) && -1 === to.path.indexOf(from.path) && this.$store.commit("CLEAR_LIST_STATUS");
  // }
  next();
});

router.afterEach(route => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
})

export default router;
