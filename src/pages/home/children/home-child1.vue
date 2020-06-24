<template>
  <div id="home-child">
    <div class="top-sels">
      <div class="c-title">
        <div class="c-txt">报警类型趋势分析</div>
        <div class="c-btn" v-if="false">
            <div class="icon"></div>
            对比分析
        </div>
        <div class="c-btn c-btn-back hvr-sweep-to-right">
            <div class="icon"></div>
            返回
        </div>
      </div>
      <div class="c-content">
        <div class="label">查询时间</div>
        <div class="txt">
          <el-date-picker
            v-model="datePicker"
            type="daterange"
            align="right"
            id="time-picker"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </div>
        <div class="label">报警类型</div>
        <div class="txt">
          <div class="sel checked">
            <div class="icon"></div>入套报警
          </div>
          <div class="sel checked">
            <div class="icon"></div>离套报警
          </div>
          <div class="sel checked">
            <div class="icon"></div>区域报警
          </div>
          <div class="sel checked">
            <div class="icon"></div>逾期报警
          </div>
        </div>
        <div class="label">机构名称</div>
        <div class="txt-list">
          <div class="sel2 checked" v-for="e in 50">
            <div class="icon"></div>A市公安局
          </div>
        </div>
      </div>
      <div class="btn-wrap">
          对比分析
      </div>
    </div>
    <div class="bottom-chart-two-wrap">
        <div class="c_title">
            报警对比
            <div class="icon"></div>
            <div class="right-line"></div>
            <div class="bottom-line"></div>
        </div>
        <div class="c_title">
            同比增长
            <div class="icon"></div>
            <div class="right-line"></div>
            <div class="bottom-line"></div>
        </div>
        <div id="echart_left">
            
        </div>
        <div id="echart_right">rrr</div>
    </div>
    <div class="bottom-chart-one-wrap" v-if="false">
        <div id="echart_only">bottom-chart-one-wrap</div>
        <div class="duibi-text"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      datePicker: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  }
};
</script>