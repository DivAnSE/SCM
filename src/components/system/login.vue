<template>
    <div class="login_container">
        <div class="login_box" >
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="loginForm">
                <h2>欢迎登录</h2>
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user-fill" v-model="loginForm.username" clearable class="loginFormInput"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-lock" v-model="loginForm.password" type="password" clearable class="loginFormInput"></el-input>
                </el-form-item>
                <div class="btn">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button plain @click="resetForm">重置</el-button>
                </div>
                
            </el-form>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    data(){
        return{
            loginForm:{
                username:'marsk',
                password:'12345',
                role:'member',
            },
            loginTime:'',
            //表单验证对象
            loginFormRules:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        login(){
            this.$refs.loginFormRef.validate(res=>{
                if(!res) return;
                else{
                    axios.post('/cgi/sys/login?username='+this.loginForm.username+'&password='+this.loginForm.password+'&role='+this.loginForm.role).then(resp=>{
                            if(resp.data.code !==2) return this.$message.error(resp.data.message);
                            else{
                                var  date =  new  Date();
                                var  seperator1 =  "-" ;
                                var  year = new  Date().getFullYear();
                                var  month = date.getMonth() + 1;
                                var  strDate = date.getDate();
                                var hour = date.getHours();
                                var minutes = date.getMinutes();
                                var seconds = date.getSeconds();
                                if  (month >= 1 && month <= 9) {
                                    month =  "0"  + month;
                                }
                                if  (strDate >= 0 && strDate <= 9) {
                                    strDate =  "0"  + strDate;
                                }
                                if(hour >= 0 && hour <=9){ hour = "0"+hour};
                                if(minutes>=0&&minutes<=9){ minutes = "0"+minutes};
                                if(seconds>-0&&seconds<=9){ seconds = "0"+seconds};
                                this.loginTime = year + seperator1 + month + seperator1 + strDate + " " +hour+":"+minutes+":"+seconds;
                                //this.loginTime = new Date().getFullYear()+'-'+(new Date().getMonth()+1) +'-'+new Date().getDate()+' '+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds();
                                this.$message.success("登录成功！")
                                sessionStorage.setItem('user',JSON.stringify(this.loginForm))
                                sessionStorage.setItem('loginTime',JSON.stringify(this.loginTime))
                                this.$router.push({path:'/home'})
                            }
                            
                        })
                }
            })
        },
        //重置表单
        resetForm(){
            this.$refs.loginFormRef.resetFields();
        }
    }
}
</script>
<style scoped>
    .login_container{
        background-color: #1D4A71;
        height: 100%;
    }
    .login_box{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #fff;
        width: 450px;
        height: 300px;
        border-radius: 3px;
    }
    .loginForm{
        position: absolute;
        bottom: 10px;
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
    }
    .loginFormInput{
        margin-bottom: 5px;
    }
    .btn{
        display: flex;
        justify-content: flex-end;
    }
</style>