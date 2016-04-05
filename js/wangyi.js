// 通用函数方法
    //getElementsByClassName方法
function getElementsByClassName(element, names) {
    if (element.getElementsByClassName) {
        return element.getElementsByClassName(names);
    } else {
        var elements = element.getElementsByTagName('*');
        var result = [];
        var element,
            classNameStr,
            flag;
        names = names.split(' ');
        for (var i = 0; element = elements[i]; i++) {
            classNameStr = ' ' + element.className + ' ';
            flag = true;
            for (var j = 0, name; name = names[j]; j++) {
                if (classNameStr.indexOf(' ' + name + '') == -1) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                result.push(element);
            }
        }
        return result;
    }
}
 // 设置参数
function serialize (data) { 
    if (!data) return '';
    var pairs = [];
    for (var name in data){
        if (!data.hasOwnProperty(name)) continue;
        if (typeof data[name] === 'function') continue;
        var value = data[name].toString();
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        pairs.push(name + '=' + value);
    }
    return pairs.join('&');
}
  //get方法
function get(url,options,callback){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (){
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                 callback(xhr.responseText);
            } else {
                alert("request failed : " + xhr.status);
            }
        }
    };
    xhr.open("get",url + "?" + serialize(options),true);
    xhr.send(null);
}
  //获取样式
function getStyle (obj,attr) {
        if( obj.currentStyle ){
            return obj.currentStyle[attr];
        }
        else{
            return getComputedStyle(obj)[attr];
        }
    }
//删除元素节点
function removeLi (el) {
   for (var i = el.length-1; i >=0 ; i--) {
    el[i].parentNode.removeChild(el[i]);
}
} 
// 写入cookie
function setCookie (name, value, expires, path, domain, secure) {
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires instanceof Date)
        cookie += '; expires=' + expires.toGMTString();
    if (path)
        cookie += '; path=' + path;
    if (domain)
        cookie += '; domain=' + domain;
    if (secure)
        cookie += '; secure=' + secure;
    document.cookie = cookie;
}
// 读取cookie
function getCookie (name) {
    var cookieName=encodeURIComponent(name)+"=",
    cookieStart=document.cookie.indexOf(cookieName),
    cookieValue=null;
    if(cookieStart>-1){
        var cookieEnd=document.cookie.indexOf(";",cookieStart);
        if(cookieEnd==-1){
            cookieEnd=document.cookie.length;
        }
        cookieValue=decodeURIComponent(document.cookie.substring(cookieStart+cookieName.length,cookieEnd));
    }
    return cookieValue;
}
// 删除cookie
function removeCookie (name, path, domain) {
    setCookie(name, '', new Date(0), path, domain);
}
// 检测是否设置小黄条的隐藏cookie
function closeCheck(){
    var cookie=getCookie('closeclick');
    if(cookie=='close'){
        getElementsByClassName(document,'h-top')[0].style.display='none';
    }else{
        getElementsByClassName(document,'h-top')[0].style.display='block';
    }
}

// 点击不再提醒使小黄条隐藏，并设置cookie
function closeClick(){
    var notShow=document.getElementById('not');
    notShow.onclick=function(){
        var warn=getElementsByClassName(document,'h-top');
        warn[0].style.display='none';
        setCookie('closeclick','close');
    }
}

//关注与登录事件
function loginYn(){
    // 检测是否设置关注cookie
        var cookie=getCookie('followSuc');
        if(!!cookie){
            getElementsByClassName(document,'follow')[0].style.display='none';
            getElementsByClassName(document,'already')[0].style.display='inline-block';
        }else{
            getElementsByClassName(document,'follow')[0].style.display='inline-block';
            getElementsByClassName(document,'already')[0].style.display='none';
        }
    // 点击关注，检测是否登录，若登录则
    var follow=document.getElementById('follow');
    follow.onclick=function(){
        var cookie=getCookie('loginSuc');
        if(!!cookie){
            //调用关注API
            attention();
        }else{
           // 弹出登录窗
            document.getElementById('login-screen').style.display='block';
        }
    }
    // 关闭登录窗口
    var close=document.getElementById('close');
    close.onclick=function(){
        document.getElementById('login-screen').style.display='none';
    }
    //单击登录
    var loginBtn=document.getElementById('loginBtn');
    loginBtn.onclick=function(){ submit();}
}
// 导航关注
function attention(){
    var xhr=new XMLHttpRequest();
     xhr.onreadystatechange=function(){
        if(xhr.readyState==4){
            if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                if(xhr.responseText==1){
                    setCookie('followSuc','followSuc');
                    getElementsByClassName(document,'follow')[0].style.display='none';
                    getElementsByClassName(document,'already')[0].style.display='block';
                }
            }
        }
    }
    xhr.open("get",'http://study.163.com/webDev/attention.htm',true);
    xhr.send(null);
}
// 取消关注，删除cookie
function attCancel(){
    removeCookie('followSuc');
    getElementsByClassName(document,'follow')[0].style.display='block';
    getElementsByClassName(document,'already')[0].style.display='none';
}

