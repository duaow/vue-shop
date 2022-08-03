<template>
  <el-container class="home-container">
    <el-header
      ><div>
        <img src="../assets/logo.png" alt="" />
        <span>vue电商项目管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button></el-header
    >
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse()">|||</div>
        <el-menu
          background-color="#333747"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <el-menu-item
              :index="`/${subItem.path}`"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveActiveStatus(`/${subItem.path}`)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList();
    this.activePath = sessionStorage.getItem("activePath");
  },
  data() {
    return {
      menuList: [],
      iconsObj: {
        125: "iconfont icon-shuangren",
        103: "iconfont icon-zhengfangti-xianxing",
        101: "iconfont icon-gouwudai",
        102: "iconfont icon-dingdan",
        145: "iconfont icon-shujutongji",
      },
      isCollapse: false,
      activePath: "",
    };
  },
  methods: {
    logout() {
      sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      const res = await this.$http.get("menus");
      console.log(res);
      if (res.data.meta.status !== 200) this.$message.error(res.data.meta.msg);
      this.menuList = res.data.data;
      console.log(this.menuList);
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接的激活状态
    saveActiveStatus(activePath) {
      sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  padding-left: 0;
  div {
    height: 100%;
    display: flex;
    align-items: center;
    span {
      padding-left: 15px;
    }
    img {
      height: 100%;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  height: 100%;
}

.el-submenu .el-menu-item {
  padding: 0;
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
}
</style>