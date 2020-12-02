<template>
    <div>
        <el-card>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>销售管理</el-breadcrumb-item>
            <el-breadcrumb-item>产品管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="primary" @click="addProduct" size="small">添加产品</el-button>
        <el-table :data="productList" stripe>
            <el-table-column prop="productCode" label="产品编号" sortable width="100px"></el-table-column>
            <el-table-column prop="name" sortable label="产品名称"></el-table-column>
            <el-table-column prop="num" label="数量" width="80px"></el-table-column>
            <el-table-column prop="unitName" label="单位" width="100px"></el-table-column>
            <el-table-column prop="categoryName" label="分类名称" width="130px"></el-table-column>
            <el-table-column prop="createDate" label="添加日期"></el-table-column>
            <el-table-column prop="price" label="销售价" width="120px"></el-table-column>
            <el-table-column prop="remark" label="产品描述"></el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-link type="primary"  @click="ChangePro(scope.row)">修改</el-link>
                    <el-link type="warning" @click="deletePro(scope.$index,scope.row)">删除</el-link>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block">
            <el-pagination layout="prev, pager, next" :total="totalProducts" :current-page="currentPage" @current-change="handleCurrentChange"></el-pagination>
        </div>
        </el-card>
        <!-- 添加产品对话框 -->
         <el-dialog title="添加产品" :visible.sync="showAddProDialog" width="50%">
            <el-form :model="newProduct" :rules="rules" ref="addProductForm" label-width="110px" class="demo-ruleForm" >
                <el-form-item label="产品编号" prop="productCode" required>
                    <el-input v-model="newProduct.productCode"></el-input>
                </el-form-item>
                <el-form-item label="产品名称" prop="name" required>
                    <el-input v-model="newProduct.name"></el-input>
                </el-form-item>
                <el-form-item label="单位" prop="unitName" required>
                    <el-input v-model="newProduct.unitName"></el-input>
                </el-form-item>
                <el-form-item label="分类编号" prop="categoryId" required>
                    <!-- <el-input v-model="newProduct.categoryId"></el-input> -->
                    <!-- 选择分类编号 -->
                    <el-select v-model="newProduct.categoryId" placeholder="请选择分类编号 " @change="handleCommand($event)" style="width:150px" size="small">
                        <el-option v-for="item in productCategoryList" :key="item.categoryId" :label="item.name" :value="item.categoryId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="售价" prop="price" required>
                    <el-input v-model="newProduct.price"></el-input>
                </el-form-item>
                <el-form-item label="添加日期" prop="createDate" required>
                    <el-input v-model="newProduct.createDate" disabled></el-input>
                </el-form-item>
                <el-form-item label="产品描述" prop="remark">
                    <el-input v-model="newProduct.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetAddProForm('addProductForm')">取 消</el-button>
                <el-button type="primary" @click="comfirmAddProduct">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改产品 -->
        <el-dialog title="修改产品" :visible.sync="showChangeProDialog" width="50%">
            <el-form :model="newProduct" :rules="rules" ref="addProductForm" label-width="110px" class="demo-ruleForm">
                <el-form-item label="产品编号" prop="productCode" required>
                    <el-input v-model="newProduct.productCode"></el-input>
                </el-form-item>
                <el-form-item label="产品名称" prop="name" required>
                    <el-input v-model="newProduct.name"></el-input>
                </el-form-item>
                <el-form-item label="单位" prop="unitName" required>
                    <el-input v-model="newProduct.unitName"></el-input>
                </el-form-item>
                <el-form-item label="分类编号" prop="categoryId" required>
                    <!-- <el-input v-model="newProduct.categoryId"></el-input> -->
                    <!-- 选择分类编号 -->
                    <el-select v-model="newProduct.categoryId" placeholder="请选择分类编号 " @change="handleCommand($event)" style="width:150px" size="small">
                        <el-option v-for="item in productCategoryList" :key="item.categoryId" :label="item.name" :value="item.categoryId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="售价" prop="price" required>
                    <el-input v-model="newProduct.price"></el-input>
                </el-form-item>
                <el-form-item label="添加日期" prop="createDate" required>
                    <el-input v-model="newProduct.createDate"></el-input>
                </el-form-item>
                <el-form-item label="产品描述" prop="remark">
                    <el-input v-model="newProduct.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetAddProForm('addProductForm')">取 消</el-button>
                <el-button type="primary" @click="comfirmChangeProduct">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Axios from 'axios'
