<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <el-form
        label-width="0px"
        class="login-form"
        :model="loginform"
        :rules="loginformrules"
        ref="loginFormref"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-renbudaiwaiquan"
            v-model="loginform.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-mima"
            v-model="loginform.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginform">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录的用户名和密码
      loginform: {
        username: "admin",
        password: "123456",
      },
      // 登录的校验
      loginformrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 表单重置
    resetLoginform() {
      this.$refs.loginFormref.resetFields();
    },
    login() {
      this.$refs.loginFormref.validate(async (valid) => {
        if (!valid) return;
        const res = await this.$http.post("login", this.loginform);
        if (res.data.meta.status !== 200) {
          this.$message.error("登录失败");
        } else {
          this.$message.success("登录成功");

          sessionStorage.setItem("token", res.data.data.token);
          this.$router.push("/home");
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.login-container {
  background-color: #2b4d6d;
  height: 100%;
}
.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar-box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login-form {
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  box-sizing: border-box;
  width: 100%;
}
</style>