// 获取登录表单

function submit(){
        var loginForm=document.forms.loginForm;
        var nameinput=loginForm.userName,
        name=nameinput.value,
        pswdinput=loginForm.password,
        pswd=pswdinput.value;
        var rightname='xuan',
        rightpswd='456789';
        // 表单验证,并错误提示信息
        var msg = document.getElementById('message');
        if(name!=rightname){
            msg.innerHTML ='请使用"xuan"账号登录。';
            return;
        }
        else if(pswd!=rightpswd){
            msg.innerHTML ='请输入正确的密码（456789）。';
            return;
        }
        // 使用Md5加密用户数据
         var userName=md5(name),password=md5(pswd);
        // 调用Ajax登录
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            if (xhr.readyState==4) {
                if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                    if(xhr.responseText==1){
                        // 成功
                        // 调用关注API
                        attention();
                        // 关闭登录窗口
                        closelogin();
                        // 设置登录的cookie......
                        setCookie('loginSuc','loginSuc');
                    }else{
                        // 失败
                        msg.innerHTML ='登录失败！';
                    }
                }
            }
        }
        var url="http://study.163.com/webDev/login.htm";
        url=addURLParam(url,"userName",userName);
        url=addURLParam(url,"password",password);
        xhr.open("get",url,true);
        xhr.send(null);
    }
// 向现有URL的末尾添加查询字符串参数
function addURLParam(url,name,value){
    url+=(url.indexOf("?")==-1?"?":"&");
    url+=encodeURIComponent(name)+"="+encodeURIComponent(value);
    return url;
}
// 轮播图
function bannerRoll(){
    var picindex=0;
    var picwrap=document.getElementById('banner');
    var picArr=picwrap.getElementsByTagName('a');
    var controlwrap=getElementsByClassName(document,'m-tab')[0];
    var controlArr=controlwrap.getElementsByTagName('i');
    //滚动
    function move(){
        if(picindex<picArr.length-1){
            picindex++;
        }else{
            picindex=0;
        }
        changePic(picindex);
        fadeIn(picArr[picindex]);
    }
    // 调用淡入函数和改变控制小圆点
    function changePic(num){
        for(var i=0;i<picArr.length;i++){
            picArr[i].className='';
            controlArr[i].className='';
        }
        picArr[num].className='imgon';
        controlArr[num].className='active';
    }
    // 淡入函数
    function fadeIn(ele){
        ele.style.opacity=0;
        ele.style.transition = ''; 
        setTimeout( function  () {
            ele.style.transition = '0.5s';
            ele.style.opacity = 1;
        },50);
    }
// 鼠标悬停，停止切换
    var timer=setInterval(move,5000);
    picwrap.onmouseover=function (){
        clearInterval(timer);
    }
    picwrap.onmouseout=function (){
        timer=setInterval(move,5000);
    }

//点击控制器，切换到对应图片
    function controller(){
        for (var i = 0; i < controlArr.length; i++) {
            controlArr[i].index=i;
            controlArr[i].onclick=function(){ 
                changePic(this.index);
                fadeIn(picArr[this.index]);
            }
        }  
    }
    controller();
}