import qs from 'qs'
import dayjs from 'dayjs'
export default {
    data(){
        return{
            productList:[],
            //产品分类
            productCategoryList:[],
            //当前页码
            currentPage:1,
            //总页数
            totalPage:1,
            //总产品
            totalProducts:10,
            newProduct:{
                productCode:'', //4~10位数字字母
                name:'',        //长度不超过100
                unitName:'',    //单位，不能为空
                categoryId:'',
                price:1,
                createDate:'',
                remark:''
            },
            //添加产品对话框显示
            showAddProDialog:false,
            //修改产品对话框
            showChangeProDialog : false,
            //表单验证规则
            rules:{
                productCode:[
                    {required:true, message: '请输入产品编号', trigger: 'blur'},
                    {validator: function (rule, value, callback){
                        const productCode = /^[0-9 a-z A-Z]{4,10}$/;
                        if(!productCode.test(value)){
                            callback(this.message="4~10位数字字母")}
                    },trigger:'blur'}
                ],
                name:[
                    {required:true, message: '请输入产品名称', trigger: 'blur'},
                    {min:1,max:100,message:"长度不超过100",trigger:'blur'}
                ],
                price:[
                    {required:true, message: '请输入产品售价', trigger: 'blur'},
                    {validator: function (rule, value, callback){
                        const priceReg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
                        if(!priceReg.test(value)){
                            callback(this.message="价格大于0")}
                    },trigger:'blur'}
                ],
                unitName:[
                     {required:true, message: '请输入产品单位', trigger: 'blur'}
                ],
                categoryId:[
                    {required:true, message: '请输入产品分类编号', trigger: 'blur'}
                ],
                createDate:[
                    {required:true, message: '请输入产品添加日期', trigger: 'blur'}
                ]
            }
        }
    },
    mounted(){
        this.getProductList();
        this.getProductCategoryList();
    },
    methods:{
        //获取产品列表
        getProductList(){
            Axios.get("/cgi/main/sell/product/show?page="+this.currentPage).then(res=>{
                    this.productList = res.data.list;
                    this.currentPage = res.data.pageNum;
                    this.totalPage = res.data.pages;
                    this.totalProducts = res.data.total
            })
        },
        //获取分类
        getProductCategoryList(){
            Axios.get("/cgi/main/sell/category/all").then(res=>{
                this.productCategoryList = res.data;
                console.log(this.productCategoryList);
            })
        },
        //添加产品
        addProduct(){
            this.showAddProDialog = true;
            this.newProduct.createDate = dayjs().format("YYYY-MM-DD HH:mm:ss")
        },
        //确认添加产品
        comfirmAddProduct(){
            Axios.post('/cgi/main/sell/product/add',qs.stringify({
                productCode : this.newProduct.productCode,
                name  : this.newProduct.name,
                unitName : this.newProduct.unitName,
                categoryId : this.newProduct.categoryId,
                price : this.newProduct.price,
                createDate : this.newProduct.createDate,
                remark : this.newProduct.remark 
            })).then(res=>{
                if(res.data.code === 2){
                    this.showAddProDialog = false;
                    this.getProductList();
                    this.$message({
                        message: res.data.message,
                        type:'success'
                    })
                }else this.$message.error(res.data.message);
            })
        },
        //修改产品
        ChangePro(pro){
            this.showChangeProDialog = true;
            this.newProduct.productCode = pro.productCode;
            this.newProduct.name = pro.name;
            this.newProduct.unitName = pro.unitName
            this.newProduct.categoryId = pro.categoryId;
            this.newProduct.price = pro.price;
            this.newProduct.createDate = pro.createDate;
            this.newProduct.remark  = pro.remark
        },
        //确认修改产品
        comfirmChangeProduct(){
            this.showChangeProDialog = false;
            Axios.post('/cgi/main/sell/product/update',qs.stringify({
                productCode : this.newProduct.productCode,
                name :  this.newProduct.name,
                unitName : this.newProduct.unitName,
                categoryId : this.newProduct.categoryId,
                price : this.newProduct.price,
                createDate : this.newProduct.createDate,
                remark : this.newProduct.remark
            })).then(res=>{
                if(res.data.code===2){
                    this.showChangeProDialog = false;
                    this.$message({
                        type:'success',
                        message: res.data.message
                    })
                    this.getProductList();
                }else{
                    this.$message.error(res.data.message)
                }
            })
        },
        //删除产品
        deletePro(index,pro){
            this.$confirm('此操作将删除该产品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                Axios.post("/cgi/main/sell/product/delete",qs.stringify({
                productCode : pro.productCode,
                page: this.currentPage
            })).then(res=>{
                    if(res.data.code===2){
                            this.productList.splice(index,1)
                            this.$message({
                            type: 'success',
                            message: res.data.message
                        });
                        this.getProductList();
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
        //换页
        handleCurrentChange(newPage){
            this.currentPage = newPage;
            this.getProductList();
        },
        resetAddProForm(form){
            this.showAddProDialog =false;
            this.$refs[form].resetFields();
        },
        handleCommand(p){
            this.newProduct.categoryId = p;
            this.getProductList();
        }
    }
}
</script>
<style  scoped>
.el-button{
    margin: 10px 0;
}
</style>