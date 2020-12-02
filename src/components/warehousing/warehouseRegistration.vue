<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>库存管理</el-breadcrumb-item>
            <el-breadcrumb-item>入库登记</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-table :data="orderList" style="width: 100%" stripe>
                <el-table-column prop="poId" sortable label="采购单编号" width="140"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="170"></el-table-column>
                <el-table-column prop="venderName" label="供应商名称"  width="150">
                </el-table-column>
                <el-table-column prop="account" label="创建用户" width="90"></el-table-column>
                <el-table-column prop="tipFee" label="附加费用" width="90"></el-table-column>
                <el-table-column prop="productTotal" label="采购产品总价" width="110"></el-table-column>
                <el-table-column prop="poTotal" label="采购单总价" width="100"></el-table-column>
                <el-table-column  label="付款方式" width="130">
                    <template slot-scope="scope">
                        <el-tag type="success" effect="dark" v-if="scope.row.payType==1">货到付款</el-tag>
                        <el-tag type="success" effect="dark" v-if="scope.row.payType==2">款到发货</el-tag>
                        <el-tag type="success" effect="dark" v-if="scope.row.payType==3">预付款到发货</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="prePayFee" label="最低预付款" width="100"></el-table-column>
                <el-table-column label="操作" width="60">
                    <template slot-scope="scope">
                    <el-link type="primary" @click="inStock(scope.row)">入库</el-link>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="block">
                <el-pagination layout="prev, pager, next" :total="total" :current-page="currentPage" @current-change="handleCurrentChange"></el-pagination>
            </div>
        </el-card>
    </div>
</template>
<script>
import Axios from 'axios'
export default {
    data(){
        return{
            status:2,
            orderList:[],
            currentPage:1,
            total:10
        }
    },
    created(){
        this.getInstockList();
    },
    methods:{
        getInstockList(){
            Axios.post('/cgi/main/purchase/pomain/show?type='+this.status+'&page='+this.currentPage).then(res=>{
                this.orderList = res.data.list;
                this.total = res.data.total
            })
        },
        //入库
        inStock(order){
            this.$confirm('确定将该采购单入库吗？, 是否继续?', '入库登记', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                Axios.post('/cgi/main/stock/instock?poId='+order.poId+'&payType='+order.payType).then(res=>{
                    if(res.data.code===2){
                            this.$message({
                                type:'success',
                                message:res.data.message
                            })
                            this.getInstockList();
                        }
                })
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消入库'
            });          
        });
        },
        handleCurrentChange(newPage){
            this.currentPage = newPage;
            this.getInstockList();
        }
    }
}
</script>
<style scoped>
    .el-card{
        margin-top: 10px;
    }
</style>