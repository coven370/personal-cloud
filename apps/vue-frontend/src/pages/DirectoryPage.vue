<template>
  <div>
    <h2>{{currentFolder.name}} <span style="margin-left: 15px;font-size: 20px">{{formatBytes(currentFolder.size)}}</span></h2>
    <div class="iconContainer">
      <div class="icons">
        <button class="iconButton" @click="navigateToParentFolder">
          <i class="el-icon-d-arrow-left"></i>
        </button>
        <button class="iconButton" @click="selectFolder(fileSystem.id)">
          <i class="el-icon-house"></i>
        </button>
        <UploadModal :folder="currentFolder" @reload="selectFolder(currentFolder.id)"></UploadModal>
        <button class="iconButton" @click="createNewFolder">
          <i class="el-icon-folder-add"></i>
        </button>
      </div>
      <div class="icons" v-if="selectedItems.length > 0">
        <button
            class="iconButton"
            @click="downloadFile"
            v-if="selectedItems.length === 1 &&
             currentFolder.contents.find(data => data.id === selectedItems[0]).systemType.name === 'File'">
          <i class="el-icon-download"></i>
        </button>
        <DeleteModal
            id="delete"
            :items="currentFolder.contents.filter(data => selectedItems.includes(data.id))"
            @confirm="deleteItems"
        ></DeleteModal>
        <ShareModal
            id="share"
            :file="currentFolder.contents.find(data => data.id === selectedItems[0])"
            v-if="selectedItems.length === 1 &&
             currentFolder.contents.find(data => data.id === selectedItems[0]).systemType.name === 'File'"
        ></ShareModal>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>
            <div class="columnHeader" @click="filterFiles('name')">
              Name
              <div class="sortButton">
                <i class="el-icon-caret-top icon" :class="nameDirection > 0 ? 'selected' : ''"></i>
                <i class="el-icon-caret-bottom icon" :class="nameDirection < 0 ? 'selected' : ''"></i>
              </div>
            </div>
          </th>
          <th>
            <div class="columnHeader" @click="filterFiles('type')">
              Type
              <div class="sortButton">
                <i class="el-icon-caret-top icon" :class="typeDirection > 0 ? 'selected' : ''"></i>
                <i class="el-icon-caret-bottom icon" :class="typeDirection < 0 ? 'selected' : ''"></i>
              </div>
            </div>
          </th>
          <th>
            <div class="columnHeader" @click="filterFiles('size')">
              Size
              <div class="sortButton">
                <i class="el-icon-caret-top icon" :class="sizeDirection > 0 ? 'selected' : ''"></i>
                <i class="el-icon-caret-bottom icon" :class="sizeDirection < 0 ? 'selected' : ''"></i>
              </div>
            </div>
          </th>
          <th>
            <div class="columnHeader" @click="filterFiles('update')">
              Modified Date
              <div class="sortButton">
                <i class="el-icon-caret-top icon" :class="updatedDirection > 0 ? 'selected' : ''"></i>
                <i class="el-icon-caret-bottom icon" :class="updatedDirection < 0 ? 'selected' : ''"></i>
              </div>
            </div>
          </th>
          <th>
            <div class="columnHeader" @click="filterFiles('create')">
              Uploaded Date
              <div class="sortButton">
                <i class="el-icon-caret-top icon" :class="createdDirection > 0 ? 'selected' : ''"></i>
                <i class="el-icon-caret-bottom icon" :class="createdDirection < 0 ? 'selected' : ''"></i>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="dblClickItem"
            v-for="item of currentFolder.contents"
            v-bind:key="item.id"
            @dblclick="clickItem(item)"
            @click="highlightFolder(item, $event)"
            :class="[
                item.systemType.name.toLowerCase() + 'TR',
                selectedItems.includes(item.id) ? 'selectedItem' : ''
            ]">
          <td>
            <input
                :id="'item' + item.id"
                type="text"
                v-model="item.displayName"
                :disabled="!item.editable"
                @blur="renameItem(item)"
                @keyup.esc="cancelEdit(item)"
                @keyup.enter="renameItem(item)"
            >
          </td>
          <td>{{item.type}}</td>
          <td>{{item.displaySize}}</td>
          <td>{{item.updatedAt.format(dateFormat)}}</td>
          <td>{{item.createdAt.format(dateFormat)}}</td>
        </tr>
      </tbody>
    </table>
    <div class="empty" v-if="currentFolder.contents.length === 0">Empty Folder</div>
    <ToastNotifier ref="toast"></ToastNotifier>
  </div>
</template>

