<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>业务报表</el-breadcrumb-item>
            <el-breadcrumb-item>月度出库报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div class="block">
                <el-date-picker v-model="date" type="month" value-format="yyyy-MM" placeholder="选择月" size="small"></el-date-picker>
                <el-button type="success" @click="search" size="small">查询</el-button>
            </div>
            <el-table :data="reportList" v-show="reportList.length>=1">
                <el-table-column prop="total" label="出库单据数"></el-table-column>
                <el-table-column prop="totalNum" label="产品总数量"></el-table-column>
                <el-table-column prop="productTotal" label="产品总金额"></el-table-column>
            </el-table>
            <el-table :data="detailsList" v-show="reportList.length>=1" height="450">
                <el-table-column prop="soId" label="销售单号"></el-table-column>
                <el-table-column prop="stockTime" label="出库日期"></el-table-column>
                <el-table-column prop="productCode" label="产品编号"></el-table-column>
                <el-table-column prop="name" label="产品名称"></el-table-column>
                <el-table-column prop="stockNum" label="产品数"></el-table-column>
                <el-table-column prop="productTotal" label="产品总金额"></el-table-column>
            </el-table>
            <div class="block" v-show="reportList.length>=1">
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
            date:'',
            reportList:[],
            detailsList:[],
            currentPage:1,
            total:10,
        }
    },
    methods:{
        getDetailsList(){
            Axios.get('/cgi/main/report/outstock/main?time='+this.date+'&page='+this.currentPage).then(res=>{
                this.detailsList = res.data.details.list;
                this.currentPage = res.data.details.pageNum;
                this.total = res.data.details.total;
            })
        },
        search(){if(!this.date){
                this.$message.error("请选择查询日期");
            }else{
                Axios.get('/cgi/main/report/outstock/main?time='+this.date).then(res=>{
                    this.reportList.push(res.data)
                })
            }
            this.getDetailsList()
        },
        handleCurrentChange(newPage){
            this.currentPage = newPage;
            this.getDetailsList();
        }
    }
}
</script>
<style  scoped>

</style>