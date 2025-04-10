<template>
  <div>
    <button class="iconButton" @click="openModal">
      <i class="el-icon-delete"></i>
    </button>
    <div class="overlay" id="overlay" v-if="modalOpen" v-loading="loading">
      <div class="modalContainer">
        <h3 class="modalTitle">Delete Confirm</h3>

        <div class="deleteItems">
          <table style="width: 75%">
            <thead>
              <tr>
                <th>
                  <div class="columnHeader">
                    Type
                  </div>
                </th>
                <th>
                  <div class="columnHeader">
                    Name
                  </div>
                </th>
                <th>
                  <div class="columnHeader">
                    Safe To Delete
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                  v-for="item of items"
                  v-bind:key="item.id"
                  :class="[item.systemType.name.toLowerCase() + 'TR']">
                <td>{{item.systemType.name}}</td>
                <td>{{item.name}}</td>
                <td>
                  <div v-if="item.safe2Delete">
                    <i class="el-icon-check green"></i>
                    {{item.systemType.name}} is safe to delete
                  </div>
                  <div v-else>
                    <i class="el-icon-close red"></i>
                    {{item.systemType.name}} isn't empty
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="red" v-if="items.some(data => !data.safe2Delete)">
          Please delete folder contents before deleting the folder
        </div>
        <div class="d-flex">
          <button class="basicButton" @click="confirm" :disabled="items.some(data => !data.safe2Delete)">
            Confirm
          </button>
          <button id="cancelButton" style="margin-left: 15px" class="basicButton" @click="modalOpen = false">
            Cancel
          </button>
        </div>

        <button class="iconButton closeButton" @click="modalOpen = false">
          <i class="el-icon-close"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import SystemServiceHandler from "@/servicehandlers/SystemServiceHandler";

const systemAPIService = new SystemServiceHandler()

export default {
  name: "UploadModal",
  props: {
    items: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      loading: false,
      modalOpen: false,
    }
  },
  mounted(){
    this.determineSafe()
  },
  methods: {
    confirm(){
      this.$emit('confirm')
      this.modalOpen = false
    },
    async openModal(){
      this.modalOpen = true
      await this.determineSafe()
    },
    async determineSafe(){
      for (let item of this.items){
        switch (item.systemType.name){
          case 'File':
            item.safe2Delete = true
            break
          case 'Folder':
            item.contents = await systemAPIService.getContentsOfFolder(item.id, this.$router)
            item.safe2Delete = !item.contents.length
            break
        }
      }
      this.$forceUpdate()
    },
  }
}
</script>

<style scoped>
.deleteItems{
  width: 100%;
  display: flex;
  color: var(--soft-cyan);
  justify-content: center;
}
.green, .red{
  font-size: 20px;
  font-weight: bold;
  background-color: var(--steel-grey);
  padding: 8px;
  border-radius: 8px;
  margin-right: 10px;
}
.green{
  color: var(--green-color);
}
.red{
  color: var(--red-color);
}
</style>