<template>
  <div>
    <div class="storageUsageContainer">
      <h4>Storage Usage <i class="el-icon-coin"></i></h4>
      <div class="storageBarContainer">
        <div class="storageBar" id="storageBar">
          <div class="progress" id="progress">
            <div class="progressColors" id="progressColors"></div>
          </div>
          <div class="progressValue" id="progressValue">
            <h4>{{displayPercentage.toFixed(0)}}%</h4>
          </div>
        </div>
      </div>
    </div>
    <div class="recentContainer" v-if="leftFile && midFile && rightFile">
      <h4>Recent <i class="el-icon-time"></i></h4>
      <div class="rotateContainer">
        <div class="row">
          <div class="col-sm-1 text-center align-content-center">
            <button class="arrowButton" @click="cycleLeft">
              <i class="el-icon-back"></i>
            </button>
          </div>
          <div class="col-sm-10">
            <div class="row" id="cycleContainer">
              <div class="col-sm-4">
                <div class="fileCard" id="leftFile">
                  <h5 class="fileName">{{leftFile.name}}</h5>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="fileCard midFile" id="midFile">
                  <h5 class="fileName">{{midFile.name}}</h5>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="fileCard" id="rightFile">
                  <h5 class="fileName">{{rightFile.name}}</h5>
                </div>
              </div>
            </div>
            <div class="fileCountContainer">
              <div class="fileCount">
                <div class="counter" v-for="file of recentFiles" v-bind:key="file.id" :class="[midFile === file ? 'selected' : '']"></div>
              </div>
            </div>
          </div>
          <div class="col-sm-1 text-center align-content-center">
            <button class="arrowButton" @click="cycleRight">
              <i class="el-icon-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "HomePage",
  data(){
    return {
      storagePercentage: 0,
      displayPercentage: 0,
      recentFiles: [],
      leftFile: null,
      midFile: null,
      rightFile: null,
    }
  },
  mounted(){
    this.getStoragePercentage()
    this.getRecentFiles()
  },
  methods: {
    getStoragePercentage(){
      this.storagePercentage = getRandomFloat(0, 100)
      this.$nextTick(() => {
        setTimeout(this.updateDisplay, 1000)
      })
      function getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
      }
    },
    getRecentFiles(){
      this.recentFiles = [
        {
          id: 1,
          name: 'File 1',
        },
        {
          id: 2,
          name: 'File 2',
        },
        {
          id: 3,
          name: 'File 3',
        },
        {
          id: 4,
          name: 'File 4',
        },
        {
          id: 5,
          name: 'File 5',
        },
        {
          id: 6,
          name: 'File 6',
        },
        {
          id: 7,
          name: 'File 7',
        },
        {
          id: 8,
          name: 'File 8',
        },
        {
          id: 9,
          name: 'File 9',
        },
        {
          id: 10,
          name: 'File 10',
        },
      ]
      this.leftFile = this.recentFiles[this.recentFiles.length - 1]
      this.midFile = this.recentFiles[0]
      this.rightFile = this.recentFiles[1]
    },
    updateDisplay(){
      let storageBar = document.getElementById('storageBar')
      let progressBar = document.getElementById('progress')
      let progressValue = document.getElementById('progressValue')
      let progressColor = document.getElementById('progressColors')
      let barWidth = storageBar.offsetWidth
      progressColor.style.width = `${barWidth}px`;
      progressColor.style.backgroundImage = `linear-gradient(90deg, #21fa1a 0px, #fffc00 ${barWidth * 0.6}px, #fe9900 ${barWidth * 0.8}px, #FA2C1A ${barWidth}px)`;

      let VO = this
      function incrementNumber(start, threshold) {
        let current = start;
        let duration = 750;
        let startTime = performance.now();

        function updateProgress() {
          let elapsedTime = performance.now() - startTime;
          let progress = elapsedTime / duration;

          if (progress > 1) progress = 1;

          let easedProgress = 1 - Math.pow(1 - progress, 3);

          current = Math.round(start + (threshold - start) * easedProgress);

          VO.displayPercentage = current
          let barLoc = barWidth * (current / 100);
          progressBar.style.width = `${barLoc}px`;
          progressValue.style.left = `${barLoc - (progressValue.offsetWidth / 2)}px`;

          if (progress < 1) {
            requestAnimationFrame(updateProgress);
          }
        }

        requestAnimationFrame(updateProgress);
      }

      incrementNumber(this.displayPercentage, this.storagePercentage);

    },
    cycleRight(){
      let index = this.recentFiles.indexOf(this.midFile) + 1
      if (index >= this.recentFiles.length){
        index = 0
      }

      let cycleWidth = document.getElementById('cycleContainer').offsetWidth

      document.documentElement.style.setProperty('--cycle-width', `${cycleWidth / 3}px`);

      let leftFile = document.getElementById('leftFile')
      let midFile = document.getElementById('midFile')
      let rightFile = document.getElementById('rightFile')

      midFile.classList.add('cycleRightAndScaleDown')
      leftFile.classList.add('cycleRightAndAppear')
      rightFile.classList.add('cycleRightAndScaleUp')

      let VO = this
      function removeClasses(){
        midFile.classList.remove('cycleRightAndScaleDown')
        leftFile.classList.remove('cycleRightAndAppear')
        rightFile.classList.remove('cycleRightAndScaleUp')
        VO.updateCards(index)
      }

      setTimeout(removeClasses, 500)
    },
    cycleLeft(){
      let index = this.recentFiles.indexOf(this.midFile) - 1
      if (index < 0){
        index = this.recentFiles.length - 1
      }

      let cycleWidth = document.getElementById('cycleContainer').offsetWidth

      document.documentElement.style.setProperty('--cycle-width', `${cycleWidth / 3}px`);

      let leftFile = document.getElementById('leftFile')
      let midFile = document.getElementById('midFile')
      let rightFile = document.getElementById('rightFile')

      midFile.classList.add('cycleLeftAndScaleDown')
      leftFile.classList.add('cycleLeftAndScaleUp')
      rightFile.classList.add('cycleLeftAndAppear')

      let VO = this
      function removeClasses(){
        midFile.classList.remove('cycleLeftAndScaleDown')
        leftFile.classList.remove('cycleLeftAndScaleUp')
        rightFile.classList.remove('cycleLeftAndAppear')
        VO.updateCards(index)
      }

      setTimeout(removeClasses, 500)
    },
    updateCards(index){
      let leftIndex = index - 1
      if (leftIndex < 0){
        leftIndex = this.recentFiles.length - 1
      }

      let rightIndex = index + 1
      if (rightIndex >= this.recentFiles.length){
        rightIndex = 0
      }

      this.leftFile = this.recentFiles[leftIndex]
      this.midFile = this.recentFiles[index]
      this.rightFile = this.recentFiles[rightIndex]
    }
  },
};
</script>

