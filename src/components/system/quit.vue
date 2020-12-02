<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>退出系统</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="danger" @click="quit">退出系统</el-button>
    </div>
</template>
<script>
export default {
    methods:{
        quit(){
            this.$confirm('您将退出系统, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                    this.$router.push({path:'/home'})
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