<template>
  <div class="logout-spin" v-if="loading">
    <Spin fix>
      <Icon type="ios-loading" size='25' class="demo-spin-icon-load"></Icon>
      <div>加载中</div>
    </Spin>
  </div>
</template>

<script>

  export default {
    name: "loading",
    props: ['loading'],
    data() {
      return {}
    },
    methods: {},
    mounted: function () {

    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .logout-spin {
    height: 100px;
    border: 1px solid #eee;
    font-size: 14px;
  }

  .logout-spin .ivu-spin-fix {
    background-color: unset;
    z-index: 10000;
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
