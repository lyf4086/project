


let gscookie={

    // setCookie(c_name, value, expiredays) {
    //     var exdate = new Date();　　　　
    //           exdate.setDate(exdate.getDate() + expiredays);　　　　
    //     document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "": ";expires=" + exdate.toGMTString());
    // },
    //  getCookie(name)
    // {
    //     var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)"); //正则匹配
    //     if(arr=document.cookie.match(reg)){
    //       return unescape(arr[2]);
    //     }
    //     else{
    //      return null;
    //     }
    // }

    setCookie(key,value){ //....................这里并不是cookie
      // console.log('存session',key,JSON.stringify(value))
      sessionStorage.setItem(key,JSON.stringify(value))
     
    },
    getCookie(key){
      if(sessionStorage.getItem(key)){
        return JSON.parse(sessionStorage.getItem(key))
      }else{
        return {}; 
      }
    }




}





export default {
    install :function (vm){
        vm.prototype.$gscookie=gscookie
    }
}


