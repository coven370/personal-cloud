<template>
  <div class="fullContainer">
    <div class="row fullHeight">
      <div class="col-sm-2 sidebar">
        <h2 class="siteLogo">Sky <br> Vault</h2>
        <div class="sidebarItem" v-for="tab of tabs" v-bind:key="tab.name" :class="[$route.name === tab.name ? 'selected' : null]" @click="goToPage(tab.name, {})">
          <i :class="tab.icon" class="tabIcon"></i>
          <h4>{{tab.label}}</h4>
        </div>
      </div>
      <div class="col-sm-10 contentContainer">
        <div class="header">
          <h3 class="headerText">{{tabs.find(data => data.name === $route.name).label}}</h3>
          <div class="searchContainer">
            <label>Browse:</label>
            <input type="text" class="searchBar" v-model="search">
            <i class="el-icon-search searchIcon"></i>
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
  data(){
    return {
      tabs: [
        {
          label: 'Home',
          name: 'Home',
          icon: 'el-icon-house',
        },
        {
          label: 'Directory',
          name: 'Directory',
          icon: 'el-icon-monitor',
        },
        {
          label: 'My Files',
          name: 'MyFiles',
          icon: 'el-icon-folder-opened',
        },
        {
          label: 'Upload Files',
          name: 'Upload',
          icon: 'el-icon-top',
        },
        {
          label: 'Download Files',
          name: 'Download',
          icon: 'el-icon-bottom',
        },
        {
          label: 'Encrypt Files',
          name: 'Encrypt',
          icon: 'el-icon-unlock',
        },
        {
          label: 'Share Files',
          name: 'Share',
          icon: 'el-icon-share',
        },
        {
          label: 'Manage Account',
          name: 'ManageAccount',
          icon: 'el-icon-setting',
        },
      ],
      search: '',
    }
  },
  methods: {
    goToPage(name, params){
      if (this.$route.name !== name){
        this.$router.push({
          name: name,
          params: params,
        })
      }
    }
  }
};
</script>

<style scoped>
.fullContainer{
  width: 100vw;
  height: 100vh;
}
.fullHeight{
  height: 100%;
  margin: 0;
  padding: 0;
}
.sidebar{
  color: var(--white);
  border-right: 3px var(--dark-blue-grey) solid;
  margin: 0;
  padding: 0;
  z-index: 50;
  background-color: var(--steel-grey);
}
.sidebarItem{
  color: var(--pastel-yellow);
  display: flex;
  align-content: center;
  font-size: 18px;
  margin: 20px 30px;
  padding: 15px 25px;
  cursor: pointer;
}
.tabIcon{
  font-size: 24px;
  margin-right: 15px;
}
.selected{
  background-color: var(--dark-blue-grey);
  border-radius: 10px;
}
.contentContainer{
  padding: 0;
  margin: 0;
}
.siteLogo{
  height: var(--page-header-height);
  padding: 5px;
  border-bottom: 3px var(--dark-blue-grey) solid;
  text-align: center;
  margin: 0;
  width: 100%;
}
.header{
  height: var(--page-header-height);
  width: 100%;
  margin: 0;
  padding: 5px 20px;
  border-bottom: 3px var(--dark-blue-grey) solid;
  display: flex;
  justify-content: space-between;
}
.headerText{
  align-self: end;
}
.content{
  padding: 15px;
  overflow-x: hidden;
}
.searchContainer{
  width: 40%;
  display: flex;
  align-items: center;
  position: relative;
}
.searchBar{
  width: 90%;
  height: 40px;
  margin: 5px;
}
.searchIcon{
  font-size: 25px;
  position: absolute;
  right: 20px;
  font-weight: bold;
  color: var(--metallic-blue);
  pointer-events: none;
}
</style>