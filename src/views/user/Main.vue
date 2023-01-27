<template>
  <div class="user-main">
    <el-row>
      <el-col :span="12">
        <!--用户卡片-->
        <el-card class="user-card">
          <el-row>
            <el-col :span="4" style="margin-left: 10px">
              <el-avatar src="https://s1.ax1x.com/2023/01/22/pSJA5Sx.png"
                         fit="none" :size="70"></el-avatar>
            </el-col>
            <el-col :span="12" style="line-height: 70px; font-size: 23px;letter-spacing: 4px; font-weight: bolder">
              {{userinfo.real_name || userinfo.username}}<span style="margin-left: 20px; color:#409EFF">欢迎您</span>
            </el-col>
            <el-col :span="7" style="line-height: 70px">
              <el-button type="success" size="small" round>修改信息</el-button>
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
                  <i class="el-icon-tickets"></i>
                  用户组
                </template>
                <el-tag>业主</el-tag>
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
          <router-view></router-view>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      userinfo: {}
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

  },
  created() {
    const userinfo = JSON.parse(sessionStorage.getItem('user_info')
        || localStorage.getItem('user_info'))
    this.userinfo = {...userinfo}
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
  width: 600px;
  height: 330px;
  margin: 20px;
  padding: 20px;
}
.operationWindow{
  width: 600px;
  height: 450px;
  margin: 20px;
  padding: 20px;
}
</style>