<style scoped>
.storageUsageContainer{
  border-bottom: 3px var(--dark-blue-grey) solid;
}
.recentContainer{
  margin-top: 15px;
}
.storageBar{
  height: 50px;
  background-color: var(--metallic-blue);
  border-radius: 10px;
  margin: 100px 20px;
  position: relative;
}
.progress{
  height: 100%;
  background-color: transparent;
}
.progressColors{
  height: 100%;
  background-color: transparent;
}
.progressValue{
  color: black;
  position: absolute;
  top: -50%;
  z-index: 2;
  padding: 0;
  background-color: transparent;
}
.arrowButton{
  background-color: transparent;
  border: 2px var(--metallic-blue) solid;
  border-radius: 50%;
  padding: 0;
  color: var(--metallic-blue);
  font-size: 30px;
  font-weight: bolder;
  width: 50px;
  height: 50px;
  z-index: 5;
}
.fileCard{
  background-color: var(--white);
  margin: 50px;
  border-radius: 20px;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-items: center;
}
.fileName{
  text-align: center;
  width: 100%;
}
.midFile{
  transform: scale(1.2);
}

.cycleLeftAndScaleDown {
  animation: cycleLeftAndScaleDown .5s ease-in-out forwards;
}

@keyframes cycleLeftAndScaleDown {
  0% {
    transform: scale(1.2);
  }
  100% {
    transform: translate(var(--cycle-width) , 0) scale(1);
  }
}

.cycleLeftAndScaleUp {
  animation: cycleLeftAndScaleUp .5s ease-in-out forwards;
}

@keyframes cycleLeftAndScaleUp {
  0% {
    transform: scale(1);
  }
  100% {
    transform: translate(var(--cycle-width) , 0) scale(1.2);
  }
}

.cycleLeftAndAppear {
  animation: cycleLeftAndAppear .5s ease-in-out forwards;
}

@keyframes cycleLeftAndAppear {
  0% {
    transform: translate(0 , 0);
  }
  49.9% {
    transform: translate(calc(2 * var(--cycle-width)) , 0);
  }
  50% {
    transform: translate(calc(-4 * var(--cycle-width)) , 0);
  }
  100% {
    transform: translate(calc(-2 * var(--cycle-width)) , 0);
  }
}

.cycleRightAndScaleDown {
  animation: cycleRightAndScaleDown .5s ease-in-out forwards;
}

@keyframes cycleRightAndScaleDown {
  0% {
    transform: scale(1.2);
  }
  100% {
    transform: translate(calc(-1 *var(--cycle-width)) , 0) scale(1);
  }
}

.cycleRightAndScaleUp {
  animation: cycleRightAndScaleUp .5s ease-in-out forwards;
}

@keyframes cycleRightAndScaleUp {
  0% {
    transform: scale(1);
  }
  100% {
    transform: translate(calc(-1 *var(--cycle-width)) , 0) scale(1.2);
  }
}

.cycleRightAndAppear {
  animation: cycleRightAndAppear .5s ease-in-out forwards;
}

@keyframes cycleRightAndAppear {
  0% {
    transform: translate(0 , 0);
  }
  49.9% {
    transform: translate(calc(-2 * var(--cycle-width)) , 0);
  }
  50% {
    transform: translate(calc(4 * var(--cycle-width)) , 0);
  }
  100% {
    transform: translate(calc(2 * var(--cycle-width)) , 0);
  }
}
.fileCountContainer{
  display: flex;
  justify-content: center;
}

.fileCount{
  display: flex;
  justify-content: space-evenly;
}
.counter{
  height: 5px;
  width: 40px;
  margin: 10px;
  background-color: var(--dark-blue-grey);
}
.selected{
  background-color: var(--pastel-yellow);
  opacity: 75%;
}

</style>
