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
            <el-checkbox v-model="rememberMe">记住我,下次自动登录</el-checkbox>
            <el-form-item class="form-button-group">
              <el-button type="primary" @click="submitForm">登录</el-button>
              <el-button @click="resetForm">重置</el-button>
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
      },
      rememberMe:false
    }
  },
  methods:{
    submitForm(){
      this.$refs['refLoginForm'].validate(valid => {
        if(valid){
          this.$request('login','post',this.loginForm).then(value => {
            if(value.status === 404){
              return this.$message.error('用户名不存在')
            }
            if(value.status === 403){
              return this.$message.error('密码错误,请重试')
            }
            this.$message.success('登录成功')
            if(this.rememberMe){
              localStorage.setItem('token',value.data.token)
              sessionStorage.setItem('user_info',JSON.stringify(value.data.user))
            }
            sessionStorage.setItem('token',value.data.token)
            sessionStorage.setItem('user_info',JSON.stringify(value.data.user))
            this.$router.push('user')
          }).catch(err => {
            console.log(err)
          })
        }else {
          this.$message.error('请完整填写信息')
        }
      })
    },
    resetForm(){
      this.$refs['refLoginForm'].resetFields()
    }
  },
  created() {
    if(localStorage.getItem('token')){
      this.$request('login/check','post').then(value => {
        console.log(value)
        this.$message.success('自动登录成功,欢迎您')
        this.$router.push('user')

      }).catch(err => {
        console.log(err)
        this.$message.error('token校验失败,请重新登录')
      })
    }
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
.el-form-item{
  margin-bottom: 10px;
}
.el-checkbox{
  margin-top: 10px;
  margin-bottom: 15px;
}
</style>
