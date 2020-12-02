<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>网上销售</el-breadcrumb-item>
            <el-breadcrumb-item>产品展示</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-table :data="productList" height="600" stripe>
                <el-table-column prop="productCode" label="产品编号"></el-table-column>
                <el-table-column prop="name" label="产品名称"></el-table-column>
                <el-table-column prop="unitName" label="数量单位"></el-table-column>
                <el-table-column prop="categoryName" label="分类名称"></el-table-column>
                <el-table-column prop="createDate" label="添加日期"></el-table-column>
                <el-table-column prop="price" label="销售价"></el-table-column>
                <el-table-column prop="remark" label="产品描述"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-link type='primary' @click="changeProduct(scope.row)">修改</el-link>
                        <el-link type='danger' @click="delProduct(scope.row,scope.$index)">删除</el-link>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
import Axios from 'axios'
export default {
    data(){
        return{
            productList:[],
            currentPage:1,
            total:10
        }
    },
    created(){
        this.getProductList()
    },
    methods:{
        getProductList(){
            Axios.get('/cgi/main/sell/product/all').then(res=>{
                this.productList = res.data;
            })
        },
        changeProduct(item){
            console.log(item);
        },
        delProduct(item,index){}
    }
}
</script>