<template>
    <div style="height:100%">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>采购管理</el-breadcrumb-item>
                <el-breadcrumb-item>采购订单查询</el-breadcrumb-item>
            </el-breadcrumb>
            <el-card>
                <el-input v-model="poId" size="small" clearable placeholder="请输入采购单编号" ></el-input>
                <el-select v-model="vender.name" class="el-inner" placeholder="供应商" @change="selectVender($event)" style="width:150px" size="small">
                    <el-option v-for="sup in vender" :key="sup.venderCode" :label="sup.name" :value="sup.name"></el-option>
                </el-select>
                <el-button type="success" size="small"  @click="search">查询</el-button>
                <el-table :data="orderList">
                    <el-table-column prop="poId" label="采购单编号" width="150px"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="170px"></el-table-column>
                    <el-table-column prop="venderName" label="供应商名称"></el-table-column>
                    <el-table-column prop="tipFee" label="附加费用" width="80px"></el-table-column>
                    <el-table-column prop="productTotal" label="采购产品总价"></el-table-column>
                    <el-table-column prop="poTotal" label="采购单总价格"></el-table-column>
                    <el-table-column  label="付款方式" width="120px">
                        <template slot-scope="scope">
                            <el-tag type="success" effect="dark" v-if="scope.row.payType==1">货到付款</el-tag>
                            <el-tag type="success" effect="dark" v-if="scope.row.payType==2">款到发货</el-tag>
                            <el-tag type="success" effect="dark" v-if="scope.row.payType==3">预付款到发货</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prePayFee" label="最低预付款金额"></el-table-column>
                    <el-table-column label="处理状态" width="80px">
                        <template slot-scope="scope">
                            <el-tag type="success" effect="dark" v-if="scope.row.status==1">新增</el-tag>
                            <el-tag type="success" effect="dark" v-if="scope.row.status==2">已收货</el-tag>
                            <el-tag type="success" effect="dark" v-if="scope.row.status==3">已付款</el-tag>
                            <el-tag type="success" effect="dark" v-if="scope.row.status==4">已了结</el-tag>
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
import qs from 'qs'
export default {
    data() {
        return {
            orderList:[],
            vender:[],
            venderCode:'',
            //当前页
            currentPage:1,
            total:10,
            poId :'',
            poId:'',
            payType:[
                {type:1,value:'货到付款',label:'货到付款'},
                {type:2,value:'款到发货',label:'款到发货'},
                {type:3,value:'预付款到发货',label:'预付款到发货'}
            ],
        }
    },
    created(){
        this.getOrderList();
        this.getAllVender();
    },
    methods:{
        getOrderList(){
            Axios.get('/cgi/main/purchase/pomain/query?page='+this.currentPage+'&poId='+this.poId+'&venderCode='+this.venderCode).then(res=>{
                this.orderList = res.data.list;
                this.currentPage = res.data.pageNum,
                this.total = res.data.total
            })
        },
        //获取所有供应商
        getAllVender(){
            Axios.get('/cgi/main/purchase/vender/all').then(res=>{
                this.vender = res.data;
            })
        },
        //当前选中的供应商
         selectVender(sup){
            let s = {};
            s = this.vender.find((item)=>{
                return item.name === sup
            })
            this.venderCode = s.venderCode
        },
        search(){
            this.getOrderList();
        },
        handleCurrentChange(newPage){
            this.currentPage = newPage;

            console.log(this.currentPage);
            this.getOrderList();
        }
    }
}
</script>
<style scoped>
.el-input{
    width: 250px;
}
</style>