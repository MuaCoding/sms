<template>
  <div class="root">
    <div>
      <div class="login-panel">
        <h1>管理平台登录</h1>
        <Form ref="loginForm" :model="loginForm" :rules="loginRules">
          <FormItem prop="username">
            <Input type="text" v-model="loginForm.username" size="large" clearable placeholder="请输入用户名"
                   autocomplete="on"></Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="loginForm.password" size="large" clearable placeholder="请输入密码"
                   autocomplete="on" @keyup.enter.native="handleSubmit('loginForm')"></Input>
          </FormItem>
          <FormItem class="btn-group">
            <Button size="large" icon="md-checkmark" type="primary" @click="handleSubmit('loginForm')">登录</Button>
            <Button size="large" icon="md-refresh" @click="handleReset('loginForm')" style="margin-left: 8px">重置
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
  import {loginAction} from "../../server/commonServices";
  import {ERR_OK} from "../../server/configServices";
  import Fingerprint from "fingerprintjs";
  import md5 from "md5";

  export default {
    name: "login",
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请填写用户名"));
        } else {
          callback();
        }
      };
      const validatePassword = (rule, value, callback) => {
        let pattern = /^\S{1,20}$/g;
        if (value === "") {
          callback(new Error("请填写密码"));
        } else if (!pattern.test(value)) {
          callback(new Error("请输入1-20个非空白字符"));
        } else {
          callback();
        }
      };
      return {
        loginForm: {
          username: "etxin",
          password: "a"
        },
        loginRules: {
          username: [
            {required: true, trigger: "blur", validator: validateUsername}
          ],
          password: [
            {required: true, trigger: "blur", validator: validatePassword}
          ]
        }
      };
    },
    mounted() {
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            let formdata = {
              account: this.loginForm.username,
              password: this.loginForm.password
            };
            loginAction(formdata)
              .then(res => {
                if (res.Code === ERR_OK) {
                  this.$Message.success("登录成功");
                  this.$store.commit("USERNAME", this.loginForm.username);
                  // this.$store.commit(types.EXP, res.data.exp);
                  this.$router.push({
                    path: "/app/recordBoard"
                  });
                }
              })
          }
        });
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      }
    }
  };
</script>


<style scoped lang="scss" rel="stylesheet/scss">
  .login-panel {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 400px;
    padding: 25px 40px 15px 40px;
    background-color: #ffffff;
    border-radius: 2px;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
    transform: translate(-50%, -80%);

    > h1 {
      line-height: 50px;
      text-align: center;
    }

    > form {
      padding-top: 15px;

      .btn-group {
        text-align: center;
      }
    }
  }
</style>
