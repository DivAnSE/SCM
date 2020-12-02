<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>仓储管理</el-breadcrumb-item>
            <el-breadcrumb-item>库存查询</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-input v-model="productCode" size="small" clearable placeholder="请输入产品编号" ></el-input>
            <el-input v-model="name" size="small" clearable placeholder="请输入产品名称" ></el-input>
            <el-button type="success" size="small"  @click="search">查询</el-button>
            <el-table :data="product">
                <el-table-column prop="categoryId" label='分类编号' width="100"></el-table-column>
                <el-table-column prop="createDate" label='创建日期' width="180"></el-table-column>
                <el-table-column prop="productCode" label='产品编号'></el-table-column>
                <el-table-column prop="name" label='产品名称'></el-table-column>
                <el-table-column prop="price" label='单价' width="80"></el-table-column>
                <el-table-column prop="unitName" label='单位' width="60"></el-table-column>
                <el-table-column prop="poNum" label='采购在途数' width="100"></el-table-column>
                <el-table-column prop="soNum" label='预销售数' width="100"></el-table-column>
                <el-table-column prop="num" label='库存数量' width="100"></el-table-column>
                <el-table-column prop="remark" label='描述'></el-table-column>
            </el-table>
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
            //产品编号
            productCode:'',
            //名称
            name:'',
            product:[],
            currentPage:1,
            total:10
        }
    },
    created() {
            this.getAllInventory();
        },
    methods:{
        getAllInventory(){
             Axios.get('/cgi/main/stock/query?page='+this.currentPage+'&productCode='+this.productCode+'&name='+this.name).then(res=>{
                if(res.status===200){
                    this.product = res.data.list;
                    this.total = res.data.total
                }
            })
        },
        search(){
            this.getAllInventory();
        },
        handleCurrentChange(newPage){
            this.currentPage = newPage;
            this.getAllInventory();
        }
    }
}
</script>
<style  scoped>
.el-card{
    margin-top: 10px;
}
.el-input{
    width: 250px;
}
</style>