<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoles">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['elBottom', i1 === 0 ? 'elTop' : '', 'vcenter']"
            >
              <el-col :span="5">
                <el-tag closable @close="removeTagById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i
              ></el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'elTop', 'vcenter']"
                >
                  <el-col :span="6"
                    ><el-tag
                      type="success"
                      closable
                      @close="removeTagById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i
                  ></el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeTagById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row></el-col
              >
            </el-row>
            <!-- <pre>
                    {{ scope.row }}
                </pre
            > -->
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRole(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightsDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="defArray = []"
    >
      <el-tree
        :data="setRightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defArray"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allowRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="addRoleDialogClose"
    >
      <el-form
        ref="addRoleFormRef"
        :model="addRoleForm"
        :rules="addRoleRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleTrue">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
    >
      <el-form
        ref="editRoleFormRef"
        :model="editRoleMessage"
        :rules="addRoleRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleMessage.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleMessage.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleTrue">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      setRightDialogVisible: false,
      setRightList: [],
      treeProps: {
        label: "authName",
        children: "children",
      },
      defArray: [],
      //   用户权限id
      roleID: "",
      addRoleDialogVisible: false,
      addRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      addRoleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [{ message: "请输入角色描述", trigger: "blur" }],
      },
      editRoleDialogVisible: false,
      editRoleMessage: {},
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        this.$message.error("角色列表获取失败");
      }
      this.rolesList = res.data;
      console.log(this.rolesList);
    },
    async removeTagById(role, reid) {
      const removeTag = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (removeTag !== "confirm") {
        this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http
        .delete(`roles/${role.id}/rights/${reid}
      
`);
      if (res.meta.status !== 200) {
        this.$message.error("删除权限失败");
      }
      role.children = res.data;
    },
    // 分配权限
    async showSetRightsDialog(role) {
      const { data: res } = await this.$http.get(`rights/tree`);
      if (res.meta.status !== 200) {
        this.$message.error("获取权限列表失败");
      }
      this.setRightList = res.data;
      console.log(this.setRightList);
      this.getLeafKeys(role, this.defArray);
      this.roleID = role.id;

      this.setRightDialogVisible = true;
    },
    // 通过递归的形式，将角色下所有三级权限下的id，保存到defkey数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    async allowRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleID}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        this.$message.error("分配权限失败");
      }
      this.getRolesList();

      this.$message.success("分配权限成功 ");
      this.setRightDialogVisible = false;
    },
    addRoles() {
      this.addRoleDialogVisible = true;
    },
    addRoleTrue() {
      console.log(this.addRoleForm.roleName);
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addRoleForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加角色失败");
        }
        this.$message.success("添加角色成功");
        this.getRolesList();
        this.addRoleDialogVisible = false;
      });
    },
    addRoleDialogClose() {
      this.$refs.addRoleFormRef.resetFields();
    },
    async editRole(id) {
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status !== 200) {
        this.$message.error("获取角色信息失败");
      }
      this.editRoleMessage = res.data;
      console.log(this.editRoleMessage);
      this.editRoleDialogVisible = true;
    },
    editRoleTrue() {
      this.$refs.editRoleFormRef.validate(async (vaild) => {
        if (!vaild) return;
        const { data: res } = await this.$http.put(
          `roles/${this.editRoleMessage.roleId}`,
          {
            roleName: this.editRoleMessage.roleName,
            roleDesc: this.editRoleMessage.roleDesc,
          }
        );
        console.log(res);

        if (res.meta.status !== 200) {
          this.$message.error("编辑角色失败");
        } else {
          this.$message.success("编辑角色成功");
          this.getRolesList();
          this.editRoleDialogVisible = false;
        }
      });
    },
    async delRole(id) {
      const { data: res } = await this.$http.delete(`roles/${id}`);
      if (res.meta.status !== 200) {
        this.$message.error("删除角色信息失败");
      }
      this.getRolesList();
      this.$message.success("删除角色成功");
    },
  },
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.elTop {
  border-top: 1px solid #eee;
}
.elBottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>