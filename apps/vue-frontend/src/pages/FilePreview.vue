<template>
  <div class="file-preview">
    <div v-if="!fileName" class="no-file">
      No file specified.
    </div>

    <div v-else>
      <div class="header">
        <h3>{{fileName}}</h3>
        <div class="icons">
          <button class="iconButton" @click="navigateBack">
            <i class="el-icon-d-arrow-left"></i>
          </button>
          <button
              class="iconButton"
              @click="downloadFile">
            <i class="el-icon-download"></i>
          </button>
          <ShareModal
              id="share"
              :file="file"
          ></ShareModal>
          <DeleteModal
              id="delete"
              :items="[file]"
              @confirm="deleteFile"
          ></DeleteModal>
        </div>
      </div>
      <div v-if="loading" class="loading">
        Loading preview…
      </div>
      <div v-else-if="error" class="error">
        Error loading file: {{ error }}
      </div>
      <div v-else>
        <!-- Image preview -->
        <img
            v-if="fileType === 'image'"
            :src="fileUrl"
            :alt="fileName"
            class="preview-image"
        />

        <!-- Video preview -->
        <video
            v-else-if="fileType === 'video'"
            :src="fileUrl"
            controls
            class="preview-video"
        />

        <!-- PDF preview -->
        <iframe
            v-else-if="fileType === 'pdf'"
            :src="fileUrl"
            class="preview-pdf"
            frameborder="0"
        ></iframe>

        <!-- Text preview -->
        <pre
            v-else-if="fileType === 'text'"
            class="preview-text"
        >
{{ textContent }}
        </pre>

        <!-- Fallback download link -->
        <div v-else class="fallback">
          <p>Cannot preview this file type.</p>
          <a href="#" onclick="return false;" @click="downloadFile" :title="fileName">
            Download {{ fileName }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FileAPIService from "@/servicehandlers/FileServiceHandler";
import DeleteModal from "@/components/DeleteModal.vue";
import SystemServiceHandler from "@/servicehandlers/SystemServiceHandler";
import ShareModal from "@/components/ShareModal.vue";

const fileAPIService = new FileAPIService()
const systemAPIService = new SystemServiceHandler()

export default {
  name: 'FilePreview',
  components: {ShareModal, DeleteModal},
  data() {
    return {
      file: null,
      fileName: '',
      fileUrl: '',
      fileType: '',
      textContent: '',
      loading: true,
      error: null
    };
  },
  methods: {
    determineType(name) {
      const ext = name.split('.').pop().toLowerCase();
      if (['png','jpg','jpeg','gif','bmp','webp','svg'].includes(ext)) {
        return 'image';
      }
      if (['mp4','webm','ogg','mov'].includes(ext)) {
        return 'video';
      }
      if (ext === 'pdf') {
        return 'pdf';
      }
      if (['txt','md','csv','log','json','xml'].includes(ext)) {
        return 'text';
      }
      return 'unknown';
    },
    getFile(){
      return fileAPIService.getFile(this.file.fileAddress, this.$router)
          .then(response => {
            this.textContent = response
            this.loading = false
          })
    },
    navigateBack(){
      this.$router.go(-1)
    },
    downloadFile(){
      return fileAPIService.downloadFile(this.file.fileAddress, this.$router)
          .then(response => {
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = this.file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          })
    },
    deleteFile(){
      return systemAPIService.deleteItems([this.file.id], this.$router)
          .then(() => {
            this.navigateBack()
          })
    }
  },
  mounted() {
    console.clear()
    this.file = this.$route.params.file
    this.fileName = this.file.name;
    if (!this.fileName) {
      this.loading = false;
      return;
    }
    console.log(this.file)
    // build the URL however your API expects it
    this.fileUrl = `/uploads/${this.file.fileAddress}`
    console.log(this.fileUrl)
    this.fileType = this.determineType(this.fileName);

    if (this.fileType === 'text') {
      // fetch text content
      this.getFile()
    } else {
      // for binary previews just stop loading
      // the browser will handle errors inside the tag
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.header{
  display: flex;
  justify-content: space-between;
}
.icons{
  display: flex;
}
h3{
  text-align: left;
  max-width: 75%;
}
.file-preview {
  max-width: 90%;
  margin: 1rem auto;
  text-align: center;
}
.loading,
.error,
.no-file {
  font-size: 1.2rem;
  color: var(--soft-cyan);
  margin: 2rem 0;
}
.preview-image {
  max-width: 100%;
  height: auto;
  border: none;
}
.preview-video {
  max-width: 100%;
  height: auto;
}
.preview-pdf {
  width: 100%;
  height: 80vh;
}
.preview-text {
  text-align: left;
  white-space: pre-wrap;
  background: transparent;
  padding: 1rem;
  border: none;
  overflow: auto;
  max-height: 80vh;
  color: var(--soft-cyan);
}
.fallback a {
  color: #007bff;
  text-decoration: none;
}
.fallback a:hover {
  text-decoration: underline;
}
</style>
