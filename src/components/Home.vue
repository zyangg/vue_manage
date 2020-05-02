<template>
  <div>
    <el-button type="success" @click="goback">退出</el-button>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  methods: {
    goback () {
      // 清空token
      window.sessionStorage.clear()
      // 跳转到login
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
