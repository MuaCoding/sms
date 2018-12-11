<template>
  <div class="index">
    <div class="index-cover">
      <img src="@/assets/index.png" alt="">
      <h3>欢迎来到XXX管理平台</h3>
      <p>请使用左侧菜单进行操作</p>
    </div>
  </div>
</template>

<script>

  export default {
    name: "index",

    data() {
      return {}
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  .index {
    width: 100%;
    height: 100%;
    text-align: center;
    position: relative;
    > .index-cover {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      > img {
        height: 300px;
      }

      > h3 {
        font-size: 24px;
        font-weight: 400;
        line-height: 35px;
      }

      > p {
        font-size: 14px;
        opacity: 0.7;
        line-height: 35px;
      }
    }
  }
</style>
