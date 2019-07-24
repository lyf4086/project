<template>
  <div class="item-main" v-if="!!item.created">
    <div class="title" style="color:#ffffff">
      <div class="round_wrap">
        <div class="round"></div>
        <div class="gun"></div>
      </div>
      <div class="name">
        <p>
          {{item.policeuser.policeuser_name}}
          <i :title="item.policeuser.police_number">{{item.policeuser.police_number}}</i>
        </p>
        <p class="time">{{changeTime(item.created)}}</p>
      </div>
    </div>
    <div class="content">
      <div class="tex_wrap">
        <div class="list">
          <span>报警类型：</span>
          <span>{{item.type}}</span>
        </div>
        <div class="list">
          <span>所属机构：</span>
          <span>{{item.mechanism_name}}</span>
        </div>
        <div class="list">
          <span>枪支编号：</span>
          <span>{{item.gun.gun_code}}</span>
        </div>
        <div class="list">
          <span>枪支类型：</span>
          <span>{{item.gun.gtype}}</span>
        </div>
        <div class="list">
          <span>描述：</span>
          <span>电量剩余{{item.ele}}%</span>
        </div>
        <div class="list">
          <span>处理意见：</span>
          <span class="yijian" :title="item.desc">{{!!item.desc ? item.desc :'无'}}</span>
        </div>
        <div class="list">
          <span>是否处理：</span>
          <span :class="chuli">
            <i></i>
            {{text}}
          </span>
        </div>
      </div>
      <div
        class="sel"
        v-show="!item.desc"
        :class="{selected:item.checked}"
        @click="changeOne(item.index)"
      ></div>
    </div>
  </div>
</template>
<style scoped>
@import url(./bj-item.css);
</style>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    chuli() {
      return this.item.desc ? "yes" : "not";
    },
    text() {
      return this.item.desc ? "已处理" : "未处理";
    }
  },
  methods: {
    changeOne(index) {
      this.$emit("changeOneData", index);
    },
    gunCode(s) {
      if (s == 1) {
        return "92式";
      } else if (s == 2) {
        return "95式";
      } else if (s == 3) {
        return "77式";
      } else if (s == 4) {
        return "64式";
      } else if (s == 5) {
        return "92改";
      }
    },
    changeTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      var h = date.getHours() + ":";
      var m = date.getMinutes() + ":";
      var s = date.getSeconds();
      return Y + M + D + h + m + s;
    }
  }
};
</script>
