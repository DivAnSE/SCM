<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>销售管理</el-breadcrumb-item>
            <el-breadcrumb-item>新增销售单</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 选择单据类型 -->
            <span>单据类型:</span>
            <el-select v-model="saleType.value" placeholder="请选择单据类型" @change="handleCommand($event)" style="width:150px" size="small">
                <el-option v-for="item in saleType" :key="item.key" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button type="primary" size="mini" @click="addNewSaleOrder">新建销售单</el-button>
            <el-table :data="saleList">
                <el-table-column prop="soId" label="销售单编号" width="140px"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="170px"></el-table-column>
                <el-table-column prop="customerName" label="客户" width="100"></el-table-column>
                <el-table-column prop="account" label="创建用户" width="100"></el-table-column>
                <el-table-column prop="tipFee" label="附加费用" width="80"></el-table-column>
                <el-table-column prop="productTotal" label="产品总价" width="80"></el-table-column>
                <el-table-column prop="soTotal" label="销售单总价格" width="130"></el-table-column>
                <el-table-column  label="付款方式" width="130">
                    <template slot-scope="scope">
                        <el-tag type="success" effect="dark" v-if="scope.row.payType==1">货到付款</el-tag>
                        <el-tag type="success" effect="dark" v-if="scope.row.payType==2">款到发货</el-tag>
                        <el-tag type="success" effect="dark" v-if="scope.row.payType==3">预付款到发货</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="处理状态" width="100">
                    <template slot-scope="list">
                        <el-tag type="success" effect="dark" v-if="list.row.status==1">新增</el-tag>
                        <el-tag type="success" effect="dark" v-if="list.row.status==2">已发货</el-tag>
                        <el-tag type="success" effect="dark" v-if="list.row.status==3">已收款</el-tag>
                        <el-tag type="success" effect="dark" v-if="list.row.status==4">已了结</el-tag>
                        <el-tag type="success" effect="dark" v-if="list.row.status==5">已预付</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-link type="primary" @click="checkout(scope.row)">查看</el-link>
                        <el-link type="success" @click="checkout(scope.row)" v-show="type===1">修改</el-link>
                        <el-link type="info" @click="delOrder(scope.row,scope.$index)">删除</el-link>
                    </template>
                </el-table-column>
            </el-table>
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
            dialogTableVisible:false,
            saleList:[],
            detailList : [],
            //销售单类型
            type:1,
            saleType:[
                {key:1,value:1,label:'新增'},
                {key:2,value:2,label:'可出库'},
                {key:3,value:3,label:'可收款'},
                {key:4,value:4,label:'可了结'},
            ],
            currentPage:1,
            total:10,
        }
    },
    created(){
        this.getSaleList();
    },
    methods:{
        getSaleList(){
            Axios.get('/cgi/main/sell/somain/show?type='+this.type+'&page='+this.currentPage).then(res=>{
                this.currentPage = res.data.pageNum;
                this.saleList = res.data.list;
                
            })
        },
        //新建销售单
        addNewSaleOrder(){
            this.$router.push({path:'/newSaleOrder'})
        },
        handleCurrentChange(newPage){
            this.currentPage = newPage;
            this.getSaleList();
        },
        handleCommand(t){
            this.type = t;
            this.getSaleList();
        },
        checkout(order){
            Axios.get('/cgi/main/sell/somain/queryItem?soId='+order.soId).then(res=>{
                this.dialogTableVisible = true;
                this.soId = order.soId;
                this.detailList = res.data
            })
        },
        //删除
        delOrder(item,index){
             this.$confirm('此操作将永久删除该销售单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                Axios.post('/cgi/main/sell/somain/delete?soId='+item.soId).then(res=>{
                    if(res.data.code===2){
                        this.saleList.splice(index,1);
                        this.$message({
                            type:'success',
                            message: res.data.message
                        })
                        this.getSaleList();
                    }
                    this.$message.error(res.data.message)
                })
                }).catch(() => {
                    this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        }
    }
}
</script>
<style scoped>
.el-card{
    margin-top: 10px;
}
</style>