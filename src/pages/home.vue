<template>
  <div class="container hello">
    <div class="top_logo">
      <img v-if="logo_base64" :src="logo_base64" alt="">
      <input id="imgID" class="logo" type="file" @change="getLogo" placeholder="text" autocomplete="off">
    </div>
    <div>
      <input type="file" name="file" id="fileId" @change="getFile" />
      <i class="el-icon-circle-plus-outline" @click="addGroup()"></i>
      <el-button v-for="(item,index) in rollingList" :key="index" @click="signGroup(item)" :type="item.sign == true?'info':'primary'"
        :disabled="item.memberList.length==0">
        {{item.groupName}} -- {{item.sign}}
      </el-button>
    </div>
    <div class="body">
      <div class="left">
        <el-collapse v-model="activeNames" v-for="(item,index) in rollingList" :key="index">
          <el-collapse-item :name="index">
            <template slot="title">
              <div class="collapse-title">
                <div>{{item.groupName}}</div>
                <i class="el-icon-edit" @click.stop="changeGroupName(item)"></i>
                <i class="el-icon-delete" @click.stop="deleteGroup(item,index)"></i>
              </div>
            </template>
            <div>
              <i class="el-icon-circle-plus-outline" @click="addMember(item)"></i>
              <el-tag v-for="(member,memberIndex) in item.memberList" :key="memberIndex" @click="signMember(member)" closable
                @close="deleteMember(index,member,memberIndex)" :type="member.sign?'info':''">
                {{member.name}}
              </el-tag>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="middle">
        <el-button @click="sign">测试逻辑</el-button>
      </div>
      <div class="right">
        <div v-if="historyList.length == 0">暂无历史记录</div>
        <div v-else v-for="(item,index) in historyList" :key="index">{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  components: {},
  data() {
    return {
      logo_base64: '',
      rollingList: [],
      activeNames: [],
      historyList: [],
    }
  },
  mounted() {
    this.logo_base64 = this.$public.getStorage('logo_base64');
    this.rollingList = this.$public.getStorage('rollingList')
    this.historyList = this.$public.getStorage('historyList') || [];
    console.log('mounted：this.rollingList', this.rollingList)
  },
  methods: {
    // 抽取
    sign() {
      let signGroup = this.rollingList.filter(item => item.sign == false);
      if (signGroup.length == 0) { // 组抽完
        let residue = this.rollingList.filter(group => {
          let memberlength = group.memberList.filter(member => member.sign == false).length
          return memberlength != 0
        })
        if (residue.length == 0) { // 全部抽完  - 开启新一轮
          this.$message({ type: 'success', message: '开启新一大轮!' })
          this.rollingList.forEach(group => {
            group.sign = false;
            group.memberList.forEach(member => {
              member.sign = false;
            })
          })
          this.saveRollListData();
        } else {
          this.rollingList.forEach(group => {
            this.$message({ type: 'success', message: '开启新一小轮!' })
            if (group.memberList.filter(item => item.sign == false).length != 0) group.sign = false;
          })
        }
        this.saveRollListData();
      } else { //小组轮询
        let randomGroupIndex = this.getRndInteger(0, signGroup.length - 1); // 随机一个小组
        let realGroupIndex = null;
        this.rollingList.forEach((group, index) => {
          if (group.groupName == signGroup[randomGroupIndex].groupName) {
            realGroupIndex = index
            group.sign = true;
          }
        });
        let signMember = signGroup[randomGroupIndex].memberList.filter(item => item.sign == false);
        if (signMember.length == 0) { // 成员抽完
          this.rollingList[realGroupIndex].memberList.forEach(item => {
            item.sign = false;
          })
          signMember = signGroup[randomGroupIndex].memberList.filter(item => item.sign == false);
        }
        let randomMemberIndex = this.getRndInteger(0, signMember.length - 1);
        this.rollingList[realGroupIndex].memberList.forEach(item => {
          if (item.name == signMember[randomMemberIndex].name) { // 抽取成功
            item.sign = true;
            this.saveHistory(this.rollingList[realGroupIndex], signMember[randomMemberIndex])
          }
        })
        this.saveRollListData();
      }
    },
    // 保存抽取历史
    saveHistory(group, member) {
      let time = new Date()
      let now = `${time.getFullYear()}年${time.getMonth() + 1}月${time.getDate()}日 ${time.getHours()}时${time.getMinutes()}分`
      console.log(now, '抽取的是', group, '组的', member);
      this.historyList.push(`${now}抽取的是：'${group.groupName}'组的'${member.name}'`)
      this.$public.saveStorage('historyList', this.historyList)
    },
    // 获取本地文件
    async getFile(e) {
      console.log('获取文件', e)
      await this.$public.getFile(e, 'new')
      this.rollingList = this.$public.getStorage('rollingList')
      console.log('this.rollingList', this.rollingList)
    },
    // 获取本地图片
    getLogo(e) {
      let reader = new FileReader();
      let files = document.getElementById('imgID').files[0]
      console.log(files);
      reader.readAsDataURL(files);
      reader.onload = () => {
        console.log('file 转换 base64', reader.result)
        this.logo_base64 = reader.result;
        this.$public.saveStorage('logo_base64', reader.result)
      }
    },
    // 选择小组
    signGroup(group) {
      this.$confirm(`是否${group.sign ? '选中' : '跳过'}“${group.groupName}”组?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        group.sign = !group.sign
        this.saveRollListData();
      })
    },
    // 添加小组
    addGroup() {
      this.$prompt('请输入小组名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        if (value) {
          this.rollingList.push({
            groupName: value,
            memberList: [],
            sign: true,
          })
          this.saveRollListData();
        } else {
          this.$message({
            type: 'info',
            message: '保存失败，请输入正确的名称'
          });
        }
      })
    },
    // 删除小组
    deleteGroup(group, index) {
      this.$confirm(`是否删除“${group.groupName}”组?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        this.rollingList.splice(index, 1);
        this.saveRollListData();
      })
    },
    // 修改小组名
    changeGroupName(group) {
      this.$prompt('请输入小组名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        if (value) {
          group.groupName = value;
          this.saveRollListData();
        } else {
          this.$message({
            type: 'info',
            message: '保存失败，请输入正确的名称'
          });
        }
      })
    },
    // 选择成员
    signMember(member) {
      this.$confirm(`是否${member.sign ? '选中' : '跳过'}“${member.name}”?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        member.sign = !member.sign
        this.saveRollListData();
      })
    },
    // 添加成员
    addMember(group) {
      this.$prompt('请输入成员名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        if (value) {
          group.memberList.push({
            name: value,
            sign: false,
          })
          this.saveRollListData();
        } else {
          this.$message({
            type: 'info',
            message: '保存失败，请输入正确的名称'
          });
        }
      })

    },
    // 删除成员
    deleteMember(groupIndex, member, memberIndex) {
      this.$confirm(`是否删除“${member.name}”?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.rollingList[groupIndex].memberList.splice(memberIndex, 1)
        this.saveRollListData();
      })
    },
    // 保存
    saveRollListData() {
      window.queueMicrotask(() => {
        this.$public.saveStorage('rollingList', this.rollingList);
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
      })
    },
    // 获取随机
    getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
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
