<template>
  <div class="text-center">
    <h1>Create Account</h1>
    <input type="text" v-model="firstName" placeholder="First Name" @keyup="validateInputs">
    <br>
    <input type="text" v-model="lastName" placeholder="Last Name" @keyup="validateInputs">
    <br>
    <input type="text" v-model="email" placeholder="Email" @keyup="validateInputs">
    <br>
    <input type="text" v-model="username" placeholder="Username" @keyup="validateInputs">
    <br>
    <input type="password" v-model="password" placeholder="Password" @keyup="validateInputs">
    <br>
    <input type="password" v-model="confirmPassword" placeholder="Confirm Password" @keyup="validateInputs">
    <br>
    <el-button v-if="validated" @click="submit" type="primary">Submit</el-button>
    <el-dialog
        center
        title="Error"
        :visible.sync="modals.error"
        :modalAppendToBody="false">
      <div class="text-center">
        <span>Error: {{ errorText }}</span>
        <br>
        <span slot="footer" class="dialog-footer">
            <el-button type="danger" @click="closeModal('error')" icon="">OK</el-button>
          </span>
      </div>
    </el-dialog>
    <el-dialog
        center
        title="Success"
        :visible.sync="modals.success"
        :modalAppendToBody="false">
      <div class="text-center">
        <span>New user Successfully created</span>
        <br>
        <br>
        <span slot="footer" class="dialog-footer">
            <el-button type="success" @click="goToLogin" icon="">Go To Login</el-button>
          </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Dialog } from "element-ui";
import UsersAPIService from "@/servicehandlers/UsersAPIService";

const usersAPIService = new UsersAPIService()
export default {
  components: {
    [Dialog.name]: Dialog,
  },
  name: "CreateAccount",
  data() {
    return {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      validated: false,
      modals: {
        error: false,
        success: false,
      },
      errorText: '',
    }
  },
  methods: {
    validateInputs(){
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/
      if (!this.firstName){
        this.validated = false
      }
      else if (!this.lastName){
        this.validated = false
      }
      else if (!emailRegex.test(this.email)){
        this.validated = false
      }
      else if (!passwordRegex.test(this.password)){
        this.validated = false
      }
      else if (this.confirmPassword !== this.password){
        this.validated = false
      }
      else {
        this.validated = true
      }
    },
    submit(){
      let newUser = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        username: this.username,
        password: this.password,
      }
      return usersAPIService.createUser(newUser)
          .then(response => {
            console.log(response)
            console.log('Test')
            this.openModal('success')
          })
          .catch(e => {
            this.errorText = e.response.data.message
            this.openModal('error')
          })
    },
    openModal(modal){
      this.modals[modal] = true
    },
    closeModal(modal){
      this.modals[modal] = false
    },
    goToLogin(){
      this.$router.push({
        path: '/login'
      })
    },
  },
};
</script>

<style scoped>

</style>
