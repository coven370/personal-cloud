<template>
  <div>
    <h1>Login Page</h1>
    <el-button @click="login" type="primary">Login</el-button>
  </div>
</template>

<script>
import CommonHandler from "@/servicehandlers/CommonHandler";

const commonHandler = new CommonHandler()
export default {
  name: "LoginPage",
  data(){
    return {
      username: 'Test',
      password: 'Test'
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
  }
};
</script>

<style scoped>

</style>
