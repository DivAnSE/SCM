<template>
    <div>
        <el-card>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button type="primary" @click="addNewMember" size="small">添加用户</el-button>
            <el-table :data="userList" style="width: 100%" stripe type="index">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="account" label="用户账号"></el-table-column>
                <el-table-column prop="name" label="用户姓名" width="250px"></el-table-column>
                <el-table-column prop="createDate" label="添加日期" width="200px"></el-table-column>
                <el-table-column prop="status" label="锁定状态"></el-table-column>
                <el-table-column prop="models[0].modelCode" label="用户权限列表"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-link type="primary"  @click="ChangeMember(scope.row)">修改</el-link>
                        <el-link type="warning" @click="deleteMember(scope.$index,scope.row)">删除</el-link>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 页码 -->
            <div class="block">
                <el-pagination layout="prev, pager, next" :total="pagination.total" :current-page="pagination.pageNum" @current-change="handleCurrentChange"></el-pagination>
            </div>
        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%">
            <el-form :model="addMenber" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="账号" prop="account">
                    <el-input v-model="addMenber.account"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addMenber.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="passWord">
                    <el-input v-model="addMenber.passWord"></el-input>
                </el-form-item>
                <el-form-item label="创建日期" prop="createDate">
                    <el-input v-model="addMenber.createDate" disabled></el-input>
                </el-form-item>
                <el-form-item label="锁定状态" prop="status">
                    <template>
                        <el-radio-group v-model="addMenber.status">
                            <el-radio :label="0">未锁定</el-radio>
                            <el-radio :label="1">锁定</el-radio>
                        </el-radio-group>
                    </template>
                    <!-- <el-input v-model="addMenber.status"></el-input> -->
                </el-form-item>
                <el-form-item label="权限" prop="modelcodes">
                    <el-checkbox-group v-model="modelcodes" @change="getValue()">
                        <el-checkbox  v-for="(item,i) in items" :key="i" :label="item.content" :disabled="item.disabled" :checked="item.checked">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetAddForm('addForm')">取 消</el-button>
                <el-button type="primary" @click="confirmAddMenmber">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户信息对话框 -->
        <el-dialog title="修改用户信息" :visible.sync="dialogVisibleChangeMenber" width="50%">
            <el-form :model="addMenber" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="账号" prop="account">
                    <el-input v-model="addMenber.account" readonly></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addMenber.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="passWord">
                    <el-input v-model="addMenber.passWord"></el-input>
                </el-form-item>
                <el-form-item label="创建日期" prop="createDate">
                    <el-input v-model="addMenber.createDate" readonly></el-input>
                </el-form-item>
                <el-form-item label="锁定状态" prop="status">
                    <template>
                        <el-radio-group v-model="addMenber.status">
                            <el-radio :label="0">未锁定</el-radio>
                            <el-radio :label="1">锁定</el-radio>
                        </el-radio-group>
                    </template>
                </el-form-item>
                <el-form-item label="权限" prop="modelcodes">
                    <el-checkbox-group v-model="modelcodes" @change="getValue()">
                        <el-checkbox  v-for="(item,i) in items" :key="i" :label="item.content" :disabled="item.disabled" :checked="item.checked">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetChangeForm('ruleForm')">取 消</el-button>
                <el-button type="primary" @click="confirmChangeMenmber">确 定</el-button>
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
            userList:[],
            pagination:{
                //当前页码
                pageNum:1,
                //一页显示的数量
                total:10
            },
            dialogVisible : false,
            dialogVisibleChangeMenber:false,
            items:[
                {id:0,content:"1",disabled:false,checked:false,name:'采购管理'},
                {id:1,content:"2",disabled:false,checked:false,name:'销售管理'},
                {id:2,content:"3",disabled:false,checked:false,name:'系统管理'},
                {id:3,content:"4",disabled:false,checked:false,name:'财务管理'},
                {id:5,content:"5",disabled:false,checked:false,name:'仓库管理'},
                {id:6,content:"6",disabled:false,checked:false,name:'业务报表'},
            ],
            modelcodes:[],
            addMenber:{
                account:'',
                name:'',
                passWord:'',
                createDate:'',
                status:0,
                modelcodes:[],
            },
            rules:{
                account:[
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                ],
                name:[
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 2, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
                ],
                passWord:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
                ],
                createDate:[
                    { required: true, message: '请输入添加日期', trigger: 'blur' }
                ],
                status:[
                    { required: true, message: '是否锁定？0不锁定 1锁定', trigger: 'blur' },
                    {max:1,min:0,message:'选择1或者0',trigger:'blur'}
                ],
                modelcodes:[
                    { required: true, message: '请分配权限：1~6', trigger: 'blur' }
                ],
            }
        }
    },
    created(){
        this.getUserList();
    },
    methods:{
        //获取用户数据
        getUserList(){
            Axios.get('/cgi/main/system/user/show?page='+this.pagination.pageNum).then(resp=>{
                this.userList = resp.data.list;
                this.pagination.pageNum = resp.data.pageNum;
                this.pagination.total = resp.data.total;
            }) 
        },
        addNewMember(){
            this.dialogVisible = true;
            //获取当前时间
            this.addMenber.createDate =Dayjs().format("YYYY-MM-DD HH:mm:ss")
        },
        //选择权限
        getValue(){
            this.addMenber.modelcodes = this.modelcodes;
        },
        //确认添加新用户
        confirmAddMenmber(){
            Axios.post("/cgi/main/system/user/add",qs.stringify({
                account:this.addMenber.account,
                name:this.addMenber.name,
                passWord:this.addMenber.passWord,
                createDate:this.addMenber.createDate,
                status:this.addMenber.status,
                modelcodes:this.addMenber.modelcodes
            })).then(resp=>{
                if(resp.data.code===2){this.dialogVisible = false;  this.$message({
                            type: 'success',
                            message: resp.data.message
                        });}
                this.$message.error(resp.data.message)
            })
        },
        //下一页
        handleCurrentChange(newPage){
            this.pagination.pageNum = newPage;
            this.getUserList();
        },
        //修改用户
        ChangeMember(member){
            this.dialogVisibleChangeMenber = true;
            this.addMenber.account = member.account;
            this.addMenber.name = member.name;
            this.addMenber.passWord = member.passWord;
            this.addMenber.createDate = member.createDate;
            this.addMenber.status = member.status;
            this.addMenber.modelcodes.push(member.models);
        },
        //确认修改用户信息
        confirmChangeMenmber(){
            Axios.post("/cgi/main/system/user/update",qs.stringify({
                account:this.addMenber.account,
                name:this.addMenber.name,
                passWord:this.addMenber.passWord,
                createDate:this.addMenber.createDate,
                status:this.addMenber.status,
                modelcodes:this.addMenber.modelcodes
            })).then(resp=>{
                if(resp.data.code==2) {
                    this.dialogVisibleChangeMenber = false; 
                     this.$message({
                            type: 'success',
                            message: resp.data.message
                        });
                    this.getUserList();
                }else this.$message.error(resp.data.message)
            })
        },
        //删除用户
        deleteMember(index,member){
            this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                Axios.post("/cgi/main/system/user/delete",qs.stringify({
                account:member.account,
                page:this.pageNum
            })).then(res=>{
                    if(res.data.code===2){
                            this.userList.splice(index,1);
                            this.$message({
                            type: 'success',
                            message: res.data.message
                        });
                        this.getUserList();
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
            this.dialogVisibleChangeMenber = false;
            this.$refs[form].resetFields();
        }
    }
}
</script>
<style  scoped>
.el-button{
    margin: 10px 0;
}
.el-card{
    margin-bottom: 5px;
}
</style>