<template>

  <Breadcrumb style="margin: 16px 0px;" separator="/">
    <BreadcrumbItem>管理平台</BreadcrumbItem>
    <BreadcrumbItem v-for="item in breadcrumb" :key="item.value"><a @click="routerPush(item.router)">{{item.name}}</a>
    </BreadcrumbItem>
  </Breadcrumb>

</template>

<script>
  import {breadCrumbs} from "../../common/js/breadCrumb";

  export default {
    name: "BreadCrumb",
    data() {
      return {
        breadcrumb: []
      }
    },
    methods: {
      updateMatches: function () {
        let e = this
          , r = this.$route.path.slice(5).split("/")
          , t = []
          , n = void 0;
        r.forEach(function (r, u) {
          (n = 0 === t.length ? e.getChildren(breadCrumbs, r) : e.getChildren(t[u - 1].children, r)) && t.push(n)
        }), this.breadcrumb = t
      },
      getChildren: function (e, r) {
        if (e) {
          let t = "";
          return e.forEach(function (e) {
            e.value === r && (t = e)
          }), t
        }
      },
      routerPush(e) {
        this.$router.push({
          name: e
        });
      },
    },
    watch: {
      $route: "updateMatches"
    },
    created: function () {
      this.updateMatches()
    }
  }
</script>

<style scoped>

</style>
