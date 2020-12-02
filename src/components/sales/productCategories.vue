<template>
    <div>
        <el-card>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>销售管理</el-breadcrumb-item>
            <el-breadcrumb-item>产品分类管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="primary" @click="addCategory" size="small">添加分类</el-button>
        <el-table :data="productCategoryList">
           <el-table-column prop="categoryId" label="序列号"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="remark" label="描述"></el-table-column>
            <el-table-column label="操作" width="170">
                <template slot-scope="scope">
                    <el-link type="primary"  @click="ChangeCategory(scope.row)">修改</el-link>
                    <el-link type="warning" @click="deleteCategory(scope.$index,scope.row)">删除</el-link>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block">
            <el-pagination layout="prev, pager, next" :total="total" :current-page="currentPage" @current-change="handleCurrentChange"></el-pagination>
        </div>
        </el-card>
        <!-- 添加分类 -->
        <el-dialog title="添加产品分类信息" :visible.sync="visibleAddProCategory" width="50%">
            <el-form :model="changeProduct" :rules="rules" ref="addForm" label-width="110px" class="demo-ruleForm">
                <el-form-item label="产品类别名称" prop="name" required>
                    <el-input v-model="changeProduct.name"></el-input>
                </el-form-item>
                <el-form-item label="产品类别描述" prop="remark">
                    <el-input v-model="changeProduct.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetAddForm('addForm')">取 消</el-button>
                <el-button type="primary" @click="comfirmAddCategory">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改信息对话框 -->
        <el-dialog title="修改产品分类信息" :visible.sync="visibleChangeProCategory" width="50%">
            <el-form :model="changeProduct" ref="changeForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="产品类别名称" prop="account">
                    <el-input v-model="changeProduct.name"></el-input>
                </el-form-item>
                <el-form-item label="产品类别描述" prop="account">
                    <el-input v-model="changeProduct.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetChangeForm('changeForm')">取 消</el-button>
                <el-button type="primary" @click="comfirmChangeProInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Axios from 'axios'
import qs from 'qs'
export default {
    data(){
        return{
            productCategoryList:[],
            //当前页
            currentPage:1,
            //总数
            totalPage:0,
            //总页码
            pageNum:1,
            //总数
            total:0,
            changeProduct:{
                categoryId:'',
                name:'',
                remark:''
            },
            //修改信息对话框
            visibleChangeProCategory:false,
            visibleAddProCategory : false,
            rules:{
                name:[
                    {required:true,message:'请输入产品类别名称',trigger:'blur'}
                ]
            }
        }
    },
    created(){
        this.getProductsList();
    },
    methods:{
        //获取分类
        getProductsList(){
            Axios.get("/cgi/main/sell/category/show?page="+this.currentPage).then(res=>{
                this.productCategoryList = res.data.list;
                this.currentPage = res.data.pageNum;
                this.totalPage = res.data.pages;
                this.total = res.data.total
            })
        },
        //修改产品分类信息
        ChangeCategory(item){
            this.visibleChangeProCategory = true;
            this.changeProduct.categoryId = item.categoryId;
            this.changeProduct.name = item.name;
            this.changeProduct.remark = item.remark;
        },
        //确认修改
        comfirmChangeProInfo(){
            Axios.post("/cgi/main/sell/category/update?categoryId="+this.changeProduct.categoryId+"&name="+this.changeProduct.name+"&remark="+this.changeProduct.remark).then(res=>{
                if(res.data.code===2){
                    this.visibleChangeProCategory = false;
                    this.$message({
                            type: 'success',
                            message: res.data.message
                        });
                    this.getProductsList();
                }else this.$message.error(res.data.message)
            })
        },
        //删除分类
        deleteCategory(index,proCategory){
            this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                Axios.post("/cgi/main/sell/category/delete",qs.stringify({
                categoryId: proCategory.categoryId,
                page: this.currentPage
            })).then(res=>{
                    if(res.data.code===2){
                            this.productCategoryList.splice(index,1);
                            this.$message({
                            type: 'success',
                            message: res.data.message
                        });
                        this.getProductsList();
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
        //添加分类
        addCategory(){
            this.visibleAddProCategory = true;
        },
        //确认添加
        comfirmAddCategory(){
            Axios.post('/cgi/main/sell/category/add',qs.stringify({
                name : this.changeProduct.name,
                remark : this.changeProduct.remark
            })).then(res=>{
                if(res.data.code===2){
                    this.visibleAddProCategory = false;
                    this.$message({
                            type: 'success',
                            message: res.data.message
                    });
                    this.getProductsList();
                }else this.$message.error(res.data.message)
            })
        },
        //下一页
        handleCurrentChange(newPage){
            this.currentPage = newPage;
            this.getProductsList();
        },
        resetAddForm(form){
            this.visibleAddProCategory = false;
            this.$refs[form].resetFields();
        },
        resetChangeForm(form){
             this.visibleChangeProCategory = false;
             this.$refs[form].resetFields();
        }
    }
}
</script>
<style scoped>
.el-button{
    margin: 10px 0;
}
.el-form-item__label{
    width: 110px;
}
</style>