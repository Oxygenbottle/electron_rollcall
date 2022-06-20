import XLSX from "../utils/xlsx"
import {
  Message
} from 'element-ui';

export default {
  // ——————————————————————————————————————获取文件公共方法——————————————————————————————————————
  // 获取上传文件
  getFile(event, type) {
    console.log(event, '触发获取文件')
    let _this = this;
    return new Promise((resolve, reject) => {
      let sheetList = '';
      if (!event.currentTarget.files.length) {
        console.log('文件内容为空')
        return;
      }
      var f = event.currentTarget.files[0];
      // 用FileReader来读取
      var reader = new FileReader();
      FileReader.prototype.readAsBinaryString = function (f) {
        var binary = '';
        var wb; // 读取完成的数据
        var reader = new FileReader();
        reader.onload = function (e) {
          // 读取成Uint8Array，再转换为Unicode编码（Unicode占两个字节）
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          // 接下来就是xlsx了，具体可看api
          wb = XLSX.read(binary, {
            type: 'binary'
          });
          sheetList = XLSX.utils.sheet_to_row_object_array(wb.Sheets[wb.SheetNames[0]]);
          // 自定义方法向父组件传递数据
          if (type == 'new') {
            resolve('新增成功')
            _this.newList(sheetList);
          } else if (type == 'add') {
            resolve('添加成功')
            _this.addList(sheetList)
          } else {
            reject('识别有误')
            Message({
              message: '上传识别有误',
              type: 'warning'
            })
          }
          return sheetList;
        };
        reader.readAsArrayBuffer(f);
      };
      reader.readAsBinaryString(f);
    })
  },
  // 新增列表
  newList(list) {
    // console.log(list)
    let groupList = [];
    let memberList = [];
    list.forEach(row => {
      for (let groupName in row) {
        console.log(groupName, row[groupName])
        if (!memberList[groupName]) memberList[groupName] = [];
        memberList[groupName].push({
          'name': row[groupName],
          'sign': false
        })
      }
    })
    // console.log('memberList', memberList)
    for (let groupName in memberList) {
      groupList.push({
        groupName,
        memberList: memberList[groupName],
        sign: false,
      })
    }
    // console.log('groupList', groupList)
    this.saveStorage('rollingList', groupList)
    Message({
      message: '导入成功',
      type: 'success'
    })
  },
  // 新增小组
  addList() {},



  // ——————————————————————————————————————数据存储公共方法——————————————————————————————————————
  // groupList: []
  // historyList: [],
  // rollingList: [{groupName: '', groupMember: []},],
  getStorage(name) {
    if (!!localStorage.getItem(name)) {
      return JSON.parse(localStorage.getItem(name))
    } else {
      Message({
        message: '没有本地数据：' + name,
        type: 'warning'
      })
    }
  },
  saveStorage(name, data) {
    if (Object.prototype.toString(data) == '[object Object]') {
      localStorage.setItem(name, JSON.stringify(data))
    } else {
      Message({
        message: '暂无本地数据',
        type: 'warning'
      })
    }
  },
}