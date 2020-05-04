<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>
<script>
/* 导入echarts */
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data () {
    return {
      /* 配置数据和数据项 需要合并的数据 */
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created () {},
  /* 此时页面上的元素已经被渲染完毕 */
  async mounted () {
    /* 基于准备好的dom 创建echarts实例 */
    var myChart = echarts.init(document.getElementById('main'))
    /* 获取报表数据 */
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取折线图失败')
    }
    /* 实现鼠标跟随效果 需要和并数据源 */
    const result = _.merge(res.data, this.options)
    // 展示数据
    myChart.setOption(result)
  },
  methods: {}
}
</script>
<style lang="less" scoped>
</style>
