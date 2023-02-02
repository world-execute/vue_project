<template>
  <!--我是不想写注释的,毕业设计罢了,但是后面自己改起来也好麻烦,还是加上吧-->
  <div id="login">
    <!--登录面板-->
    <el-card class="form-window" v-show="!lostPwdVisible" shadow="hover">
        <el-row>
          <!--用户的侧边栏图片-->
          <el-col :span="employeeLogin?0:12">
            <img src="../assets/image/asideRight.png" width="400">
          </el-col>
          <!--登录用菜单-->
          <el-col :span="12" class="formContainer">
            <el-row class="head">
              <el-col :span="6">
                <img src="../assets/logo.png" width="50">
              </el-col>
              <el-col :span="18">
                <h3>疫情物资分配管理系统</h3>
              </el-col>
            </el-row>
            <!--登录表单-->
            <el-form :model="loginForm" :rules="rules" ref="refLoginForm"
                     label-width="100px" label-position="top" class="login-form">
              <el-form-item label="用户名" prop="username">
                <el-input prefix-icon="iconfont icon-yonghutianchong" v-model="loginForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input prefix-icon="iconfont icon-mima" v-model="loginForm.password" type="password"></el-input>
              </el-form-item>
              <el-switch
                  v-show="!employeeLogin"
                  style="margin-top: 15px"
                  v-model="rememberMe"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="记住我,下次自动登录">
              </el-switch>
              <el-form-item class="form-button-group">
                <el-button type="primary" @click="submitForm">登录</el-button>
                <el-button @click="resetForm">重置</el-button>
                <el-button v-show="!employeeLogin" type="info" @click="lostPwdVisible=!lostPwdVisible">忘记密码</el-button>
              </el-form-item>
            </el-form>
            <!--切换至其他功能-->
            <el-row style="width: 80%">
              <el-col :span="12">
                <el-link type="primary" v-show="!employeeLogin">用户注册</el-link>
              </el-col>
              <el-col :span="12">
                <el-link type="success" @click="changeLogin">{{employeeLogin?'用户登录入口':'员工登录入口'}}</el-link>
              </el-col>
            </el-row>
          </el-col>
          <!--员工侧边栏图片-->
          <el-col :span="employeeLogin?12:0">
            <img src="../assets/image/asideLeft.png" width="400">
          </el-col>
        </el-row>
      </el-card>
    <!--忘记密码面板-->
    <el-card class="lost-pwd-window" v-show="lostPwdVisible">
      <el-row>
        <el-col :span="23">
          <span style="font-size: 20px">用户恢复密码</span>
        </el-col>
        <el-col :span="1">
          <i class="el-icon-close"
             onmouseover="this.style.color='#409EFF'"
             onmouseout="this.style.color='#000000'"
             @click="lostPwdVisible=false"
          ></i>
        </el-col>
      </el-row>
      <!--输入手机号码-->
      <el-form :model="verifyForm" :rules="verifyFormRule" ref="verifyForm"
               label-width="90px" style="width: 100%;margin-top: 50px">
        <!--你应该很好奇为什么使用 recipient(接受器) 而不是使用 phone(手机号码),-->
        <!--因为在设计开始密码找回是支持邮箱号码和手机号码的,只是为了和数据库对齐-->
        <el-form-item label="手机号码" prop="recipient">
          <el-row>
            <el-col :span="15">
              <el-input v-model="verifyForm.recipient"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button style="margin-left: 10px" @click="showVerify">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <!--输入新密码和验证码-->
      <el-form :model="lostPwdForm" :rules="lostPwdFormRule" ref="lostPwdForm"
               label-width="90px" style="width: 100%">
        <el-form-item label="验证码" prop="code">
          <el-row>
            <el-col :span="15">
              <el-input v-model="lostPwdForm.code" :disabled="changePassLock"
              @blur="verifyCode"></el-input>
            </el-col>
            <el-col :span="8" v-show="verifyResult==='1'">
              <i class="el-icon-success" style="font-size: 20px;margin-left: 10px;color:#67C23A "></i>
              <span style="font-size: 13px;margin-left: 10px">验证码正确</span>
            </el-col>
            <el-col :span="8" v-show="verifyResult==='-1'">
              <i class="el-icon-error" style="font-size: 20px;margin-left: 10px;color:#F56C6C "></i>
              <span style="font-size: 13px;margin-left: 10px">验证码错误</span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-row>
            <el-col :span="15">
              <el-input v-model="lostPwdForm.password" :disabled="changePassLock" type="password"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="重复密码" prop="re_password">
          <el-row>
            <el-col :span="15">
              <el-input v-model="lostPwdForm.re_password" :disabled="changePassLock" type="password"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button style="margin-left: 10px" type="primary" :disabled="changePassLock" @click="changePass">修改密码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-card>
    <!--滑动验证的dialog-->
    <el-dialog
        title="滑动验证"
        :visible.sync="verifyVisible"
        width="390px"
        top="30vh">
      <!--滑动验证控件-->
      <slide-verify :l="42"
                    :r="10"
                    :w="350"
                    :h="155"
                    slider-text="向右滑动"
                    :imgs="verifyImage"
                    @success="verifySuccess"
                    @fail="verifyError"
      ></slide-verify>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    let validationPass = (rule,value,callback) => {
      if(value !== this.lostPwdForm.password){
        callback(new Error('两次输入的密码不一致'))
      }
      callback()
    }
    return {
      // 登录表单数据绑定
      loginForm:{
        username:'',
        password:''
      },
      // 左右边栏显示隐藏控制
      aside: {
        left:12,
        right:0
      },
      // 表单验证
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      },
      // 是否启动记住密码的功能
      rememberMe:false,
      // 切换至工作人员登录
      employeeLogin:false,

      // 忘记密码面板显示
      lostPwdVisible:false,
      // 验证码表单
      verifyForm:{
        recipient:''
      },
      verifyFormRule:{
        recipient: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger:'blur'}
        ]
      },
      // 忘记密码表单
      lostPwdForm: {
        password:'',
        re_password:'',
        code:''
      },
      lostPwdFormRule:{

        code: { required: true, message: '请输入验证码', trigger: 'blur' },
        password: { required: true, message: '请输入新密码', trigger: 'blur' },
        re_password: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator:validationPass, trigger: 'blur' }
        ]
      },
      // 验证码发送前锁死后部分
      changePassLock:true,
      // 验证结果
      verifyResult:'0',
      // 滑动验证对话框显示
      verifyVisible:false,
      // 滑动验证图片url
      verifyImage:[
        'http://localhost:8080/verifyImage/v01.jpg',
        'http://localhost:8080/verifyImage/v02.jpg',
        'http://localhost:8080/verifyImage/v03.jpg',
        'http://localhost:8080/verifyImage/v04.jpg',
      ]
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
              sessionStorage.setItem('user_id',value.data.user._id)
            }
            sessionStorage.setItem('token',value.data.token)
            sessionStorage.setItem('user_id',value.data.user._id)
            this.$router.push('user')
          }).catch(err => {
            this.$message.error('请求失败,请稍后再试')
          })
        }else {
          this.$message.error('请完整填写信息')
        }
      })
    },
    resetForm(){
      this.$refs['refLoginForm'].resetFields()
    },
    changeLogin(){
      this.employeeLogin = !this.employeeLogin
    },
    // 忘记密码功能区
    showVerify(){
      this.$refs['verifyForm'].validate(valid => {
        if(valid){
          this.verifyVisible = true
        }
      })
    },
    // 滑动验证事件
    verifySuccess(){
      this.verifyVisible = false
      this.$request('lost-pwd/send','post',this.verifyForm).then(value => {
        console.log(value)
        if(value.status === 404){
          return this.$message.error('该手机号不存在')
        }
        if(value.status === 200){
          this.changePassLock = false
          window.sessionStorage.setItem('user_id',value.data.user_id)
          return this.$message.success('验证码发送成功!')
        }
        this.$message.error('验证码发送失败,请重试')
      })
    },
    verifyError(){
      this.$message.error('滑动验证失败')
    },
    verifyCode(){
      this.$request('lost-pwd/check','post',{
        recipient:this.verifyForm.recipient,
        code:this.lostPwdForm.code
      }).then(value => {
        if(value.data.auth){
          window.sessionStorage.setItem('user_id',value.data.user_id)
          this.verifyResult='1'
        }else {
          this.verifyResult='-1'
        }
      })
    },
    changePass(){
      this.$refs['lostPwdForm'].validate(valid => {
        if(valid){
          this.$request('lost-pwd/change','post',{
            id:window.sessionStorage.getItem('user_id'),
            password:this.lostPwdForm.password
          }).then(value => {
            if(value.status === 201){
              this.$message.success('密码修改成功')
              this.loginForm.username = value.data.username
              this.lostPwdVisible = false
            }else {
              this.$message.error('密码修改失败,请重试')
            }
          })
        }
      })
    }
  },
  created() {
    if(localStorage.getItem('token')){
      this.$request('login/check','post').then(value => {
        console.log(value)
        this.$message.success('自动登录成功,欢迎您')
        sessionStorage.setItem('user_info',JSON.stringify(value.data))
        this.$router.push('/user')

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
  height: 520px;
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
  margin-top: 40px;
  width: 300px;
}
.head{
  margin-top: 20px;
  width: 80%;
  .el-col h3{
    height: 50px;
    line-height: 50px;
  }
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
  margin-bottom: 20px;
}
.el-checkbox{
  margin-top: 10px;
  margin-bottom: 15px;
}
.el-form-item__label{
  padding: 0;
}
.lost-pwd-window{
  height: 350px;
  width: 450px;
  min-width: 450px;
  margin: 0 auto;
  padding: 20px;
}
</style>
