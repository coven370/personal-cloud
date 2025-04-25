<template>
  <div>
    <button class="iconButton" @click="openAndGenerateLink">
      <i class="el-icon-share"></i>
    </button>
    <div class="overlay" v-if="modalOpen" v-loading="loading">
      <div class="modalContainer">
        <h3 class="modalTitle">Share {{file.name}}</h3>
        <div class="linkContainer" v-if="generatedLink">
          <h4 v-if="copied">Copied!</h4>
          <h4 v-else>Link Created</h4>
          <i class="el-icon-copy-document customIcon" @click="copyToClipboard"></i>
          <i class="el-icon-search customIcon" @click="goToLink"></i>
        </div>
        <button class="iconButton closeButton" @click="modalOpen = false">
          <i class="el-icon-close"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import crypto from 'crypto-js'
export default {
  name: "UploadModal",
  props: {
    file: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      loading: false,
      modalOpen: false,
      fileAddress: '',
      generatedLink: '',
      copied: false,
    }
  },
  mounted(){
    console.clear()
  },
  methods: {
    //window.location.origin
    openAndGenerateLink() {
      this.modalOpen = true
      console.log('Original file:', this.file)

      // 1. grab the address
      const address = this.file.fileAddress

      // 2. encrypt with AES (you can swap in your own secret)
      const encrypted = crypto.AES.encrypt(address, process.env.VUE_APP_SECRET_KEY).toString()
      console.log('Encrypted payload:', encrypted)

      // 3. url-encode and append as `?file=…`
      this.fileAddress = encodeURIComponent(encrypted)
      this.generatedLink = `${window.location.origin}/shareFile?file=${this.fileAddress}`

      console.log('Generated link:', this.generatedLink)
    },
    async copyToClipboard(){
      const text = this.generatedLink
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          this.copied = true
        } catch (err) {
          console.error('Failed to copy via Clipboard API, falling back…', err);
          this.fallbackCopy(text);
        }
      } else {
        // Fallback for older browsers
        this.fallbackCopy(text);
      }
    },
    fallbackCopy(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      // Prevent scrolling to bottom of page in MS Edge.
      textarea.style.position = 'fixed';
      textarea.style.top = 0;
      textarea.style.left = 0;
      textarea.style.width = '1px';
      textarea.style.height = '1px';
      textarea.style.padding = 0;
      textarea.style.border = 'none';
      textarea.style.outline = 'none';
      textarea.style.boxShadow = 'none';
      textarea.style.background = 'transparent';
      document.body.appendChild(textarea);
      textarea.select();

      try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'Fallback: Link copied!' : 'Fallback: Copy command was unsuccessful';
        console.log(msg);
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      }

      document.body.removeChild(textarea);
    },
    goToLink(){
      this.$router.push({
        name: 'SharedFile',
        query: {
          file: this.fileAddress
        }
      })
    },
  }
}
</script>

<style scoped>
h4{
  color: var(--soft-cyan);
}
.linkContainer{
  display: flex;
  gap: 30px;
  justify-content: center;
  align-items: center;
}
.customIcon{
  font-size: 30px;
  color: var(--soft-cyan);
  cursor: pointer;
}
</style>