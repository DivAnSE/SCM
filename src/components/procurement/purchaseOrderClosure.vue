<template>
    <div style="height:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>采购管理</el-breadcrumb-item>
            <el-breadcrumb-item>采购了结</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-table :data="orderList" style="width: 100%" stripe>
                <el-table-column prop="poId" sortable label="采购单编号" width="150"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="170"></el-table-column>
                <el-table-column prop="venderName" label="供应商名称"></el-table-column>
                <el-table-column prop="account" label="创建用户" width="80"></el-table-column>
                <el-table-column prop="tipFee" label="附加费用" width="80"></el-table-column>
                <el-table-column prop="productTotal" label="采购产品总价"></el-table-column>
                <el-table-column prop="poTotal" label="采购单总价"></el-table-column>
                <el-table-column  label="付款方式" width="80">
                    <template slot-scope="scope">
                        <el-tag type="success" effect="dark" v-if="scope.row.payType==1">货到付款</el-tag>
                        <el-tag type="success" effect="dark" v-if="scope.row.payType==2">款到发货</el-tag>
                        <el-tag type="success" effect="dark" v-if="scope.row.payType==3">预付款到发货</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="prePayFee" label="最低预付款金额"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                    <el-link type="primary" @click="checkOut(scope.row)">了结</el-link>
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
import dayjs from 'dayjs';
export default {
    data(){
        return{
            //单据列表
           orderList:[],
           value:'',
            //单据类型
           orderType:4,
           //当前页
           currentPage:1,
           //总数
           total:10,
        }
    },
    created(){
        this.getPurchaseOrderList();
    },
    methods: {
        //获取指定类型采购单据
        getPurchaseOrderList(){
            Axios.get('/cgi/main/purchase/pomain/show?type='+this.orderType+"&page="+this.currentPage).then(res=>{
                this.orderList = res.data.list;
                this.currentPage = res.data.pageNum;
                this.total = res.data.total;
            })
        },
        //了结
        checkOut(pro){
            this.$alert('是否将此条采购单了结？', '采购单了结', {
                    confirmButtonText: '确定',
                    callback: action => {
                        Axios.post('/cgi/main/purchase/pomain/end?poId='+pro.poId+'&payType='+pro.payType).then(res=>{
                        if(res.data.code===2){
                            this.$message({
                                type:'success',
                                message:res.data.message,
                            })
                            this.getPurchaseOrderList();
                        }else{
                            this.$message.error(res.data.message)
                        }
                })
                }
            });
        },
        handleCurrentChange(newPage){
            this.currentPage = newPage;
            this.getPurchaseOrderList();
        },
    },
}
</script>
<style scoped>
.el-card{
    margin: 15px 0;
}
</style>