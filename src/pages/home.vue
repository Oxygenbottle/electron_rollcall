<template>
  <div class="hello">
    <div class="top_logo">
      <img v-if="logo_base64" :src="logo_base64" alt="">
      <input id="imgID" class="logo" type="file" @change="getLogo" autocomplete="off">
    </div>
    <div>
      上传文件 ： <input type="file" name="file" id="fileId" @change="getFile" />
      <button type="submit" name="btn" value="提交" id="btnId" @click="check()">111</button>
      <el-button>默认按钮1</el-button>
    </div>
    {{rollingList}}
  </div>
</template>

<script>
// import { Swiper, SwiperSlide } from 'swiper/swiper-bundle';
// import 'swiper/swiper.min.css';
export default {
  name: 'home',
  components: {
    // Swiper,
    // SwiperSlide,
  },
  data() {
    return {
      msg: '首页',
      rollingList: [],
      logo_base64: '',
    }
  },
  mounted() {
    // let router = this.$route
    this.rollingList = this.$public.getStorage('rollingList')
    this.logo_base64 = this.$public.getStorage('logo_base64')
  },
  methods: {
    async getFile(e) {
      await this.$public.getFile(e, 'new')
      this.rollingList = this.$public.getStorage('rollingList')
      console.log('this.rollingList', this.rollingList)
    },
    getLogo(e) {
      let reader = new FileReader();
      let files = document.getElementById('imgID').files[0]
      console.log(files)
      reader.readAsDataURL(files);
      reader.onload = () => {
        console.log('file 转换 base64', reader.result)
        this.logo_base64 = reader.result;
        this.$public.saveStorage('logo_base64', reader.result)
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@media screen and (min-width: 960px) {
  .hello {
    background-color: $theme-color-blue;
  }
}
@media screen and (max-width: 960px) {
  .hello {
    background-color: $theme-color-red;
  }
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.top_logo {
  width: 100vw;
  height: 200px;
  background-color: #42b983;
  overflow: hidden;
  .logo {
    width: 100vw;
    // height: 200px;
  }
}
</style>
