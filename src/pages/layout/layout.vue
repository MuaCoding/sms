<template>
  <div style="background-color: rgb(245, 247, 249);">
    <div class="layout">
      <Layout>
        <!--头部-->
        <headerBar :userinfo="userinfo"></headerBar>
        <Layout style="padding: 0px 50px;">
          <!--面包屑-->
          <bread-crumb></bread-crumb>
          <Content :style="{padding: '24px 0', minHeight: '280px', background: '#fff'}">
            <Layout class="ivu-layout-has-sider">
              <!--侧边菜单栏-->
              <sider-menu></sider-menu>
              <!--内容-->
              <Content :style="{padding: '5px 24px 80px',minWidth: '870px', minHeight: '280px', background: '#fff'}">
                <router-view></router-view>
              </Content>
            </Layout>
          </Content>
        </Layout>
        <!--底部-->
        <footerBar></footerBar>
      </Layout>
    </div>
    <loading :loading="loading"></loading>
  </div>
</template>

<script>
  import {queryUserInfo} from "../../server/commonServices";
  import {ERR_OK} from "../../server/configServices";
  import HeaderBar from 'components/common/header-bar.vue';
  import FooterBar from 'components/common/footer-bar.vue';
  import BreadCrumb from 'components/common/bread-crumb.vue';
  import SiderMenu from 'components/common/sider-menu.vue';
  import Loading from 'components/common/loading.vue';

  export default {
    name: "app",
    data() {
      return {
        activeName: "index",
        userinfo: {},
        breadcrumb: [],
        loading: null,
      };
    },
    computed: {
      loadingChange(){
        return this.$store.state.spinner.isLoading;
      }
    },
    mounted() {
    },
    methods: {
      queryUserInfo() {
        queryUserInfo().then(res => {
          if (res.code === ERR_OK) {
            this.userinfo = res.data;
          }
        })
      },
      activeMenu() {
        this.$nextTick(function () {
          this.activeName = this.$route.path.slice(5).split("/")[0]
        }.bind(this))
      },
      routerPush(e) {
        this.$router.push({
          name: e
        });
      },
    },
    created: function () {
      this.activeMenu()
    },
    watch: {
      $route: ["activeMenu"],
      loadingChange(e){
        this.loading = e;
      },
    },
    components: {
      HeaderBar,
      FooterBar,
      BreadCrumb,
      SiderMenu,
      Loading,
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
  .layout {
    position: relative;
    min-width: 1100px;
    background: #f5f7f9;

    > .ivu-layout {
      display: flex;
      flex: auto;
      flex-direction: column;
      background: #f5f7f9;

      > .ivu-layout-header {
        > .ivu-menu {
          display: flex;
          height: 64px;
          line-height: 64px;

          > .layout-nav {
            width: 240px;
          }
        }
      }
    }
  }

  .ivu-layout-content {
    h1 {
      &.page-title {
        line-height: 40px;
        overflow: hidden;
        margin-bottom: 20px;
      }
    }
  }
</style>
