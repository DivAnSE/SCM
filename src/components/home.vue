<template>
    <el-container>
        <el-header>
            <div class="logo">
                <h4>A企业进销存系统</h4>
            </div>
            <div class="head_info">
                <el-button type="danger" size="small" @click="logout">退出</el-button>
            </div>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-menu active-text-color="#409Eff" unique-opened router>
                    <el-submenu :index="item.id +''" v-for="item in asidMenuList" :key='item.id' >
                        <template slot="title">
                            <i :class="iconList[item.id]"></i>
                            <span>{{item.authorName}}</span>
                        </template>
                        <el-menu-item :index="'/' +secItem.path" v-for="secItem in item.children" :key="secItem.id">
                            <template slot="title">
                                <i class="el-icon-d-arrow-right"></i>
                                <span>{{secItem.authorName}}</span>
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
import Axios from 'axios'
export default {
    data(){
        return{
            //侧边栏列表
            asidMenuList:[
                {id:1,authorName:"系统管理",children:[
                    {id:101,authorName:'用户管理',path:'user'},
                    {id:102,authorName:'重新登录',path:''},
                    {id:103,authorName:'退出系统',path:'quit'},
                ]},
                {id:2,authorName:"采购管理",children:[
                    {id:104,authorName:'供应商管理',path:'supplier'},
                    {id:105,authorName:'新添采购订单',path:'addPurchaseOrder'},
                    {id:106,authorName:'采购单了结',path:'purchaseOrderClosure'},
                    {id:107,authorName:'采购单查询',path:'searchPurchaseOrder'},
                ]},
                {id:3,authorName:"仓储管理",children:[
                    {id:108,authorName:'入库登记',path:'warehouseRegistration'},
                    {id:109,authorName:'出库登记',path:'outboundRegistration'},
                    {id:110,authorName:'库存盘点',path:'stockTaking'},
                    {id:111,authorName:'库存查询',path:'searchInventory'},
                ]},
                {id:4,authorName:"财务收支",children:[
                    {id:112,authorName:'收款登记',path:'collectionRegistration'},
                    {id:113,authorName:'付款登记',path:'paymentRegistration'},
                    {id:114,authorName:'收支查询',path:'paymentSearch'},
                ]},
                {id:5,authorName:"销售管理",children:[
                    {id:115,authorName:'产品分类管理',path:'productCategories'},
                    {id:116,authorName:'产品管理',path:'productManagement'},
                    {id:117,authorName:'客户管理',path:'customer'},
                    {id:118,authorName:'新添销售单',path:'addSalesList'},
                    {id:119,authorName:'销售单了结',path:'salesListClose'},
                    {id:120,authorName:'销售单查询',path:'searchSalesList'},
                ]},
                {id:6,authorName:"业务报表",children:[
                    {id:121,authorName:'月度采购报表',path:'purchasingReport'},
                    {id:122,authorName:'月度收支登记表',path:'paymentRegistrationReport'},
                    {id:123,authorName:'月度入库报表',path:'warehouseReport'},
                    {id:124,authorName:'月度出库报表',path:'outboundReport'},
                    {id:125,authorName:'产品库存报表',path:'inventoryReport'},
                    {id:126,authorName:'月度销售报表',path:'salesReport'},
                ]},
                {id:7,authorName:"网上销售",children:[
                    {id:127,authorName:'客户注册',path:'customerRegist'},
                    {id:128,authorName:'商品展示',path:'showProducts'},
                    {id:129,authorName:'网上下单',path:'orderOnline'}
                ]},
            ],
            //一级菜单图标
            iconList:{
                '1':'iconfont icon-adjust',
                '2':'iconfont icon-icon-test',
                '3':'iconfont icon-huowudui',
                '4':'iconfont icon-rmb',
                '5':'iconfont icon-libra',
                '6':'iconfont icon-data-view',
                '7':'iconfont icon-qiapianmoshi_kuai',
            }
        }
    },
    methods:{
        logout(){
            this.$confirm('退出登录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            Axios.get("/cgi/sys/logout").then(resp=>{
                sessionStorage.clear("user");
                this.$router.push({path:'/'}) 
        })
            this.$message({
                type: 'success',
                message: '退出成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
            
        }
    }
}
</script>
<style scoped>
.el-header{
    display: flex;
    justify-content: space-between;
    background-color: #343D41;
    color: #333;
    line-height: 60px;
  }
.logo{color: white;}
.el-aside {
    background-color: #D3DCE6;
    line-height: 200px;
  }
  
.el-main {
    background-color: #E9EEF3;
    color: #333;
  }
.el-menu{
    background-color: #D1DCE5;
}
.iconfont{
    font-size: 1.4em;
    margin-right: 5px;
}
</style>