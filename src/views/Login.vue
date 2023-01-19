<template>
  <div id="login">
    <el-card class="form-window" shadow="hover">
      <el-row>
        <el-col :span="12">
          <img src="../assets/image/asidePicture.png" width="400">
        </el-col>
        <el-col :span="12" class="formContainer">
          <h3>
            LOGO和系统名称
          </h3>
          <el-form :model="loginForm" :rules="rules" ref="refLoginForm"
                   label-width="100px" label-position="top" class="login-form">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="loginForm.password"></el-input>
            </el-form-item>
            <el-form-item class="form-button-group">
              <el-button type="primary">登录</el-button>
              <el-button>重置</el-button>
              <el-button type="info">忘记密码</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm:{
        username:'',
        password:''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      }
    }
  },
  methods:{

  }
}
</script>

<style lang="less" scoped>
#login{
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}
.form-window{
  height: 500px;
  width: 800px;
  min-width: 800px;
  margin: 0 auto;
}
.formContainer{
  padding: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.login-form{
  margin-top: 100px;
  width: 300px;
}
.form-button-group{
  padding-top: 20px;
}
.el-button{
  margin-right: 10px !important;
}
.el-form-item__content{
  display: flex;
}
</style>
