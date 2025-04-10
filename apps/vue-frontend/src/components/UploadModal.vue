<template>
  <div>
    <button class="iconButton" @click="modalOpen = true">
      <i class="el-icon-upload2"></i>
    </button>
    <div class="overlay" v-if="modalOpen" v-loading="loading">
      <div class="modalContainer">
        <h3 class="modalTitle">Upload File to {{folder.name}}</h3>
        <input
            type="file"
            ref="fileInput"
            @change="handleFileChange"
            style="display: none"
        />

        <!-- Custom Button to Trigger Input -->
        <button v-if="!file" class="basicButton" @click="triggerFileInput">
          Choose File
        </button>

        <div v-else class="d-flex">
          <div v-if="file" class="fileName" @click="triggerFileInput">{{ file.name }}</div>
          <button style="margin-left: 15px" class="basicButton" @click="uploadFile">
            Upload
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
import FileAPIService from "@/servicehandlers/FileServiceHandler";

const fileAPIService = new FileAPIService()
export default {
  name: "UploadModal",
  props: {
    folder: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      loading: false,
      modalOpen: false,
      file: null,
    }
  },
  mounted(){
    console.clear()
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      this.file = event.target.files[0];
    },
    uploadFile(){
      this.loading = true
      let formData = new FormData()
      for (const file of this.$refs.fileInput.files){
        formData.append('fileInput', file)
      }
      return fileAPIService.uploadFile(formData, this.folder.id, this.$store.getters.user.id, this.$router)
          .then(() => {
            this.loading = false
            this.modalOpen = false
            this.file = null
            this.$emit('reload')
          })
          .catch(e => {
            console.error("Error uploading file: ", e)
            this.loading = false
          })
    },
  }
}
</script>

<style scoped>
.fileName{
  cursor: pointer;
  color: var(--soft-cyan);
}
</style>