<template>
  <div>
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
        <tr class="sectionHeader">
          <td>
            Favorites
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr v-for="file of filteredFiles.filter(data => data.group === 'favorite')" v-bind:key="file.id">
          <td>{{file.displayName}}</td>
          <td>{{file.type}}</td>
          <td>{{file.displaySize}}</td>
          <td>{{file.updatedAt.format(dateFormat)}}</td>
          <td>{{file.createdAt.format(dateFormat)}}</td>
        </tr>
        <tr class="blankRow">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr class="sectionHeader">
          <td>
            Recent
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr v-for="file of filteredFiles.filter(data => data.group === 'recent')" v-bind:key="file.id">
          <td>{{file.displayName}}</td>
          <td>{{file.type}}</td>
          <td>{{file.displaySize}}</td>
          <td>{{file.updatedAt.format(dateFormat)}}</td>
          <td>{{file.createdAt.format(dateFormat)}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: "MyFilesPage",
  data(){
    return {
      filteredFiles: [],
      files: [],
      nameDirection: 0,
      typeDirection: 0,
      sizeDirection: 0,
      updatedDirection: 0,
      createdDirection: 0,
      dateFormat: "YYYY-MM-DD HH:mm:ss",
    }
  },
  mounted(){
    console.clear()
    this.getMyFiles()
  },
  methods: {
    getMyFiles(){
      let today = dayjs()
      this.files = [
        {
          id: 1,
          name: 'Example File 1.mov',
          size: rand(512, 1000000000),
          createdAt: today.add(rand(-1, -50), 'day'),
          updatedAt: today.add(rand(-1, -50), 'day'),
          group: 'favorite',
        },
        {
          id: 2,
          name: 'Example File 2.txt',
          size: rand(512, 1000000000),
          createdAt: today.add(rand(-1, -50), 'day'),
          updatedAt: today.add(rand(-1, -50), 'day'),
          group: 'favorite',
        },
        {
          id: 3,
          name: 'Example File 3.vue',
          size: rand(512, 1000000000),
          createdAt: today.add(rand(-1, -50), 'day'),
          updatedAt: today.add(rand(-1, -50), 'day'),
          group: 'favorite',
        },
        {
          id: 4,
          name: 'Example File 4.jpeg',
          size: rand(512, 1000000000),
          createdAt: today.add(rand(-1, -50), 'day'),
          updatedAt: today.add(rand(-1, -50), 'day'),
          group: 'favorite',
        },
        {
          id: 5,
          name: 'Example File 5.png',
          size: rand(512, 1000000000),
          createdAt: today.add(rand(-1, -50), 'day'),
          updatedAt: today.add(rand(-1, -50), 'day'),
          group: 'favorite',
        },
        {
          id: 6,
          name: 'Example File 6.mov',
          size: rand(512, 1000000000),
          createdAt: today.add(rand(-1, -50), 'day'),
          updatedAt: today.add(rand(-1, -50), 'day'),
          group: 'recent',
        },
        {
          id: 7,
          name: 'Example File 7.txt',
          size: rand(512, 1000000000),
          createdAt: today.add(rand(-1, -50), 'day'),
          updatedAt: today.add(rand(-1, -50), 'day'),
          group: 'recent',
        },
        {
          id: 8,
          name: 'Example File 8.vue',
          size: rand(512, 1000000000),
          createdAt: today.add(rand(-1, -50), 'day'),
          updatedAt: today.add(rand(-1, -50), 'day'),
          group: 'recent',
        },
        {
          id: 9,
          name: 'Example File 9.jpeg',
          size: rand(512, 1000000000),
          createdAt: today.add(rand(-1, -50), 'day'),
          updatedAt: today.add(rand(-1, -50), 'day'),
          group: 'recent',
        },
        {
          id: 10,
          name: 'Example File 10.png',
          size: rand(512, 1000000000),
          createdAt: today.add(rand(-1, -50), 'day'),
          updatedAt: today.add(rand(-1, -50), 'day'),
          group: 'recent',
        },
      ]

      for (let file of this.files) {
        let split = file.name.split('.')
        file.displayName = split[0]
        file.type = split[1].toUpperCase()
        file.createdAt = new dayjs(file.createdAt)
        file.updatedAt = new dayjs(file.updatedAt)
        file.displaySize = formatBytes(file.size)
      }

      this.filteredFiles = this.files

      function formatBytes(sizeInBytes) {
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
      }

      function rand(min, max) {
        return Math.random() * (max - min) + min;
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
  },
};
</script>

<style scoped>
.sortButton{
  display: flex;
  flex-direction: column;
  padding: 0;
  margin-left: 10px;
  cursor: pointer;
}
.icon{
  padding: 0 !important;
  font-size: 12px;
}
.columnHeader{
  display: flex;
  align-items: center;
  justify-content: center;
}
.selected{
  color: var(--steel-grey);
}
</style>
