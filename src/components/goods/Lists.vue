<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList()"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addShops"
            >添加商品</el-button
          ></el-col
        >
      </el-row>
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="90px
          "
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="75px
          "
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="add_time"
          width="140px
          "
          ><template slot-scope="scope">
            {{ scope.row.add_time | moment("YYYY-MM-DD hh:mm:ss") }}
          </template></el-table-column
        >
        <el-table-column
          label="操作"
          width="130px
          "
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delGoodsList(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      goodsList: [],
      total: 0,
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        this.$message.error("商品列表获取失败");
      } else {
        console.log(res.data);
        this.$message.success("商品列表获取成功");
        this.goodsList = res.data.goods;
        this.total = res.data.total;
      }
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getGoodsList();
    },
    handleCurrentChange(newcurrent) {
      this.queryInfo.pagenum = newcurrent;
      this.getGoodsList();
    },
    async delGoodsList(id) {
      const delRult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (delRult !== "confirm") {
        this.$message.info("取消删除");
      } else {
        const { data: res } = await this.$http.delete(`goods/${id}`);
        if (res.meta.status !== 200) {
          this.$message.error("删除失败");
        } else {
          this.$message.success("删除成功");
          this.getGoodsList();
        }
      }
    },
    addShops() {
      this.$router.push("/goods/add");
    },
  },
};
</script>
<style lang="less" scoped>
</style>