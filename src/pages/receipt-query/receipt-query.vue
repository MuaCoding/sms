<template>
  <div class="receiptQuery">
    <h1 class="page-title">回执查询</h1>
    <div class="action-bar clearfix">
      <div class="bar-left">
        <label style="padding-left: 15px;">手机号码：</label>
        <Input placeholder="请输入" style="width:450px; padding-left: 15px;" v-model="mobile"/>
      </div>
      <div class="bar-right">
        <Button type="primary" size="large" @click="searchAction">
          <Icon type="ios-search"/>
          <span>搜索</span>
        </Button>
        <Button size="large" v-if="isReset" @click="resetAction">
          <Icon type="md-refresh"/>
          <span>重置搜索</span>
        </Button>
      </div>
    </div>
    <div>
      <!--列表-->
      <Table stripe border :columns="columnsList" :data="receiptList" align="center"></Table>

    </div>

  </div>
</template>

<script>
  import {queryReceiptRecord} from "../../server/commonServices";
  import {ERR_Fail, ERR_OK} from "../../server/configServices";
  export default {
    name: "receiptQuery",
    data() {
      return {
        mobile: null,
        isReset: !1,
        columnsList: [
          {
            title: "id",
            align: 'center',
            key: "msgid"
          },
          {
            title: "网关",
            align: 'center',
            key: "gate"
          },
          {
            title: "产品代号",
            align: 'center',
            key: "pname"
          },
          {
            title: "用途",
            align: 'center',
            key: "reason"
          },
          {
            title: "营销短信",
            align: 'center',
            key: "type"
          },
          {
            title: "短信内容",
            align: 'center',
            key: "message"
          },
          {
            title: "回执状态码",
            align: 'center',
            key: "code"
          },
          {
            title: "回执信息",
            align: 'center',
            key: "result"
          },
          {
            title: "收到回执时间",
            align: 'center',
            key: "updatetime"
          },
        ],
        receiptList: [],
      }
    },
    methods: {
      queryReceipt(){
        this.$store.commit("SET_LOADING", 1)
        let formData = {
          telnumber: this.mobile
        }
        queryReceiptRecord(formData).then(res => {
          if (res.Code == ERR_OK) {
            this.receiptList = res.Message;
          } else if (res.Code == ERR_Fail) {
            this.receiptList = [];
          }
        })
      },
      searchAction() {
        if (null === this.mobile)
          return this.$Message.error("请选择搜索条件"), !1;
        this.isReset = 1;
        this.queryReceipt();
      },
      //重置搜索条件事件
      resetAction() {
        this.isReset = !1;
        this.mobile = null;
      },
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '~common/scss/common.scss';

  .receiptQuery {
    padding-bottom: 30px;

    .action-bar {
      margin-bottom: 30px;
      width: 100%;

      .bar-left {
        float: left;
      }

      .bar-right {
        float: right;
      }
    }
  }
</style>
