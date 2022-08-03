<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="usersInfo.query"
            clearable
            @change="getUSerList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUSerList()"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <el-table :data="userList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              v-bind="scope.row"
              @click="showEditDialog(scope.row.id)"
            ></el-button>

            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserInfo(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="usersInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="usersInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户弹窗 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addRuleForm"
        label-width="70px"
      >
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
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息弹窗 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="EditDiglog"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="editFormRule"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditDiglog = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getUSerList();
  },
  data() {
    // 添加用户的自定义校验规则
    var checkEmail = (rule, value, cb) => {
      const regEmail =
        /^[A-Za-z0-9\-_]+[A-Za-z0-9\.\-_]*[A-Za-z0-9\-_]+@[A-Za-z0-9]+[A-Za-z0-9\.\-_]*(\.[A-Za-z0-9\.\-_]+)*[A-Za-z0-9]+\.[A-Za-z0-9]+[A-Za-z0-9\.\-_]*[A-Za-z0-9]+$/;
      if (regEmail.test(value)) {
        cb();
      }
      cb(new Error("请输入正确邮箱地址"));
    };
    var checkMobile = (rule, value, cb) => {
      const regMobile =
        /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;

      if (regMobile.test(value)) {
        cb();
      }
      cb(new Error("请输入正确手机号码"));
    };

    return {
      // 查询用户的请求参数
      usersInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      // 添加用户的弹窗显示参数
      addDialogVisible: false,
      // 添加用户的表单信息
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 编辑用户的弹窗显示参数
      EditDiglog: false,
      // 添加用户的校验规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
      // 编辑的用户信息
      editForm: {},
      // 编辑用户信息校验规则
      editFormRule: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async getUSerList() {
      const { data: res } = await this.$http.get("users", {
        params: this.usersInfo,
      });
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message("获取管理员列表失败");
      }
      this.userList = res.data.users;

      this.total = res.data.total;
    },
    // 分页器函数
    handleSizeChange(newsize) {
      console.log(newsize);
      this.usersInfo.pagesize = newsize;
      this.getUSerList();
    },
    handleCurrentChange(newcurrent) {
      console.log(newcurrent);
      this.usersInfo.pagenum = newcurrent;
      this.getUSerList();
    },
    // 用户状态的改变
    async userStatusChange(userInfo) {
      const { data: res } = await this.$http
        .put(`users/${userInfo.id}/state/${userInfo.mg_state}
      
`);
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("用户状态更新成功");
    },
    // 添加用户表单重置
    addDialogClose() {
      this.$refs.addRuleForm.resetFields();
    },
    // 添加成员
    addUser() {
      this.$refs.addRuleForm.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
        this.addDialogVisible = false;
        this.getUSerList();
      });
    },
    // 获取成员信息
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`users/${id}`);
      if (res.meta.status !== 200)
        return this.$message.error("查询用户信息失败");
      this.editForm = res.data;
      console.log(this.editForm);
      this.EditDiglog = true;
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户信息
    editUserInfo() {
      this.$refs.editFormRef.validate(async (vaild) => {
        if (!vaild) return;
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改用户信息失败");
        }
        this.EditDiglog = false;
        this.getUSerList();
        this.$message.success("用户信息修改成功");
      });
    },
    // 删除用户
    async deleteUserInfo(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete(`users/${id}`);
      if (res.meta.status !== 200) {
        this.$message.error("删除用户失败");
      }
      this.getUSerList();
      return this.$message.success("删除用户成功");
    },
  },
};
</script>

<style lang="less" scoped>
</style>