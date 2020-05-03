<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <!-- selection-type取消复选框expand-type 取消展开列show-index索引index-text="#"索引名字
         border边框   :show-row-hover="false"鼠标经过是否高亮-->
      <tree-table
        class="treetable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!--是否有效 模板名为isok-->
        <template v-slot:isOk="scope">
          <!-- 用v-if来判断显示那个图标 -->
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false "
            style="color: lightgreen;"
          ></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
          <!-- 排序 -->
        </template>
        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!--操作-->
        <template slot="opt">
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        label-width="100px"
        :rules="addCateFormRules"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- 级联选择器 options指定数据源 props用来指定级联选择器的配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{ expandTrigger: 'hover' ,label: 'cat_name',
     value:'cat_id' ,children: 'children'}"
            @change="parentCateChange"
            clearable
            checkStrictly
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类数据列表
      catelist: [],
      // 数据总条数
      total: 0,
      columns: [
        {
          label: '分类名称', // 标题
          prop: 'cat_name' // 属性名称
        },
        {
          label: '是否有效',
          type: 'template', // 当前列为模板列
          template: 'isOk' // 模板名称
        },
        {
          label: '排序',
          type: 'template', // 当前列为模板列
          template: 'order' // 模板列名称
        },
        {
          label: '操作',
          type: 'template', // 当前列为模板列
          template: 'opt' // 模板列名称
        }
      ],
      /* 控制添加分类对话框的显示与隐藏 */
      addCateDialogVisible: false,
      /* 添加表单分类对象 */
      addCateForm: {
        cat_name: '', // 父级名称
        cat_pid: 0, // 父级id
        cat_level: 0 // 父级等级
      },
      // 表单验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类列表
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的数组
      selectedKeys: []
    }
  },
  methods: {
    // 获取商品列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品失败')
      }
      this.catelist = res.data.result
      this.total = res.data.total
    },
    /* 监听pagesize改变 */
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    /* 监听pagenum的改变 */
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮展示添加商品分类对话框
    showAddCateDialog () {
      /* 先获取父级分类数据列表 */
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      this.parentCateList = res.data
    },
    // 选择项发生变化
    parentCateChange () {
      // selectedKeys的length大于0说明选中了父级分类
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        this.addCateForm.cat_level = this.selectedKeys.length
        return true
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0
        // 父级分类的等级
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮添加分类
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return true
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听对话框的关闭 重置表单
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    }
  },
  created () {
    this.getCateList()
  }
}
</script>
<style lang="less" scoped>
.treetable {
  margin-top: 15px;
}
</style>
