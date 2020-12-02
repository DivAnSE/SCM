<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>采购管理</el-breadcrumb-item>
            <el-breadcrumb-item>供应商管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="primary" @click="addNewSupplier" size="small">添加供应商</el-button>
        <el-table :data="supplier" style="width: 100%" :default-sort = "{prop: 'supplier.id', order: 'descending'}" stripe>
            <el-table-column prop="venderCode" label="编号" sortable width="150"></el-table-column>
            <el-table-column prop="name" label="供应商名称" sortable width="170"></el-table-column>
            <el-table-column prop="contactor" label="联系人"  width="90"></el-table-column>
            <el-table-column prop="address" label="地址"  width="150"></el-table-column>
            <el-table-column prop="postCode" label="邮政编码"  width="100"></el-table-column>
            <el-table-column prop="createDate" label="注册日期"  width="170"></el-table-column>
            <el-table-column prop="tel" label="电话"  width="140"></el-table-column>
            <el-table-column prop="fax" label="传真"  width="150"></el-table-column>
            <el-table-column label="操作" width="89">
                <template slot-scope="scope">
                    <el-link type="primary" @click="ChangeSupplier(scope.row)">修改</el-link>
                    <el-link type="warning" @click="deleteSupplier(scope.$index,scope.row)">删除</el-link>
                </template>
            </el-table-column>
        </el-table>
        <!-- 页码 -->
        <div class="block">
            <el-pagination layout="prev, pager, next" :total="totalSupplier" :current-page="currentPage" @current-change="handleCurrentChange"></el-pagination>
        </div>
         <!-- 添加用户对话框 -->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
            <el-form :model="newSupplier" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="编号" prop="venderCode">
                    <el-input v-model="newSupplier.venderCode"></el-input>
                </el-form-item>
                <el-form-item label="供应商名称" prop="name">
                    <el-input v-model="newSupplier.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="passWord">
                    <el-input v-model="newSupplier.passWord"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contactor">
                    <el-input v-model="newSupplier.contactor"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="newSupplier.address"></el-input>
                </el-form-item>
                <el-form-item label="邮政编码" prop="postCode">
                    <el-input v-model="newSupplier.postCode"></el-input>
                </el-form-item>
                <el-form-item label="注册日期" prop="createDate">
                    <el-input v-model="newSupplier.createDate"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="tel">
                    <el-input v-model="newSupplier.tel"></el-input>
                </el-form-item>
                <el-form-item label="传真" prop="fax">
                    <el-input v-model="newSupplier.fax"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetAddForm('addForm')">取 消</el-button>
                <el-button type="primary" @click="confirmAddMenmber">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户信息对话框 -->
        <el-dialog title="提示" :visible.sync="dialogVisibleChangeSupplier" width="50%">
            <el-form :model="newSupplier" :rules="rules" ref="changeForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="编号" prop="venderCode">
                    <el-input v-model="newSupplier.venderCode"></el-input>
                </el-form-item>
                <el-form-item label="供应商名称" prop="name">
                    <el-input v-model="newSupplier.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="passWord">
                    <el-input v-model="newSupplier.passWord"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contactor">
                    <el-input v-model="newSupplier.contactor"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="newSupplier.address"></el-input>
                </el-form-item>
                <el-form-item label="邮政编码" prop="postCode">
                    <el-input v-model="newSupplier.postCode"></el-input>
                </el-form-item>
                <el-form-item label="注册日期" prop="createDate">
                    <el-input v-model="newSupplier.createDate"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="tel">
                    <el-input v-model="newSupplier.tel"></el-input>
                </el-form-item>
                <el-form-item label="传真" prop="fax">
                    <el-input v-model="newSupplier.fax"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetChangeForm('changeForm')">取 消</el-button>
                <el-button type="primary" @click="confirmChangeSupplier">确 定</el-button>
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
            dialogVisible : false,
            dialogVisibleChangeSupplier : false,
            //供应商列表
            supplier:[],
            //当前页码
            currentPage:1,
            totalSupplier:0,
            newSupplier:{
                venderCode:'',
                name:'',
                passWord:'',
                contactor:'',
                address:'',
                postCode:'',
                createDate:'',
                tel:'',
                fax:''
            },
            rules:{
                venderCode:[
                    {required: true, message: '请输入编号', trigger: 'blur'},
                    {validator: function (rule, value, callback){
                        const venderCodeReg = /^[0-9 a-z A-Z]{4,20}$/;
                        if(!venderCodeReg.test(value)){
                            callback(this.message="4~20位数字字母")}
                    },trigger:'blur'}
                ],
                name:[
                    {required: true, message: '请输入供应商名称', trigger: 'blur'},
                    {max: 100, message: '长度小于100个字符', trigger: 'blur'}
                ],
                passWord:[
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {min:4,max:20, message: '长度为4~20个字符', trigger: 'blur'}
                ],
                contactor:[
                    {required: true, message: '请输入联系人', trigger: 'blur'},
                ],
                tel:[
                    {required: true, message: '请输入电话', trigger: 'blur'},
                ],
                createDate:[
                    {required: true, message: '请输入创建时间', trigger: 'blur'},
                ]
            }
        }
    },
    created(){
        this.getSupplierList();
    },
    methods:{
        getSupplierList(){
            Axios.get("/cgi/main/purchase/vender/show?page="+this.currentPage).then(resp=>{
                this.supplier = resp.data.list;
                this.currentPage = resp.data.pageNum;
                this.totalSupplier = resp.data.total
            })
        },
        handleCurrentChange(newPage){
            this.currentPage = newPage;
            this.getSupplierList();
        },
        addNewSupplier(){
            this.dialogVisible = true;
            //获取当前时间
            this.newSupplier.createDate =Dayjs().format("YYYY-MM-DD HH:mm:ss")
        },
        //确认添加
        confirmAddMenmber(){
            Axios.post("/cgi/main/purchase/vender/add",qs.stringify({
                venderCode: this.newSupplier.venderCode,
                name: this.newSupplier.name,
                passWord: this.newSupplier.passWord,
                contactor: this.newSupplier.contactor,
                address: this.newSupplier.address,
                postCode: this.newSupplier.postCode,
                createDate: this.newSupplier.createDate,
                tel: this.newSupplier.tel,
                fax: this.newSupplier.fax
            })).then(resp=>{
                if(resp.data.code===2){
                    this.dialogVisible = false;
                    this.getSupplierList();
                    this.$message({
                        message: resp.data.message,
                        type:'success'
                    })}
                this.$message.error(resp.data.message)
            })
        },
        //修改供应商信息
        ChangeSupplier(supplier){
            this.dialogVisibleChangeSupplier = true;
            this.newSupplier.venderCode = supplier.venderCode;
            this.newSupplier.name = supplier.name;
            this.newSupplier.passWord = supplier.passWord;
            this.newSupplier.contactor = supplier.contactor;
            this.newSupplier.address = supplier.address;
            this.newSupplier.postCode = supplier.postCode;
            this.newSupplier.createDate = supplier.createDate;
            this.newSupplier.tel = supplier.tel;
            this.newSupplier.fax = supplier.fax;
        },
        //确认修改供应商信息
        confirmChangeSupplier(){
            Axios.post("/cgi/main/purchase/vender/update",qs.stringify({
                venderCode:this.newSupplier.venderCode,
                name:this.newSupplier.name,
                passWord:this.newSupplier.passWord,
                contactor:this.newSupplier.contactor,
                address:this.newSupplier.address,
                postCode:this.newSupplier.postCode,
                createDate:this.newSupplier.createDate,
                tel: this.newSupplier.tel,
                fax:this.newSupplier.fax
            })).then(resp=>{
                if(resp.data.code===2) {
                    this.dialogVisibleChangeSupplier = false; 
                    this.getSupplierList();
                    this.$message({
                        message: resp.data.message,
                        type:'success'
                    })
                    this.getSupplierList();
                }else this.$message.error(resp.data.message)
            })
        },
        //删除供应商
        deleteSupplier(index,supplier){
            this.$confirm('此操作将删除该供应商, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                Axios.post("/cgi/main/purchase/vender/delete",qs.stringify({
                    venderCode: supplier.venderCode
            })).then(res=>{
                    if(res.data.code===2){
                            this.supplier.splice(index,1);
                            this.$message({
                            type: 'success',
                            message: res.data.message
                        });
                        this.getSupplierList();
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
            this.dialogVisible = false;
            this.$refs[form].resetFields();
        },
        resetChangeForm(form){
            this.dialogVisibleChangeSupplier = false;
            this.$refs[form].resetFields();
        }
    }
}
</script>
<style scoped>
.el-button{
    margin: 15px 0 10px 0;
}
.el-table th{
    padding: 8px 0;
}
</style>