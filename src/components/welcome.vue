<template>
    <div class="welPage">
        <p>欢迎：{{username}}</p>
        <span>登录时间：{{loginTime}}</span>
    </div>
</template>
<script>
import Axios from 'axios'
export default {
    data(){
        return{
            username:'',
            loginTime:''
        }
    },
    created(){
        this.username = JSON.parse(sessionStorage.getItem("user")).username;
        this.loginTime = JSON.parse(sessionStorage.getItem("loginTime"));
    },
}
</script>
<style scoped>
p{
    line-height: 0;
    font-size: 1.5em;
}
</style>