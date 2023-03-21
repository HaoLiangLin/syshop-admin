<template>
  <div class="container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增用户</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="box">
      <div class="form">
        <div class="title">
          新增用户
        </div>
        <el-form ref="user" :model="user" label-width="180px">
          <el-form-item label="用户名">
            <el-input v-model="user.username" clearable size="small"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="user.phone" clearable size="small"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="user.password" clearable size="small"></el-input>
          </el-form-item>
          <el-form-item label="用户类型">
            <el-select v-model="user.userType" clearable placeholder="用户类型" size="small">
              <el-option
                v-for="item in userTypeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户状态">
            <el-radio-group v-model="user.status">
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSave">确 定</el-button>
        </div>
      </div>
      <div class="result" v-if="!Object.keys(resultUser).length == 0">
        <el-descriptions title="新增用户信息" direction="vertical" :column="4" border>
          <template slot="extra">
            <el-button type="primary" size="mini" @click="updateUserVisible = true">修改账号信息</el-button>
          </template>
          <el-descriptions-item label="用户ID">{{resultUser.id}}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{resultUser.username}}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{resultUser.phone}}</el-descriptions-item>
          <el-descriptions-item label="用户身份">
            <el-tag size="small">{{resultUser.userType === 0 ? '管理员' : '用户'}}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="昵称">{{resultUser.nickname}}</el-descriptions-item>
          <el-descriptions-item label="账号状态">
            <el-tag type="success" v-if="resultUser.status">正常</el-tag>
            <el-tag type="info" v-else-if="resultUser.isDel === 1">注销</el-tag>
            <el-tag type="danger" v-else-if="!resultUser.status">停用</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <!-- 修改用户弹窗 -->
    <el-dialog
      title="修改用户"
      :visible.sync="updateUserVisible"
      width="30%">
      <el-form :model="resultUser">
        <el-form-item label="用户编号" :label-width="formLabelWidth">
          <el-input v-model="resultUser.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="resultUser.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="resultUser.phone"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" :label-width="formLabelWidth">
          <el-input v-model="resultUser.nickname"></el-input>
        </el-form-item>
        <el-form-item label="用户类型">
            <el-select v-model="resultUser.userType" clearable placeholder="用户类型" size="small">
              <el-option
                v-for="item in userTypeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        <el-form-item label="账号状态" :label-width="formLabelWidth">
          <el-switch
            v-model="resultUser.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="正常"
            inactive-text="停用">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="onUpdateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { saveUser, updateSytsemUser } from '@/api/user.js'
export default {
  name: 'Save-User',
  data() {
    return {
      user: {
        username: '',
        phone: '',
        password: '',
        userType: null,
        status: 0
      },
      username: null,
      phone: null,
      resultUser: {},
      updateUserVisible: false,
      formLabelWidth: '70px',
      userTypeOption: [{ value: 0, label: '管理员' }, { value: 1, label: '用户' }],
      statusOption: [{ value: 0, label: '正常' }, { value: 1, label: '停用' }]
    }
  },
  methods: {
    onCancel() {
      this.user.username = ''
      this.user.phone = ''
      this.user.password = ''
      this.user.userType = null
      this.user.status = 0
      this.$router.back()
    },
    onSave() {
      saveUser(this.user.username, this.user.phone, this.user.password, this.user.userType, this.user.status).then(res => {
        const data = res.data
        if (data.code === 20011) {
          this.$notify({
            title: '成功',
            message: data.message,
            type: 'success'
          })
          this.username = this.user.username
          this.phone = this.user.phone
          this.user.username = ''
          this.user.phone = ''
          this.user.password = ''
          this.user.userType = null
          this.user.status = 0
          this.resultUser = data.data
          if (this.resultUser.status === 0) {
            this.resultUser.status = true
          } else {
            this.resultUser.status = false
          }
        } else {
          this.$notify({
            title: '失败',
            message: data.message,
            type: 'warning'
          })
        }
      }).catch(err => {
        this.$notify.error({
          title: '错误',
          message: err.message
        })
      })
    },
    onUpdateUser() {
      let username = null
      if (this.username !== this.resultUser.username) {
        username = this.resultUser.username
      }
      let phone = null
      if (this.phone !== this.resultUser.phone) {
        phone = this.resultUser.phone
      }
      console.log(this.resultUser)
      updateSytsemUser(this.resultUser.id, username, phone, this.resultUser.nickname, this.resultUser.userType, this.resultUser.status ? 0 : 1).then(res => {
        const data = res.data
        if (data.code === 20011) {
          this.$notify({
            title: '成功',
            message: data.message,
            type: 'success'
          })
          this.updateUserVisible = false
        } else {
          this.$notify({
            title: '失败',
            message: data.message,
            type: 'warning'
          })
        }
      }).catch(err => {
        this.$notify.error({
          title: '错误',
          message: err.message
        })
      })
    }
  },
  created() {}
}
</script>

<style lang="less" scoped>
.container{
  .box{
    margin: 20px;
    .form{
      width: 70vh;
      margin-left: 35vh;
      .title{
        font-size: 24px;
        font-weight: bolder;
        color: #777777;
        text-align: center;
        margin-bottom: 10px;
      }
      .btn{
        text-align: center;
      }
    }
    .result{
      /deep/.el-descriptions{
        background-color: transparent;
      }
    }
  }
}
</style>
