// 获取访问者ip信息
// remote_ip_info 结构如下：
// {
//     "ret":1,
//     "start":-1,
//     "end":-1,
//     "country":"日本",
//     "province":"",
//     "city":"",
//     "district":"",
//     "isp":"",
//     "type":"",
//     "desc":""
// }

$(document).ready(function(){

    // 欢迎提示信息
    if('NO' !== getCookie("PROMPT") ) {
    swal({   
        title: "Welcome to miniNav",
        text: "<strong>ctrl + key</strong> 设置站点<br /><strong>alt + key</strong> 删除站点",
        type: "warning",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "我学会了",
        confirmButtonColor: "#DD6B55",
        cancelButtonText: "不再提示",
        html: true,
        closeOnConfirm: false,   
        closeOnCancel: false }, function(isConfirm) {   
            if (isConfirm) {     
                swal("Good Job!", "玩得愉快！", "success");   
            } else {     
                swal("OK", "不再打扰啦", "success");
                setCookie("PROMPT", "NO");
            } 
        });
    }


    var city = remote_ip_info.city; //ip城市信息
    // console.log(city)
    var greeting,                   // 问候信息
        weather_temperature,        // 当前摄氏度
        weather_info,               // 当前天气信息
        info_chuanyi,               // 穿衣信息
        info_ganmao,                // 感冒信息
        info_kongtiao,              // 空调信息
        info_wuran,                 // 污染信息
        info_yundong;               // 运动信息

    // 根据城市获取天气信息
    $.getJSON("http://op.juhe.cn/onebox/weather/query?callback=?", {
        "cityname" : city,
        "dtype" : "jsonp",
        "key" : "82ebfea782a5868afeacadc3e4f96f9e"
    }, function(data) {
        var errorcode = data.error_code;
        if( errorcode == 0){
            //数据正常返回
            var info_selected;
            // console.log(JSON.stringify(data));

            weather_temperature = data.result.data.realtime.weather.temperature;
            weather_info = data.result.data.realtime.weather.info;
            info_chuanyi = data.result.data.life.info.chuanyi[1];
            info_ganmao = data.result.data.life.info.ganmao[1];
            info_kongtiao = data.result.data.life.info.kongtiao[1];
            info_wuran = data.result.data.life.info.wuran[1];
            info_yundong = data.result.data.life.info.yundong[1];

            // 随机选择问候信息，数组存储可以简化过程
            switch(Math.floor((Math.random() * 5))) {
                case 0:
                    info_selected = info_chuanyi;
                    break;
                case 1:
                    info_selected = info_ganmao;
                    break
                case 2:
                    info_selected = info_kongtiao;
                    break;
                case 3:
                    info_selected = info_wuran;
                    break;
                case 4:
                    info_selected = info_yundong;
                    break;
                default:
                    break;
            }

            greeting = '<strong>当前气温：' + weather_temperature + '℃</strong><br>' + info_selected;
            $("#message").html(greeting);
        } else {
            // 该接口次数目前使用已达到上限（100次），若无问候信息可通过控制台查看报错信息
            console.log(errorcode+":"+data.reason);
        }
    });
})

// 第一次访问设置默认主页
if ( 'OVER' != getCookie("FIRSTTIME") ) {
    setCookie("_B", "http://bbs.byr.cn");
    setCookie("_G", "http://www.google.com");
    setCookie("_Q", "http://www.qq.com");
    setCookie("_T", "http://www.taobao.com");
    setCookie("_V", "http://www.v2ex.com");    
    setCookie("_W", "http://www.weibo.com");
    setCookie("_Y", "http://www.youku.com");
    setCookie("FIRSTTIME", "OVER");
};


var urlcache = {};  //存储各键位已有站点信息
var currentSite;    //存储当前键位对应站点

// 48 对应 0，90 对应 Z
// 预处理，为已有设置键位添加网站avatar
for(var i = 48; i <= 90; i++) {
    var code = String.fromCharCode(i);
    var v = getCookie("_" + code);
    if (v != null && v != '' && typeof(v) != 'undefined') {
        urlcache[code] = v;
        $("#LI_" + code).prepend('<img id="' + code + '" class="avatar" src="' + getico(v) + '" align="center">')
    }
};

// keydown
$(document).keydown(function(ev) {

    // 回车确认跳转
    if((ev.keyCode == 13) && currentSite){
        window.location.href = currentSite;
        setTimeout(($("#message").html("正在跳转...:)")), 2000);
        return false;
    }
    
    // 避免非字母数字键触发#message，取得一定效果，
    // bug: swal()状态下如何防止按键触发#message更新
    
    if(ev.keyCode<48 || ev.keyCode>90)  return;

    // 组合键 ctrl + x
    // 作用：设置键位
    if(ev.ctrlKey) {
        var code = String.fromCharCode(ev.keyCode);
        $("#tempdate").val(code);
        $("#LI_" + code).addClass("m-keyboard-key-active");
        update();
        return false;
    }

    // 组合键 alt + x
    // 作用：删除键位
    if(ev.altKey) {
        var code = String.fromCharCode(ev.keyCode);
        $("#tempdate").val(code);
        $("#LI_" + code).addClass("m-keyboard-key-active");
        del();
        return false;
    }

    var code = String.fromCharCode(ev.keyCode);
    $("#LI_" + code).addClass("m-keyboard-key-active");
    if(urlcache[code] == '' || typeof(urlcache[code]) == 'undefined') {
        $("#message").html('并没有找到该键位设定，试试ctrl + ' + code);
        currentSite = null;
        // setTimeout('$("#message").html("");', 2000)
    } else {
        $("#message").html('您即将访问：' + urlcache[code] + '，回车确认');
        currentSite = urlcache[code];
    }
});

