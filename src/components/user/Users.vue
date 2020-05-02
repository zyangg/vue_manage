<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20"><!-- 列之间的距离 -->
        <el-col :span="7"><!-- 列占多宽 -->
          <!-- 搜索与添加区 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            :clearable="true"
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <!-- 按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <!-- 状态列 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
              <!-- switch开关 -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <!-- 操作列 -->
         <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配权限 -->
            <el-tooltip content="分配角色" placement="top" :enterable="false"><!-- 自动隐藏 -->
              <el-button type="warn" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,2,5,10]"
        :page-size="queryInfo.pagesize"
        :total="total"
        layout="total, sizes ,prev,pager,next,jumper"
      ></el-pagination>
    </el-card>
    <!--添加对话框-->
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
<!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!--分配角色对话框-->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleClosed">
      <div>
        <p>当前用户: {{userInfo.username}}</p>
        <p>当前角色: {{userInfo.role_name}}</p>
        <p>
          分配新角色
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in  rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    // 自定义邮箱校验规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 自定义手机校验规则
    var checkPhone = (rule, value, cb) => {
      const regPhone = /^[1][3,4,5,7,8][0-9]{9}$/
      if (regPhone.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      /* 获取用户列表参数 */
      queryInfo: {
        query: '',
        pagenum: 1, // 当前页码
        pagesize: 2 // 显示几条数据
      },
      /* 保存用户数据 */
      userlist: [],
      /* 总数据数 */
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 控制编辑用户对话框的显示与隐藏
      editDialogVisible: false,
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      userInfo: {},
      // 修改用户表单数据
      editForm: {},
      // 添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度3-10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度3-10个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      // 修改用户表单验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      rolesList: [],
      selectedRoleId: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    /* 获取用户列表 */
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize的改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听当前页码的改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听switch的改变
    async userStateChanged (userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('用户状态更新失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 监听添加用户对话框的关闭重置
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 监听编辑用户对话框的关闭重置
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 添加用户表单点击按钮表单预验证
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // 查询用户信息
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('users/' + id)
      this.editDialogVisible = true
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 编辑用户信息
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户失败')
        }
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('更新用户成功')
      })
    },
    // 根据id删除用户
    async removeUserById (id) {
      const res = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (res !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: rs } = await this.$http.delete('users/' + id)
      if (rs.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('用户删除成功')
      this.getUserList()
    },
    async setRole (userInfo) {
      this.userInfo = userInfo
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.$message.success('请求成功')
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    async saveRoleInfo () {
      if (!this.selectedRoleId) {
        this.$message.error('请选择一个角色')
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新用户角色失败')
      }
      this.$message.success('更新用户角色成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    setRoleClosed () {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style lang="less" scoped>
</style>
