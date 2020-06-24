var socket_suciz;
var socket_suciz_lock32;
var ref;

function getSetSn()
{
    var sn = 0;
    return sn;
}

export default function Lock32_Function(rand, sn){
    let that=this
	var sn = getSetSn();
    var oJson = { "function": "InitiateLock", "sn": sn };
    var sJson = JSON.stringify(oJson);

	var sStatus;
    $.ajax({
        url: 'http://127.0.0.1:17681',
        data: 'json=' + sJson,
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "jsonpcallback",
		timeout: 1000,
        success: function(ojson) {
			if(ojson[0].ret == true)
			{
				var oJsonLock = { "function": "Lock32_Function", "sn": sn, "rand": rand };
				var sJsonLock = JSON.stringify(oJsonLock);
				$.ajax(
				{
					url: 'http://127.0.0.1:17681',
					data: 'json=' + sJsonLock,
					dataType: "jsonp",
					jsonp: "callback",
					jsonpCallback: "jsonpcallback"
				}).
				done(function(ojson)
				{
					var sjson = JSON.stringify(ojson[0]);
					sStatus += sjson;
                    socket_suciz_lock32 = ojson[0].lock;
                    that.keyStr=socket_suciz_lock32
					// sendVal(socket_suciz_lock32);
				});
			}
        },
		error: function(ojson)
		{
			// alert( "请安装插件程序");//暂时不用安装插件
			console.log("请安装插件程序")
		}
    });
	var pac=0;
	pac += 9;
}


