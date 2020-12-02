<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>业务报表</el-breadcrumb-item>
            <el-breadcrumb-item>月度采购报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div class="block">
                <span class="demonstration">查询月份：</span>
                <el-date-picker v-model="date" type="month" size="small" placeholder="选择年月" format="yyyy-MM" value-format="yyyy-MM" @change="search" ></el-date-picker>
            </div>
            <transition name="el-zoom-in-top">
                <el-table :data="pomainReport" v-show="isShow">
                    <el-table-column prop="totalnum" label="采购单总数"></el-table-column>
                    <el-table-column prop="endtotalnum" label="已了结数"></el-table-column>
                    <el-table-column prop="pototal" label="采购单总金额"></el-table-column>
                    <el-table-column prop="totalpay" label="已付款金额"></el-table-column>
                </el-table>
            </transition>
            <transition name="el-zoom-in-top">
                <el-table :data="detailsList" stripe v-show="isShow" height="450">
                    <el-table-column prop="poId" label="采购单编号" width="160"></el-table-column>
                    <el-table-column prop="venderName" label="供应商名称" width="180"></el-table-column>
                    <el-table-column prop="createTime" label="创建日期" width="170"></el-table-column>
                    <el-table-column prop="account" label="创建用户" width="90"></el-table-column>
                    <el-table-column prop="poTotal" label="采购单总金额" width="120"></el-table-column>
                    <el-table-column label="未付款金额" width="100"></el-table-column>
                    <el-table-column prop="payType" label="付款方式" width="90"></el-table-column>
                    <el-table-column prop="prePayFee" label="最低预付款金额" width="120"></el-table-column>
                    <el-table-column label="处理状态" width="80px">
                        <template slot-scope="scope">
                        <el-tag type="success" effect="dark" v-if="scope.row.status==1">新增</el-tag>
                        <el-tag type="success" effect="dark" v-if="scope.row.status==2">已收货</el-tag>
                        <el-tag type="success" effect="dark" v-if="scope.row.status==3">已付款</el-tag>
                        <el-tag type="success" effect="dark" v-if="scope.row.status==4">已了结</el-tag>
                    </template>
                    </el-table-column>
                </el-table>
            </transition>
            <!-- 分页 -->
            <div class="block" v-show="isShow">
                <el-pagination layout="prev, pager, next" :total="total" :current-page="currentPage" @current-change="handleCurrentChange"></el-pagination>
            </div>
        </el-card>
    </div>
</template>
<script>
import Axios from 'axios';
export default {
    data(){
        return{
            date:'',
            currentPage:1,
            pomainReport:[],
            detailsList:[],
            isShow : false,
            total:10,
        }
    },
    methods:{
        search(){
            this.pomainReport=[];
            this.getPomainReport();
            this.getDetails();
            if(!this.date){
                this.isShow = false
            }else this.isShow =true
        },
        getPomainReport(){
            Axios.get('/cgi/main/report/pomain/main?time='+this.date).then(res=>{
                if(res.status===200){
                    this.pomainReport.push(res.data)
                }else{this.$message.error(res.statusText)}
            })
        },
        //获取详单内容
        getDetails(){
            Axios.get('/cgi/main/report/pomain/main?time='+this.date+'&page='+this.currentPage).then(res=>{
                if(res.status===200){
                    this.detailsList = res.data.details.list
                    this.currentPage = res.data.details.pageNum;
                    this.total = res.data.details.total;
                }else{this.$message.error(res.statusText)}
            })
            console.log(this.detailsList);
        },
        handleCurrentChange(newPage){
            this.currentPage = newPage;
            this.getDetails();
        }
    }
}
</script>
<style  scoped>
.block{
    margin-top: 15px;
}
.el-table:first-of-type{
    margin-top: 10px;
}
</style>