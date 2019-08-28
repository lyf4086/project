import md5 from 'js-md5'
let methods = {
    urlEncode(param, key, encode) {
        if (param == null) return '';
        var paramStr = '';
        var t = typeof (param);
        if (t == 'string' || t == 'number' || t == 'boolean') {
            paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
        } else {
            for (var i in param) {
                var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
                paramStr += this.urlEncode(param[i], k, encode)
            }
        }
        return paramStr;

    },

    objKeySort(obj) {//排序的函数
        var newkey = Object.keys(obj).sort();
        var newObj = {};//创建一个新的对象，用于存放排好序的键值对
        for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
            newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
        }
        return newObj;//返回排好序的新对象
    },
    mkSign(param, key) {
        var newParam = this.objKeySort(param);
        // var paramStr = this.urlEncode(newParam);
        var paramStr = '';
        for (var k in newParam) {
            paramStr += '&' + k + '=' + newParam[k];
        }


        // console.log(paramStr);
        paramStr = key + paramStr;
        var ret = md5(paramStr);
        // console.log(ret);
        return ret;
    },
    listMove(id, t = 2000) {
        var $uList = $(id);
        var timer = null;
        //触摸清空定时器
        $uList
            .hover(
                function () {
                    clearInterval(timer);
                },
                function () {
                    //离开启动定时器
                    timer = setInterval(function () {
                        scrollList($uList);
                    }, t);
                }
            )
            .trigger("mouseleave"); //自动触发触摸事件
        //滚动动画
        function scrollList(obj) {
            //获得当前<li>的高度
            var scrollHeight = $(`${id} .item:first`).height();
            //滚动出一个<li>的高度
            $uList.stop().animate(
                {
                    marginTop: -scrollHeight
                },
                700,
                function () {
                    //动画结束后，将当前<ul>marginTop置为初始值0状态，再将第一个<li>拼接到末尾。
                    $uList
                        .css({
                            marginTop: 0
                        })
                        .find(".item:first")
                        .appendTo($uList);
                }
            );
        }
    }







}
export default {
    install: function (vm) {
        vm.prototype.$methods = methods
    }
}


