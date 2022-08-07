<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate"> 添加分类 </el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        show-index
        index-text="#"
        :show-row-hover="false"
        :selection-type="false"
        :expand-type="false"
        border
        class="treetable"
      >
        <!--是否有效 使用作用域插槽 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-circle-close"
            v-if="scope.row.cat_deleted"
            style="color: red"
          ></i>
          <i class="el-icon-circle-check" v-else style="color: lightgreen"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="option" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCate(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="delCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <el-form
        :model="addCateData"
        :rules="addCateDataRule"
        ref="addCateDataRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateData.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- option数据源 props 进行配置选项 -->
          <el-cascader
            expand-trigger="hover"
            v-model="selectKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            change-on-select
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCates()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
    >
      <el-form
        :model="editCateData"
        :rules="addCateDataRule"
        ref="editCateDataRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateData.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCates()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      total: 0,
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          //   作用域插槽的使用
          type: "template",
          template: "isOk",
        },
        {
          label: "排序",

          type: "template",
          template: "order",
        },
        {
          label: "操作",

          type: "template",
          template: "option",
        },
      ],
      addCateDialogVisible: false,
      editCateDialogVisible: false,
      addCateData: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0,
      },
      editCateData: {
        cat_name: "",
      },
      addCateDataRule: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      parentCateList: [],
      // 级联选择器的配置
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectKeys: [],
      editCateIds: "",
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //   获取分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        this.$message.error("获取商品分类数据列表失败");
      }
      this.$message.success("获取商品分类数据列表成功");
      this.cateList = res.data.result;

      this.total = res.data.total;
    },
    // 分页器
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getCateList();
    },
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum;
      this.getCateList();
    },
    // 展示添加对话框
    addCate() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    // 获取父级分类列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        this.$message.error("获取父级数据失败");
      }
      this.parentCateList = res.data;
      console.log(this.parentCateList);
    },
    // 选择项发生改变触发函数
    parentCateChange() {
      if (this.selectKeys.length > 0) {
        this.addCateData.cat_pid = this.selectKeys[this.selectKeys.length - 1];
        this.addCateData.cat_level = this.selectKeys.length;
      } else {
        this.addCateData.cat_pid = 0;
        this.addCateData.cat_level = 0;
      }
    },
    addCates() {
      this.$refs.addCateDataRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateData
        );
        if (res.meta.status !== 201) {
          this.$message.error("添加分类失败");
        }

        this.$message.success("添加分类成功");
        this.getCateList();
      });
      this.addCateDialogVisible = false;
    },
    addCateDialogClose() {
      this.$refs.addCateDataRef.resetFields();
      this.selectKeys = [];
      this.addCateData.cat_pid = 0;
      this.addCateData.cat_level = 0;
    },
    async editCate(id) {
      const { data: res } = await this.$http.get(`categories/${id}`);
      if (res.meta.status !== 200) {
        this.$message.error("获取失败");
      } else {
        this.editCateData.cat_name = res.data.cat_name;

        this.editCateIds = res.data;
        console.log(res.data);

        this.editCateDialogVisible = true;
      }
    },
    editCates() {
      console.log(this.editCateIds.cat_id);
      this.$refs.editCateDataRef.validate(async (valid) => {
        if (!valid) return;
        console.log(this.editCateIds.cat_id);
        const { data: res } = await this.$http.put(
          `categories/${this.editCateIds.cat_id}`,
          this.editCateData
        );
        console.log(this.editCateIds.cat_id);
        console.log(res);

        if (res.meta.status !== 200) {
          this.$message.error("更新分类失败");
        }

        this.$message.success("更新分类成功");
        this.getCateList();
      });
      this.editCateDialogVisible = false;
    },
    // editCateDialogClose() {
    //   this.$refs.editCateDataRef.resetFields();
    // },
    async delCate(id) {
      const delCates = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (delCates !== "confirm") {
        this.$message.success("已取消删除");
      } else {
        const { data: res } = await this.$http.delete(`categories/${id}`);
        console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error("删除失败");
        } else {
          this.$message.success("删除成功");
          this.getCateList();
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.treetable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>