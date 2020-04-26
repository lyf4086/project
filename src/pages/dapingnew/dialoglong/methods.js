
import {task_rank,alarm_rank,xiaohao_rank} from '../apis'
import leftChart from './leftChart'
import centerChart from './centerChart'
import rightChart from './rightChart'
export default {
    data(){
        return{
            leftList:[],
            leftTags:[],
            centerList:[],
            centerTags:[],
            rightList:[],
            rightTags:[]
        }
    },
    methods:{
        task_rank,
        alarm_rank,
        xiaohao_rank,
        leftChart,
        centerChart,
        rightChart,
        close(){
            this.$emit('close')
        },
        getData(){
            this.task_rank().then(res=>{
                if(res.status==200){
                    console.log('task_rank',res)
                    this.leftList=res.data.data
                    this.leftTags=res.data.tasks
                    let leftChartData=res.data.data.map(e=>e.total)
                    this.leftChart(leftChartData)
                }
            })
            this.alarm_rank().then(res=>{
                if(res.status==200){
                    console.log('alarm_rank',res)
                    this.centerList=res.data.data
                    this.centerTags=res.data.type
                    let centerChartData=res.data.data.map(e=>{
                        return {
                            name:e.cname,
                            value:e.total
                        }
                    })
                    this.centerChart(centerChartData)
                }
            })
            this.xiaohao_rank().then(res=>{
                if(res.status==200){
                    console.log('xiaohao_rank',res)
                    // this.rightList=res.data.data
                    // this.rightTags=res.data.type
                    let nameList=res.data.data.map(e=>e.cname)
                    let dataList=res.data.data.map(e=>e.total)
                    this.rightChart(nameList,dataList)
                }
            })
        }
    },
    mounted(){
        
        
        this.getData()
    }
}