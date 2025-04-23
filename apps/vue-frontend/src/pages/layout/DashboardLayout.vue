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
            {{ tabs.find(data => data.name === $route.name)?.label }}
          </h3>
          <div class="convoContainer" id="convoContainer">
            <div class="convoHeader" v-if="convoOpen">
              <h2>Sky Vault AI</h2>
              <button @click="clearConversation" class="basicButton" style="background-color: var(--steel-grey)">Clear</button>
            </div>
            <div class="conversation" v-show="convoOpen">
              <div v-for="(message, i) of messages.filter(data => data.role !== 'system')" v-bind:key="i">
                <h3 :class="message.role + 'Header'">
                  {{message.role === 'assistant' ? 'Vault AI' : 'You'}}
                </h3>
                <div class="message" :class="message.role + 'Message'" :id="i + 'message'"></div>
              </div>
            </div>
            <div class="searchContainer">
              <label>Browse:</label>
              <input
                  type="text"
                  class="searchBar"
                  v-model="search"
                  @focus="openAIConvo"
                  @keyup.enter="sendMessage"
              />
              <i class="el-icon-search searchIcon"></i>
            </div>
            <div class="loadingContainer" v-if="loading">
              <i class="el-icon-loading"></i>
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
import { marked } from 'marked';
import SystemServiceHandler from "@/servicehandlers/SystemServiceHandler";

const systemAPIService = new SystemServiceHandler()
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
          label: "Manage Account",
          name: "ManageAccount",
          icon: "el-icon-setting",
        },
      ],
      search: "",
      convoOpen: false,
      messages: [],
      loading: false,
    };
  },
  mounted() {
    console.clear()
    this.messages = this.$store.getters.conversation
    console.log(this.messages)
    document.addEventListener("click", this.handleClickOutside);
    this.$nextTick(() => {
      for (let message of this.messages){
        console.log(message.content, )
        if (message.role === 'assistant') {
          document.getElementById(this.messages.indexOf(message) - 1 + 'message').innerHTML = marked(message.content)
        } else if (message.role === 'user') {
          document.getElementById(this.messages.indexOf(message) - 1 + 'message').innerHTML = message.content
        }
      }
    })
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    clearConversation(){
      this.$store.dispatch('CLEAR_CONVERSATION')
      this.messages = this.$store.getters.conversation
    },
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
    },
    sendMessage(){
      console.log(this.messages)
      if (this.search.length > 0){
        this.messages.push({
          role: 'user',
          content: this.search
        })

        this.$nextTick(() => {
          console.log(this.messages.length - 2 + 'message')
          document.getElementById(this.messages.length - 2 + 'message').innerHTML = this.search;

          this.search = ''
          this.loading = true
          return systemAPIService.sendMessage(this.messages, this.$router)
              .then(response => {
                this.loading = false
                this.messages.push(response.message)

                let fullText = response.message.content;

                this.typeWriterEffect(response.message, fullText, 3000);
                this.$store.dispatch('ADD_CONVERSATION', this.messages)
              })
              .catch(() => {
                this.loading = false
              })
        })
      }
    },
    typeWriterEffect(messageObj, fullText, duration = 3000) {
      let currentIndex = 0;
      const totalLetters = fullText.length;
      const interval = duration / totalLetters;

      messageObj.message = ''

      const timer = setInterval(() => {
        messageObj.message += fullText.charAt(currentIndex);

        let div = document.getElementById(this.messages.length - 2 + 'message')

        if (div){
          div.innerHTML = marked(messageObj.message);
        }

        currentIndex++;

        if (currentIndex >= totalLetters) {
          clearInterval(timer);
        }
      }, interval);
    }
  },
};
</script>

<style scoped>
.loadingContainer{
  position: absolute;
  bottom: 75px;
  left: 50%;
  transform: translate(-50%, 0);
  -webkit-transform: translate(-50%, 0);
  color: var(--steel-grey);
  background-color: var(--soft-cyan);
  padding: 10px;
  aspect-ratio: 1 / 1;
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
.loadingContainer i {
  font-size: 100px;
  padding: 0;
  margin: 0;
}
.convoHeader{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--page-header-height);
  padding: 0 30px;
}
.fullContainer {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
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
  overflow-x: auto;
  overflow-y: hidden;
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
  width: 60%;
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
  height: calc(100% - (var(--page-header-height) * 2) - 15px);
  margin: 20px 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
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
.assistantMessage{
  background-color: var(--metallic-blue);
  margin-right: 20%;
}
.userMessage{
  background-color: var(--steel-grey);
  margin-left: 20%;
}
.assistantHeader, .userHeader{
  padding: 5px 15px;
}
.userHeader{
  text-align: right;
}
</style>
