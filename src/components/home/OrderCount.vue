<template>
  <div class="container">
    <div id="monthOrderCount"></div>
    <div class="leftBox">
      <div class="title">近30天订单收益</div>
      <div>
        <el-statistic group-separator="," :precision="2" :value="income" title="累计收入">
          <template slot="prefix">
            <i class="el-icon-caret-top" style="color: green"></i>
          </template>
        </el-statistic>
      </div>
      <div>
        <el-statistic group-separator="," :precision="2" :value="deficit" title="累计支出">
          <template slot="prefix">
            <i class="el-icon-caret-bottom" style="color: red"></i>
          </template>
        </el-statistic>
      </div>
      <div>
        <el-statistic group-separator="," :precision="2" :value="turnover" title="累计日盈利">
          <template slot="prefix">
            <i class="el-icon-s-data" style="color: green"></i>
          </template>
        </el-statistic>
      </div>
      <div>
        <el-statistic group-separator="," :precision="2" :value="turnover / 30" title="平均日盈利">
          <template slot="prefix">
            <i class="el-icon-s-data" style="color: green"></i>
          </template>
        </el-statistic>
      </div>
    </div>
  </div>
</template>

<script>
import { orderCount } from '@/api/order.js'
export default {
  name: 'Order-Count',
  data() {
    return {
      monthOrderCount: null,
      deficit: 0, // 支出
      income: 0, // 收入
      turnover: 0 // 日盈利
    }
  },
  methods: {
    initData() {
      // 获取当前时间
      const date = new Date()
      // 当前时间戳
      const nowTime = date.getTime()
      // 1天时间的时间戳
      const oneDayTime = 24 * 60 * 60 * 1000

      orderCount(nowTime - (30 * oneDayTime), nowTime, nowTime).then(res => {
        const data = res.data
        if (data.code === 20011) {
          this.monthOrderCount = data.data
          this.monthChart(this.monthOrderCount)
          this.monthCount(this.monthOrderCount)
        } else {
          this.$message({
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
    monthChart(data) {
      // 解决{_ob_: Observer}无法取值问题
      data = JSON.parse(JSON.stringify(data))

      const timeList = []
      const cancelOrderList = []
      const completedOrderList = []
      const paymentOrderList = []
      const returnOrderList = []

      // cancelOrder Object 取消订单数
      // completedOrder Object 完成订单数
      // deficit 0 支出
      // income 3201 收入
      // paymentOrder Object 支付订单
      // returnOrder Object 退款订单
      // turnover 3201 日盈利

      data.forEach(element => {
        timeList.push(element.time)
        cancelOrderList.push(element.data.cancelOrder.quantity)
        completedOrderList.push(element.data.cancelOrder.quantity)
        paymentOrderList.push(element.data.paymentOrder.quantity)
        returnOrderList.push(element.data.returnOrder.quantity)
      })

      const myChart = this.echarts.init(document.getElementById('monthOrderCount'))
      myChart.setOption({
        legend: {
          // Try 'horizontal'
          orient: 'vertical',
          right: 30
        },
        title: {
          text: '近30天订单统计',
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: timeList
        },
        tooltip: {},
        yAxis: {
        },
        series: [
          {
            name: '支付订单',
            type: 'bar',
            data: paymentOrderList
          },
          {
            name: '完成订单',
            type: 'bar',
            data: paymentOrderList
          },
          {
            name: '取消订单',
            type: 'bar',
            data: cancelOrderList
          },
          {
            name: '退款订单',
            type: 'bar',
            data: returnOrderList
          }
        ]
      })
    },
    monthCount(data) {
      let deficit = 0.00
      let income = 0.00
      let turnover = 0.00

      data.forEach(element => {
        deficit += element.data.deficit
        income += element.data.income
        turnover += element.data.turnover
      })

      this.deficit = deficit
      this.income = income
      this.turnover = turnover
    }
  },
  created() {
    this.initData()
  },
  mounted() {
    this.$bus.$on('init', (val) => {
      if (val) {
        this.monthOrderCount = null
        this.deficit = 0 // 支出
        this.income = 0 // 收入
        this.turnover = 0 // 日盈利
        this.initData()
      }
    })
  },
  beforeDestroy() {
    this.$bus.$off('init')
  }
}
</script>

<style lang="less" scoped>
.container{
  display: flex;
  .leftBox{
    flex: 2;
    .title{
      font-size: 18px;
      font-weight: bolder;
      color: #474747;
    }
  }
  #monthOrderCount{
    flex: 4;
    width: 100%;
    height: 300px;
  }
}
</style>
