<template>
    <div style="height:100%">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>财务收支</el-breadcrumb-item>
                <el-breadcrumb-item>付款登记</el-breadcrumb-item>
            </el-breadcrumb>
        <el-card>
        <el-table :data="orderList" style="width: 100%" stripe>
            <el-table-column prop="poId" sortable label="采购单编号" width="150"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="170"></el-table-column>
            <el-table-column prop="venderName" label="供应商名称"></el-table-column>
            <el-table-column prop="account" label="创建用户" width="80"></el-table-column>
            <el-table-column prop="tipFee" label="附加费用" width="80"></el-table-column>
            <el-table-column prop="productTotal" label="采购产品总价"></el-table-column>
            <el-table-column prop="poTotal" label="采购单总价"></el-table-column>
            <el-table-column label="付款方式" width="80">
                <template slot-scope="scope">
                    <el-tag type="success" effect="dark" v-if="scope.row.payType==1">货到付款</el-tag>
                    <el-tag type="success" effect="dark" v-if="scope.row.payType==2">款到发货</el-tag>
                    <el-tag type="success" effect="dark" v-if="scope.row.payType==3">预付款到发货</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="采购单状态" width="110">
                <template slot-scope="scope">
                    <el-tag type="success" effect="dark" v-if="scope.row.status==1">新增</el-tag>
                    <el-tag type="success" effect="dark" v-if="scope.row.status==2">已收货</el-tag>
                    <el-tag type="success" effect="dark" v-if="scope.row.status==3">已付款</el-tag>
                    <el-tag type="success" effect="dark" v-if="scope.row.status==3">已了结</el-tag>
                    <el-tag type="success" effect="dark" v-if="scope.row.status==3">已预付</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-link type="primary" @click="checkout(scope.row)">查看</el-link>
                    <el-link type="success" @click="payment(scope.row)">付款</el-link>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block">
            <el-pagination layout="prev, pager, next" :total="total" :current-page="currentPage" @current-change="handleCurrentChange"></el-pagination>
        </div>
        </el-card>
        <el-dialog title="付款方式" :visible.sync="dialogFormVisible" width="30%">
            <el-select v-model="payTypeList.value" placeholder="请选择付款方式" @change="handleCommand($event)" style="width:150px" size="small">
                <el-option v-for="item in payTypeList" :key="item.key" :label="item.lable" :value="item.value"></el-option>
            </el-select>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmToPayment">确 定</el-button>
        </div>
        </el-dialog>
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
import dayjs from 'dayjs';
export default {
    data(){
        return{
            dialogTableVisible : false,
             //详单
            detailList:[],
            //单据列表
           orderList:[],
           //采购单编号
           orderPoId:1,
            //单据类型
           orderType:3,
           //当前页
           currentPage:1,
           //总数
           total:10,
           //付款方式
           payType:'',
           payTypeList:[
               {key:1,value:1,lable:'付款'},
               {key:2,value:2,lable:'付预付款'},
           ],
           dialogFormVisible : false
        }
    },
    created(){
        this.getPurchaseOrderList();
    },
    methods: {
        //获取指定类型采购单据
        getPurchaseOrderList(){
            Axios.get('/cgi/main/purchase/pomain/show?type='+this.orderType+"&page="+this.currentPage).then(res=>{
                this.orderList = res.data.list;
                this.currentPage = res.data.pageNum;
                this.total = res.data.total;
            })
        },
        //付款
        payment(order){
            this.dialogFormVisible = true;
            this.orderPoId = order.poId;
        },
        //付款方式
        handleCommand(type){
            this.payType = type;
        },
        //确认付款
        confirmToPayment(){
            if(this.payType){
                Axios.post('/cgi/main/finance/pay?poId='+this.orderPoId+'&type='+this.payType).then(res=>{
                    if(res.data.code===2){
                        this.$message({
                            type:'success',
                            message:res.data.message
                        })
                        this.dialogFormVisible = false;
                        this.getPurchaseOrderList();
                    }else{
                        this.$message.error(res.data.message)
                    }
                })
            }else{
                this.$message.error("请选择付款方式")
            }
            
        },
        checkout(order){
            Axios.get('/cgi/main/purchase/pomain/queryItem?poId='+order.poId).then(res=>{
                this.dialogTableVisible = true;
                this.detailList = res.data
            })
        },
        handleCurrentChange(newPage){
            this.currentPage = newPage;
            this.getPurchaseOrderList();
        },
    },
}
</script>
<style scoped>
.el-card{
    margin-top: 10px;
}
.el-select{
    position: relative;
    left: 25px;
    margin-top: 10px;
}
</style>