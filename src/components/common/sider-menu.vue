<template>
  <Sider hide-trigger :style="{minHeight: '580px', background: '#fff'}">

    <Menu width="auto" :active-name="activeName" @on-select="routerPush">

      <MenuGroup :title="items.title" v-for="items in menus" :key="items.title">

        <MenuItem :name="item.active" v-for="item in items.children" :key="item.text">
          <Icon :type="item.icon"/>
          {{item.text}}
        </MenuItem>

      </MenuGroup>
    </Menu>
  </Sider>
</template>

<script>
  import {siderMenus} from "../../common/js/siderMenu";

  export default {
    name: "SiderMenu",
    data() {
      return {
        menus: siderMenus,
        activeName: ''
      }
    },
    methods: {
      routerPush: function (t) {
        this.$router.push({
          name: t
        })
      },
      activeMenu: function () {
        this.$nextTick(function () {
          this.activeName = this.$route.path.slice(5).split("/")[0]
        }.bind(this))
      }
    },
    watch: {
      $route: "activeMenu"
    },
    created: function () {
      this.activeMenu()
    }
  }
</script>

<style scoped>

</style>
