<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>业务报表</el-breadcrumb-item>
            <el-breadcrumb-item>月度库存报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div class="block">
                <el-date-picker v-model="date" type="month" value-format="yyyy-MM" placeholder="选择月" size="small"></el-date-picker>
                <el-button type="success" @click="search" size="small">查询</el-button>
            </div>
            <el-table :data="mainInfo" v-show="mainInfo.length>=1">
                <el-table-column prop="totalNum" label="产品总库数"></el-table-column>
            </el-table>
            <el-table :data="details" v-show="mainInfo.length>=1"  height="450">
                <el-table-column prop="ProductCode" label="产品编号"></el-table-column>
                <el-table-column prop="name" label="产品名称"></el-table-column>
                <el-table-column prop="num" label="库存数量"></el-table-column>
            </el-table>
            <div class="block" v-show="mainInfo.length>=1">
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
            mainInfo:[],
            details:[],
            currentPage:1,
            total:10,
        }
    },
    methods:{
        getDetails(){
            Axios.get('/cgi/main/report/stock/main?date='+this.date+'&page='+this.currentPage).then(res=>{
                this.details = res.data.details.list;
                this.currentPage = res.data.details.pageNum;
                this.total = res.data.details.total;
            })
        },
        search(){
            if(!this.date){
                this.$message.error("请选择查询日期");
            }else{this.currentPage = res.data.details.pageNum;
                Axios.get('/cgi/main/report/stock/main?date='+this.date+'&page='+this.currentPage).then(res=>{
                    this.mainInfo.push(res.data)
                    this.total = res.data.details.total;
                    this.currentPage = res.data.details.pageNum;
                    console.log(this.mainInfo);
                })
            this.getDetails();
            }
        },
        handleCurrentChange(newPage){
            this.currentPage = newPage;
            this.getDetails();
        }
    }
}
</script>