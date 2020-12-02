<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>网上销售</el-breadcrumb-item>
            <el-breadcrumb-item>客户注册</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div class="search">
                <el-input v-model="customerCode" size="small" clearable placeholder="请输入客户编号" ></el-input>
                <el-input v-model="customerName" size="small" clearable placeholder="请输入客户名称" ></el-input>
                <el-button type="success" size="small"  @click="search">查询</el-button>
                <el-button type='primary' size="small" @click="addCustomer">添加客户</el-button>
            </div>
            <el-table :data="customer" height="500">
                <el-table-column prop="customerCode" label="客户编号"></el-table-column>
                <el-table-column prop="name" label="客户名称"></el-table-column>
                <el-table-column prop="contactor" label="联系人"></el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
                <el-table-column prop="postCode" label="邮政编码"></el-table-column>
                <el-table-column prop="createDate" label="注册日期"></el-table-column>
                <el-table-column prop="tel" label="电话"></el-table-column>
                <el-table-column prop="fax" label="传真"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-link type="primary" @click="changeCustomer(scope.row)">修改</el-link>
                        <el-link type="danger" @click="delCustomer(scope.row,scope.$index)">删除</el-link>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 页码 -->
            <div class="block">
                <el-pagination layout="prev, pager, next" :total="total" :current-page="currentPage" @current-change="handleCurrentChange"></el-pagination>
            </div>
        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog title="添加用户" :visible.sync="addCustomerDialog" width="50%">
            <el-form :model="newCustomer" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="客户编号" prop="customerCode">
                    <el-input v-model="newCustomer.customerCode"></el-input>
                </el-form-item>
                <el-form-item label="客户名称" prop="name">
                    <el-input v-model="newCustomer.name"></el-input>
                </el-form-item>
                <el-form-item label="客户密码" prop="passWord">
                    <el-input v-model="newCustomer.passWord" show-password></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contactor">
                    <el-input v-model="newCustomer.contactor"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="newCustomer.address"></el-input>
                </el-form-item>
                <el-form-item label="邮政编码" prop="postCode">
                    <el-input v-model="newCustomer.postCode"></el-input>
                </el-form-item>
                <el-form-item label="注册日期" prop="createDate">
                    <el-input v-model="newCustomer.createDate" readonly></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="tel">
                    <el-input v-model="newCustomer.tel"></el-input>
                </el-form-item>
                <el-form-item label="传真" prop="fax">
                    <el-input v-model="newCustomer.fax"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetAddForm('addForm')">取 消</el-button>
                <el-button type="primary" @click="confirmAddCustomer">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户信息对话框 -->
        <el-dialog title="修改客户信息" :visible.sync="changeDialog" width="50%">
            <el-form :model="newCustomer" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="客户编号" prop="customerCode">
                    <el-input v-model="newCustomer.customerCode" readonly></el-input>
                </el-form-item>
                <el-form-item label="客户名称" prop="name">
                    <el-input v-model="newCustomer.name"></el-input>
                </el-form-item>
                <el-form-item label="客户密码" prop="passWord">
                    <el-input v-model="newCustomer.passWord" show-password></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contactor">
                    <el-input v-model="newCustomer.contactor"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="newCustomer.address"></el-input>
                </el-form-item>
                <el-form-item label="邮政编码" prop="postCode">
                    <el-input v-model="newCustomer.postCode"></el-input>
                </el-form-item>
                <el-form-item label="注册日期" prop="createDate">
                    <el-input v-model="newCustomer.createDate" readonly></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="tel">
                    <el-input v-model="newCustomer.tel"></el-input>
                </el-form-item>
                <el-form-item label="传真" prop="fax">
                    <el-input v-model="newCustomer.fax"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetChangeForm('ruleForm')">取 消</el-button>
                <el-button type="primary" @click="confirmChangeCustomer">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Axios from 'axios'