// 调用浮层播放介绍视频
function controlVideo(){
    var play=document.getElementById('play');
    var close=document.getElementById('close-video');
    var video= document.getElementById('play-video');
    var stop=document.getElementById('video');
    play.onclick=function(){
        video.style.display='block';
    }  
    close.onclick=function(){
        video.style.display='none';
        stop.pause();
    }
}
function hotList(){
    // 获取最热排行
    function setList(){ 
        var oList = document.getElementById('l-hot');    
        var oListwrap = oList.getElementsByTagName('ul');
        var oHot=oListwrap[0].getElementsByTagName('li');
        removeLi(oHot);
        get('http://study.163.com/webDev/hotcouresByCategory.htm',{},function(data){
            var arr = JSON.parse(data);
            for( var i=0; i<20; i++){
                var aLi= document.createElement('li');
                aLi.className="ho clearfix";
                aLi.innerHTML = '<img src=\"' + arr[i].smallPhotoUrl + '\" class=\"le\" /><p>' + arr[i].name + '</p><div class=\"num\">' + arr[i].learnerCount + '</div>';
                oListwrap[0].appendChild(aLi);   
            }
        });
    }
     //热门列表滚动
    function change(){ 
        var oList = document.getElementById('l-hot');  
        var oListwrap = oList.getElementsByTagName('ul');
        function listRoll(){
                if( oListwrap[0].style.top == '-700px'){
                    oListwrap[0].style.top = 0;
                }
                else{
                    oListwrap[0].style.top = parseFloat(getStyle(oListwrap[0],'top')) - 70 + 'px';
                    }
            }
        var timer = setInterval(listRoll,5000);
        oListwrap[0].onmouseover = function(){
            clearInterval(timer);
            };
        oListwrap[0].onmouseout = function(){
            timer=setInterval(listRoll,5000);
            };
    }
    setList();
    change();
}
// tab实现课程切换  //课程列表
function productTab(){ 
    var oTab = document.getElementById('p-edu');  
    var aTabhd = getElementsByClassName(oTab,'p-tab');
    var aTabbtn = getElementsByClassName(aTabhd[0],'btn');
    var aContent = getElementsByClassName(oTab,'p-course');
    var aDesign = document.getElementById('design');
    var aLanguage = document.getElementById('language');
    //获取服务器数据
    function setData(page,num,element){  
        get('http://study.163.com/webDev/couresByCategory.htm',{pageNo:page,psize:15,type:num},function(data){   //设置课程
            var data = JSON.parse(data);
            for (var i = 0; i < data.list.length; i++) {
            var oTeam = document.createElement('div');
            oTeam.className = 'cour le pr';
            var oImg = document.createElement('img');
            var oH5 = document.createElement('h5');
            var oP = document.createElement('p');
            var oI = document.createElement('i');
                oI.className='meru num';
            var oDiv = document.createElement('div');
            var oSpan = document.createElement('span');
                oSpan.className='price';
            var oPic = document.createElement('div');
                oPic.className='pic pa';
                oImg.src = data.list[i].middlePhotoUrl;
                oH5.innerHTML = data.list[i].name;
                oI.innerHTML=data.list[i].learnerCount;
                if( data.list[i].price == 0){
                    oSpan.innerHTML = '免费';
                }else{
                    oSpan.innerHTML = '￥' + data.list[i].price;
                }
                if(!data.list[i].categoryName){
                    data.list[i].categoryName = '无';
                }
                oPic.innerHTML = '<img src="' + data.list[i].middlePhotoUrl +'" /><h5>' + data.list[i].name + '</h5><i class="num">' + data.list[i].learnerCount + '人在学</i><p>发布者：' + data.list[i].provider + '</br>分类：' + data.list[i].categoryName + '</p><p class="introduce">' +  data.list[i].description + '</p>';

                oTeam.appendChild(oImg);
                oTeam.appendChild(oH5);
                oTeam.appendChild(oP);
                oTeam.appendChild(oI);
                oTeam.appendChild(oSpan);
                oTeam.appendChild(oPic);
                element.appendChild(oTeam);
            }
            
        });
    }
    var page=1;
    setData(page,10,aDesign);
    setData(page,20,aLanguage);    
    aTabbtn[0].onclick = function(){
        aDesign.style.display = 'block';
        this.className = 'btn p-active';
        aLanguage.style.display = 'none';
        aTabbtn[1].className = 'btn';  
    };
    aTabbtn[1].onclick = function(){
        aDesign.style.display = 'none';
        aTabbtn[0].className = 'btn';
        aLanguage.style.display = 'block';
        this.className = 'btn p-active';
    };
    // 页码切换
    function tabPage() {
        var oPage=document.getElementById('pager');
        var change=oPage.getElementsByTagName('span');
        var oPtion=oPage.getElementsByTagName('i');
        var oCour=getElementsByClassName(document,"cour");
        function removeClass(){
            for (var i = 0; i < oPtion.length; i++) {
                oPtion[i].className="";
            }           
        }

        for (var i = 0; i < oPtion.length; i++) {
            oPtion[i].index=i;
            oPtion[i].onclick=function(){
                removeClass();
                oPtion[this.index].className="page-active";
                removeLi(oCour); 
                setData(this.index+1,10,aDesign);
                setData(this.index+1,20,aLanguage);
                page=this.index+1;
            }
        }
        function changeCour(n){
            page=page+n;
            removeLi(oCour);
            setData(page,10,aDesign);
            setData(page,20,aLanguage);
            return page;      
        }
        change[0].onclick=function(){
            if (page>1){
            removeClass();
            page=changeCour(-1);
            oPtion[page-1].className="page-active";
            }              
        }
        change[1].onclick=function(){
            if (page<8) {
            removeClass();
            page=changeCour(1);
            oPtion[page-1].className="page-active";  
            }
        }         
    }
    tabPage();
}

window.onload=function(){

    closeClick();
    closeCheck();
    loginYn();
    bannerRoll();
    controlVideo();
    hotList();
    productTab()
}