<script>
import dayjs from "dayjs";
import ToastNotifier from "@/components/ToastNotifier.vue";
import UploadModal from "@/components/UploadModal.vue";
import DeleteModal from "@/components/DeleteModal.vue";
import ShareModal from "@/components/ShareModal.vue";
import SystemServiceHandler from "@/servicehandlers/SystemServiceHandler";
import FileServiceHandler from "@/servicehandlers/FileServiceHandler";

const systemAPIService = new SystemServiceHandler()
const fileAPIService = new FileServiceHandler()
export default {
  name: "DirectoryPage",
  components: {
    ToastNotifier,
    UploadModal,
    DeleteModal,
    ShareModal,
  },
  data(){
    return {
      fileSystem: {},
      currentFolder: {},
      nameDirection: 0,
      typeDirection: 0,
      sizeDirection: 0,
      updatedDirection: 0,
      createdDirection: 0,
      dateFormat: "YYYY-MM-DD HH:mm:ss",
      selectedItems: [],
    }
  },
  async mounted(){
    this.getHomeFolder()
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    getHomeFolder(){
      return systemAPIService.getHomeDirectoryForUser(this.$store.getters.user.id, this.$router)
          .then(response => {

            this.fileSystem = response

            this.selectFolder(this.fileSystem.id)
          })
    },
    cancelEdit(item){
      this.formatDisplayName(item)
      document.getElementById('item' + item.id).blur()
    },
    highlightFolder(item, event) {
      let clear = false
      if (event.shiftKey) {
        this.selectedItems.push(item.id);
        clear = true
      }
      else if (this.selectedItems.length > 1 || this.selectedItems.length === 0 || !this.selectedItems.includes(item.id)){
        this.selectedItems = [item.id];
        clear = true
      }
      else {
        item.editable = true
        this.$nextTick(async () => {
          await this.$forceUpdate()
          document.getElementById('item' + item.id).focus();
          document.getElementById('item' + item.id).select();
        })
      }

      if (clear){
        for (let item of this.currentFolder.contents){
          item.editable = false
        }
      }
    },
    formatDisplayName(item){
      if (item.systemType.name === 'File'){
        let split = item.name.split('.')
        item.displayName = split[0]
        item.type = split[1].toUpperCase()
      } else if (item.systemType.name === 'Folder'){
        item.displayName = item.name
        item.type = item.systemType.name.toUpperCase()
      }
    },
    async selectFolder(folderId){
      let selectedFolder = this.findFolder(this.fileSystem, folderId)

      try {
        selectedFolder.contents = await systemAPIService.getContentsOfFolder(folderId, this.$router)
      } catch (e) {
        this.$refs.toast.showError('Error getting contents of folder, ' + e)
      }

      selectedFolder.size = 0
      for (let item of selectedFolder.contents) {
        this.formatDisplayName(item)
        item.createdAt = dayjs(item.createdAt)
        item.updatedAt = dayjs(item.updatedAt)
        item.displaySize = this.formatBytes(item.size)
        item.editable = false
        selectedFolder.size += item.size
      }

      this.currentFolder = selectedFolder

      this.$forceUpdate()
    },
    formatBytes(sizeInBits) {
      const sizeInBytes = sizeInBits / 8
      const oneGB = 1024 ** 3;  // 1,073,741,824 bytes
      const oneMB = 1024 ** 2;  // 1,048,576 bytes
      const oneKB = 1024;       // 1,024 bytes

      if (sizeInBytes >= oneGB) {
        return (sizeInBytes / oneGB).toFixed(2) + " GB";
      } else if (sizeInBytes >= oneMB) {
        return (sizeInBytes / oneMB).toFixed(2) + " MB";
      } else if (sizeInBytes >= oneKB) {
        return (sizeInBytes / oneKB).toFixed(2) + " KB";
      } else {
        return sizeInBytes + " bytes";
      }
    },
    filterFiles(type){
      switch (type){
        case 'name':
          this.nameDirection = this.nameDirection === 1 ? -1 : (this.nameDirection === -1 ? 0 : 1);
          this.filteredFiles = (this.nameDirection === 0)
              ? [...this.files]
              : [...this.files].sort((a, b) =>
                  this.nameDirection * a.displayName.localeCompare(b.displayName)
              );
          break
        case 'type':
          this.typeDirection = this.typeDirection === 1 ? -1 : (this.typeDirection === -1 ? 0 : 1);
          this.filteredFiles = (this.typeDirection === 0)
              ? [...this.files]
              : [...this.files].sort((a, b) =>
                  this.typeDirection * a.type.localeCompare(b.type)
              );
          break
        case 'size':
          this.sizeDirection = this.sizeDirection === 1 ? -1 : (this.sizeDirection === -1 ? 0 : 1);
          this.filteredFiles = (this.sizeDirection === 0)
              ? [...this.files]
              : [...this.files].sort((a, b) =>
                  this.sizeDirection * (a.size - b.size)
              );
          break
        case 'update':
          this.updatedDirection = this.updatedDirection === 1 ? -1 : (this.updatedDirection === -1 ? 0 : 1);
          this.filteredFiles = (this.updatedDirection === 0)
              ? [...this.files]
              : [...this.files].sort((a, b) =>
                  this.updatedDirection * a.updatedAt.diff(b.updatedAt));
          break;

        case 'create':
          this.createdDirection = this.createdDirection === 1 ? -1 : (this.createdDirection === -1 ? 0 : 1);
          this.filteredFiles = (this.createdDirection === 0)
              ? [...this.files]
              : [...this.files].sort((a, b) =>
                  this.createdDirection * a.createdAt.diff(b.createdAt));
          break;

      }
    },
    findFolder(folder, searchId) {
      if (folder.id === searchId) {
        return folder;
      }
      if (folder.contents && folder.contents.some(data => data.systemType.name === 'Folder')) {
        for (let subFolder of folder.contents.filter(data => data.systemType.name === 'Folder')) {
          let found = this.findFolder(subFolder, searchId);
          if (found) {
            return found;
          }
        }
      }
      return null;
    },
    clickItem(item){
      if (item.systemType.name === 'Folder'){
        this.selectFolder(item.id)
      }
      else if (item.systemType.name === 'File') {
        this.$router.push({
          name: 'FilePreview',
          params: {
            file: item,
          }
        })
      }
    },
    navigateToParentFolder(){
      if (this.currentFolder.parentFolderId){
        this.selectFolder(this.currentFolder.parentFolderId)
      }
    },
    createNewFolder(){
      return systemAPIService.createFolderForUser(this.currentFolder.id, this.$store.getters.user.id, this.$router)
          .then(() => {
            this.selectFolder(this.currentFolder.id)
          })
    },
    handleClickOutside(event) {
      const folderEls = document.querySelectorAll('.folderTR');
      const fileEls = document.querySelectorAll('.fileTR');
      const deleteButton = document.getElementById('delete');
      const shareButton = document.getElementById('share');
      const overlay = document.getElementById('overlay')
      const cancelButton = document.getElementById('cancelButton')

      const clickedInsideFolder = Array.from(folderEls).some(el => el.contains(event.target));
      const clickedInsideFile = Array.from(fileEls).some(el => el.contains(event.target));
      const clickedInsideDelete = deleteButton ? deleteButton.contains(event.target) : false;
      const clickedInsideShare = shareButton ? shareButton.contains(event.target) : false;
      const clickedInsideOverlay = overlay ? overlay.contains(event.target) : false;
      const clickedInsideCancel = cancelButton ? cancelButton.contains(event.target) : false;


      if (
          !clickedInsideFolder &&
          !clickedInsideFile &&
          !clickedInsideDelete &&
          !clickedInsideShare &&
          !clickedInsideOverlay &&
          !clickedInsideCancel
      ) {
        this.selectedItems = [];
      }
    },
    renameItem(item){
      item.name = item.displayName
      if (item.systemType.name === 'File'){
        item.name += '.' + item.type.toLowerCase()
      }
      return systemAPIService.updateItem(item, item.id, this.$router)
          .then(() => {
            this.selectFolder(this.currentFolder.id)
            this.selectedItems = []
            for (let item of this.currentFolder.contents){
              item.editable = false
            }
          })
    },
    deleteItems(){
      return systemAPIService.deleteItems(this.selectedItems, this.$router)
          .then(() => {
            this.selectFolder(this.currentFolder.id)
          })
    },
    downloadFile(){
      const item = this.currentFolder.contents.find(data => data.id === this.selectedItems[0])
      return fileAPIService.downloadFile(item.fileAddress, this.$router)
          .then(response => {
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = item.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          })
    },
  },
};
</script>

<style scoped>
.iconContainer{
  display: flex;
  justify-content: space-between;
}
input{
  font-size: 14px;
  color: inherit;
  font-weight: inherit;
  padding: 0;
  margin: 0;
  width: 100%;
  background-color: transparent;
  border-radius: 0;
}
input:disabled{
  pointer-events: none;
}
.empty{
  width: 100%;
  color: var(--soft-cyan);
  font-size: 26px;
  text-align: center;
  background-color: var(--metallic-blue);
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}
.icons{
  display: flex;
}
.selectedItem{
  background-color: var(--pastel-yellow);
  color: var(--metallic-blue);
}
</style>
