<template>
  <div class="fullContainer">
    <div class="row fullHeight">
      <div class="col-sm-2 sidebar">
        <h2 class="siteLogo">Sky <br> Vault</h2>
        <div
            class="sidebarItem"
            v-for="tab of tabs"
            :key="tab.name"
            :class="[$route.name === tab.name ? 'selected' : null]"
            @click="goToPage(tab.name, {})"
        >
          <i :class="tab.icon" class="tabIcon"></i>
          <h4>{{ tab.label }}</h4>
        </div>
      </div>
      <div class="col-sm-10 contentContainer">
        <div class="header">
          <h3 class="headerText">
            {{ tabs.find(data => data.name === $route.name).label }}
          </h3>
          <div class="convoContainer" id="convoContainer">
            <div class="conversation" v-if="convoOpen">
              <div v-for="(message, i) of messages" v-bind:key="i">
                <h3 :class="message.from + 'Header'">
                  {{message.from === 'ai' ? 'Vault AI' : 'You'}}
                </h3>
                <div class="message" :class="message.from + 'Message'">
                  {{message.message}}
                </div>
              </div>
            </div>
            <div class="searchContainer">
              <label>Browse:</label>
              <input
                  type="text"
                  class="searchBar"
                  v-model="search"
                  @focus="openAIConvo"
              />
              <i class="el-icon-search searchIcon"></i>
            </div>
          </div>
        </div>
        <div class="content">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardLayout",
  data() {
    return {
      tabs: [
        {
          label: "Home",
          name: "Home",
          icon: "el-icon-house",
        },
        {
          label: "My Files",
          name: "MyFiles",
          icon: "el-icon-folder-opened",
        },
        {
          label: "Directory",
          name: "Directory",
          icon: "el-icon-monitor",
        },
        {
          label: "Upload Files",
          name: "Upload",
          icon: "el-icon-top",
        },
        {
          label: "Download Files",
          name: "Download",
          icon: "el-icon-bottom",
        },
        {
          label: "Encrypt Files",
          name: "Encrypt",
          icon: "el-icon-unlock",
        },
        {
          label: "Share Files",
          name: "Share",
          icon: "el-icon-share",
        },
        {
          label: "Manage Account",
          name: "ManageAccount",
          icon: "el-icon-setting",
        },
      ],
      search: "",
      convoOpen: false,
      messages: [
        {
          from: 'ai',
          message: '1Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
          from: 'user',
          message: '2Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
          from: 'ai',
          message: '3Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
          from: 'user',
          message: '4Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
          from: 'ai',
          message: '5Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
          from: 'user',
          message: '6Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
      ],
    };
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    goToPage(name, params) {
      if (this.$route.name !== name) {
        this.$router.push({
          name: name,
          params: params,
        });
      }
    },
    openAIConvo() {
      const convoContainer = document.getElementById("convoContainer");
      if (convoContainer) {
        const rootStyles = getComputedStyle(document.documentElement);
        convoContainer.style.height = "calc(100vh - 40px)";
        convoContainer.style.backgroundColor = rootStyles.getPropertyValue("--dark-blue-grey").trim();
        this.convoOpen = true
      }
    },
    handleClickOutside(event) {
      const convoContainer = document.getElementById("convoContainer");
      if (convoContainer && !convoContainer.contains(event.target)) {
        this.closeAIConvo()
      }
    },
    closeAIConvo(){
      const convoContainer = document.getElementById("convoContainer");
      if (convoContainer) {
        convoContainer.style.height = "calc(var(--page-header-height) - 40px)";
        convoContainer.style.backgroundColor = "";
        setTimeout(() => {this.convoOpen = false}, 450)
      }
    }
  },
};
</script>

<style scoped>
.fullContainer {
  width: 100vw;
  height: 100vh;
}
.fullHeight {
  height: 100%;
  margin: 0;
  padding: 0;
}
.sidebar {
  color: var(--white);
  border-right: 3px var(--dark-blue-grey) solid;
  margin: 0;
  padding: 0;
  z-index: 50;
  background-color: var(--steel-grey);
}
.sidebarItem {
  color: var(--pastel-yellow);
  display: flex;
  align-content: center;
  font-size: 18px;
  margin: 20px 30px;
  padding: 15px 25px;
  cursor: pointer;
}
.tabIcon {
  font-size: 24px;
  margin-right: 15px;
}
.selected {
  background-color: var(--dark-blue-grey);
  border-radius: 10px;
}
.contentContainer {
  padding: 0;
  margin: 0;
}
.siteLogo {
  height: var(--page-header-height);
  padding: 5px;
  border-bottom: 3px var(--dark-blue-grey) solid;
  text-align: center;
  margin: 0;
  width: 100%;
}
.header {
  height: var(--page-header-height);
  width: 100%;
  margin: 0;
  padding: 5px 20px;
  border-bottom: 3px var(--dark-blue-grey) solid;
  display: flex;
  justify-content: space-between;
}
.headerText {
  align-self: end;
}
.content {
  padding: 15px;
  overflow-x: hidden;
}
.searchContainer {
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
}
.searchBar {
  width: calc(90% - 15px);
  height: 40px;
  margin-left: 15px;
}
.searchIcon {
  font-size: 25px;
  position: absolute;
  right: 40px;
  font-weight: bold;
  color: var(--metallic-blue);
  pointer-events: none;
}
.convoContainer {
  width: 40%;
  height: calc(var(--page-header-height) - 40px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 50;
  border-radius: 10px;
  margin: 20px;
  background-color: transparent;
  transition: height 0.5s ease, background-color 0.5s ease;
}
.conversation{
  width: 100%;
  height: calc(100% - var(--page-header-height));
  margin: 20px 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
  padding: 15px;
  gap: 25px;
}
.message{
  color: var(--pastel-yellow);
  font-size: 16px;
  padding: 15px 20px;
  border-radius: 20px;
  width: 80%;
}
.aiMessage{
  background-color: var(--metallic-blue);
  margin-right: 20%;
}
.userMessage{
  background-color: var(--steel-grey);
  margin-left: 20%;
}
.aiHeader, .userHeader{
  padding: 5px 15px;
}
.userHeader{
  text-align: right;
}
</style>
