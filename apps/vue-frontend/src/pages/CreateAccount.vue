<template>
  <div>
    <div class="row outsideContainer">
      <LoginImage></LoginImage>
      <div class="col-sm-5 formContainer text-center" v-loading="loading">
        <h1>Register</h1>
        <div class="redText" v-if="errorText.length > 0">{{errorText}}</div>
        <div v-else style="color: transparent">.</div>
        <div class="inputContainer">
          <label for="firstName">First Name:</label>
          <input class="formInput" type="text" v-model="firstName" @keyup="validateFirstName">
          <div>
            <span v-if="firstNameError === 1" class="smallErrorText">Please enter a valid First Name</span>
            <i v-else-if="firstNameError === 0" class="el-icon-check greenText"></i>
            <span class="smallErrorText" style="color: transparent">.</span>
          </div>
          <label for="lastName">Last Name:</label>
          <input class="formInput" type="text" v-model="lastName" @keyup="validateLastName">
          <div>
            <span v-if="lastNameError === 1" class="smallErrorText">Please enter a valid Last Name</span>
            <i v-else-if="lastNameError === 0" class="el-icon-check greenText"></i>
            <span class="smallErrorText" style="color: transparent">.</span>
          </div>
          <label for="lastName">Email:</label>
          <input class="formInput" type="text" v-model="email" @keyup="validateEmail">
          <div>
            <span v-if="emailError === 1" class="smallErrorText">Please enter a valid Email</span>
            <i v-else-if="emailError === 0" class="el-icon-check greenText"></i>
            <span class="smallErrorText" style="color: transparent">.</span>
          </div>
          <label for="lastName">Username:</label>
          <input class="formInput" type="text" v-model="username" @keyup="validateUsername">
          <div>
            <span v-if="usernameError === 1" class="smallErrorText">Please enter a valid Username</span>
            <i v-else-if="usernameError === 0" class="el-icon-check greenText"></i>
            <span class="smallErrorText" style="color: transparent">.</span>
          </div>
          <label for="lastName">Password:</label>
          <input class="formInput" type="password" v-model="password" @keyup="validatePassword">
          <div>
            <span v-if="passwordError === 1" class="smallErrorText">Password requirements: 8 characters, least one of each: lowercase letter, uppercase letter, number,</span>
            <i v-else-if="passwordError === 0" class="el-icon-check greenText"></i>
            <span class="smallErrorText" style="color: transparent">.</span>
          </div>
          <label for="lastName">Confirm Password:</label>
          <input class="formInput" type="password" v-model="confirmPassword" @keyup="validateConfirmPassword">
          <div>
            <span v-if="confirmPasswordError === 1" class="smallErrorText">Confirmation Password must match Password</span>
            <i v-else-if="confirmPasswordError === 0" class="el-icon-check greenText"></i>
            <span class="smallErrorText" style="color: transparent">.</span>
          </div>
        </div>
        <br>
        <button class="hugeButton" :disabled="!validated" @click="submit">Sign up</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog } from "element-ui";
import UsersAPIService from "@/servicehandlers/UsersAPIService";

const usersAPIService = new UsersAPIService()

import LoginImage from '../components/LoginImage.vue'
export default {
  components: {
    [Dialog.name]: Dialog,
    LoginImage,
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
      firstNameError: -1,
      lastNameError: -1,
      passwordError: -1,
      confirmPasswordError: -1,
      usernameError: -1,
      emailError: -1,
      validated: false,
      modals: {
        error: false,
        success: false,
      },
      errorText: '',
      loading: false,
    }
  },
  methods: {
    validateFirstName(){
      if (this.firstName.length === 0){
        this.firstNameError = 1
      } else {
        this.firstNameError = 0
      }
      this.validateInput()
    },
    validateLastName(){
      if (this.lastName.length === 0){
        this.lastNameError = 1
      } else {
        this.lastNameError = 0
      }
      this.validateInput()
    },
    validateUsername(){
      if (this.username.length === 0){
        this.usernameError = 1
      } else {
        this.usernameError = 0
      }
      this.validateInput()
    },
    validateEmail(){
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)){
        this.emailError = 1
      } else {
        this.emailError = 0
      }
      this.validateInput()
    },
    validatePassword(){
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(this.password)){
        this.passwordError = 1
      } else {
        this.passwordError = 0
      }
      this.validateInput()
    },
    validateConfirmPassword(){
      if (this.confirmPassword !== this.password){
        this.confirmPasswordError = 1
      } else {
        this.confirmPasswordError = 0
      }
      this.validateInput()
    },
    validateInput(){
      this.validated = !(this.firstNameError !== 0 || this.lastNameError !== 0 || this.emailError !== 0 || this.usernameError !== 0 || this.passwordError !== 0 || this.confirmPasswordError !== 0);
    },
    submit(){
      let newUser = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        username: this.username,
        password: this.password,
      }
      this.loading = true
      return usersAPIService.createUser(newUser)
          .then(() => {
            this.loading = false
            this.goToLogin()
          })
          .catch(e => {
            this.loading = false
            this.errorText = e.response.data.message
          })
    },
    goToLogin(){
      this.$router.push({
        name: 'Login',
        params: {
          newAccount: true
        }
      })
    },
  },
};
</script>

<style scoped>
</style>
