import md5 from 'js-md5'
let methods={
    urlEncode (param, key, encode) {
        if (param==null) return '';
        var paramStr = '';
        var t = typeof (param);
        if (t == 'string' || t == 'number' || t == 'boolean') {
            paramStr += '&' + key + '='  + ((encode==null||encode) ? encodeURIComponent(param) : param);
        } else {
            for (var i in param) {
                var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
                paramStr += this.urlEncode(param[i], k, encode)
            }
        }
        return paramStr;

    },

    objKeySort(obj){//排序的函数
        var newkey = Object.keys(obj).sort();
        var newObj = {};//创建一个新的对象，用于存放排好序的键值对
        for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
            newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
        }
        return newObj;//返回排好序的新对象
    },
    mkSign(param,key){
        var newParam = this.objKeySort(param);
        // var paramStr = this.urlEncode(newParam);
        var paramStr = '';
        for(var k in newParam){
            paramStr+='&'+k+'='+newParam[k];
        }


        // console.log(paramStr);
        paramStr= key+paramStr;
        var ret  = md5(paramStr);
        // console.log(ret);
        return ret;
    }








}
export default {
    install :function (vm){
        vm.prototype.$methods=methods
    }
}


