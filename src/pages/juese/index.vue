<template>
  <div class="wrap">
    <div class="top">
      <button @click="addRoloe=true">添加角色</button>
    </div>
    <div class="role_main">
      <div class="title">
        <span>角色名称</span>
        <span>权限</span>
        <span>操作</span>
      </div>
      <div class="item" v-for="item in roleList" :key="item.id">
        <span>{{item.name}}</span>
        <span>{{item.pname}}</span>
        <span>
          <button style="background:rgba(102,177,255,0.5)" @click="editRole(item)">角色修改</button>
          <button style="background:rgba(235,181,99,0.5)" @click="showShouquan(item)">角色授权</button>
          <button style="background:rgba(245,108,108,0.5)" @click="deleteOne(item)">角色删除</button>
        </span>
      </div>
    </div>
    <div class="cover" v-show="addRoloe||shouquanRoloe">
      <div class="text-wrap">
        <div class="text-title">{{editID?'修改':'新增'}}角色</div>
        <div class="text-content">
          <div class="floor">
            <span>角色名称：</span>
            <input v-model="roleName" maxlength="6" />
            <br />
          </div>
        </div>

        <div class="submit" @click="subAdd">确认</div>
        <i @click="close">X</i>
      </div>

      <div class="text-wrap" v-show="shouquanRoloe">
        <div class="text-title">角色授权</div>
        <div class="shouquan-content" v-show="shouquanRoloe">
          <el-checkbox
            style="margin-bottom:5px"
            v-for="item in newpowerList"
            :key="item.id"
            v-model="item.checked"
          >{{item.mname}}</el-checkbox>
        </div>
        <el-select v-model="btnIds" multiple placeholder="请选择">
          <el-option
            v-for="item in buttons"
            :key="item.id"
            :label="item.button_name"
            :value="item.id"
          ></el-option>
        </el-select>
        <div class="submit" @click="subShouquan">确认</div>
        <i @click="close">X</i>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url(./index.css);
</style>
<script>
import post from "@/server/post";
export default {
  data() {
    return {
      roleList: [],
      addRoloe: false,
      shouquanRoloe: false,
      roleName: "",
      editID: "",
      shouquanList: [],
      powerList: [],
      newpowerList: [],
      shouQuanID: "",
      buttons: [],
      btnIds:''
    };
  },
  methods: {
    post,
    close() {
      this.editID = "";
      this.roleName = "";
      this.addRoloe = false;
      this.shouquanRoloe = false;
    },
    getDataList() {
      this.post(
        {
          url: "/weixin/project/index.php?m=home&c=Role&a=lst",
          data: {}
        },
        res => {
          if (res.data.code == 200) {
            console.log(res);
            this.roleList = res.data.data;
            this.powerList = res.data.menu;
            this.buttons = res.data.buttons;
          } else {
            console.log(res.data.msg);
          }
        }
      );
    },
    addRole(name) {
      this.post(
        {
          url: "/weixin/project/index.php?m=home&c=Role&a=hand",
          data: { name }
        },
        res => {
          if (res.data.code == 200) {
            this.addRoloe = false;
            this.$message.success("添加成功");
            this.getDataList();
            this.roleName = "";
          } else {
            this.$message.error("添加失败");
            console.log(res.data.msg);
          }
        }
      );
    },
    subAdd() {
      let roleName = this.roleName.trim();
      if (this.editID) {
        if (roleName) {
          this.subEdit(roleName, this.editID);
        } else {
          this.$message.warning("请输入正确的名称");
        }
        return;
      } else {
        if (roleName) {
          this.addRole(roleName);
        } else {
          this.$message.warning("请输入正确的名称");
        }
      }
    },
    editRole(item) {
      if (item.name == "系统管理员") {
        this.$message.warning("无权操作该角色");
        return;
      }
      this.editID = item.id;
      this.roleName = item.name;
      this.addRoloe = true;
    },
    subEdit(name, id) {
      this.post(
        {
          url: "/weixin/project/index.php?m=home&c=Role&a=edit",
          data: { name, id }
        },
        res => {
          if (res.data.code == 200) {
            this.addRoloe = false;
            this.$message.success("修改成功");
            this.getDataList();
            this.roleName = "";
            this.editID = "";
          } else {
            this.$message.error("修改失败");
            console.log(res.data.msg);
          }
        }
      );
    },
    showShouquan(item) {
      if (item.name == "系统管理员") {
        this.$message.warning("无权操作该角色");
        return;
      }
      this.btnIds=item.button_id?item.button_id.split('_'):[]
      this.shouQuanID = item.id;
      this.shouquanRoloe = true;
      let names = item.pname.split(",");
      let powers = item.power ? item.power.split("_") : [];
      let newpowerList = this.powerList.map(item => {
        let bl = powers.find(e => e == item.id);
        if (bl != undefined) {
          return {
            ...item,
            checked: true
          };
        } else {
          return {
            ...item,
            checked: false
          };
        }
      });
      this.newpowerList = newpowerList;
    },
    subShouquan() {
        let button_id=this.btnIds.join('_')
      let id = this.shouQuanID;
      let power = this.newpowerList
        .filter(e => e.checked)
        .map(item => item.id)
        .join("_");
      this.shouQuan({id, power,button_id});
    },
    shouQuan(data) {
      this.post(
        {
          url: "/weixin/project/index.php?m=home&c=Role&a=rset",
          data: data
        },
        res => {
          if (res.data.code == 200) {
              this.$message.success('成功')
            this.shouQuanID = "";
            this.shouquanRoloe = false;
            this.btnIds=''
            this.getDataList();
          } else {
            this.$message.error("修改失败");
            console.log(res.data.msg);
          }
        }
      );
    },
    deleteOne(item) {
      if (item.name == "系统管理员") {
        this.$message.warning("无权操作该角色");
        return;
      }
      this.$alert("您正在执行危险操作，是否继续？", "操作警告", {
        confirmButtonText: "确定",
        callback: action => {
          if (action === "confirm") {
            this.delete(item.id);
          }
        }
      });
    },
    delete(id) {
      this.post(
        {
          url: "/weixin/project/index.php?m=home&c=Role&a=del",
          data: { id }
        },
        res => {
          if (res.data.code == 200) {
            this.$message.success("删除成功");
            this.getDataList();
          } else {
            this.$message.error("删除失败");
            console.log(res.data.msg);
          }
        }
      );
    }
  },
  created() {
    this.getDataList();
  }
};
</script>