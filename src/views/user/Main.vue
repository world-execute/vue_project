<template>
  <div class="user-main">
    <el-row>
      <el-col :span="10" style="min-width: 650px">
        <!--用户卡片-->
        <el-card class="user-card">
          <el-row>
            <el-col :span="3" style="margin-right: 10px">
              <el-avatar :src="userinfo.avatar || 'http://localhost:8080/avatar/default.png'" shape="square"
                         :size="70" style="border: #bfc3cb 2px solid"></el-avatar>
            </el-col>
            <el-col :span="13" style="line-height: 70px; font-size: 23px;letter-spacing: 4px; font-weight: bolder">
              {{userinfo.real_name || userinfo.username}}<span style="font-size: 20px;margin-left: 20px; color:#409EFF">欢迎您</span>
            </el-col>
            <el-col :span="7" style="line-height: 70px">
              <el-button type="success" size="small" round @click="changeUserDialogVisible = true">修改信息</el-button>
              <el-button type="danger" size="small" round @click="loginOut">退出登录</el-button>
            </el-col>
          </el-row>
          <!--用户描述-->
          <el-row style="margin-top: 30px">
            <el-descriptions class="margin-top" :column="2" border>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-user"></i>
                  用户名
                </template>
                {{userinfo.username}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-mobile-phone"></i>
                  手机号
                </template>
                {{userinfo.phone || '暂无'}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-turn-off"></i>
                  是否有效
                </template>
                <el-tag v-if="userinfo.is_delete" type="danger">无效</el-tag>
                <el-tag v-if="!userinfo.is_delete" type="success">有效</el-tag>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-date"></i>
                  注册时间
                </template>
                {{userinfo.create_time | transformUtc}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-office-building"></i>
                  联系地址
                </template>
                {{userinfo.address || '暂无'}}
              </el-descriptions-item>
            </el-descriptions>
          </el-row>
          <!--用户配额-->
          <el-row style="margin-top: 20px">
            <el-col>
              <span>您的配额</span>
              <span style="color: #409EFF;margin-left: 20px;letter-spacing: 2px">{{userinfo.ration + '/' + '100'}}</span>
            </el-col>
            <el-col style="margin-top: 10px">
              <el-progress :text-inside="true" :stroke-width="20" :percentage="userinfo.ration"></el-progress>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="operationWindow">
          <el-tabs type="border-card">
            <el-tab-pane label="物资申请">

            </el-tab-pane>
            <el-tab-pane label="配额申请">

            </el-tab-pane>
            <el-tab-pane label="历史申请列表">角色管理</el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <el-col :span="14" style="min-width: 800px">
        <!--物资信息展示-->
        <el-card class="material-info-card">
          <el-button></el-button>
        </el-card>
      </el-col>
    </el-row>
    <!--修改用户信息的对话框-->
    <el-dialog
        title="修改信息"
        :visible.sync="changeUserDialogVisible"
        :before-close="changeUserDialogBeforeClose"
        width="400px"
        >
      <el-row :gutter="20" style="margin-left: 20px">
        <el-col :span="8">
          <!--上传新头像图片-->
          <span class="span-label">上传新头像</span>
          <el-upload
              class="avatar-uploader"
              action="http://localhost:8080/api/upload"
              :headers="token"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :before-upload="beforeUpload"
          >
            <img v-if="changeUserForm.avatar" :src="changeUserForm.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
        <el-col :span="16">
          <span class="span-label">预览</span>
          <div style="height: 100px;float: left;display: flex;flex-direction: column;justify-content: center">
            <el-avatar shape="square" :size="70" :src="changeUserForm.avatar || 'http://localhost:8080/avatar/default.png'"></el-avatar>
            <span class="span-label" style="text-align: center">中</span>
          </div>
          <div style="float: left;display: flex;flex-direction: column;justify-content: center;margin-left: 10px">
            <el-avatar shape="square" :size="50" :src="changeUserForm.avatar || 'http://localhost:8080/avatar/default.png'"></el-avatar>
            <span class="span-label" style="text-align: center">小</span>
          </div>
        </el-col>
      </el-row>
      <!--修改用户信息表单-->
      <el-form :model="changeUserForm" :rules="changeUserFormRule" ref="changeUserForm"
               label-width="70px" style="margin-top: 20px;width: 85%">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="changeUserForm.username" :placeholder="userinfo.username"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="real_name">
          <el-input v-model="changeUserForm.real_name" :placeholder="userinfo.real_name"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="changeUserForm.phone" :placeholder="userinfo.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="changeUserForm.password"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Main",
  data() {
     let sameNameChick = async (rule, value, callback) => {
       const {data} = await this.$request('user','get',{username:value})
       console.log(data.result.length)
       if(data.result.length !== 0){
         return callback(new Error('用户名已被占用'))
       }
       return callback()
     }
    return {
      token:{},
      userinfo: {},
      // 用户信息修改对话框
      changeUserDialogVisible:false,
      // 用户修改信息表单
      changeUserForm:{
        username:'',
        password:'',
        avatar:'',
        phone:'',
        real_name:''
      },
      changeUserFormRule:{
        username:[
          { pattern: /^[A-Za-z]+$/, message:'只支持英文字母的用户名', trigger:'blur'},
          { validator:sameNameChick, trigger: 'blur'}
        ],
        real_name:[
            { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' },
            { pattern: /[\u4e00-\u9fa5]/g, message: '只支持中文姓名', trigger:'blur'}
        ],
        phone:{ pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger:'blur'}
      }
    }
  },
  methods:{
    // 退出登录
    loginOut(){
      this.$confirm('确认退出吗,退出后需要重新登录','登出',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(() => {
        sessionStorage.removeItem('user_info')
        sessionStorage.removeItem('token')
        localStorage.removeItem('user_info')
        localStorage.removeItem('token')
        this.$router.push('/login')
        this.$message.success('登出成功')
      }).catch(() => {
        this.$message.info('取消登录')
      })
    },
    // 头像上传前
    beforeUpload(file){
      // 检查文件大小和后缀
      if(file.size > 4*1024*1024){
        this.$message.error('头像文件大小大于4M')
        return false
      }
      const fileType = file.name.substring(file.name.lastIndexOf('.')+1)
      console.log(fileType)
      if(fileType !== 'jpg' && fileType !== 'png'){
        this.$message.error('头像文件格式只支持jpg,png')
        return false
      }
    },
    // 头像上传成功
    uploadSuccess(res){
      console.log(res)
      this.changeUserForm.avatar = res.data.imageUrl
      this.$message.success('头像上传成功')
    },
    // 头像上传失败
    uploadError(err){
      this.$message.error('头像上传失败')
    },
    // 修改信息对话框关闭前
    changeUserDialogBeforeClose(done){
      this.$confirm('用户信息还未保存, 是否退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        for ( let key in this.changeUserForm) {
          this.changeUserForm[key] = ''
        }
        done()
      }).catch(() => {
        return
      });
    },
    // 修改用户信息
    changeUserInfo(){
      this.$request(`/user/${this.userinfo._id}`,'put',this.changeUserForm).then(value => {
        console.log(value)
        this.$message.success('修改用户成功')
        this.userinfo = value.data
        this.changeUserDialogVisible = false
      }).catch(reason => {
        this.$message.error('修改用户信息失败')
      })
    }
  },
  created() {
    const user_id = sessionStorage.getItem('user_id') || localStorage.getItem('user_id')
    this.$request(`user/${user_id}`,'get').then(result => {
      this.userinfo = result.data
    })
    this.token.Authorization = sessionStorage.getItem('token') || localStorage.getItem('token')
  },
  filters:{
  }
}
</script>

<style scoped>
.user-main{
  height: 100%;
}
.user-card{
  width: 90%;
  height: 330px;
  margin: 20px;
  padding: 20px;
}
.material-info-card{
  width: 90%;
  margin: 20px;
  padding: 20px;
}
.operationWindow{
  width: 90%;
  margin: 20px;
  padding: 20px;
}
.avatar-uploader{
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 28px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.span-label{
  display: block;
  margin-bottom: 10px;
}
.dialog-footer{
  margin-right: 20px;
}
</style>
