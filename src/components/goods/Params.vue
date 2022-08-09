<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意:只允许为第三级分类设置参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row class="row-col">
        <el-col>
          <span style="margin-right: 10px">选择商品分类:</span>
          <el-cascader
            v-model="selectCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态属性面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isbtndisabled"
            @click="adddialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态表格 -->
          <el-table :data="manyTableData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  style="margin-right: 10px"
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeCate(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isbtndisabled"
            @click="adddialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态表格 -->
          <el-table :data="onlyTableData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  style="margin-right: 10px"
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeCate(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加属性对话框 -->
    <el-dialog
      :title="`添加${addTitle}`"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="addTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addparams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑属性对话框 -->
    <el-dialog
      :title="`编辑${addTitle}`"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="addTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editparams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      selectCateKeys: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      adddialogVisible: false,
      addForm: {
        attr_name: "",
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: `请输入参数名称
            `,
            trigger: "blur",
          },
        ],
      },
      editdialogVisible: false,
      editForm: {
        attr_name: "",
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        this.$message.error("获取分类列表失败");
      }
      this.cateList = res.data;
      console.log(this.cateList);
    },
    // 级联选择器的更改事件
    async handleChange() {
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = [];
        (this.manyTableData = []), (this.onlyTableData = []);
      } else {
        this.getParamsData();
      }
    },
    // tabs标签改变触发事件
    handleTabClick() {
      console.log(this.activeName);
      this.getParamsData();
    },
    async getParamsData() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );

      if (res.meta.status !== 200) {
        this.$message.error("获取参数失败");
      } else {
        res.data.forEach((item) => {
          // 将字符串拆分为数组
          item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
          // 为每行new tag 添加自己独有的属性
          item.inputVisible = false;

          item.inputValue = "";
        });
        console.log(res.data);
        if (this.activeName === "many") {
          this.manyTableData = res.data;
        } else {
          this.onlyTableData = res.data;
        }
      }

      console.log(res.data);
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    addparams() {
      this.$refs.addFormRef.validate(async (vali) => {
        if (!vali) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes
`,
          { attr_name: this.addForm.attr_name, attr_sel: this.activeName }
        );
        if (res.meta.status !== 201) {
          this.$message.error("添加参数失败");
        } else {
          this.$message.success("添加参数成功");
          this.getParamsData();
          this.adddialogVisible = false;
        }
      });
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        { params: { attr_sel: this.activeName } }
      );
      if (res.meta.status !== 200) {
        this.$message.error("获取属性失败");
      }
      this.editForm = res.data;
      this.editdialogVisible = true;
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    editparams() {
      this.$refs.editFormRef.validate(async (vali) => {
        if (!vali) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("编辑更新失败");
        } else {
          this.$message.success("编辑更新成功");
          this.getParamsData();
        }
      });
      this.editdialogVisible = false;
    },
    async removeCate(id) {
      const removecate = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (removecate !== "confirm") {
        this.$message.info("删除已取消");
      } else {
        const { data: res } = await this.$http
          .delete(`categories/${this.cateId}/attributes/${id}
        
`);
        if (res.meta.status !== 200) {
          this.$message.error("删除失败");
        } else {
          this.$message.success("删除成功");
          this.getParamsData();
        }
      }
    },
    // input 失去焦点或者按下回车触发事件
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      } else {
        row.attr_vals.push(row.inputValue.trim());
        row.inputValue = "";
        row.inputVisible = false;
        this.tagShow(row);
      }
    },
    async tagShow(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(","),
        }
      );
      if (res.meta.status !== 200) {
        this.$message.error("提交更新参数失败");
      } else {
        this.$message.success("提交参数成功");
      }
    },
    showInput(row) {
      row.inputVisible = true;
      // this.$nextTick 在页面元素重新渲染之后，执行回调函数
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除tag标签
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.tagShow(row);
    },
  },
  computed: {
    isbtndisabled() {
      if (this.selectCateKeys.length === 3) {
        return false;
      } else {
        return true;
      }
    },
    cateId() {
      if (this.selectCateKeys.length === 3) {
        return this.selectCateKeys[this.selectCateKeys.length - 1];
      } else {
        return null;
      }
    },
    addTitle() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
};
</script>
<style lang="less" scoped>
.row-col {
  margin: 15px 0;
}
.el-tab-pane {
  text-align: left;
}
.input-new-tag {
  width: 120px;
}
</style>