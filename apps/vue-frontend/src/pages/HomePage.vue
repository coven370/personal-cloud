<template>
  <div>
    <h1>Home Page</h1>
    {{allUsers}}
  </div>
</template>

<script>

import UsersAPIService from "@/servicehandlers/UsersAPIService";

const userAPIService = new UsersAPIService()
export default {
  name: "HomePage",
  data(){
    return {
      allUsers: [],
    }
  },
  mounted(){
    this.getAllUsers()
  },
  methods: {
    getAllUsers(){
      return userAPIService.getUserList(this.$router)
          .then(response => {
            this.allUsers = response
          })
    },
  },
};
</script>

<style scoped>

</style>
