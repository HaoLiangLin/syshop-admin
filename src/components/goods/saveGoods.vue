<template>
  <div class="container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增商品</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="box">
      <div class="form">
        <div class="title">
          新增商品
        </div>
        <el-form ref="goods" :model="goods" label-width="150px" :inline="true">
          <el-form-item label="商品名称">
            <el-input v-model="goods.name" clearable size="small"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
            v-model="goods.cid"
            size="small"
            :options="goodsCategory"
            :props="{ checkStrictly: true, value: 'id', label: 'name' }"></el-cascader>
          </el-form-item>
          <el-form-item label="发货省份">
            <el-input v-model="goods.province" clearable size="small"></el-input>
          </el-form-item>
          <el-form-item label="发货城市">
            <el-input v-model="goods.city" clearable size="small"></el-input>
          </el-form-item>
          <el-form-item label="发货区县">
            <el-input v-model="goods.district" clearable size="small"></el-input>
          </el-form-item>
          <el-form-item label="发货地址">
            <el-input v-model="goods.address" clearable size="small"></el-input>
          </el-form-item>
          <el-form-item label="物流运费">
            <el-input-number v-model="goods.postage" :precision="2" :step="0.01"></el-input-number>
          </el-form-item>
          <el-form-item label="保修期限">
            <el-input-number v-model="goods.warrantyTime" :min="0" label="保修期限"></el-input-number>
          </el-form-item>
          <el-form-item label="包退期限">
            <el-input-number v-model="goods.refundTime" :min="0" label="包退期限"></el-input-number>
          </el-form-item>
          <el-form-item label="包换期限">
            <el-input-number v-model="goods.changerTime" :min="0" label="包换期限"></el-input-number>
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSave">确 定</el-button>
        </div>
      </div>
      <div class="result" v-if="!Object.keys(resultGoods).length == 0">
        <el-descriptions title="新增商品信息" direction="vertical" :column="4" border>
          <template slot="extra">
            <el-button type="primary" size="mini" @click="updateGoodsVisible = true">修改商品信息</el-button>
          </template>
          <el-descriptions-item label="商品ID">{{resultGoods.id}}</el-descriptions-item>
          <el-descriptions-item label="商品名称">{{resultGoods.name}}</el-descriptions-item>
          <el-descriptions-item label="商品分类">
            <el-cascader
              v-model="resultGoods.cid"
              :options="goodsCategory"
              :disabled="true"
              :props="{ checkStrictly: true, value: 'id', label: 'name' }"></el-cascader>
          </el-descriptions-item>
          <el-descriptions-item label="发货省份">{{resultGoods.province}}</el-descriptions-item>
          <el-descriptions-item label="发货城市">{{resultGoods.city}}</el-descriptions-item>
          <el-descriptions-item label="发货区县">{{resultGoods.district}}</el-descriptions-item>
          <el-descriptions-item label="发货地址">{{resultGoods.address}}</el-descriptions-item>
          <el-descriptions-item label="保修期限">{{resultGoods.warrantyTime}}</el-descriptions-item>
          <el-descriptions-item label="包换期限">{{resultGoods.changerTime}}</el-descriptions-item>
          <el-descriptions-item label="包退期限">{{resultGoods.refundTime}}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <!-- 修改商品 -->
    <el-dialog
      title="修改商品"
      :visible.sync="updateGoodsVisible"
      width="45%">
      <el-form :model="resultGoods" :inline="true">
        <el-form-item label="商品编号" :label-width="formLabelWidth">
          <el-input v-model="resultGoods.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-cascader
            v-model="resultGoods.cid"
            :options="goodsCategory"
            :props="{ checkStrictly: true, value: 'id', label: 'name' }"></el-cascader>
        </el-form-item>
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="resultGoods.name"></el-input>
        </el-form-item>
        <el-form-item label="发货省份" :label-width="formLabelWidth">
          <el-input v-model="resultGoods.province"></el-input>
        </el-form-item>
        <el-form-item label="发货城市" :label-width="formLabelWidth">
          <el-input v-model="resultGoods.city"></el-input>
        </el-form-item>
        <el-form-item label="发货城区" :label-width="formLabelWidth">
          <el-input v-model="resultGoods.district"></el-input>
        </el-form-item>
        <el-form-item label="发货地址" :label-width="formLabelWidth">
          <el-input v-model="resultGoods.address"></el-input>
        </el-form-item>
        <el-form-item label="物流运费" :label-width="formLabelWidth">
          <el-input-number v-model="resultGoods.postage" :precision="2" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item label="保修期限" :label-width="formLabelWidth">
          <el-input-number v-model="resultGoods.warrantyTime" :min="0" label="保修期限"></el-input-number>
        </el-form-item>
        <el-form-item label="包退期限" :label-width="formLabelWidth">
          <el-input-number v-model="resultGoods.refundTime" :min="0" label="包退期限"></el-input-number>
        </el-form-item>
        <el-form-item label="包换期限" :label-width="formLabelWidth">
          <el-input-number v-model="resultGoods.changerTime" :min="0" label="包换期限"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateGoodsVisible = false">取 消</el-button>
        <el-button type="primary" @click="onUpdateGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findSelectCategory, saveGoods, updateGoods } from '@/api/goods.js'
