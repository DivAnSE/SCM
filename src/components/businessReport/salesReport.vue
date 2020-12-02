<template>
    <div style="height:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>业务报表</el-breadcrumb-item>
            <el-breadcrumb-item>月度销售报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div class="block">
                <el-date-picker v-model="date" type="month" value-format="yyyy-MM" placeholder="选择月" size="small"></el-date-picker>
                <el-button type="success" @click="search" size="small">查询</el-button>
            </div>
            <el-table :data="mainList" v-show="mainList.length>=1">
                <el-table-column prop="totalnum" label="销售单数"></el-table-column>
                <el-table-column prop="endtotalnum" label="已了结单数"></el-table-column>
                <el-table-column prop="sototal" label="销售总金额"></el-table-column>
                <el-table-column prop="totalpay" label="已付款金额"></el-table-column>
            </el-table>
            <el-table :data="details" v-show="details.length>=1" height="350">
                <el-table-column prop="soId" label="销售单号"></el-table-column>
                <el-table-column prop="customerCode" label="客户编号" width="90"></el-table-column>
                <el-table-column prop="customerName" label="客户名称"></el-table-column>
                <el-table-column prop="createTime" label="销售日期"></el-table-column>
                <el-table-column prop="account" label="经手人" width="90"></el-table-column>
                <el-table-column prop="soTotal" label="销售单总金额"></el-table-column>
                <el-table-column prop="" label="未付款金额"></el-table-column>
                <el-table-column prop="status" label="处理状态" width="100"></el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="block" v-show="details.length>=1">
                <el-pagination layout="prev, pager, next" :total="total" :current-page="currentPage" @current-change="handleCurrentChange"></el-pagination>
            </div>
        </el-card>
    </div>
</template>
<script>
import Axios from 'axios'
export default {
    data(){
        return {
            date:'',
            mainList:[],
            details:[],
            currentPage:1,
            total:10,
        }
    },
    methods:{
        //获取数据
        getReportList(){
            this.mainList=[];
            Axios.get('/cgi/main/report/somain/main?time='+this.date+'&page='+this.currentPage).then(res=>{
                this.mainList.push(res.data);
                this.details=res.data.details.list
                this.currentPage = res.data.details.pageNum;
                this.total = res.data.details.total
            })
        },
        search(){
            this.getReportList();
        },
        handleCurrentChange(newPage){
            this.currentPage = newPage;
            this.getReportList();
        }
    }
}
</script>