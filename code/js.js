// 第一次访问设置默认主页
if ( 'OVER' != getCookie("FIRSTTIME") ) {
    setCookie("_B", "http://www.baidu.com");
    setCookie("_G", "http://www.google.com");
    setCookie("_Q", "http://www.qq.com");
    setCookie("_T", "http://www.taobao.com");
    setCookie("_V", "http://www.v2ex.com");    
    setCookie("_W", "http://www.weibo.com");
    setCookie("_Y", "http://www.youku.com");
    setCookie("FIRSTTIME", "OVER");
};

var urlcache = {};
var currentSite;

// 48 对应 0，90 对应 Z
// 预处理，为已有设置键位添加网站avatar
for (var i = 48; i <= 90; i++) {
    var code = String.fromCharCode(i);
    var v = getCookie("_" + code);
    if (v != null && v != '' && typeof(v) != 'undefined') {
        urlcache[code] = v;
        $("#LI_" + code).prepend('<img id="' + code + '" class="fav" src="' + getico(v) + '" align="center">')
    }
};

// keydown
$(document).keydown(function(ev) {
    // if(ev.ctrlKey) return false;

    // 组合键 ctrl + x
    // 作用：设置键位
    if(ev.ctrlKey) {
        var code = String.fromCharCode(ev.keyCode);
        $("#tempdate").val(code);
        $("#LI_" + code).addClass("active");
        // console.log('current code :' + code);
        update();
        return false;
    }

    // 组合键 alt + x
    // 作用：删除键位
    if(ev.altKey) {
        var code = String.fromCharCode(ev.keyCode);
        $("#tempdate").val(code);
        $("#LI_" + code).addClass("active");
        del();
        return false;
    }

    // 回车确认跳转
    if((ev.keyCode == 13) && currentSite){
        console.log('13');
        window.location.href = currentSite;
        setTimeout(($("#message").html("正在跳转...")), 2000);
        return false;
    }

    var code = String.fromCharCode(ev.keyCode);
    $("#LI_" + code).addClass("active");
    // setTimeout('$("#LI_' + code + '").removeClass("active");', 300);
    if(urlcache[code] == '' || typeof(urlcache[code]) == 'undefined') {
        console.log('down message')
        $("#message").html('找不到这个按键的配置');
        currentSite = null;
        // setTimeout('$("#message").html("");', 2000)
    } else {
        $("#message").html('你即将访问：' + urlcache[code] + '，回车确认');
        currentSite = urlcache[code];
        // window.location.href = urlcache[code];
    }
});

// keyup
$(document).keyup(function(ev) {
    // if(ev.ctrlKey) return false;
    var code = String.fromCharCode(ev.keyCode);
    var key = "#LI_" + code;
    $(("#LI_" + code).toString()).removeClass("active");
});

// 鼠标移入时
// 动态插入编辑、删除按钮
$("#main li").mouseenter(function() {
    $("#tempdate").val($(this).attr('id').replace("LI_", ""));
    $(this).append('<div class="oper"><span><a onclick="return del()" class="del" title="删除"><img src="image/delete-icon.png"></a></span><span><a onclick="return update()" class="edit" title="编辑"><img src="image/edit-icon.png"></a></span></div>')
}).mouseleave(function() {
    //鼠标移出时
    $("#tempdate").val('');
    $(".oper").remove()
});

// 鼠标单击时
// $("#main li").click(function() {
//     var code = $(this).attr('id').replace('LI_', '');
//     if (urlcache[code] != '' && typeof(urlcache[code]) != 'undefined') {
//         // alert('click')
//         // window.location.href = urlcache[code];
//     }
// });

// 阻止事件传播
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

// 阻止事件传播
function update() {
    var code = $("#tempdate").val();
    // $("#LI_" + code).css('background', '#ccf');
    // var u = window.prompt("请输入键位 [" + code + "] 对应的网站地址", "");
    var u;

    swal({   
        title: "Hello",   
        text: "请输入键位 [" + code + "] 对应的网站地址",   
        type: "input",   
        showCancelButton: true,   
        closeOnConfirm: false,   
        animation: "slide-from-top",   
        inputPlaceholder: urlcache[code] }, function(u){   
            if (u === false) return false;      
            if (u === "") {     
                swal.showInputError("You need to write something!");     
                return false   
            }
            if (u.indexOf('http://') == -1 && u.indexOf('https://') == -1) {
                u = 'http://' + u
            };
            if (!IsURL(u)) {
                // alert('网站地址输入错误!请核对');
                // console.log('wrong');
                swal.showInputError("网址地址输入有误，请核对！");     
                return false;
            };      
        swal("Nice!", "You wrote: " + u, "success");
        // $("#LI_" + code).css('background', '#fff');
        urlcache[code] = u;
        // $("#" + code).remove();
        $("#LI_" + code).prepend('<img id="' + code + '" class="fav" src="' + getico(u) + '" align="center">');
        setCookie("_" + code, u);
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
