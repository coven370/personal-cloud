<template>
  <div class="manageAccountContainer">

    <!-- Main Menu -->
    <div v-if="view === 'main'" class="manageOptions">
      <button class="accountBtn" @click="view = 'accountSettings'">Account Settings</button>
      <button class="accountBtn" @click="view = 'profile'">Profile</button>
    </div>

    <!-- Account Settings -->
    <div v-if="view === 'accountSettings'" class="accountSettingsContainer">
      <h4>
        <span @click="view = 'main'" class="breadcrumb">Manage Account</span>
        > Account Settings
      </h4>
      <div class="formField" v-for="(value, key) in account" :key="key">
        <label>{{ key }}:</label>
        <input
          :type="key === 'password' ? 'password' : 'text'"
          v-model="account[key]"
        />
      </div>
      <button class="saveBtn" @click="saveAccountSettings">Save</button>
    </div>

    <!-- Profile Settings -->
    <div v-if="view === 'profile'" class="accountSettingsContainer">
      <h4>
        <span @click="view = 'main'" class="breadcrumb">Manage Account</span>
        > Profile
      </h4>
      <div class="formField">
        <label>
          <input type="radio" value="light" v-model="theme" name="theme"/>
          Light Mode
        </label>
      </div>
      <div class="formField">
        <label>
          <input type="radio" value="dark" v-model="theme" name="theme" />
          Dark Mode
        </label>
      </div>
      <button class="saveBtn" @click="saveProfileSettings">Save</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ManageAccountPage",
  data() {
    return {
      view: "main",
      account: {
        username: "UserOne",
        password: "*********",
        email: "*********@email.com"
      },
      theme: "light", //default is light mode
    };
  },
  methods: {
    saveAccountSettings() {
      alert("Account settings saved!");
      // future: send API request here
    },
    saveProfileSettings() {
      alert(`Saved theme settings: Dark Mode = ${this.darkMode}, Light Mode = ${this.lightMode}`);
    }
  }
};
</script>

<style scoped>
.manageAccountContainer {
  margin: 20px;
}
.manageOptions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 20px;
}
.accountBtn {
  background-color: var(--metallic-blue);
  color: var(--pastel-yellow);
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 10px;
  border: none;
  width: 400px;
  text-align: center;
}
.formField {
  margin: 20px 0;
}
.saveBtn {
  background-color: var(--pastel-yellow);
  color: var(--almost-black);
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}
.breadcrumb {
  cursor: pointer;
  color: var(--pastel-yellow);
  text-decoration: none;
  display: inline;
}
.breadcrumb:hover {
  text-decoration: underline;
}
.accountSettingsContainer,
.profileSettingsContainer {
  margin-top: 100px;
}
</style>
