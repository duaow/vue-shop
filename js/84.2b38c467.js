"use strict";(self["webpackChunkvue_shop"]=self["webpackChunkvue_shop"]||[]).push([[84],{56084:function(t,e,a){a.r(e),a.d(e,{default:function(){return o}});var r=function(){var t=this,e=t._self._c;return e("div",[e("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[e("el-breadcrumb-item",{attrs:{to:{path:"/home"}}},[t._v("首页")]),e("el-breadcrumb-item",[t._v("权限管理")]),e("el-breadcrumb-item",[t._v("权限列表")])],1),e("el-card",[e("el-table",{attrs:{data:t.rightsList,border:"",stripe:""}},[e("el-table-column",{attrs:{type:"index",label:"#"}}),e("el-table-column",{attrs:{prop:"authName",label:"权限名称"}}),e("el-table-column",{attrs:{prop:"path",label:"路径"}}),e("el-table-column",{attrs:{prop:"level",label:"权限等级"},scopedSlots:t._u([{key:"default",fn:function(a){return["0"===a.row.level?e("el-tag",[t._v("一级")]):"1"===a.row.level?e("el-tag",{attrs:{type:"success"}},[t._v("二级")]):e("el-tag",{attrs:{type:"warning"}},[t._v("三级")])]}}])})],1)],1)],1)},s=[],l={data(){return{rightsList:[]}},created(){this.getRightsList()},methods:{async getRightsList(){const{data:t}=await this.$http.get("rights/list");200!==t.meta.status&&this.$message.error("获取权限列表失败"),this.rightsList=t.data}}},i=l,u=a(1001),n=(0,u.Z)(i,r,s,!1,null,"4db3c059",null),o=n.exports}}]);
//# sourceMappingURL=84.2b38c467.js.map