import Dayjs from 'dayjs'
import qs from 'qs'
export default {
    data(){
        return{
            customer:[],
            currentPage:1,
            total:10,

            customerCode:'',
            customerName:'',

            changeDialog : false,
            addCustomerDialog : false,
            newCustomer:
                {
                    customerCode:'',        //String   客户编号。要求：唯一，4~20位数字字母。   必须
                    name:'',                //String   客户名称。要求：长度不超过100。   必须
                    passWord:'',                //String   客户密码。默认=客户编号，要求：4~20位字符。   必须
                    contactor:'',               //String   联系人。要求：不能为空。   必须
                    address:'',                 //String   地址。   可选
                    postCode:'',                // String   邮政编码。   可选
                    createDate:'',              //String   注册日期。要求：系统当前时间。   必须
                    tel:'',                     //String    电话。要求：不能为空。   必须
                    fax:'',                     //String   传真。   可选
                },
            rules:{
                customerCode:[
                    {required: true, message: '请输入客户编号', trigger: 'blur'},
                    {validator: function (rule, value, callback){
                        const venderCodeReg = /^[0-9 a-z A-Z]{4,20}$/;
                        if(!venderCodeReg.test(value)){
                            callback(this.message="4~20位数字字母")}
                    },trigger:'blur'}
                ],
                name:[
                    {required: true, message: '请输入客户名称', trigger: 'blur'},
                    { min: 2, max: 100, message: '长度不超过100个字符', trigger: 'blur' }
                ],
                passWord:[
                    {required: true, message: '请输入客户密码', trigger: 'blur'},
                    {validator: function (rule, value, callback){
                        const venderCodeReg = /^\w{4,20}$/;
                        if(!venderCodeReg.test(value)){
                            callback(this.message="4~20位字符")}
                    },trigger:'blur'}
                ],
                contactor:[
                    {required: true, message: '请输入联系人', trigger: 'blur'}
                ],
                createDate:[
                    {required: true, message: '请输入创建时间', trigger: 'blur'}
                ],
                tel:[
                    {required: true, message: '请输入电话', trigger: 'blur'}
                ]
            }
        }
    },
    created(){
        this.getCustomerInfo()
    },
    methods:{
        //获取客户信息
        getCustomerInfo(){
            Axios.get('/cgi/main/sell/customer/show?page='+this.currentPage+'&customerCode='+this.customerCode+'&name='+this.customerName).then(res=>{
                this.currentPage = res.data.pageNum;
                this.total = res.data.total;
                this.customer = res.data.list;
            })
        },
        //换页
        handleCurrentChange(newPage){
            this.currentPage = newPage;
            this.getCustomerInfo();
        },
        //查询
        search(){
            this.getCustomerInfo();
        },
        //添加客户
        addCustomer(){
            this.newCustomer = {};
            this.addCustomerDialog=true;
            this.newCustomer.createDate =Dayjs().format("YYYY-MM-DD HH:mm:ss")
        },
        //确认添加
        confirmAddCustomer(){
            Axios.post('/cgi/main/sell/customer/add',qs.stringify({
                customerCode : this.newCustomer.customerCode,
                name : this.newCustomer.name,
                passWord : this.newCustomer.passWord,
                contactor : this.newCustomer.contactor,
                address : this.newCustomer.address,
                postCode : this.newCustomer.postCode,
                createDate : this.newCustomer.createDate,
                tel : this.newCustomer.tel,
                fax : this.newCustomer.fax
            })).then(res=>{
                if(res.data.code===2){
                    this.$message({
                        type:'success',
                        message:res.data.message
                    })
                    this.addCustomerDialog=false;
                    this.getCustomerInfo();
                }else{
                    this.$message.error(res.data.message)
                }
            })
            
        },
        //修改
        changeCustomer(item){
            this.changeDialog = true
            this.newCustomer.customerCode = item.customerCode;
            this.newCustomer.name = item.name;
            this.newCustomer.passWord = item.passWord;
            this.newCustomer.contactor = item.contactor;
            this.newCustomer.address = item.address;
            this.newCustomer.postCode = item.postCode;
            this.newCustomer.createDate = item.createDate;
            this.newCustomer.tel = item.tel;
            this.newCustomer.fax = item.fax
        },
        //确认修改
        confirmChangeCustomer(){
            Axios.post('/cgi/main/sell/customer/update',qs.stringify({
                customerCode : this.newCustomer.customerCode,
                name : this.newCustomer.name,
                passWord : this.newCustomer.passWord,
                contactor : this.newCustomer.contactor,
                address : this.newCustomer.address,
                postCode : this.newCustomer.postCode,
                createDate : this.newCustomer.createDate,
                tel : this.newCustomer.tel,
                fax : this.newCustomer.fax
            })).then(res=>{
                if(res.data.code===2){
                    this.$message({
                        type:'success',
                        message:res.data.message
                    })
                    this.changeDialog=false;
                    this.getCustomerInfo();
                }else{
                    this.$message.error(res.data.message)
                }
            })

        },
        //删除
        delCustomer(item,index){
            this.$confirm('此操作将删除该客户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                Axios.post("/cgi/main/sell/customer/delete?customerCode="+item.customerCode).then(res=>{
                    if(res.data.code===2){
                            this.customer.splice(index,1);
                            this.$message({
                            type: 'success',
                            message: res.data.message
                        });
                        this.getCustomerInfo()
                    }else{
                        this.$message.error(res.data.message)
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        resetAddForm(form){
            this.addCustomerDialog = false;
            this.$refs[form].resetFields();
        },
        resetChangeForm(form){
            this.changeDialog = false;
            this.$refs[form].resetFields();
        }
        
    }
}
</script>
<style  scoped>
.el-button:first-of-type{
    margin-right: 20px;
}
.search .el-input{
    width: 250px;
}
</style>