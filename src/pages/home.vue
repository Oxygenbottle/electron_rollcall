<template>
  <div class="container hello">
    <div class="top_logo">
      <img v-if="logo_base64" :src="logo_base64" alt="">
      <input id="imgID" class="logo" type="file" @change="getLogo" placeholder="text" autocomplete="off">
    </div>
    <div>
      <el-input type="file" name="file" id="fileId" @change="getFile" />

      <el-button v-for="(item,index) in rollingList" :key="index" @click="signGroup(item)" :type="item.sign?'info':'primary'">
        {{item.groupName}}
      </el-button>
    </div>
    <div class="body">
      <div class="left">
        <el-collapse v-model="activeNames" v-for="(item,index) in rollingList" :key="index">
          <el-collapse-item :name="index">
            <template slot="title">
              <div class="collapse-title">
                <div>{{item.groupName}}</div>
                <i class="el-icon-edit"></i>
                <i class="el-icon-plus"></i>
                <i class="el-icon-delete"></i>
              </div>
            </template>
            <div>
              <el-tag v-for="(member,memberIndex) in item.memberList" :key="memberIndex" closable @click="signMember(member)" :type="member.sign?'info':''">
                {{member.name}}
              </el-tag>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <!-- <div class="middle">中间</div>
      <div class="right">右边</div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  components: {},
  data() {
    return {
      msg: '首页',
      rollingList: [],
      logo_base64: '',
      activeNames: ['1']
    }
  },
  mounted() {
    // let router = this.$route
    this.rollingList = this.$public.getStorage('rollingList')
    this.logo_base64 = this.$public.getStorage('logo_base64');
    this.rollingList[0].sign = true;
    console.log('this.rollingList', this.rollingList)
    this.getGroupLeader(this.rollingList);
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
    signGroup(group) {
      this.$confirm(`是否跳过${group.groupName}组?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        group.sign = !group.sign
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
      })
    },
    signMember(member) {
      this.$confirm(`是否跳过${member.name}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        member.sign = !member.sign
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
      })
    },
    getGroupLeader(list) {
      // let leaderList = list.filter(item => item.sign)
      // console.log(leaderList)
      // leaderList = list.map(item => item.groupName)
      // console.log(leaderList)
      // return leaderList;
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
.container {
  .top_logo {
    width: 100vw;
    height: 200px;
    // background-color: #42b983;
    overflow: hidden;
    .logo {
      width: 100vw;
      height: 200px;
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .body {
    height: calc(100vh - 300px);
    overflow: hidden;
    font-size: 18px;
    display: flex;
    .left {
      overflow-y: scroll;
      flex: 2;
      .collapse-title {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0 10px;
        i:nth-child(1) {
          margin-left: 20px;
        }
      }
    }
    .middle {
      flex: 3;
    }
    .right {
      flex: 2;
    }
  }
}
html {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}
html::-webkit-scrollbar {
  width: 0px;
}
::-webkit-scrollbar {
  display: none;
}
</style>
