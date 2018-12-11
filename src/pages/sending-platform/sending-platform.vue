<template>
  <div class="sendingPlatform">
    <h1 class="page-title">发送平台</h1>
    <Form ref="platformForm" :model="platformForm" :rules="ruleValidate" label-position="left" :label-width="100">
      <FormItem label="通道" prop="animal">
        <Select v-model="platformForm.animal" size="large" @on-change="changeAction">
          <Option v-for="item in animalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="电话号码" prop="phone">
        <Input type="text" v-model="platformForm.phone" size="large" clearable placeholder="请输入"
               autocomplete="off"></Input>
      </FormItem>
      <FormItem label="短信内容" prop="content">
        <Input type="textarea" :autosize="{minRows: 5,maxRows: 10}" v-model="platformForm.content" size="large"
               clearable
               placeholder="请输入"
               autocomplete="off"></Input>
      </FormItem>
      <FormItem label="子码" prop="subcode">
        <Input type="text" v-model="platformForm.subcode" size="large" clearable placeholder="请输入"
               autocomplete="off" @keyup.enter.native="handleSubmit('platformForm')"></Input>
      </FormItem>
      <FormItem label="尾号" prop="tailNumber">
        <Input type="text" v-model="platformForm.tailNumber" size="large" clearable placeholder="请输入"
               autocomplete="off" @keyup.enter.native="handleSubmit('platformForm')"></Input>
      </FormItem>
      <FormItem class="btn-group">
        <Button size="large" icon="md-checkmark" type="primary" @click="handleSubmit('platformForm')">发送</Button>
        <Button size="large" icon="md-refresh" @click="handleReset('platformForm')" style="margin-left: 8px">重置
        </Button>
      </FormItem>
    </Form>
    <!--询问框-->
    <div>
      <Modal v-model="quizModal" @on-ok="submitAction" width="300">
        <p>你确定要发送本条信息吗？</p>
      </Modal>
    </div>
    <!--结果框-->
    <div>
      <Modal v-model="resultModal" title="发送成功" class="result-box">
        <ul class="field-list" v-for="item in resultList" :key="item.smID">
          <li class="list-item">
            <span class="filed-name">编号：</span>
            <span class="filed-content">{{item.smID}}</span>
          </li>
          <li class="list-item">
            <span class="filed-name">手机号码：</span>
            <span class="filed-content">{{item.telnumber}}</span>
          </li>
        </ul>
      </Modal>
    </div>
  </div>

</template>

<script>
  import iView from 'iview';
  import {sendPlatform} from "../../server/commonServices";
  import {ERR_OK} from "../../server/configServices";

  export default {
    name: "sendingPlatform",
    data() {
      const validateAnimal = (rule, value, callback) => {
        if (value == null || value === "" || typeof (value) == "undefined") {
          callback(new Error("请选择通道"));
        } else {
          callback();
        }
      };
      const validatePhone = (rule, value, callback) => {
        if (value == null || value === "" || typeof (value) == "undefined") {
          callback(new Error("请输入手机号码"));
        } else if (!(/^1[34578]\d{9}$/.test(value))) {
          callback(new Error("请输入正确的手机号码"));
        } else {
          callback();
        }
      };
      const validateContent = (rule, value, callback) => {
        if (value == null || value === "" || typeof (value) == "undefined") {
          callback(new Error("请输入短信内容"));
        } else {
          callback();
        }
      };
      const validateSubcode = (rule, value, callback) => {
        if (value == null || value === "" || typeof (value) == "undefined") {
          callback(new Error("请输入子码"));
        } else {
          callback();
        }
      };
      return {
        platformForm: {
          animal: "",
          // areaCode: "",
          phone: "",
          content: "",
          subcode: "",
          tailNumber: ""
        },
        animalList: [
          {
            value: '200',
            label: '200生产短信'
          },
          {
            value: '201',
            label: '201生产短信'
          },
          {
            value: '300',
            label: '300验证码短信'
          },
          {
            value: '310',
            label: '310营销短信'
          },
          {
            value: '320',
            label: '320语音短信'
          },
          {
            value: '420',
            label: '420语音短信'
          },
          {
            value: '530',
            label: '530国际短信'
          },
          {
            value: '600',
            label: '600验证码短信'
          },
          {
            value: '610',
            label: '610营销短信'
          },
          {
            value: '630',
            label: '630国际短信'
          },
          {
            value: '800',
            label: '800台湾验证码短信'
          },
          {
            value: '810',
            label: '810台湾营销短信'
          },
        ],
        ruleValidate: {
          animal: [
            {trigger: 'change', validator: validateAnimal}
          ],
          phone: [
            {trigger: 'blur', validator: validatePhone}
          ],
          content: [
            {trigger: 'blur', validator: validateContent}
          ],
          subcode: [
            {trigger: 'blur', validator: validateSubcode}
          ],
          tailNumber: [
            {trigger: 'blur',}
          ]
        },
        quizModal: false, //询问是否发送模态框
        resultModal: false,  //接口返回成功数据
        formdata: {},
        phoneArr: [],     //手机号码数组存储
        resultList: null,
      }
    },
    methods: {
      changeAction(e) {
        this.platformForm.animal = e;
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.quizModal = true;
            this.phoneArr[0] = this.platformForm.phone;
          }
        })
      },
      submitAction() {
        this.$store.commit("SET_LOADING", 1)
        this.formdata = {
          gate: this.platformForm.animal,
          telnumbers: this.phoneArr,
          message: this.platformForm.content,
          chaid: this.platformForm.subcode,
          port: this.platformForm.tailNumber,
        }
        sendPlatform(this.formdata).then(res => {
          if (res.Code === ERR_OK) {
            this.resultList = res.Message;
            iView.Message.info("发送成功");
            this.resultModal = true;
          } else {
            iView.Message.error("发送失败，请重试")
          }
        })
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .sendingPlatform {
    > form {
      padding-top: 15px;

      .btn-group {
        text-align: center;
      }
    }
  }

  .result-box {
    .field-list {
      list-style: none;
      padding-bottom: 15px;

      > .list-item {
        font-size: 13px;
        line-height: 25px;

        > .filed-name {
          display: inline-block;
          width: 80px;
          color: #888;
        }
      }
    }
  }

</style>
