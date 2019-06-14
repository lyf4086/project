<template>
  <div class="item">
    <div class="imgwrap">
      <img :src="oneDate.icon" alt="警员">
    </div>
    <div class="textwrap">
      <p>警员：{{oneDate.policeName}}</p>
      <p>警号：{{oneDate.policeNum}}</p>
      <p>持枪证号：{{oneDate.permitid}}</p>
      <p>单位：{{oneDate.mechanism_name}}</p>
      <p>持枪编号：{{oneDate.gunNum}}</p>
      <p>持枪类型：{{oneDate.bulletType}}</p>
      <p>
        <button @click="toHistory(oneDate)">历史轨迹</button>
        <button @click="toNew(oneDate)">最新位置</button>
      </p>
    </div>
    <div class="mes-l">
      <span></span>
      <p>审批人：{{oneDate.aprName}}</p>
      <p>用途：{{oneDate.taskType}}</p>
    </div>
    <div class="mes-r" :class="{'alert':oneDate.state}">
      <span v-if="oneDate.state" @click="toAlarm(oneDate)" style="cursor:pointer"></span>
      <span v-else="!oneDate.state"></span>
      <p>借出时间：{{oneDate.optime}}</p>
      <p>预期归还时间：{{oneDate.planreturntime}}</p>
    </div>
  </div>
</template>
<style scoped>
@import url(./onePerson.css);
</style>
<script>
export default {
  props: {
    oneDate: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    toHistory(obj) {
      this.$emit("toHistory", obj);
    },
    toNew(obj) {
      this.$emit("toNew", obj);
    },
    toAlarm(oneDate) {
      this.$router.push({
        name: "BaoJing",
        params: {
          one: true,
          ...oneDate
        }
      });
    }
  }
};
</script>
