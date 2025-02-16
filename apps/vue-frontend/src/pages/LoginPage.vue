<template>
  <div>
    <div class="row outsideContainer">
      <LoginImage></LoginImage>
      <div class="col-sm-5 formContainer text-center" v-loading="loading">
        <br>
        <h1>Welcome to your Sky Vault</h1>
        <label v-if="$route.params.newAccount">Successfully Registered!<br>Please login.</label>
        <label v-else style="color: transparent">.<br>.</label>
        <div class="inputContainer">
          <label for="username">Username:</label>
          <input class="formInput" type="text" id="username" v-model="username" @keyup.enter="loginSubmit">
          <br>
          <label for="password">Password:</label>
          <input class="formInput" type="password" id="password" v-model="password" @keyup.enter="loginSubmit">
        </div>
        <div class="errorContainer">
          {{errorTxt}}
        </div>
        <br>
        <button class="hugeButton" @click="loginSubmit">Login</button>
        <br>
        <label class="top100">Don't have an account? <b class="clickable" @click="goToCreateAccount">Register</b></label>
      </div>
    </div>
  </div>
</template>

<script>
import CommonHandler from "@/servicehandlers/CommonHandler";

const commonHandler = new CommonHandler()

import LoginImage from '../components/LoginImage.vue'
export default {
  components: {LoginImage},
  name: "LoginPage",
  data(){
    return {
      username: '',
      password: '',
      errorTxt: '',
      loading: false,
    }
  },
  mounted(){
    console.log(this.$route)
  },
  methods: {
    loginSubmit(){
      let loggedIn = this.$store.getters.loggedIn;
      const errors = [];
      const login = {
        username: this.username,
        password: this.password
      };
      this.loading = true
      return commonHandler.login(login, this.$router, this.$store, errors, false)
          .then(response => {
            if (response && response.success) {
              loggedIn = this.$store.getters.loggedIn;
              if (loggedIn){
                this.loading = false
                this.goToHome()
              }
            } else {
              this.loading = false
              this.errorTxt = response.msg
            }
          })
          .catch(e => {
            this.loading = false
            this.errorTxt = 'Error logging in: ' + e
          })
    },
    goToHome(){
      this.$router.push({
        path: '/dashboard/home'
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
.top100{
  margin-top: 100px !important;
}
.errorContainer{
  height: 100px;
  color: var(--red-color);
  margin: auto;
  line-height: 100px;
}
</style>
