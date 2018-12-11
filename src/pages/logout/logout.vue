<template>
  <div class="logout-spin">
    <Spin fix>
      <Icon type="ios-loading" size='25' class="demo-spin-icon-load"></Icon>
      <div>正在注销中</div>
    </Spin>
  </div>
</template>

<script>

  export default {
    name: "logout",
    data() {
      return {}
    },
    methods: {
      removeInfo() {
        this.$store.commit("USERNAME", null);
      },
      logout: function () {
        setTimeout(() => {
          this.$router.replace({
            name: "login"
          });
          this.$Message.success("注销成功");
        }, 1000);
      }
    },
    mounted: function () {
      this.removeInfo();
      this.logout();
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .logout-spin {
    height: 100px;
    border: 1px solid #eee;
    font-size: 14px;
  }

  .ivu-spin-main {
    padding: 18px 20px;
    background-color: rgba(0, 0, 0, .4);
    border-radius: 5px;
    color: #fff;
    font-size: 14px;
  }

  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }

  @keyframes ani-demo-spin {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
