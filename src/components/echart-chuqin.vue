<template>
    <div id="main">
        
    </div>
</template>

<script>
    export default {
        mounted() {
            let Echart1=this.$echarts.init(document.getElementById('main'));
            let option = {
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['1', '2', '3', '4', '5','6','7','8']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [120, 200, 90, 300, 110,290,260,520],
                    type: 'line',
                    areaStyle: {}
                }]
            };
            Echart1.setOption(option)   
        }
    }
</script>
<style scoped>

.main{
    width:100px;
    height:100px;
    background:blue;
}


</style>