// keyup
$(document).keyup(function(ev) {
    var code = String.fromCharCode(ev.keyCode);
    var key = "#LI_" + code;
    $(("#LI_" + code).toString()).removeClass("m-keyboard-key-active");
});


// [鼠标移入移出、单击]相关功能已取消，故注释

// 鼠标移入时
// 动态插入编辑、删除按钮
// $("#main li").mouseenter(function() {
//     $("#tempdate").val($(this).attr('id').replace("LI_", ""));
//     $(this).append('<div class="oper"><span><a onclick="return del()" class="del" title="删除"><img src="image/delete-icon.png"></a></span><span><a onclick="return update()" class="edit" title="编辑"><img src="image/edit-icon.png"></a></span></div>')
// }).mouseleave(function() {
//     //鼠标移出时
//     $("#tempdate").val('');
//     $(".oper").remove()
// });

// 鼠标单击时
// $("#main li").click(function() {
//     var code = $(this).attr('id').replace('LI_', '');
//     if (urlcache[code] != '' && typeof(urlcache[code]) != 'undefined') {
//         // alert('click')
//         // window.location.href = urlcache[code];
//     }
// });


// 若加入[鼠标单击跳转]，需阻止事件传播
function del() {
    var code = $("#tempdate").val();
    swal({   
        title: "Are you sure?",   
        text: "此操作将会清除该键位设置",   
        type: "warning",   
        showCancelButton: true,   
        confirmButtonColor: "#DD6B55",   
        confirmButtonText: "我确认",   
        cancelButtonText: "反悔了",   
        closeOnConfirm: false,   
        closeOnCancel: false }, function(isConfirm){   
        if (isConfirm) {     
            swal("Deleted!", "该键位设置已重置", "success");   
                
                console.log('code :' + code);
                urlcache[code] = '';
                $("#" + code).remove();
                deleteCookie("_" + code);
        } else {     
            swal("Cancelled", "你的键位设置依旧 :)", "error");   
        } 
    });

    return false;
};

// 若加入[鼠标单击跳转]，需阻止事件传播
function update() {
    var code = $("#tempdate").val();
    var inputUrl;
    swal({   
        title: "Hello",   
        text: "请输入键位 [" + code + "] 对应的网站地址",   
        type: "input",   
        showCancelButton: true,   
        closeOnConfirm: false,   
        animation: "slide-from-top",   
        inputPlaceholder: urlcache[code] }, function(inputUrl){   
            if (inputUrl === false) return false;      
            if (inputUrl === "") {     
                swal.showInputError("网址不能为空哦!");     
                return false   
            }
            if (inputUrl.indexOf('http://') == -1 && inputUrl.indexOf('https://') == -1) {
                inputUrl = 'http://' + inputUrl
            };
            if (!IsURL(inputUrl)) {
                swal.showInputError("抱歉，不能正确识别输入的网址");     
                return false;
            };      
        swal("Nice!", "You wrote: " + inputUrl, "success");
        // $("#LI_" + code).css('background', '#fff');
        urlcache[code] = inputUrl;
        // $("#" + code).remove();
        $("#LI_" + code).prepend('<img id="' + code + '" class="fav" src="' + getico(inputUrl) + '" align="center">');
        setCookie("_" + code, inputUrl);
        return true;
    });    
};

function getico(url) {
    var s = url.indexOf("//");
    temp = url.substring(s + 2);
    var s1 = temp.indexOf("/");
    if (s1 == -1) {
        s1 = temp.length
    };
    return url.substring(0, s1 + s + 2) + '/favicon.ico'
};

function setCookie(name, value, path, domain, secure) {
    var expdate = new Date();
    expdate.setTime(expdate.getTime() + (100 * 365 * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + escape(value) + ((expdate) ? "; expires=" + expdate.toGMTString() : "") + "; path=/";
};

function deleteCookie(name) {
    expdate = new Date();
    expdate.setTime(expdate.getTime() - (86400 * 1000));
    setCookie(name, "", expdate)
};

function getCookie(name) {
    var bikky = document.cookie;
    name += "=";
    var i = 0;
    while (i < bikky.length) {
        var offset = i + name.length;
        if (bikky.substring(i, offset) == name) {
            var endstr = bikky.indexOf(";", offset);
            if (endstr == -1) endstr = bikky.length;
            return decodeURIComponent(bikky.substring(offset, endstr))
        };
        i = bikky.indexOf(" ", i) + 1;
        if (i == 0) break
    };
    return
};

function IsURL(str_url) {
    var strRegex = "^((https|http|ftp|rtsp|mms)?://)" + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + "(([0-9]{1,3}.){3}[0-9]{1,3}" + "|" + "([0-9a-z_!~*'()-]+.)*" + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." + "[a-z]{2,6})" + "(:[0-9]{1,4})?" + "((/?)|" + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var re = new RegExp(strRegex);
    return !!re.test(str_url);
};
