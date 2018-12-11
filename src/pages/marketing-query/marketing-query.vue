<template>
  <div class="marketingQuery">
    <h1 class="page-title">营销查询</h1>
    <div class="action-bar clearfix">
      <div class="bar-left">
        <label>选择日期：</label>
        <DatePicker v-model="datetime" format="yyyy/MM/dd HH" placeholder="选择日期" style="width:250px;"
                    type="datetimerange" @on-change="datetimeAction"></DatePicker>
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

    <!--产品代号表格-->
    <div>
      <Table stripe border :columns="columnsProCodeList" :data="productCodeRecordList"
             align="center"></Table>
      <div style="text-align: center; margin-top: 20px;" v-if="proCodeResult.length != 0">
        <Page :total="proCodeResult.length" :current="pageProCode" :page-size="size" placement="top"
              @on-change="handleProCodePage"/>
      </div>
    </div>
    <!--通道表格-->
    <div style="margin-top: 60px;">
      <Table stripe border :columns="columnsPassageList" :data="passageRecordList"
             align="center"></Table>
      <div style="text-align: center; margin-top: 20px;" v-if="passageResult.length != 0">
        <Page :total="passageResult.length" :current="pagePassage" :page-size="size" placement="top"
              @on-change="handlePassagePage"/>
      </div>
    </div>
    <!--短信信息错误类型表格-->
    <div style="margin-top: 60px;">
      <Table stripe border :columns="columnsSmsErrorList" :data="smsErrorList"
             align="center"></Table>
      <div style="text-align: center; margin-top: 20px;" v-if="smsErrorResult.length != 0">
        <Page :total="smsErrorResult.length" :current="pageSmsError" :page-size="size" placement="top"
              @on-change="handleSmsErrorPage"/>
      </div>
    </div>
  </div>
</template>

<script>
  import {queryMarketing} from "../../server/commonServices";
  import {ERR_Fail, ERR_OK} from "../../server/configServices";
  import {FormatMsec} from "common/js/filters";
  import {ComputeTotal,ComputeSum} from "common/js/util";

  export default {
    name: "marketingQuery",
    data() {
      return {
        isReset: !1,                      //是否显示重置按钮
        datetime: null,                   //时间
        beginTime: null,                  //开始时间
        endTime: null,                    //结束时间
        pageProCode: 1,                   //当前页
        pagePassage: 1,                   //当前页
        pageSmsError: 1,                  //当前页
        size: 10,                         //当前页大小
        columnsProCodeList: [
          {
            title: "产品代号",
            align: 'center',
            key: "name"
          },
          {
            title: "成功数",
            align: 'center',
            key: "success"
          },
          {
            title: "失败数",
            align: 'center',
            key: "fail"
          },
          {
            title: "未知数",
            align: 'center',
            key: "unknown"
          },
        ],        //产品代号渲染列表
        proCodeResult: [],                //产品代号中转列表
        productCodeRecordList: [],        //统计产品代号数据结果
        columnsPassageList: [
          {
            title: "通道",
            align: 'center',
            key: "name"
          },
          {
            title: "成功数",
            align: 'center',
            key: "success"
          },
          {
            title: "失败数",
            align: 'center',
            key: "fail"
          },
          {
            title: "未知数",
            align: 'center',
            key: "unknown"
          },
        ],        //通道渲染列表
        passageResult: [],                //通道中转列表
        passageRecordList: [],            //统计通道数据结果
        columnsSmsErrorList: [
          {
            title: "回执原因",
            align: 'center',
            key: "_id"
          },
          {
            title: "数量",
            align: 'center',
            key: "count"
          }
        ],       //短信错误信息类型渲染列表
        smsErrorResult: [],                //短信错误信息类型中转列表
        smsErrorList: [],                 //短信错误信息类型结果
      }
    },
    methods: {
      //获取查询时间
      datetimeAction() {
        this.beginTime = FormatMsec(this.datetime[0]);
        this.endTime = FormatMsec(this.datetime[1]);
      },
      //更改产品代号当前页
      handleProCodePage(value) {
        this.pageProCode = value;
        this.productCodeRecordList = [];
        this.handleProCode()
      },
      //更改通道当前页
      handlePassagePage(value) {
        this.pagePassage = value;
        this.passageRecordList = [];
        this.handlePassage()
      },
      //更改短信信息错误类型当前页
      handleSmsErrorPage(value) {
        this.pageSmsError = value;
        this.smsErrorList = [];
        this.handleSmsError()
      },
      //产品代号数据分页处理
      handleProCode() {
        let pages = this.pageProCode;
        let key = (--(pages)) * this.size;
        for (let i = key; i < (this.size * this.pageProCode); i++) {
          if (this.proCodeResult[i] != undefined) {
            this.productCodeRecordList.push(this.proCodeResult[i]);
          }
        }
      },
      //通道数据分页处理
      handlePassage() {
        let pages = this.pagePassage;
        let key = (--(pages)) * this.size;
        for (let i = key; i < (this.size * this.pagePassage); i++) {
          if (this.passageResult[i] != undefined) {
            this.passageRecordList.push(this.passageResult[i]);
          }
        }
      },
      //短信信息错误类型分页处理
      handleSmsError() {
        let pages = this.pageSmsError;
        let key = (--(pages)) * this.size;
        for (let i = key; i < (this.size * this.pageSmsError); i++) {
          if (this.smsErrorResult[i] != undefined) {
            this.smsErrorList.push(this.smsErrorResult[i]);
          }
        }
      },
      //获取营销查询结果
      queryMarketing() {
        this.$store.commit("SET_LOADING", 1)
        let formData = {
          beginTime: this.beginTime,        //开始时间
          endTime: this.endTime,            //结束时间
        }
        queryMarketing(formData).then(res => {
          if (res.Code == ERR_OK) {
            this.proCodeResult = ComputeTotal(res.Message.pnames);
            this.passageResult = ComputeTotal(res.Message.gates);
            this.smsErrorResult = ComputeSum(res.Message.reportResults);
            this.handleProCode()
            this.handlePassage()
            this.handleSmsError()
          } else if (res.Code == ERR_Fail) {

          }
        })
      },
      searchAction() {
        if ("" === this.datetime[0] && "" === this.datetime[1] || 0 == this.datetime.length)
          return this.$Message.error("请选择日期范围"), !1;

        this.isReset = 1;
        this.pageProCode = 1;                  //产品代号当前页
        this.pagePassage = 1;                  //通道当前页
        this.pageSmsError = 1;                 //短信当前页
        this.proCodeResult = [];               //产品代号中转列表
        this.productCodeRecordList = [];       //产品代号数据结果
        this.passageResult = []                //通道中转列表
        this.passageRecordList = []            //统计通道数据结果
        this.smsErrorResult = [];              //短信错误信息类型中转列表
        this.smsErrorList = [];                //短信错误信息类型结果
        this.queryMarketing()
      },
      //重置搜索条件事件
      resetAction() {
        this.isReset = !1;
        this.datetime = null;
      },
    },
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '~common/scss/common.scss';

  .marketingQuery {
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
