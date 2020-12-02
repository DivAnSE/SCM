<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>业务报表</el-breadcrumb-item>
            <el-breadcrumb-item>月度收支报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div class="block">
                <el-date-picker v-model="date" type="month" value-format="yyyy-MM" placeholder="选择月" size="small"></el-date-picker>
                <el-button type="success" @click="search" size="small">查询</el-button>
            </div>
            <el-table :data="mainList" v-show="mainList.length>=1">
                <el-table-column prop="recePrice" label="收款总金额"></el-table-column>
                <el-table-column prop="payPrice" label="付款总金额"></el-table-column>
                <el-table-column prop="receCount" label="收款交易次数"></el-table-column>
                <el-table-column prop="payCount" label="付款交易次数"></el-table-column>
            </el-table>
            <!-- 收款 -->
            <el-table :data="receiptList" v-show="receiptList.length>=1" height="250">
                <el-table-column prop="soId" label="销售单号"></el-table-column>
                <el-table-column prop="createTime" label="销售单日期"></el-table-column>
                <el-table-column prop="pay_time" label="收款日期"></el-table-column>
                <el-table-column prop="pay_price" label="收款金额"></el-table-column>
                <el-table-column prop="account" label="经手人"></el-table-column>
                <el-table-column prop="status" label="处理状态"></el-table-column>
            </el-table>
            <!-- 付款 -->
            <el-table :data="payList" v-show="payList.length>=1" height="250">
                <el-table-column prop="poId" label="采购单编号"></el-table-column>
                <el-table-column prop="createTime" label="采购日期"></el-table-column>
                <el-table-column prop="pay_time" label="付款日期"></el-table-column>
                <el-table-column prop="pay_price" label="付款金额"></el-table-column>
                <el-table-column prop="account" label="经手人"></el-table-column>
                <el-table-column prop="status" label="处理状态"></el-table-column>
            </el-table>
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
            receiptList:[],
            payList:[]
        }
    },
    methods:{
        //获取数据
        getReportList(){
            this.mainList=[];
            Axios.get('/cgi/main/report/payment/main?time='+this.date).then(res=>{
                this.mainList.push(res.data)
            })
        },
        //收款
        getReceiptList(){
            Axios.get('/cgi/main/report/payment/detail/receipt?time='+this.date).then(res=>{
                this.receiptList = res.data.list
            })
        },
        //付款
        getPayList(){
            Axios.get('/cgi/main/report/payment/detail/pay?time='+this.date).then(res=>{
                this.payList = res.data.list
                console.log(this.payList);
            })
        },
        search(){
            this.getReportList();
            this.getReceiptList();
            this.getPayList();
        },
        handleCurrentChange(newPage){
            this.currentPage = newPage;
            this.getReportList();
        }
    }
}
</script>
<style  scoped>
.div{
  height:80%;
  overflow:auto;
 }
</style>