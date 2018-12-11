<template>
  <div class="recordBoard">
    <h1 class="page-title">数据看板</h1>
    <div class="action-bar">
      <div class="bar-left">
        <RadioGroup type="button" v-model="dateTime" @on-change="changeAction">
          <Radio label="0">今日发送</Radio>
          <Radio label="1">昨日</Radio>
          <Radio label="2">本月</Radio>
        </RadioGroup>
      </div>
    </div>

    <div>
      <!--列表-->
      <Table stripe border :columns="columnsList" :data="recordBoardList" align="center"></Table>

    </div>

  </div>
</template>

<script>
  import {queryRecordBoard} from "../../server/commonServices";
  import {ERR_Fail, ERR_OK} from "../../server/configServices";
  import {MonthEnd, MonthStart, TodayEnd, TodayStart, YesterDayEnd, YesterDayStart} from "common/js/filters";

  export default {
    name: "recordBoard",
    data() {
      return {
        dateTime: '0',
        beginTime: '',
        endTime: '',
        columnsList: [
          {
            title: "通道",
            align: 'center',
            key: "gate"
          },
          {
            title: "发送总数",
            align: 'center',
            key: "total"
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
            title: "失败率",
            align: 'center',
            key: "rates"
          },
        ],
        recordBoardList: [],
        formData: {},   //参数
      }
    },
    mounted: function () {
      this.changeAction();
    },
    methods: {
      changeAction() {
        switch (this.dateTime) {
          case '0':
            this.beginTime = TodayStart();
            this.endTime = TodayEnd();
            this.queryRecordBoard();
            break;
          case '1':
            this.beginTime = YesterDayStart();
            this.endTime = YesterDayEnd();
            this.queryRecordBoard();
            break;
          case '2':
            this.beginTime = MonthStart();
            this.endTime = MonthEnd();
            this.queryRecordBoard();
            break;
        }
      },
      queryRecordBoard() {
        this.$store.commit("SET_LOADING", 1)
        this.formData = {
          beginTime: this.beginTime,
          endTime: this.endTime
        }
        queryRecordBoard(this.formData).then(res => {
          if (res.Code == ERR_OK) {
            this.recordBoardList = res.Message;
          } else if (res.Code == ERR_Fail) {
            this.recordBoardList = [];
          }
        })
      },
    },

  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .recordBoard {
    > .action-bar {
      margin-bottom: 30px;
      width: 100%;
    }
  }
</style>
