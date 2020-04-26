export default function centerChart(dataList){
    let box1 = document.getElementById("chart-center");
    let myChart = this.$echarts.init(box1);
    let option = {
      title: {
        text: "",
        textStyle: {
              align: 'center',
              color: '#fff',
              fontSize: 14,
          },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      series: [
        {
          type: "pie",
          // data: [
          //   {
          //     name: "实例1",
          //     value: 60
          //   },
          //   {
          //     name: "实例2",
          //     value: 40
          //   }
          // ],
          label: {
            position: "inside"
          },
          radius: [0, 40],
          itemStyle: {
            borderWidth: 1,
            borderColor: "#FFFFFF"
          },
          clockwise: true,
          animation: false
        },
        {
          type: "pie",
          data: dataList,
          // [
          //   {
          //     name: "北京",
          //     value: 20
          //   },
          //   {
          //     name: "天津",
          //     value: 20
          //   },
          //   {
          //     name: "上海",
          //     value: 20
          //   },
          //   {
          //     name: "广州",
          //     value: 20
          //   },
          //   {
          //     name: "武汉",
          //     value: 30
          //   }
          // ],
          label: {
            // position: "inside"
          },
          radius: [42, 90],
          itemStyle: {
            borderWidth: 1,
            borderColor: "#FFFFFF"
          },
          animation: true
        }
      ],
      backgroundColor: "transparent"
    };
    myChart.setOption(option)
}