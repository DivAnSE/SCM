<template>
    <div style="height:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>业务报表</el-breadcrumb-item>
            <el-breadcrumb-item>月度采购报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div class="block">
                <el-date-picker v-model="startDate" type="date" placeholder="开始日期" size="small" value-format="yyyy-MM-dd"></el-date-picker>
                <el-date-picker v-model="endDate" type="date" placeholder="结束日期" size="small" value-format="yyyy-MM-dd"> </el-date-picker>
                <el-select size="small" v-model="type.name" placeholder="收支类型">
                    <el-option v-for="item in type" :key="item.key" :label="item.name" :value="item.name"></el-option>
                </el-select>
                <el-button type="success" size="small" @click="search">查询</el-button>
            </div>
            <el-table :data="list">
                <el-table-column prop="payTime" label="付款（收款）日期"></el-table-column>
                <el-table-column prop="ordercode" label="相关单据号"></el-table-column>
                <el-table-column prop="payPrice" label="付款（收款）金额 "></el-table-column>
                <el-table-column prop="account" label="经手人"></el-table-column>
                <el-table-column prop="payType" label="单据付款方式">
                    <template slot-scope="scope">
                        <el-tag type="success" effect="dark" v-if="scope.row.payType==1">货到付款</el-tag>
                        <el-tag type="success" effect="dark" v-if="scope.row.payType==2">款到发货</el-tag>
                        <el-tag type="success" effect="dark" v-if="scope.row.payType==3">预付款到发货</el-tag>
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
import Axios from 'axios';
export default {
    data(){
        return{
            list:[],
            startDate:'',
            endDate:'',
            //收支类型  必须
            type:[
                {key:1,value:1,name:'收入'},
                {key:2,value:2,name:'支出'}
            ],
            currentPage:1,
            total:10
        }
    },
    methods:{
        search(){
            this.list = [];
            Axios.get('/cgi/main/finance/query?type='+this.type.name+'&startDate='+this.startDate+'&endDate='+this.endDate+'&page='+this.currentPage).then(res=>{
                this.list = res.data.list;
                this.currentPage = res.data.pageNum;
                this.total = res.data.total;
            }) 
        },
        handleCurrentChange(newPage){
            this.currentPage = newPage;
            this.search();
        }
    }
}
</script>
<style  scoped>
.el-card{
    margin-top: 10px;
}
</style>