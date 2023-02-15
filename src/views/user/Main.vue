<template>
  <div class="user-main">
    <el-row :gutter="10" style="min-width: 1700px">
      <!--左侧用户信息和操作栏-->
      <el-col :span="9" style="">
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
                               size="small" @click="addCollectMaterial(scope.row)"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="物资申请记录">
              <el-row>
                <el-col :span="16">
                  <el-select v-model="getDistributionParams.status"
                             clearable placeholder="配送状态筛选"
                             style="width: 150px"
                             @change="getDistribution"
                  >
                    <el-option v-for="item in distributionStatus"
                               :value="item.value" :label="item.label"
                               :key="item.value">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-switch
                      v-model="getDistributionParams.is_accept"
                      active-text="审核通过"
                      @change="getDistribution">
                  </el-switch><br>
                  <el-switch
                      v-model="getDistributionParams.sort"
                      active-text="从旧到新排序"
                      active-value="old"
                      inactive-value="new"
                      @change="getDistribution"
                  >
                  </el-switch>
                </el-col>
              </el-row>
              <el-table
                :data="distributionInfo.distributionList"
                style="width: 100%;margin-top: 10px"
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
              <el-alert
                  title="提高配额申请"
                  type="info"
                  :closable="false"
                  show-icon
                  description="您可以自己填写提高配额的原因,或是选择一些符合您描述的文字选项">
              </el-alert>
              <el-form
                :model="quotaChangeForm" :rules="quotaChangeFormRules" ref="quotaChangeForm"
                style="margin-top: 10px"
              >
                <el-form-item label="申请原因" prop="reason">
                  <el-input
                      type="textarea"
                      placeholder="提高配额申请原因"
                      v-model="quotaChangeForm.reason"
                      maxlength="30"
                      show-word-limit
                  >
                  </el-input>
                </el-form-item>
              </el-form>
              <p style="color: #409EFF;font-size:15px;margin-top: 10px">相关申请原因建议如下:</p>
              <div style="margin-top: 10px">
                <el-tag v-for="item in this.quotaChangesSuggest" @click="quotaTagClickHandler(item)" :closable="false" style="margin-right: 10px">
                  {{item}}
                </el-tag>
              </div>
              <p style="color: #000000;font-size:15px;margin-top: 10px">
                申请新的配额
                <span style="color: #409EFF;font-size: 12px">
                  (申请新的配额不可以和当前配额相等)
                </span>
              </p>
              <el-slider
                  v-model="quotaChangeForm.new_ration"
                  :min="userinfo.ration"
                  style="margin-left: 10px"
                  show-input>
              </el-slider>
              <el-button type="primary" style="margin-top:15px;float: right"
                         @click="uploadChangeQuota"
              >提交配额申请记录
              </el-button>
            </el-tab-pane>
            <el-tab-pane label="配额申请记录">
              <el-table
                :data="quotaChangesInfo" stripe border
              >
                <el-table-column type="expand" label="详情" width="60">
                  <template slot-scope="{row}">
                    <div style="padding: 10px">
                      <el-descriptions :column="2" border>
                        <el-descriptions-item label="业主真实姓名">{{row.user_id.real_name}}</el-descriptions-item>
                        <el-descriptions-item label="手机号">{{row.user_id.phone}}</el-descriptions-item>
                        <template v-if="row.employee_id">
                          <el-descriptions-item label="业务员姓名">{{row.employee_id.real_name}}</el-descriptions-item>
                          <el-descriptions-item label="业务员手机号码">{{row.employee_id.phone}}</el-descriptions-item>
                        </template>
                        <el-descriptions-item label="配额变更原因">
                          <span style="color:#409cfb;">
                            {{row.reason}}
                          </span>
                        </el-descriptions-item>
                      </el-descriptions>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="创建时间">
                  <template slot-scope="{row}">
                    {{row.create_time | transformUtc}}
                  </template>
                </el-table-column>
                <el-table-column label="新配额" align="center"
                                 width="80" prop="new_ration">
                </el-table-column>
                <el-table-column label="审核情况" width="120" align="center">
                  <template slot-scope="{row}">
                    <el-tag type="success" v-if="row.is_accept">审核已通过</el-tag>
                    <el-tag type="warning" v-else>审核未通过</el-tag>
                  </template>
                </el-table-column>
              </el-table>
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
              <span>物资信息</span><br>
              <span style="font-size: 12px;color: #409EFF">右侧可以进行查询和物资分配筛选</span>
            </el-col>
            <el-col :span="9">
              <el-input placeholder="物资名称" clearable v-model="materParam.search" @clear="getMaterialInfo">
                <template slot="append">
                  <el-button slot="append" icon="el-icon-search" type="primary"
                             @click="getMaterialInfo">查询</el-button>
                </template>
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-cascader :options="cateInfo" :props="cascadeParams"  placeholder="物资分类"
                           :show-all-levels='false' clearable v-model="materParam.type"
                           @change="getMaterialInfo" style="width: 120px"
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
      <el-col :span="6">
        <!--系统介绍与教程-->
        <el-card style="padding: 10px">
          <el-alert
              title="欢迎使用疫情物资分配系统"
              type="success"
              :closable="false"
              description="以下是相关教程,可以让您快速熟悉物资申请等操作"
              show-icon>
          </el-alert>
          <el-collapse accordion>
            <el-collapse-item>
              <template v-slot:title>
                <svg t="1676434114757" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2858" width="32" height="32"><path d="M925.4 399.2c0.4 2.4 0.6 4.7 0.6 7.2v505.3c0 1.4-0.1 2.7-0.2 4.1-1.3 23.6-20.8 42.1-44.5 42.2H141c-24.6 0-44.6-20-44.6-44.6v-507c0-2.3 0.2-4.6 0.5-6.8-0.3-2.6-0.5-5.2-0.5-7.8V362l-0.2-0.1 116.9-202.3c10.2-17.8 28.9-29 49.4-29.6 4.3-1.3 8.7-2 13.2-2h470.5c4.8 0 9.6 0.8 14.2 2.3 20.3 0.8 38.9 12 49 29.6l116.8 202.3-0.6 0.4v29.2c0.2 2.5 0.1 5-0.2 7.4z m-79.4-36c-1.7-2.5-3.2-5.2-4.6-8L758.2 186H281.4l-87.2 177.2H846z m6.1 60H170.4v474.3h681.7V423.2z" p-id="2859" fill="#409EFF"></path><path d="M739.3 665.8h-240c-15.4 0-28-12.6-28-28s12.6-28 28-28h240c15.4 0 28 12.6 28 28s-12.6 28-28 28zM481.7 407.6V144.8c0-1.1 0.9-2 2-2H539c1.1 0 2 0.9 2 2v262.8c0 1.1-0.9 2-2 2h-55.3c-1.1 0-2-0.9-2-2zM739.8 793.9h-390c-15.4 0-28-12.6-28-28s12.6-28 28-28h390c15.4 0 28 12.6 28 28s-12.6 28-28 28z" p-id="2860" fill="#409EFF"></path></svg>
                <span style="margin-left: 10px">
                  如何进行物资申请
                </span>
              </template>
            </el-collapse-item>
            <el-collapse-item>
              <template v-slot:title>
                <svg t="1676434114757" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2858" width="32" height="32"><path d="M925.4 399.2c0.4 2.4 0.6 4.7 0.6 7.2v505.3c0 1.4-0.1 2.7-0.2 4.1-1.3 23.6-20.8 42.1-44.5 42.2H141c-24.6 0-44.6-20-44.6-44.6v-507c0-2.3 0.2-4.6 0.5-6.8-0.3-2.6-0.5-5.2-0.5-7.8V362l-0.2-0.1 116.9-202.3c10.2-17.8 28.9-29 49.4-29.6 4.3-1.3 8.7-2 13.2-2h470.5c4.8 0 9.6 0.8 14.2 2.3 20.3 0.8 38.9 12 49 29.6l116.8 202.3-0.6 0.4v29.2c0.2 2.5 0.1 5-0.2 7.4z m-79.4-36c-1.7-2.5-3.2-5.2-4.6-8L758.2 186H281.4l-87.2 177.2H846z m6.1 60H170.4v474.3h681.7V423.2z" p-id="2859" fill="#409EFF"></path><path d="M739.3 665.8h-240c-15.4 0-28-12.6-28-28s12.6-28 28-28h240c15.4 0 28 12.6 28 28s-12.6 28-28 28zM481.7 407.6V144.8c0-1.1 0.9-2 2-2H539c1.1 0 2 0.9 2 2v262.8c0 1.1-0.9 2-2 2h-55.3c-1.1 0-2-0.9-2-2zM739.8 793.9h-390c-15.4 0-28-12.6-28-28s12.6-28 28-28h390c15.4 0 28 12.6 28 28s-12.6 28-28 28z" p-id="2860" fill="#409EFF"></path></svg>
                <span style="margin-left: 10px">
                  如何进行配额申请
                </span>
              </template>
            </el-collapse-item>
            <el-collapse-item>
              <template v-slot:title>
                <svg t="1676434114757" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2858" width="32" height="32"><path d="M925.4 399.2c0.4 2.4 0.6 4.7 0.6 7.2v505.3c0 1.4-0.1 2.7-0.2 4.1-1.3 23.6-20.8 42.1-44.5 42.2H141c-24.6 0-44.6-20-44.6-44.6v-507c0-2.3 0.2-4.6 0.5-6.8-0.3-2.6-0.5-5.2-0.5-7.8V362l-0.2-0.1 116.9-202.3c10.2-17.8 28.9-29 49.4-29.6 4.3-1.3 8.7-2 13.2-2h470.5c4.8 0 9.6 0.8 14.2 2.3 20.3 0.8 38.9 12 49 29.6l116.8 202.3-0.6 0.4v29.2c0.2 2.5 0.1 5-0.2 7.4z m-79.4-36c-1.7-2.5-3.2-5.2-4.6-8L758.2 186H281.4l-87.2 177.2H846z m6.1 60H170.4v474.3h681.7V423.2z" p-id="2859" fill="#409EFF"></path><path d="M739.3 665.8h-240c-15.4 0-28-12.6-28-28s12.6-28 28-28h240c15.4 0 28 12.6 28 28s-12.6 28-28 28zM481.7 407.6V144.8c0-1.1 0.9-2 2-2H539c1.1 0 2 0.9 2 2v262.8c0 1.1-0.9 2-2 2h-55.3c-1.1 0-2-0.9-2-2zM739.8 793.9h-390c-15.4 0-28-12.6-28-28s12.6-28 28-28h390c15.4 0 28 12.6 28 28s-12.6 28-28 28z" p-id="2860" fill="#409EFF"></path></svg>
                <span style="margin-left: 10px">
                  其他问题
                </span>
              </template>
            </el-collapse-item>
          </el-collapse>
        </el-card>
        <!--物资收藏菜单-->
        <el-card style="margin-top: 10px">
          <el-divider>
            <svg t="1676469351396" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7233" width="32" height="32"><path d="M174.592 378.88c10.752-36.352 44.032-61.952 81.92-63.488h600.064c0-54.272-44.032-98.304-98.304-98.304H389.12l-36.864-67.584c-7.168-18.432-25.6-30.72-45.568-31.232H118.784C64.512 118.784 20.48 162.816 20.48 217.088v516.096c0 37.888 22.016 72.704 56.832 88.576l97.28-442.88zM844.8 778.24c5.632-10.24 9.728-20.992 11.776-32.256L844.8 778.24z" fill="#409EFF" p-id="7234"></path><path d="M915.968 364.544H305.664c-37.888 1.024-71.168 26.624-81.92 63.488l-104.448 477.696h688.128c37.888-1.536 71.168-27.136 81.92-63.488l108.544-344.064c22.016-64.512-20.48-133.632-81.92-133.632z m-202.24 251.904l-62.976 61.952 14.848 87.552c1.536 7.168-1.024 14.336-6.144 18.944-2.56 2.56-6.144 3.584-9.728 3.072-3.584 0-7.68-1.024-10.752-3.072l-77.824-40.96-77.824 41.472c-6.144 4.096-14.336 4.096-19.968 0-5.632-4.608-8.192-11.776-6.144-18.944l14.848-87.552-62.976-62.464c-7.68-5.632-9.728-15.872-4.096-23.552 3.072-4.608 8.192-7.168 13.824-7.168l87.552-12.8 39.424-79.872c3.072-8.704 12.8-13.312 21.504-10.24 4.608 1.536 8.704 5.632 10.24 10.24l39.424 79.872 87.552 12.8c9.216 0 16.896 7.68 16.896 17.408 0 5.12-3.072 10.24-7.68 13.312z" fill="#409EFF" p-id="7235"></path></svg>
            <span style="position: relative;left: 10px;top: -10px">物资收藏菜单</span>
          </el-divider>
          <div style="padding: 10px">
            <el-tag v-for="item in collectMaterial" :key="item._id"
                    closable @close="removeCollectMaterial(item._id)"
                    style="margin-right: 10px;margin-bottom: 5px"
                    @click="collectMaterialTagClick(item.material_id.name)"
            >
              {{item.material_id.name}}
            </el-tag>
          </div>
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
      // 物资申请表状态筛选
      distributionStatus:[
        {
          value: 0,
          label:'等待审核'
        }, {
          value: 1,
          label: '正在准备物资'
        }, {
          value: 2,
          label: '正在配送'
        }, {
          value: 3,
          label: '物资配送完成'
        }, {
          value: -1,
          label: '配送提前结束'
        }
      ],
      // 获取物资申请筛选参数
      getDistributionParams:{
        user_id:'',
        status:'',
        is_accept: false,
        sort:'new',
      },
      // 配额变更申请记录
      quotaChangesInfo:[],
      // 配额变更申请表单
      quotaChangeForm:{
        reason:'',
        new_ration:0,
      },
      quotaChangeFormRules:{
        reason: {required:true,message: '请输入申请原因',trigger: 'blur'}
      },
      // 配额变更申请建议
      quotaChangesSuggest:[
          '家庭成员众多;',
          '特殊物资紧缺;',
          '家庭成员生病,急需物资;',
      ],
      // 收藏物资列表
      collectMaterial:[]
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
      }).catch(reason => {
        console.log(reason)
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
      if(!this.userInfoDone){
        return this.$alert('请完善信息(手机号码和地址)后再添加物资','提示',{
          confirmButtonText:'确定'
        }).then(() => {
          this.changeUserDialogVisible = true
        })
      }
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
      }).then(value => {
        if(value.status === 201){
          return this.userinfo = value.data
        }
        this.$message.error('配额修改失败')
      })
    },
    // 获取物资申请记录
    getDistribution(){
      this.getDistributionParams.user_id = this.userinfo._id
      this.$request('distribution','get',this.getDistributionParams)
          .then(value => {
        this.distributionInfo.distributionList = value.data.result
        this.distributionInfo.total = value.data.total
      })
    },
    // 配额建议Tag点击事件
    quotaTagClickHandler(tagItem){
      this.quotaChangeForm.reason += tagItem
    },
    // 发送提高配额申请
    uploadChangeQuota(){
      this.$refs["quotaChangeForm"].validate(valid => {
        if(valid){
          if(this.quotaChangeForm.new_ration === this.userinfo.ration){
            return this.$message.info('申请新的配额和当前配额相等')
          }
          this.quotaChangeForm.user_id = this.userinfo._id
          this.$request('quota-change','post',this.quotaChangeForm).then(value => {
            if(value.status === 201){
              this.quotaChangeForm.new_ration = 0
              this.quotaChangeForm.reason = ''
              this.tabIndex = 0
              return this.$message.success('配额申请提交成功')
            }
            this.$message.error('配额申请提交失败,请重试')
          })
        }
      })
    },
    // 获取配额申请记录
    getQuotaChanges(){
      this.$request('quota-change','get',{
        user_id:this.userinfo._id,
        sort:'new'
      }).then(value => {
        if(value.status === 200){
          return this.quotaChangesInfo = value.data.result
        }
        this.$message.error('获取配额变更记录失败')
      })
    },
    // 标签页被点击后触发
    tabClickHandler(tab){
      if(tab.label === '物资申请记录'){
        this.getDistribution()
      }
      if(tab.label === '配额申请记录'){
        this.getQuotaChanges()
      }
    },
    // 获取收藏物资列表
    getCollectMaterial(){
      const user_id = sessionStorage.getItem('user_id') || localStorage.getItem('user_id')
      this.$request(`collect-material/${user_id}`,'get').then(value => {
        if(value.status !== 200){
          return this.$message.error('获取收藏物资失败')
        }
        this.collectMaterial = value.data
      })
    },
    // 收藏选定物资
    addCollectMaterial(row) {
      this.$request(`collect-material`,'post',{
        user_id:this.userinfo._id,
        material_id:row.id
      }).then(value => {
        if(value.status !== 201){
          return this.$message.error('收藏物资失败')
        }
        this.$message.success('成功收藏该物资')
        this.getCollectMaterial()
      })
    },
    // 删除选定收藏物资
    removeCollectMaterial(id){
      this.$request(`collect-material/${id}`,'delete').then(value => {
        if(value.status !== 204){
          return this.$message.error('取消收藏物资失败')
        }
        this.$message.success('取消收藏该物资')
        this.getCollectMaterial()
      })
    },
    // 点击收藏物资tag时
    collectMaterialTagClick(name){
      this.materParam.search = name
      this.getMaterialInfo()
    }
  },
  created() {
    this.getUserInfo()
    this.getMaterialInfo()
    this.getCateInfo()
    this.getCollectMaterial()
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
    // 判断用户配是否完成关键信息的填写
    userInfoDone(){
      // return this.userinfo.address !== '' && this.userInfo.phone !== ''
      return true
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
  width: 93%;
  min-width: 520px;
  height: 330px;
  padding: 20px;
}
.operationWindow{
  min-width: 520px;
  max-height: 580px;
  overflow: auto;
  width: 93%;
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