export default {
  name: 'Save-Goods',
  data() {
    return {
      goodsCategory: [],
      // name, cid, province, city, district, address, postage, warrantyTime, refundTime, changerTime
      goods: {
        name: '',
        cid: null,
        province: '',
        city: '',
        district: '',
        address: '',
        postage: 0,
        warrantyTime: null,
        refundTime: null,
        changerTime: null
      },
      cid: null,
      resultGoods: {},
      updateGoodsVisible: false,
      formLabelWidth: '70px'
    }
  },
  methods: {
    initData() {
      this.goodsCategory = []
      this.goods = {
        name: '',
        cid: null,
        province: '',
        city: '',
        district: '',
        address: '',
        postage: 0,
        warrantyTime: null,
        refundTime: null,
        changerTime: null
      }
      findSelectCategory().then(res => {
        const data = res.data
        if (data.code === 20011) {
          this.goodsCategory = data.data
        } else {
          this.$notify({
            title: '失败',
            message: res.message,
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
    onCancel() {
      this.goods = {
        name: '',
        cid: null,
        province: '',
        city: '',
        district: '',
        address: '',
        postage: 0,
        warrantyTime: null,
        refundTime: null,
        changerTime: null
      }
      this.cid = null
      this.updateGoodsVisible = false
      this.$router.back()
    },
    onSave() {
      saveGoods(this.goods.name, this.goods.cid[this.goods.cid.length - 1], this.goods.province, this.goods.city, this.goods.district, this.goods.address, this.goods.postage, this.goods.warrantyTime, this.goods.refundTime, this.goods.changerTime).then(res => {
        const data = res.data
        if (data.code === 20011) {
          this.$notify({
            title: '成功',
            message: data.message,
            type: 'success'
          })
          this.resultGoods = data.data
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
    onUpdateGoods() {
      updateGoods(this.resultGoods.id, this.resultGoods.name, typeof this.resultGoods.cid !== 'string' ? this.resultGoods.cid[this.resultGoods.cid.length - 1] : this.resultGoods.cid, this.resultGoods.province, this.resultGoods.city, this.resultGoods.district, this.resultGoods.address, this.resultGoods.postage, null, this.resultGoods.warrantyTime, this.resultGoods.refundTime, this.resultGoods.changerTime, null).then(res => {
        const data = res.data
        if (data.code === 20011) {
          this.$message({
            message: data.message,
            type: 'success'
          })
          this.updateGoodsVisible = false
        } else {
          this.$notify({
            title: '失败',
            message: data.message,
            type: 'warning'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  },
  created() {
    this.initData()
  }
}
</script>

<style lang="less" scoped>
.container{
  .box{
    margin: 20px;
    .form{
      // width: 80vh;
      // margin-left: 35vh;
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
