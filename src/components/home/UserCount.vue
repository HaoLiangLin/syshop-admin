<template>
  <div class="container">
    <div class="mainBox">
      <div id="monthPvOrRegisterCount"></div>
    </div>
    <div class="otherBox">
      <div id="weekPvCount"></div>
    </div>
  </div>
</template>

<script>
import { registerCount, userPvCount } from '@/api/user.js'

export default {
  name: 'Pv-Count',
  data() {
    return {
      sevePvCount: null,
      monthPvCount: null,
      monthRegisterCount: null
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
      // 用户访问统计 过去一星期
      userPvCount(nowTime - (7 * oneDayTime), nowTime).then(res => {
        const data = res.data
        if (data.code === 20011) {
          // console.log('一星期用户访问统计', data.data)
          this.sevePvCount = data.data
          this.weekPvChart(this.sevePvCount)
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
      const promise = Promise.all([userPvCount(nowTime - (30 * oneDayTime), nowTime), registerCount(nowTime - (30 * oneDayTime), nowTime)])
      promise.then(([res1, res2]) => {
        const data1 = res1.data
        if (data1.code === 20011) {
          this.monthPvCount = data1.data
        } else {
          this.$message({
            message: data1.message,
            type: 'warning'
          })
        }
        const data2 = res2.data
        if (data2.code === 20011) {
          this.monthRegisterCount = data2.data
        } else {
          this.$message({
            message: data2.message,
            type: 'warning'
          })
        }
        this.monthPvAndRegisterChart(this.monthPvCount, this.monthRegisterCount)
      }).catch(err => {
        this.$notify.error({
          title: '错误',
          message: err.message
        })
      })
    },
    // 基于准备好的dom，初始化echarts实例
    weekPvChart(data) {
      // 解决{_ob_: Observer}无法取值问题
      data = JSON.parse(JSON.stringify(data))
      // 初始化
      var myChart = this.echarts.init(document.getElementById('weekPvCount'))
      const timeList = []
      const dataList = []

      data.data.forEach(element => {
        timeList.push(element.time)
        dataList.push(element.quantity)
      })

      // 绘制图表
      myChart.setOption({
        legend: {
          // Try 'horizontal'
          orient: 'vertical',
          right: 30
        },
        title: {
          text: '近7天访问量'
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: timeList
        },
        yAxis: {
        },
        series: [
          {
            name: '访问数',
            type: 'bar',
            smooth: true,
            data: dataList
          }
        ]
      })
    },
    // 基于准备好的dom，初始化echarts实例
    monthPvAndRegisterChart(pvData, registerData) {
      // 解决{_ob_: Observer}无法取值问题
      pvData = JSON.parse(JSON.stringify(pvData))
      registerData = JSON.parse(JSON.stringify(registerData))

      // 初始化
      var myChart = this.echarts.init(document.getElementById('monthPvOrRegisterCount'))
      const timeList = []
      const pvDataList = []
      const registerDataList = []

      pvData.data.forEach(pv => {
        timeList.push(pv.time)
        pvDataList.push(pv.quantity)
      })

      registerData.data.forEach(register => {
        registerDataList.push(register.data.length)
      })

      // 绘制图表
      myChart.setOption({
        legend: {
          // Try 'horizontal'
          orient: 'vertical',
          right: 30
        },
        title: {
          text: '近30天访问与注册统计',
          left: 'center'
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: timeList
        },
        yAxis: {
        },
        series: [
          {
            name: '访问数',
            type: 'line',
            smooth: true,
            data: pvDataList
          },
          {
            name: '注册数',
            type: 'line',
            smooth: true,
            data: registerDataList
          }
        ]
      })
    }
  },
  created() {
    this.initData()
  },
  mounted() {
    this.$bus.$on('init', (val) => {
      if (val) {
        this.sevePvCount = null
        this.monthPvCount = null
        this.monthRegisterCount = null
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
  .mainBox{
    flex: 4;
  }
  .otherBox{
    flex: 2;
  }
  #monthPvOrRegisterCount{
    width: 100%;
    height: 300px;
  }
  #weekPvCount{
    width: 100%;
    height: 100%;
  }
}
</style>
