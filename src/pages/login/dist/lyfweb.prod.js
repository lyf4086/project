"use strict";var socket_suciz,socket_suciz_lock32,ref;function getSetSn(){return 0}function Lock32_Function(c,s){var a=this,t={function:"InitiateLock",sn:s=getSetSn()},n=JSON.stringify(t);$.ajax({url:"http://127.0.0.1:17681",data:"json="+n,dataType:"jsonp",jsonp:"callback",jsonpCallback:"jsonpcallback",timeout:1e3,success:function(t){var n,o;1==t[0].ret&&(n={function:"Lock32_Function",sn:s,rand:c},o=JSON.stringify(n),$.ajax({url:"http://127.0.0.1:17681",data:"json="+o,dataType:"jsonp",jsonp:"callback",jsonpCallback:"jsonpcallback"}).done(function(t){var n=JSON.stringify(t[0]);socket_suciz_lock32=t[0].lock,a.keyStr=socket_suciz_lock32}))},error:function(){console.log("请安装插件程序")}})}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=Lock32_Function;