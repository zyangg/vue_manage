<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="goback">退出</el-button>
    </el-header>
    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边区域 -->
      <!-- 判断是否折叠来显示宽度 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <!-- 折叠按钮 -->
        <div class="toggle-button" @click="toggle">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <!-- index只接受字符串 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconlist[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <!-- 开启路由模式 通过index实现路由跳转 -->
            <el-menu-item
              :index="'/'+subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="save('/'+subitem.path)"
            >
            <!-- 二级菜单模板   -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      /* 左侧菜单数据 */
      menulist: [],
      /* 利用id对应图标 */
      iconlist: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      /* 是否折叠 */
      isCollapse: false,
      /* 激活链接的index  */
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('active')
  },
  methods: {
    /* 退出功能 */
    goback () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    /* 获得所有菜单 */
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },
    /* 导航菜单切换折叠与展开 */
    toggle () {
      this.isCollapse = !this.isCollapse
    },
    /* 保存链接的激活状态 */
    save (activePath) {
      window.sessionStorage.setItem('active', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  font-size: 20px;
  color: #fff;
  div {
    display: flex;
    align-items: center;
    margin-left: 15px;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background: #eaedf1;
}
.el-container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
