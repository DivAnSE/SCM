<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>库存管理</el-breadcrumb-item>
            <el-breadcrumb-item>出库登记</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-table :data="orderList" style="width: 100%" stripe>
                <el-table-column prop="soId" sortable label="销售单编号" width="140"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="170"></el-table-column>
                <el-table-column prop="customerName" label="客户名称"  width="100">
                </el-table-column>
                <el-table-column prop="account" label="创建用户" width="90"></el-table-column>
                <el-table-column prop="tipFee" label="附加费用" width="90"></el-table-column>
                <el-table-column prop="productTotal" label="产品总价" width="110"></el-table-column>
                <el-table-column prop="soTotal" label="销售单总价" width="100"></el-table-column>
                <el-table-column  label="收款方式" width="130">
                    <template slot-scope="scope">
                        <el-tag type="success" effect="dark" v-if="scope.row.payType==1">货到付款</el-tag>
                        <el-tag type="success" effect="dark" v-if="scope.row.payType==2">款到发货</el-tag>
                        <el-tag type="success" effect="dark" v-if="scope.row.payType==3">预付款到发货</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="prePayFee" label="最低预付款" width="100"></el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-link type="primary" @click="checkout(scope.row)">查看</el-link>
                        <el-link type="primary" @click="inStock(scope.row)">出库</el-link>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="block">
                <el-pagination layout="prev, pager, next" :total="total" :current-page="currentPage" @current-change="handleCurrentChange"></el-pagination>
            </div>
        </el-card>
        <el-dialog title="详单" :visible.sync="dialogTableVisible">
            <el-table :data="detailList">
                <el-table-column property="productCode" label="产品编号" width="150"></el-table-column>
                <el-table-column property="productName" label="产品名称" width="200"></el-table-column>
                <el-table-column property="unitPrice" label="单价"></el-table-column>
                <el-table-column property="unitName" label="单位"></el-table-column>
                <el-table-column property="num" label="数量"></el-table-column>
                <el-table-column property="itemPrice" label="金额"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Axios from 'axios'
export default {
    data(){
        return{
            dialogTableVisible : false,
            dialogTableVisible : false,
            soId:10001,
            detailList:[],
            saleList:[],
            status:2,
            orderList:[],
            currentPage:1,
            total:10
        }
    },
    created(){
        this.getInstockList();
    },
    methods:{
        getInstockList(){
            Axios.post('/cgi/main/sell/somain/show?type=2&page='+this.currentPage).then(res=>{
                this.orderList = res.data.list;
                this.total = res.data.total
            })
        },
        checkout(order){
            Axios.get('/cgi/main/sell/somain/queryItem?soId='+order.soId).then(res=>{
                this.dialogTableVisible = true;
                this.soId = order.soId;
                this.detailList = res.data
            })
        },
        //出库
        inStock(order){
            this.$confirm('确定将该销售单出库吗？, 是否继续?', '出库登记', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                Axios.post('/cgi/main/stock/outstock?soId='+order.soId+'&payType='+order.payType).then(res=>{
                    if(res.data.code===2){
                            this.$message({
                                type:'success',
                                message:res.data.message
                            })
                            this.getInstockList();
                        }
                })
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消入库'
            });          
        });
        },
        handleCurrentChange(newPage){
            this.currentPage = newPage;
            this.getInstockList();
        }
    }
}
</script>
<style scoped>
    .el-card{
        margin-top: 10px;
    }
</style>