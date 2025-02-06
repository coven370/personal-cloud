<template>
  <div>
    <h1>Login Page</h1>
    <el-input type="text" v-model="username" placeholder="Username/Email"></el-input>
    <el-input type="password" v-model="password" placeholder="Password"></el-input>
    <el-button @click="login" type="primary">Login</el-button>
    <el-button @click="goToCreateAccount" type="primary">Create Account</el-button>
  </div>
</template>

<script>
import CommonHandler from "@/servicehandlers/CommonHandler";

const commonHandler = new CommonHandler()
export default {
  name: "LoginPage",
  data(){
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    login(){
      let loggedIn = this.$store.getters.loggedIn;
      const errors = [];
      const login = {
        username: this.username,
        password: this.password
      };
      return commonHandler.login(login, this.$router, this.$store, errors)
          .then(response => {
            if (response && response.success) {
              loggedIn = this.$store.getters.loggedIn;
              if (loggedIn){
                this.goToHome()
              }
            } else {
              console.error(response.msg)
            }
          })
          .catch(e => {
            console.error('Error logging in: ' + e)
          })
    },
    goToHome(){
      this.$router.push({
        path: '/home'
      });
    },
    goToCreateAccount(){
      this.$router.push({
        path: '/createAccount'
      })
    },
  }
};
</script>

<style scoped>

</style>
