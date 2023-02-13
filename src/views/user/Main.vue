<template>
  <div class="user-main">
    <el-row :gutter="10" style="min-width: 1700px">
      <!--左侧用户信息和操作栏-->
      <el-col :span="8" style="">
        <!--用户卡片-->
        <el-card class="user-card">
          <el-row>
            <el-col :span="3" style="margin-right: 10px">
              <el-avatar :src="userinfo.avatar || 'http://localhost:8080/avatar/default.png'" shape="square"
                         :size="70" style="border: #bfc3cb 2px solid"></el-avatar>
            </el-col>
            <el-col :span="12" style="line-height: 70px; font-size: 23px;letter-spacing: 4px; font-weight: bolder">
              {{userinfo.real_name || userinfo.username}}<span style="font-size: 20px;margin-left: 20px; color:#409EFF">欢迎您</span>
            </el-col>
            <el-col :span="8" style="line-height: 70px">
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
              <el-progress :text-inside="true"
                           :stroke-width="20"
                           :color="userProgress"
                           :percentage="userinfo.ration"
                           text-color="#ffffff"
              ></el-progress>
            </el-col>
          </el-row>
        </el-card>
        <!--用户操作卡片-->
        <el-card class="operationWindow">
          <el-tabs type="border-card" v-model='tabIndex' @tab-click="tabClickHandler">
            <el-tab-pane label="物资申请">
              <el-row>
                <el-col :span="18" style="max-height: 32px">
                  <el-row>
                    <el-col :span="8">
                      <div style="margin-top: 5px">
                        <span>所需配额</span>
                        <span style="margin-left: 10px;margin-right: 10px;font-weight: bolder;color:#409dfd;">
                        {{totalPrice}}
                      </span>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <el-tag type="danger" v-show="enoughQuota">
                        <i class="el-icon-warning-outline"></i>
                        所需配额已大于您现有的配额
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="4">
                  <el-button type="primary" size="small"
                             :disabled="enoughQuota || selectMaterial.length===0"
                             @click="uploadMaterial"
                  >
                    发送物资申请
                  </el-button>
                </el-col>
              </el-row>
              <el-table
                  border
                  :data="selectMaterial"
                  style="width: 100%;margin-top: 10px">
                <el-table-column
                    prop="name"
                    label="物资名称">
                </el-table-column>
                <el-table-column
                    prop="price"
                    label="物资单价"
                    width="100"
                >
                </el-table-column>
                  <el-table-column
                      prop="charge_unit"
                      label="单位"
                      align="center"
                      width="60"
                  >
                </el-table-column>
                <el-table-column
                    label="需求数量"
                    align="center"
                    width="140">
                  <template slot-scope="scope">
                    <el-input-number v-model="scope.row.quantity" :step="1"
                                     size="mini" step-strictly
                                     style="width: 100px;"
                                     :min="0"
                    >
                    </el-input-number>
                  </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="100"
                    align="center"
                >
                  <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" circle
                               size="small"
                               @click="delMaterial(scope.row)"
                    >
                    </el-button>
                    <el-button type="warning" icon="el-icon-star-off" circle
                               size="small"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="物资申请记录">
              <el-table
                :data="distributionInfo.distributionList"
                style="width: 100%;"
                stripe
                border
              >
                <el-table-column
                    label="详情"
                    type="expand"
                    width="60"
                >
                  <template slot-scope="{row}">
                    <div  style="padding: 10px">
                      <el-descriptions :column="2" border>
                        <el-descriptions-item label="业主真实姓名">{{row.user_id.real_name}}</el-descriptions-item>
                        <el-descriptions-item label="手机号">{{row.user_id.phone}}</el-descriptions-item>
                        <template v-if="row.employee_id">
                          <el-descriptions-item label="业务员姓名">{{row.employee_id.real_name}}</el-descriptions-item>
                          <el-descriptions-item label="业务员手机号码">{{row.employee_id.phone}}</el-descriptions-item>
                        </template>
                        <el-descriptions-item label="本次配送所需配额">
                          <span style="color:#409cfb;font-weight: bolder">
                            {{row.ration}}
                          </span>
                        </el-descriptions-item>
                        <el-descriptions-item label="详细时间">{{row.create_time | transformUtc}}</el-descriptions-item>
                      </el-descriptions>
                      <el-descriptions title="物资信息" direction="vertical" :column="4" border style="margin-top: 10px">
                        <template v-for="item in row.supplies_info">
                          <el-descriptions-item label="物资名称">{{item.name}}</el-descriptions-item>
                          <el-descriptions-item label="单位">{{item.charge_unit}}</el-descriptions-item>
                          <el-descriptions-item label="数量">{{item.quantity}}</el-descriptions-item>
                          <el-descriptions-item label="物资所需配额">{{item.price}}</el-descriptions-item>
                        </template>
                      </el-descriptions>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="创建时间"
                >
                  <template slot-scope="{row}">
                    {{row.create_time | transformUtc('YYYY-MM-DD')}}
                  </template>
                </el-table-column>
                <el-table-column
                    label="审核结果"
                >
                  <template slot-scope="{row}">

                    <el-tag v-if="!row.is_accept && row.status === 0"
                            effect="dark" type="info">
                      审核中,请耐心等待
                    </el-tag>
                    <el-tag v-else-if="!row.is_accept"
                            effect="dark" type="danger">
                      未通过审核
                    </el-tag>
                    <el-tag v-else
                            effect="dark" type="success">
                      审核已通过
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                    label="配送状态"
                    align="center"
                >
                  <template slot-scope="{row}">
                    <el-tag>{{row.status | distributionStatus}}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="配额申请">
              <!--TODO 配额申请开发ing-->
            </el-tab-pane>
            <el-tab-pane label="配额申请记录">

            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <!--中间物资信息展示栏-->
      <el-col :span="9" style="">
        <!--物资信息展示-->
        <el-card class="material-info-card">
          <!--物资信息顶部操作栏-->
          <el-row style="margin-bottom: 10px" :gutter="10">
            <el-col :span="9">
              <el-input placeholder="物资名称" clearable v-model="materParam.search" @clear="getMaterialInfo">
                <template slot="append">
                  <el-button slot="append" icon="el-icon-search" type="primary"
                             @click="getMaterialInfo">查询</el-button>
                </template>
              </el-input>
            </el-col>
            <el-col :span="7">
              <el-cascader :options="cateInfo" :props="cascadeParams"  placeholder="物资分类"
                           :show-all-levels='false' clearable v-model="materParam.type"
                           @change="getMaterialInfo"
              ></el-cascader>
            </el-col>
          </el-row>
          <!--物资信息表格-->
          <el-table
              border
              stripe
            :data="materialInfo.data">
            <el-table-column
              prop="name"
              label="物资名称">
            </el-table-column>
            <el-table-column
                width="150"
                label="物资类别">
              <template slot-scope="scope">
                <el-tag :type="tagModule(scope.row)" effect="dark">
                  {{scope.row.type.pid.name}}
                </el-tag>
                <el-tag :type="tagModule(scope.row)" style="margin-left: 10px">
                  {{scope.row.type.name}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              width="110"
              sortable
              label="所需配额">
            </el-table-column>
            <el-table-column
                prop="quantity"
                width="80"
                sortable
                label="库存">
            </el-table-column>
            <el-table-column
                prop="charge_unit.name"
                width="60"
                label="单位">
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="80">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="addMaterial(scope.row)">
                  <i class="el-icon-plus"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--物资信息分页控件-->
          <el-pagination
              style="margin-top: 10px"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="materParam.page_num"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="materParam.page_size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="materialInfo.total">
          </el-pagination>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card>
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
      },
      // 用户配额进度条颜色
      userProgress:[
        {color:'#f36c6c',percentage:20},
        {color:'#ff8d30',percentage:40},
        {color:'#ffb530',percentage:60},
        {color:'#67c13a',percentage:80},
        {color:'#409dfd',percentage:100},
      ],
      // 物资查询参数
      materParam:{
        page_size:10,
        page_num:1,
        search:'',
        type:''
      },
      materialInfo:{
        data:[],
        total:0
      },
      // 物资分类数据
      cateInfo:[],
      // 物资分类级联选择器键名配置
      cascadeParams:{
        label:'name',
        value:'_id',
        children:'children',
        emitPath:false
      },
      // 用户功能区
      // 用户功能区标签页位置
      tabIndex:'',
      // 物资选择
      selectMaterial:[],
      // 物资申请记录
      distributionInfo:{
        total:0,
        distributionList:[]
      },
      // 配额变更申请记录
      quotaChangesInfo:[]
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
    // 获取用户信息
    getUserInfo(){
      const user_id = sessionStorage.getItem('user_id') || localStorage.getItem('user_id')
      this.$request(`user/${user_id}`,'get').then(result => {
        this.userinfo = result.data
      })
    },
    // 修改用户信息
    changeUserInfo(){
      this.$request(`user/${this.userinfo._id}`,'put',this.changeUserForm).then(value => {
        console.log(value)
        this.$message.success('修改用户成功')
        this.userinfo = value.data
        this.changeUserDialogVisible = false
      }).catch(reason => {
        this.$message.error('修改用户信息失败')
      })
    },
    // 监听物资每页显示数量变化
    handleSizeChange(newSize){
      this.materParam.page_size = newSize
      this.getMaterialInfo()
    },
    // 监听物资页码变化
    handleCurrentChange(newCurrent){
      this.materParam.page_num = newCurrent
      this.getMaterialInfo()
    },
    // 获取物资信息
    getMaterialInfo(){
      this.$request('material','get',this.materParam).then(value => {
        if(value.status === 200){
          this.materialInfo.data = value.data.result
          this.materialInfo.total = value.data.total
        }else {
          this.$message.error('获取物资信息失败')
        }

      })
    },
    // 获取物资分类信息
    getCateInfo(){
      this.$request('categories','get').then(value => {
        if(value.status === 200){
          this.cateInfo = value.data
        }
      })
    },
    // 根据分类返回tag的类型
    tagModule(row){
      switch (row.type.pid.name){
        case '药品':return 'warning'
        case '日用品':return ''
        case '食品':return 'success'
      }
    },
    // 点击添加物资
    addMaterial(row){
      for (let i = 0,len = this.selectMaterial.length; i <len ; i++) {
        if(this.selectMaterial[i].id === row._id) return this.$message.info('您已添加过该物资')
      }
      const materialInfo = {}
      materialInfo.name = row.name
      materialInfo.id = row._id
      materialInfo.price = row.price
      materialInfo.quantity = 1
      materialInfo.charge_unit = row.charge_unit.name
      this.selectMaterial.push(materialInfo)
      this.tabIndex='0'
    },
    // 点击移除物资
    delMaterial(row){
      console.log(row)
      this.selectMaterial = this.selectMaterial.filter(item => {
        return item.id !== row.id
      })
    },
    // 上传物资申请表
    uploadMaterial(){
      this.$request('distribution','post',{
        user_id:this.userinfo._id,
        supplies_info:this.selectMaterial,
        ration:this.totalPrice
      }).then(value => {
        if(value.status === 201){
          this.selectMaterial = []
          return this.$message.success('物资申请已发送')

        }
        this.$message.error('物资申请发送失败')
      })
      this.$request(`user/${this.userinfo._id}`,'put',{
        ration:this.userinfo.ration-this.totalPrice
      })
      this.getUserInfo()
    },
    // 获取物资申请记录
    getDistribution(){
      this.$request('distribution','get',{
        user_id:this.userinfo._id,
        sort:'new'
      }).then(value => {
        this.distributionInfo.distributionList = value.data.result
        this.distributionInfo.total = value.data.total
      })
    },
    // 获取配额申请记录
    // 标签页被点击后触发
    tabClickHandler(tab){
      if(tab.label === '物资申请记录'){
        this.getDistribution()
      }
    }
  },
  created() {
    this.getUserInfo()
    this.getMaterialInfo()
    this.getCateInfo()
    this.token.Authorization = sessionStorage.getItem('token') || localStorage.getItem('token')
  },
  computed:{
    // 实时返回需要的配额
    totalPrice(){
      let total = 0
      for (let i = 0,len = this.selectMaterial.length; i < len; i++) {
        total += this.selectMaterial[i].price*this.selectMaterial[i].quantity
      }
      return total
    },
    // 判断用户配额是否足够本次申请
   enoughQuota(){
      return this.totalPrice>this.userinfo.ration
   },
  },
}
</script>

<style scoped>
.user-main{
  height: 100%;
  padding: 10px;
}
.user-card{
  width: 92%;
  min-width: 520px;
  height: 330px;
  padding: 20px;
}
.operationWindow{
  min-width: 520px;
  max-height: 580px;
  overflow: auto;
  width: 92%;
  margin-top: 10px;
  padding: 20px;
}
.material-info-card{
  width: 93%;
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
