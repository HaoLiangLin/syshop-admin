<template>
  <div class="container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
     <div class="table">
      <el-table
        :data="orderData"
        stripe
        :border="true"
        ref="goodsTabel"
        style="width: 100%;margin-top: 15px"
        height="73vh">
        <el-table-column
          prop="order.id"
          label="订单号"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="order.name"
          label="收货人"
          align="center">
        </el-table-column>
        <el-table-column
          prop="order.phone"
          label="联系电话"
          align="center">
        </el-table-column>
        <el-table-column
          prop="order.price"
          label="订单金额(元)"
          align="center">
        </el-table-column>
        <el-table-column
          prop="order.time"
          label="下单时间"
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="order.paymentMethods"
          label="支付方式"
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.order.isPay === 0">未支付</div>
            <div v-if="scope.row.order.paymentMethods === 0">钱包</div>
            <div v-if="scope.row.order.paymentMethods === 1">微信</div>
            <div v-if="scope.row.order.paymentMethods === 2">支付宝</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="order.logisticsStatus"
          label="物流状态"
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.order.isPay === 0 && scope.row.order.logisticsStatus === 0">未支付</div>
            <div v-if="scope.row.order.isPay === 1 && scope.row.order.logisticsStatus === 0">待发货</div>
            <div v-if="scope.row.order.logisticsStatus === 1">待收货</div>
            <div v-if="scope.row.order.logisticsStatus === 2">已收货</div>
            <div v-if="scope.row.order.logisticsStatus === 3">待换货</div>
            <div v-if="scope.row.order.logisticsStatus === 4">已换货</div>
            <div v-if="scope.row.order.logisticsStatus === 5">待退货</div>
            <div v-if="scope.row.order.logisticsStatus === 6">已退货</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="order.status"
          label="订单状态 "
          width="100px"
          align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order.status === 1">已完成</el-tag>
            <el-tag type="info" v-else-if="scope.row.order.status === 0">未完成</el-tag>
            <el-tag type="danger" v-else-if="scope.row.order.status === 2">待退款</el-tag>
            <el-tag type="warning" v-else-if="scope.row.order.status === 3">已退款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button
              :disabled="!(scope.row.order.status === 0 && scope.row.order.isPay === 1 && scope.row.order.logisticsStatus === 0)"
              @click="onShipments(scope.row.order.id)"
              type="text"
              size="small">
              发货
            </el-button>
            <el-button
              :disabled="!(scope.row.order.status === 0 && scope.row.order.isPay === 1 && scope.row.order.logisticsStatus === 2)"
              @click="onShipments(scope.row.order.id)"
              type="text"
              size="small">
              完成
            </el-button>
            <el-button
              v-if="!scope.row.isUpdate"
              @click="onMore(scope.row)"
              type="text"
              size="small">
              更多
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <el-pagination
        layout="total, prev, pager, next, jumper"
        background
        :total="total"
        :page-size="size"
        v-show="isHidePage"
        :current-page="current"
        @current-change="onChangePage">
      </el-pagination>
    </div>
    <el-dialog
      title="更多信息"
      :visible.sync="orderMoreVisible"
      v-if="!Object.keys(orderInfo).length==0"
      width="75%">
      <el-descriptions title="用户信息" :column="4" size="" v-if="!Object.keys(orderInfo.user).length==0">
        <el-descriptions-item label="用户ID">{{orderInfo.user.id}}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{orderInfo.user.username}}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{orderInfo.user.phone}}</el-descriptions-item>
        <el-descriptions-item label="昵称">{{orderInfo.user.nickname}}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="订单信息" :column="4" size="" v-if="!Object.keys(orderInfo.order).length==0" border>
        <!-- <template slot="extra">
          <el-button type="primary" size="small">操作</el-button>
        </template> -->
        <el-descriptions-item label="订单编号">{{orderInfo.order.id}}</el-descriptions-item>
        <el-descriptions-item label="收货人">{{orderInfo.order.name}}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{orderInfo.order.phone}}</el-descriptions-item>
        <el-descriptions-item label="收货地址">{{orderInfo.order.province}} {{orderInfo.order.city}} {{orderInfo.order.district}} {{orderInfo.order.address}}</el-descriptions-item>
        <el-descriptions-item label="订单金额">{{orderInfo.order.price}}</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{orderInfo.order.time}}</el-descriptions-item>
        <el-descriptions-item label="支付方式">
          <div v-if="orderInfo.order.isPay === 0">未支付</div>
          <div v-if="orderInfo.order.paymentMethods === 0">钱包</div>
          <div v-if="orderInfo.order.paymentMethods === 1">微信</div>
          <div v-if="orderInfo.order.paymentMethods === 2">支付宝</div>
        </el-descriptions-item>
        <el-descriptions-item label="支付时间">{{orderInfo.order.isPay === 0 ? '未支付' : orderInfo.order.paymentTime}}</el-descriptions-item>
        <el-descriptions-item label="物流状态">
          <div v-if="orderInfo.order.isPay === 0 && orderInfo.order.logisticsStatus === 0">未支付</div>
          <div v-if="orderInfo.order.isPay === 1 && orderInfo.order.logisticsStatus === 0">待发货</div>
          <div v-if="orderInfo.order.logisticsStatus === 1">待收货</div>
          <div v-if="orderInfo.order.logisticsStatus === 2">已收货</div>
          <div v-if="orderInfo.order.logisticsStatus === 3">待换货</div>
          <div v-if="orderInfo.order.logisticsStatus === 4">已换货</div>
          <div v-if="orderInfo.order.logisticsStatus === 5">待退货</div>
          <div v-if="orderInfo.order.logisticsStatus === 6">已退货</div>
        </el-descriptions-item>
        <el-descriptions-item label="物流运费">{{orderInfo.order.lastpostage}}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag type="success" v-if="orderInfo.order.status === 1">已完成</el-tag>
          <el-tag type="info" v-else-if="orderInfo.order.status === 0">未完成</el-tag>
          <el-tag type="danger" v-else-if="orderInfo.order.status === 2">待退款</el-tag>
          <el-tag type="warning" v-else-if="orderInfo.order.status === 3">已退款</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="订单备注">{{orderInfo.order.remarks}}</el-descriptions-item>
      </el-descriptions>
      <!-- <div class="funBtn">
        <el-button type="warning" v-if="!Object.keys(loginInfo).length==0" @click="onCoerceLogout(user.id, loginInfo.token)">强制下线</el-button>
        <el-button type="danger" v-if="Object.keys(blockUpInfo).length==0" @click="onBlockUp(user.id)">禁用用户</el-button>
      </div> -->
      <div class="title">
        订单列表
      </div>
      <el-table
        :data="orderInfo.orderItemList"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="ID"
          align="center">
        </el-table-column>
        <el-table-column
          prop="goodsName"
          label="商品名称"
          align="center">
        </el-table-column>
        <el-table-column
          label="商品规格"
          align="center">
          <template slot-scope="props">
            <div>{{props.row.goodsItemColor}}{{props.row.goodsItemCombo !== undefined ? '/' + props.row.goodsItemSize : ''}}{{props.row.goodsItemCombo !== undefined ? '/' + props.row.goodsItemCombo : ''}}{{props.row.goodsItemEdition !== undefined ? '/' + props.row.goodsItemEdition : ''}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="unitPrice"
          label="单价"
          align="center">
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="数量"
          align="center">
        </el-table-column>
        <el-table-column
          prop="price"
          label="总价"
          align="center">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { queryOrder } from '@/api/order.js'
import { getImage } from '@/utils/resources.js'
export default {
  name: 'Order-List',
  data() {
    return {
      size: 9,
      isHidePage: true,
      total: 0,
      current: 1,
      orderData: [],
      orderInfo: {},
      paymentStatus: [{ value: 0, label: '未付款' }, { value: 1, label: '已付款' }],
      paymentMethods: [{ value: 0, label: '钱包' }, { value: 1, label: '微信' }, { value: 2, label: '支付宝' }],
      logisticsStatus: [{ value: 0, label: '未发货' }, { value: 1, label: '待收货' }, { value: 2, label: '已收货' }, { value: 3, label: '待换货' }, { value: 4, label: '已换货' }, { value: 5, label: '待退货' }, { value: 6, label: '已退货' }],
      orderStatus: [{ value: 0, label: '未完成' }, { value: 1, label: '已完成' }, { value: 2, label: '待退款' }, { value: 3, label: '已退款' }],
      isSearch: false,
      orderMoreVisible: false
    }
  },
  methods: {
    initData() {
      this.orderData = []
      this.isSearch = false
      queryOrder(1, this.size, null, null, null, null, null, null, null, null).then(res => {
        this.setOrderData(res)
      }).catch(err => {
        this.$notify.error({
          title: '错误',
          message: err.message
        })
      })
    },
    setOrderData(res) {
      const data = res.data
      if (data.code === 20011) {
        this.orderData = []
        data.data.records.forEach(data => {
          this.orderData.push(data)
        })
        console.log('订单数据', this.orderData)
        this.total = data.data.total
        this.current = data.data.current
      } else {
        this.$notify({
          title: '失败',
          message: res.message,
          type: 'warning'
        })
      }
    },
    setIcon(icon) {
      return getImage(icon)
    },
    setpreviewSrc(icon) {
      return [getImage(icon)]
    },
    onShipments(id) {},
    onMore(row) {
      this.orderInfo = row
      console.log(row)
      this.orderMoreVisible = true
    },
    onChangePage(page) {
      if (this.isSearch) {
      } else {
        queryOrder(page, this.size, null, null, null, null, null, null, null, null).then(res => {
          this.setOrderData(res)
        }).catch(err => {
          this.$notify.error({
            title: '错误',
            message: err.message
          })
        })
      }
    }
  },
  created() {
    this.initData()
  }
}
</script>

<style lang="less" scoped>
.container{
  /deep/.el-dialog{
    .title{
      padding: 10px 0;
      font-weight: bolder;
      font-size: 16px;
      color: #303133;
    }
  }
}
</style>
