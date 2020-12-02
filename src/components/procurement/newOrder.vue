<template>
    <div style="height:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>采购管理</el-breadcrumb-item>
            <el-breadcrumb-item>新添采购订单</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form>
                <el-card>主单据信息</el-card>
                <div class="mainInfo">
                    <div class="allegation mainInfo-grid">
                        <span class="title">采购单编号</span>
                        <el-input v-model="newOrder.poId" size="small" class="el-inner"></el-input>
                    </div>
                    <div class="createTime mainInfo-grid">
                        <span class="title">创建时间</span><el-input size="small" v-model="newOrder.createTime" class="el-inner" readonly></el-input>
                    </div>
                    <div class="supplier mainInfo-grid">
                        <span class="title"> 供应商</span>
                        <el-select v-model="supplier.name" class="el-inner" placeholder="供应商" @change="selectSup($event)" style="width:150px" size="small">
                            <el-option v-for="sup in supplier" :key="sup.venderCode" :label="sup.name" :value="sup.name"></el-option>
                        </el-select>
                    </div>
                    <div class="createUser mainInfo-grid">
                        <span class="title">创建用户</span><el-input size="small" class="el-inner" v-model="newOrder.account" readonly></el-input>
                    </div>
                    <div class="additionalCost mainInfo-grid">
                        <span class="title">附加费用</span><el-input size="small" class="tipFee" v-model="newOrder.tipFee" @input="getTipFee"></el-input>
                    </div>
                    <div class="productTotal mainInfo-grid">
                        <span class="title">采购产品总价</span><el-input size="small" class="productTotal" v-model="newOrder.productTotal"></el-input>
                    </div>
                    <div class="poTotal mainInfo-grid">
                        <span class="title">采购单总价格</span><el-input size="small" class="poTotal" v-model="newOrder.poTotal"></el-input>
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
                        <span class="title">最低预付款金额</span><el-input size="small" class="prePayFee" v-model="newOrder.prePayFee"></el-input>
                    </div>
                </div>
        </el-form>
        <el-card><span>采购单明细</span><span @click="addDetail"><i class="el-icon-circle-plus">添加明细</i></span></el-card>
        <table>
            <tr>
                <th>产品</th><th>单价</th><th>数量</th><th>单位</th><th>明细总金额</th><th>操作</th>
            </tr>
            <tr v-for="(item,index) in detailList" :key="index">
                <td>
                    <el-select v-model="detailList[index].selected" class="el-inner" placeholder="产品" @change="selectPro($event,index)" style="width:150px" size="small">
                        <el-option v-for="p in products" :key="p.productCode" :label="p.name" :value="p.name"></el-option>
                    </el-select>
                </td>
                <td><el-input v-model="detailList[index].unitPrice" size="small" class="price"></el-input></td>
                <td><el-input v-model="detailList[index].num" size="small" class="price" @input="enterNum($event,index)" :disabled='isDisable'></el-input></td>
                <td><el-input v-model="detailList[index].unitName" size="small" class="price" readonly></el-input></td>
                <td><el-input v-model="detailList[index].itemPrice" size="small" class="price" readonly></el-input></td>
                <td><el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deleteDetail(index)"></el-button></td>
            </tr>
        </table>
        <el-button type="primary" v-show="showBtn" class="save" @click="saveAll">保存</el-button>
        </div>
</template>
<script>
import Axios from 'axios'
import dayjs from 'dayjs';
import qs from 'qs'
export default {
    data(){
        return{
            showBtn:false,
            //供应商列表
            supplier:[],
            //所有产品
            products:[],
            //明细列表
            detailList:[
            ],
            //控制数量输入框是否可输入
            isDisable: true,
            //新建采购单据
           newOrder:
               {
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
           //已选中的供应商
           targetSup:'',
        }
    },
    created(){
        this.getSupplierList();
        this.getAllPro();
        //获取当前时间
        this.newOrder.createTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
        //获取用户
        this.newOrder.account = JSON.parse(sessionStorage.getItem('user')).username;
    },
    methods:{
        //获取所有产品
        getAllPro(){
            Axios.get('/cgi/main/sell/product/all').then(res=>{
                this.products = res.data;
                this.price = res.data.price
            })
        },
        //获取所有供应商
        getSupplierList(){
            Axios.post('/cgi/main/purchase/vender/all').then(res=>{
                this.supplier = res.data;
            })
        },
         //获取当前选中的供应商
        selectSup(sup){
            let s = {};
            s = this.supplier.find((item)=>{
                return item.name === sup
            })
            this.newOrder.venderCode = s.venderCode;
        },
        //付款方式
        selectPayType(p){
            this.newOrder.payType = p;
        },
        //采购单状态
        selectStatus(s){
            this.newOrder.status = s;
        },
        //附加费用
        getTipFee(){
            this.getPoTotal();
        },
        //选中的产品
        selectPro(p,i){
            let pro = {};
            pro = this.products.find((item)=>{
                return item.name === p
            })
            this.detailList[i].unitPrice = pro.price;
            this.detailList[i].unitName = pro.unitName;
            this.detailList[i].productCode = pro.productCode;
            this.isDisable = false;
            this.detailList[i].itemPrice = this.detailList[i].unitPrice * this.detailList[i].num;
            this.getProPrice();
            this.getPoTotal();
        },
        //输入数量
        enterNum(m,i){
            this.detailList[i].itemPrice = this.detailList[i].unitPrice * m;
            this.getProPrice();
            this.getPoTotal();
        },
        //添加明细
        addDetail(){
            this.detailList.push({
                        productCode:'', //String   产品编号。   必须
                        unitPrice:0,    //Number   产品单价。   必须
                        num:1,             //Number   产品数量。   必须
                        unitName:'' ,         //String   数量单位。   必须
                        itemPrice:0          //Number   明细总价。   必须
                    })
                    this.showBtn = true;
        },
        //删除明细
        deleteDetail(i){
            this.detailList.splice(i,1)
            this.getProPrice();
            this.getPoTotal();
        },
        //产品总价
        getProPrice(){
            this.newOrder.productTotal = 0;
            const len = this.detailList.length;
            for(var i=0;i<len;i++){
                this.newOrder.productTotal += this.detailList[i].itemPrice
            }
        },
        //采购总价
        getPoTotal(){
            this.newOrder.poTotal =Number(this.newOrder.tipFee)+Number(this.newOrder.productTotal);
        },
        //保存单据
        saveAll(){
            Axios({
                url:'/cgi/main/purchase/pomain/add',
                method:'post',
                headers: {'Content-Type': 'application/json'},
                data:JSON.stringify({
                    poId : this.newOrder.poId,
                    venderCode : this.newOrder.venderCode,
                    account : this.newOrder.account,
                    createTime : this.newOrder.createTime,
                    tipFee : this.newOrder.tipFee,
                    productTotal : this.newOrder.productTotal,
                    poTotal : this.newOrder.poTotal,
                    payType : this.newOrder.payType,
                    prePayFee : this.newOrder.prePayFee,
                    status : this.newOrder.status,
                    remark : this.newOrder.remark,
                    poitems : this.detailList
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
        }
    }
}
</script>
<style scoped>
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
.save{
    margin: 15px 25px;
}
</style>