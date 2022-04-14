<template>
  <div class="hello">
    <!-- <swiper :slides-per-view="3" :space-between="50" @swiper="onSwiper" @slideChange="onSlideChange">
      <swiper-slide>Slide 1</swiper-slide>
      <swiper-slide>Slide 2</swiper-slide>
      <swiper-slide>Slide 3</swiper-slide>
    </swiper> -->
    <div>
      上传文件 ： <input type="file" name="file" id="fileId" />
      <button type="submit" name="btn" value="提交" id="btnId" @click="check()">111</button>

    </div>
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
      msg: '首页'
    }
  },
  mounted() {
    let router = this.$route
    console.log('router', router)
  },
  methods: {
    check() {
      var objFile = document.getElementById("fileId");
      if (objFile.value == "") {
        alert("不能为空空");
        return false;
      }

      console.log(objFile.files[0]); // 文件字节数

      var files = document.getElementById('#fileId').prop('files');//获取到文件列表
      if (files.length == 0) {
        alert('请选择文件');
      } else {
        var reader = new FileReader();//新建一个FileReader
        reader.readAsText(files[0], "UTF-8");//读取文件 
        reader.onload = function (evt) { //读取完文件之后会回来这里
          var fileString = evt // 读取文件内容
          console.log(fileString, '--------------', files[0])
        }
      }

    }
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
</style>
