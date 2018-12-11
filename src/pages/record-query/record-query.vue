<template>
  <div class="recordQuery">
    <h1 class="page-title">数据查询</h1>
    <div class="action-bar">
      <div class="action-item clearfix">
        <div class="date-time">
          <label class="name">选择日期：</label>

          <DatePicker v-model="datetime" format="yyyy/MM/dd HH" placeholder="选择日期" style="width:100%"
                      type="datetimerange" @on-change="datetimeAction"></DatePicker>
        </div>

      </div>
      <div class="action-item clearfix">
        <div class="bar-left" ref="searchCondition">
          <label>搜索条件：</label>
          <Select v-model="pattern" style="width:100px" @on-change="cutoverAction">
            <Option v-for="item in patternList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
          <!--产品代号-->
          <Select v-model="productCode" multiple style="width:230px"
                  v-if="status === 0 && proCodeActive"
                  @on-change="changeProductCode">
            <Option v-for="item in productCodeList" :value="item.name" :key="item.id + new Date().getTime()"
                    :label="item.name"></Option>
          </Select>
          <!--功能-->
          <Select v-model="feature" class="searchFeature" OptionGroup multiple style="width:230px"
                  v-if="status === 0 && copyFeaturesList" :label-in-value="true">
            <OptionGroup :label="items.pname" v-for="items in copyFeaturesList" :key="items.pname">
              <Option v-for="item in items.list" :value="item.id" :key="item.id"
                      :label="item.name"></Option>
            </OptionGroup>
          </Select>
          <!--通道-->
          <Select v-model="passage" multiple style="width:230px" v-if="status === 1 && passageList">
            <Option v-for="item in passageList" :value="item.name" :key="item.id" :label="item.name"></Option>
          </Select>
          <!--短信-->
          <Select v-model="smsChannel" multiple style="width:230px" v-if="status === 2 && smsChannelList">
            <Option v-for="item in smsChannelList" :value="item.id" :key="item.id" :label="item.name"></Option>
          </Select>

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

    <!--短信表格-->
    <div style="margin-top: 60px;">
      <Table stripe border :columns="columnsChannelList" :data="smsChannelRecordList"
             align="center"></Table>
      <div style="text-align: center; margin-top: 20px;" v-if="smsChannelResult.length != 0">
        <Page :total="smsChannelResult.length" :current="pageChannel" :page-size="size" placement="top"
              @on-change="handleChannelPage"/>
      </div>
    </div>

    <!--短信信息错误类型表格-->
    <div style="margin-top: 60px;" v-if="status === 2">
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
  import {
    queryFeatures,
    queryPassage,
    queryPassageRecord,
    queryProductCode,
    queryProductCodeRecord,
    querySmsChannel,
    querySmsChannelRecord,
  } from "../../server/commonServices";
  import {ERR_Fail, ERR_OK} from "../../server/configServices";
  import {FormatMsec, patternDate} from "common/js/filters";
  import {ComputeTotal, DeepCopy, FormatObject} from "common/js/util";

  export default {
    name: "recordQuery",
    data() {
      return {
        datetime: null,                   //时间返回搜索
        beginTime: null,                  //开始时间
        endTime: null,                    //结束时间
        pattern: null,                    //选中统计方式
        pageProCode: 1,                   //当前页
        pagePassage: 1,                   //当前页
        pageChannel: 1,                   //当前页
        pageSmsError: 1,                  //当前页
        size: 10,                         //当前页大小
        patternList: [
          {
            id: 0,
            name: '产品代号'
          },
          {
            id: 1,
            name: '通道'
          },
          {
            id: 2,
            name: '短信类型'
          },
        ],                                //统计方式
        isReset: !1,                      //显示重置搜索按钮
        featureActive: !1,                //显示功能搜索下拉条件
        proCodeActive: !1,                //显示产品代号搜索下拉条件
        status: null,                     //显示搜索条件
        productCode: null,                //选中产品代号
        productCodeList: [],              //产品代号列表
        feature: null,                    //选中功能
        featuresList: null,               //功能列表
        copyFeaturesList: null,           //拷贝功能列表
        passage: '',                      //选中通道
        passageList: null,                //通道列表
        smsChannel: '',                   //选中短信通道
        smsChannelList: null,             //短信通道列表
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
        columnsChannelList: [
          {
            title: "短信类型",
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
        ],        //短信渲染列表
        smsChannelResult: [],             //短信中转列表
        smsChannelRecordList: [],         //短信数据结果
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
      //切换统计方式
      cutoverAction(e) {
        this.status = e;
        switch (e) {
          case 0:
            this.queryProductCode();
            break;
          case 1:
            this.queryPassage();
            break;
          case 2:
            this.querySmsChannel();
            break;
        }
      },
      //获取功能类型/更改产品代号选中项
      changeProductCode(o) {
        this.feature = '';
        this.queryFeatures();
      },
      //获取查询时间
      datetimeAction() {
        this.productCode = null;
        this.beginTime = FormatMsec(this.datetime[0]);
        this.endTime = FormatMsec(this.datetime[1]);
      },
      //获取产品代号类型
      queryProductCode() {
        let formData = {
          pattern: this.status
        }
        queryProductCode(formData).then(res => {
          if (res.Code == ERR_OK) {
            this.proCodeActive = 1;
            this.productCodeList = res.Message;
          } else if (res.Code == ERR_Fail) {
            this.productCodeList = [];
          }
        })
      },
      //获取功能类型
      queryFeatures() {
        let formData = {
          pnames: this.productCode.toString()
        }
        queryFeatures(formData).then(res => {
          if (res.Code == ERR_OK) {
            if (res.Message) this.copyFeaturesList = DeepCopy(res.Message);
            this.featuresList = res.Message;
          } else if (res.Code == ERR_Fail) {
            this.featuresList = [];
          }
        })
      },
      //获取通道类型
      queryPassage() {
        this.formData = {
          passage: this.status
        }
        queryPassage(this.formData).then(res => {
          console.log(res)
          if (res.Code == ERR_OK) {
            this.passageList = res.Message;
          } else if (res.Code == ERR_Fail) {
            this.passageList = [];
          }
        })
      },
      // 获取短信类型
      querySmsChannel() {
        this.formData = {
          smsChannel: this.status
        }
        querySmsChannel(this.formData).then(res => {
          if (res.Code == ERR_OK) {
            this.smsChannelList = res.Message;
          } else if (res.Code == ERR_Fail) {
            this.smsChannelList = [];
          }
        })
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
      //更改短信当前页
      handleChannelPage(value) {
        this.pageChannel = value;
        this.smsChannelRecordList = [];
        this.handleChannel()
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
      //短信数据分页处理
      handleChannel() {
        let pages = this.pageChannel;
        let key = (--(pages)) * this.size;
        for (let i = key; i < (this.size * this.pageChannel); i++) {
          if (this.smsChannelResult[i] != undefined) {
            this.smsChannelRecordList.push(this.smsChannelResult[i]);
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
      //获取产品代号查询结果
      queryProductCodeRecord() {
        this.$store.commit("SET_LOADING", 1)
        let result = FormatObject(this.productCode, this.feature, this.featuresList)
        let formData = {
          beginTime: this.beginTime,
          endTime: this.endTime,
          search: result,
        }
        queryProductCodeRecord(formData).then(res => {
          if (res.Code == ERR_OK) {
            this.proCodeResult = ComputeTotal(res.Message.pnames);
            this.passageResult = ComputeTotal(res.Message.gates);
            this.smsChannelResult = ComputeTotal(res.Message.types);
            this.handleProCode()
            this.handlePassage()
            this.handleChannel()
          } else if (res.Code == ERR_Fail) {
            this.productCodeRecordList = [];
          }
        })
      },
      //获取通道查询结果
      queryPassageRecord() {
        this.$store.commit("SET_LOADING", 1)
        let formData = {
          beginTime: this.beginTime,
          endTime: this.endTime,
          gates: this.passage.toString(),
        }
        queryPassageRecord(formData).then(res => {
          if (res.Code == ERR_OK) {
            this.proCodeResult = ComputeTotal(res.Message.pnames);
            this.passageResult = ComputeTotal(res.Message.gates);
            this.smsChannelResult = ComputeTotal(res.Message.types);
            this.handleProCode()
            this.handlePassage()
            this.handleChannel()
          } else if (res.Code == ERR_Fail) {

            this.passageRecordList = [];
          }
        })
      },
      //获取短信查询结果
      querySmsChannelRecord() {
        this.$store.commit("SET_LOADING", 1)
        let formData = {
          beginTime: this.beginTime,
          endTime: this.endTime,
          types: this.smsChannel.toString(),
        }
        querySmsChannelRecord(formData).then(res => {
          if (res.Code == ERR_OK) {
            this.proCodeResult = ComputeTotal(res.Message.pnames);
            this.passageResult = ComputeTotal(res.Message.gates);
            this.smsChannelResult = ComputeTotal(res.Message.types);
            this.smsErrorResult = res.Message.resultCodes;
            this.handleProCode()
            this.handlePassage()
            this.handleChannel()
            this.handleSmsError()
          } else if (res.Code == ERR_Fail) {

            this.smsChannelRecordList = [];
          }
        })
      },
      //搜索事件
      searchAction() {
        console.log(this.featuresList)
        if ("" === this.datetime[0] && "" === this.datetime[1] || 0 == this.datetime.length)
          return this.$Message.error("请选择日期范围"), !1;
        if (null === this.pattern)
          return this.$Message.error("请选择搜索条件"), !1;

        switch (this.status) {
          case 0:
            if (null === this.productCode || 0 == this.productCode.length)
              return this.$Message.error("请选择搜索条件"), !1;
            break;
          case 1:
            if (null === this.passage || 0 == this.passage.length)
              return this.$Message.error("请选择搜索条件"), !1;
            break;
          case 2:
            if (null === this.smsChannel || 0 == this.smsChannel.length)
              return this.$Message.error("请选择搜索条件"), !1;
            break;
        }
        this.pageProCode = 1;                  //当前页
        this.pagePassage = 1;                  //当前页
        this.pageChannel = 1;                  //当前页
        this.pageSmsError = 1;                 //当前页
        this.proCodeResult = [];               //产品代号中转列表
        this.productCodeRecordList = [];       //产品代号数据结果
        this.passageResult = []                //通道中转列表
        this.passageRecordList = []            //统计通道数据结果
        this.smsChannelResult = [];            //短信中转列表
        this.smsChannelRecordList = [];        //短信数据结果
        this.smsErrorResult = [];              //短信错误信息类型中转列表
        this.smsErrorList = [];                //短信错误信息类型结果
        this.isReset = 1;
        switch (this.status) {
          case 0:
            this.queryProductCodeRecord();
            break;
          case 1:
            this.queryPassageRecord();
            break;
          case 2:
            this.querySmsChannelRecord();
            break;
        }
      },
      //重置搜索条件事件
      resetAction() {
        this.isReset = !1;
        this.datetime = null;
        this.pattern = null;
        this.productCode = null;
        this.proCodeResult = [];               //产品代号中转列表
        this.productCodeRecordList = [];        //统计产品代号数据结果
        this.passageResult = []               //通道中转列表
        this.passageRecordList = []            //统计通道数据结果
        this.smsChannelResult = [];                //短信中转列表
        this.smsChannelRecordList = [];           //短信数据结果
      },
    },
    computed: {},
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '~common/scss/common.scss';

  .recordQuery {
    .action-bar {
      padding-bottom: 30px;

      .action-item {
        margin-bottom: 30px;
        width: 100%;

        > .date-time {
          position: relative;
          padding-left: 60px;

          > .name {
            position: absolute;
            top: 0;
            left: 0;
            line-height: 36px;
          }
        }

        .bar-left {
          float: left;
        }

        .bar-right {
          float: right;
        }
      }
    }
  }

</style>
