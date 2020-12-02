<template>
    <div style="height:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>采购管理</el-breadcrumb-item>
            <el-breadcrumb-item>新添采购订单</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="primary" @click="addNewOrder" size="small">添加采购单</el-button>
        <!-- 选择单据类型 -->
        <el-select v-model="selectList.value" placeholder="请选择单据类型" @change="handleCommand($event)" style="width:150px" size="small">
            <el-option v-for="item in selectList" :key="item.key" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-table :data="orderList" style="width: 100%" stripe>
            <el-table-column prop="poId" sortable label="采购单编号" width="150"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="170"></el-table-column>
            <el-table-column prop="venderName" label="供应商名称" width="150px"></el-table-column>
            <el-table-column prop="account" label="创建用户" width="80"></el-table-column>
            <el-table-column prop="tipFee" label="附加费用" width="80"></el-table-column>
            <el-table-column prop="productTotal" label="采购产品总价"></el-table-column>
            <el-table-column prop="poTotal" label="采购单总价"></el-table-column>
            <el-table-column  label="付款方式" width="120">
                <template slot-scope="scope">
                    <el-tag type="success" effect="dark" v-if="scope.row.payType==1">货到付款</el-tag>
                    <el-tag type="success" effect="dark" v-if="scope.row.payType==2">款到发货</el-tag>
                    <el-tag type="success" effect="dark" v-if="scope.row.payType==3">预付款到发货</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="prePayFee" label="最低预付款金额" width="130px"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                   <el-link type="primary" @click="checkDetail(scope.row)">查看</el-link>
                   <el-link type="danger" @click="modifyDetail(scope.row)" v-show="orderType===1">修改</el-link>
                   <el-link type="danger" @click="delDetail(scope.row,scope.$index)" v-show="orderType===1">删除</el-link>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block">
            <el-pagination layout="prev, pager, next" :total="total" :current-page="currentPage" @current-change="handleCurrentChange"></el-pagination>
        </div>
        <!-- 查看 -->
        <el-dialog title="主单" :visible.sync="dialogTableVisible" width="100%">
            <el-table :data="mainOrder" style="width: 100%">
                <el-table-column prop="poId" sortable label="采购单编号" width="170"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="200"></el-table-column>
            <el-table-column prop="venderName" label="供应商名称"  width="200">
            </el-table-column>
            <el-table-column prop="account" label="创建用户" width="80"></el-table-column>
            <el-table-column prop="tipFee" label="附加费用" width="100"></el-table-column>
            <el-table-column prop="productTotal" label="采购产品总价"></el-table-column>
            <el-table-column prop="poTotal" label="采购单总价"></el-table-column>
            <el-table-column prop="payType" label="付款方式" width="80"></el-table-column>
            <el-table-column prop="prePayFee" label="最低预付款金额"></el-table-column>
            <el-table-column prop="stockTime" label="入库时间"></el-table-column>
            <el-table-column prop="stockUser" label="操作人员"></el-table-column>
            </el-table>
            <el-card>明细</el-card>
            <el-table :data="orderDetailList" style="width: 100%">
                <el-table-column prop="productCode" label="产品编号"></el-table-column>
                <el-table-column prop="productName" label="产品名称"></el-table-column>
                <el-table-column prop="unitName" label="单位"></el-table-column>
                <el-table-column prop="num" label="数量"></el-table-column>
                <el-table-column prop="unitPrice" label="单价"></el-table-column>
                <el-table-column prop="itemPrice" label="总价"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog title="主单" :visible.sync="modifyVisible" width="100%" fullscreen>
            <el-form>
                <el-card>主单据信息</el-card>
                <div class="mainInfo">
                    <div class="allegation mainInfo-grid">
                        <span class="title">采购单编号</span>
                        <el-input v-model="mainOrder.poId" size="small" class="el-inner" readonly></el-input>
                    </div>
                    <div class="createTime mainInfo-grid">
                        <span class="title">创建时间</span><el-input size="small" v-model="mainOrder.createTime" class="el-inner" readonly></el-input>
                    </div>
                    <div class="supplier mainInfo-grid">
                        <span class="title"> 供应商</span>
                        <el-input size="small" v-model="mainOrder.venderName" class="el-inner" readonly></el-input>
                    </div>
                    <div class="createUser mainInfo-grid">
                        <span class="title">创建用户</span><el-input size="small" class="el-inner" v-model="mainOrder.account" readonly></el-input>
                    </div>
                    <div class="additionalCost mainInfo-grid">
                        <span class="title">附加费用</span><el-input size="small" class="tipFee" v-model="mainOrder.tipFee" @input="getTipFee"></el-input>
                    </div>
                    <div class="productTotal mainInfo-grid">
                        <span class="title">采购产品总价</span><el-input size="small" class="productTotal" v-model="mainOrder.productTotal" readonly></el-input>
                    </div>
                    <div class="poTotal mainInfo-grid">
                        <span class="title">采购单总价格</span><el-input size="small" class="poTotal" v-model="mainOrder.poTotal" readonly></el-input>
                    </div>
                    <div class="payType mainInfo-grid">
                        <span class="title">付款方式</span>
                        <el-select v-model="payType.value" class="el-inner" placeholder="付款方式" @change="selectPayType($event)" style="width:150px" size="small">
                            <el-option v-for="item in payType" :key="item.key" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <div class="mainInfo-grid">
                        <span class="title">采购单状态</span>
                        <el-select v-model="status.value" class="el-inner" placeholder="采购单状态" @change="selectStatus($event)" style="width:150px" size="small">
                            <el-option v-for="item in status" :key="item.key" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <div class="prePayFee mainInfo-grid">
                        <span class="title">最低预付款金额</span><el-input size="small" class="prePayFee" v-model="mainOrder.prePayFee"></el-input>
                    </div>
                </div>
            </el-form>
            <el-card><span>采购单明细</span><span><i class="el-icon-circle-plus">添加明细</i></span></el-card>
                <table>
                    <tr>
                        <th>产品</th><th>单价</th><th>数量</th><th>单位</th><th>明细总金额</th>
                    </tr>
                    <tr>
                        <td><el-input v-model="orderDetailList.productName"></el-input></td>
                        <td><el-input v-model="orderDetailList.unitPrice"></el-input></td>
                        <td><el-input v-model="orderDetailList.num" @input="enterNum($event)"></el-input></td>
                        <td><el-input v-model="orderDetailList.unitName"></el-input></td>
                        <td><el-input v-model="orderDetailList.itemPrice"></el-input></td>
                    </tr>
                </table>
                <el-button type="primary" class="save" @click="saveAll">保存</el-button>
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
            modifyVisible: false,
            //单据列表
           orderList:[],
           //供应商列表
           supplier:[],
           //所有产品
            products:[],
           //明细
           orderDetailList:[],
           //主单
           mainOrder:{
                poId:'',        //Number   采购单编号。要求：唯一，不能为空。   必须
                venderCode :'', //String   供应商编号。要求：不能为空。   必须
                account :'',    //String   创建用户。要求：不能为空，当前登录的用户。   必须
                createTime:'',  //String   创建时间。要求：日期+时间。   必须
                tipFee : 0,    //Number   附加费用。要求：不能为负数，默认为0。   必须
                productTotal : 0, //Number   产品总价。要求：不能为负数。   必须
                poTotal:0,         //Number   采购总价。要求：不能为负数。   必须
                payType : '',      //Number   付款方式。   必须 1  货到付款2   款到发货3   预付款到发货,       
                prePayFee:0,       //Number   最低预付款金额。要求：不能为负数，默认为0。   必须
                status:'',          //Number   采购单状态。   目前有的值如下：（必须） 1   新增 2   已收货 3   已付款 4   已了结 5   已预付
                remark:'',          //String   备注。   可选         
               },
           value:'',
           selectList:[
               {key:1,value:1,label:'新增'},
               {key:2,value:2,label:'可入库'},
               {key:3,value:3,label:'可付款'},
               {key:4,value:4,label:'可了结'},
            ],
            //单据类型
           orderType:1,
           //当前页
           currentPage:1,
           //总数
           total:10,
           dialogVisible : false,
           //控制数量输入框是否可输入
            isDisable: true,
           //付款方式
               payType : [              //Number   付款方式。   必须 1  货到付款2   款到发货3   预付款到发货
                    {type:1,value:1,label:'货到付款'},
                    {type:2,value:2,label:'款到发货'},
                    {type:3,value:3,label:'预付款到发货'}
                ],
                //采购单状态
                status:[
                    {type:1,value:1,label:'新增'},
                    {type:2,value:2,label:'已收货'},
                    {type:3,value:3,label:'已付款'},
                    {type:4,value:4,label:'已了结'},
                    {type:5,value:5,label:'已预付'},
                ],
        }
    },
    created(){
        this.getPurchaseOrderList();
        //获取当前时间
        this.mainOrder.createTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
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
        //新添采购单据
        addNewOrder(){
            this.$router.push({path:'/newOrder'})
        },
        //根据单据类型筛选
        handleCommand(e) {
            this.orderType = e;
            this.getPurchaseOrderList();
        },
        //查看明细
        checkDetail(order){
            this.mainOrder = order;//主单
            Axios.get('/cgi/main/purchase/pomain/queryItem?poId='+order.poId).then(res=>{
                this.dialogTableVisible = true;
                this.orderDetailList = res.data; //明细
            })
        },
        //修改
        modifyDetail(item){
            this.modifyVisible = true;
            this.mainOrder=item;
            Axios.get('/cgi/main/purchase/pomain/queryItem?poId='+item.poId).then(res=>{
                this.orderDetailList = res.data[0]; //明细
            })
            console.log(this.orderDetailList);
        },
        //付款方式
        selectPayType(p){
            this.mainOrder.payType = p;
        },
        //采购单状态
        selectStatus(s){
            this.mainOrder.status = s;
        },
        //输入数量
        enterNum(m){
            this.orderDetailList.itemPrice = this.orderDetailList.unitPrice * m;
            this.getProPrice();
            this.getPoTotal();
        },
        //附加费用
        getTipFee(){
            this.getPoTotal();
        },
        //产品总价
        getProPrice(){
            this.mainOrder.productTotal = 0;
            const len = this.orderDetailList.length;
            for(var i=0;i<len;i++){
                this.mainOrder.productTotal += this.orderDetailList[i].itemPrice
            }
        },
        //采购总价
        getPoTotal(){
            this.mainOrder.poTotal =Number(this.mainOrder.tipFee)+Number(this.mainOrder.productTotal);
        },
        //保存单据
        saveAll(){
            Axios({
                url:'/main/purchase/pomain/update',
                method:'post',
                headers: {'Content-Type': 'application/json'},
                data:JSON.stringify({
                    poId : this.mainOrder.poId,
                    venderCode : this.mainOrder.venderCode,
                    account : this.mainOrder.account,
                    createTime : this.mainOrder.createTime,
                    tipFee : this.mainOrder.tipFee,
                    productTotal : this.mainOrder.productTotal,
                    poTotal : this.mainOrder.poTotal,
                    payType : this.mainOrder.payType,
                    prePayFee : this.mainOrder.prePayFee,
                    status : this.mainOrder.status,
                    remark : this.mainOrder.remark,
                    poitems : this.orderDetailList
                })
            }).then(res=>{
                if(res.data.code===2){
                    this.$message({
                        type:'success',
                        message:res.data.message
                    });
                    this.$router.push({path:'/addPurchaseOrder'})
                }else{
                    this.$message.error(res.data.message)
                }
            })
        },
        //删除
        delDetail(item,index){
            this.$confirm('此操作将永久删除该采购单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                Axios.post('/cgi/main/purchase/pomain/delete?poId='+item.poId).then(res=>{
                    if(res.data.code===2){
                        this.mainOrder.splice(index,1);
                        this.$message({
                            type:'success',
                            message: res.data.message
                        })
                        this.getPurchaseOrderList();
                    }
                    this.$message.error(res.data.message)
                })
                }).catch(() => {
                    this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        },
        handleCurrentChange(newPage){
            this.currentPage = newPage;
            this.getPurchaseOrderList();
        },
    },
}
</script>
<style scoped>
.el-button{
    margin: 10px 0;
}
.el-dialog__body{
    padding: 0;
}
.el-input{
    width: 200px;
}
.el-dialog__body{
    padding: 0;
}
.el-input{
    width: 200px;
}
.prePayFee,.poTotal,.productTotal,.tipFee{
    width: 120px;
}
.el-card{
    margin: 20px 0;
}
.el-inner{
    margin-top: 10px;
}
.title{
    font-size: 0.7em;
    font-weight: 600;
}
.price{
    margin-top: 10px;
}
.el-card:nth-of-type(2){
    background-color: lightslategrey;
}
td,th{
    width: 220px;
    text-align: center;
    height: 40px;
}
.el-icon-circle-plus{
    margin-left: 25px;
    color: lightblue;
    cursor: pointer;
}
.mainInfo{
    display: grid;
    grid-template-rows:repeat(3,45px);
    grid-template-columns: repeat(4,300px);
}
.mainInfo-grid{
    display: grid;
    grid-template-columns: 85px 215px;
    align-items: center;
}
</style>