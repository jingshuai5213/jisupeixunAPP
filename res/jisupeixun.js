
//*************************************************
//全局界面切换监听
//*************************************************
var javaserver = "http://180.76.156.234:9187";
var javafile = "http://file.jisupeixun.com";//文件上传接口
var systemTitle="极速培训";
var domain="http://console.jisupeixun.com"; // 题目练习地址

var sysUserInfo={};
var allorgid="";
var allgroupid="";
var allroleid="";
var allorgname="";
var allgroupname="";
var allrolename="";
var FreshLoadimgImg = "{pull: ['fs://wgt/images/loading_more.gif'],load: ['fs://wgt/images/loading_more.gif']}";
var playerHeight = 200;
//手机判断
var browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {         //移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            wp: u.indexOf('IEMobile') > -1, //是否wp
            symbianos: !!u.match(/SymbianOS.*/), //是否SymbianOS
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    } (),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

try{$.noConflict();}catch(e){}
$(document).on("pageInit", function(e, id, $page) {
  try{
    bPlayer.close();  //此处主要是为了防止视频还在后台播放，所以此处加上关闭
    //GetConnectionType();
  }catch(e){ }
    //企业微信隐藏header属性
    if(isWeiXin()){
        $("header").remove();
        $("#exitLogin").remove();
        $("#lable_color").remove();
        $(".bar-header-secondary").css("top","0px !important");
        $(".pull-to-refresh-content").css("top","0px !important");
        $("#kechengContent").css("top","0px !important");
        $("#courseContent").css("top","2.2rem !important");
        $(".xiaoxi").hide();
        $(".yejianmoshi").hide();

    }else{
         $("#wxAdd").remove();
         $("#closeFileupload").remove();
        var userInfo=strToJson(GetlocalStorage("userinfo"));
        if(!isNull(userInfo)){
            document.title = userInfo.organization_Name;
            systemTitle =  userInfo.organization_Name;
        }else{
            $("title").html("极速培训");
        }
    }
    var myhash = window.location.hash; //获得#后的内容
     if(myhash!=""&&myhash!="login"&&myhash!=null){
          stuInfo();
     }
    console.log('myhash' + myhash);
    //退出登录  exitLogin
    $(document).on('click','#exitLogin', function () {
                 localStorage.setItem("userinfo", "");
                 localStorage.setItem("userinfo_token", "");
                 window.location.href ="../login.html";
    });
   //刷新后在资料
   if(myhash =="#ziliao"){

        if(isWeiXin()){
            $("title").html("资料");
        }else{
            $(".title").html("资料");
        }
        $(".tab-item").removeClass("active");
        $(myhash+"_m").addClass("active");
        ziliaoinit();

        setTimeout(function(){ if(browser.versions.ios){
            jQuery(".ios-is-show").show();
            jQuery("#zhiliaoadd").hide();
        }else{
            jQuery("#zhiliaoadd").show();
            jQuery(".ios-is-show").hide();
        }},100);
   }
   //刷新后在任务
  else if(myhash =="#renwu"  || id == "renwu"){
        $(".tab-item").removeClass("active");
        $("#xuexi_m").addClass("active");

        if(isWeiXin()){
            $("title").html("任务");
        }else{
            $(".title").html("任务");
        }
        renwuinit();
   }
   //刷新后在个人
   else if(myhash =="#stuInfo"  || id == "stuInfo"){
        if(isWeiXin()){
            $("title").html("个人中心");
        }else{
            $(".title").html("个人中心");
        }
   //刷新后在公开课
   }else if(myhash == "#course" || id == "course"){
        if(isWeiXin()){
            $("title").html("公开课");
        }else{
            $(".title").html("公开课");
        }
        getPublicCourse(true);
        $("#xuexi_m").addClass("active");
    //刷新后在首页
   }else if(myhash == "#xuexi" || id == "xuexi"){
        if(isWeiXin()){
            $("title").html("首页");
        }else{
            $(".title").html("首页");
        }
        $("#xuexi_m").addClass("active");
   }
});

//****************************************************/

$("#renwu_m").click(function(){

    if(isWeiXin()){
         $("title").html("任务");
    }else{
        $(".title").html("任务");
    }

});
$("#xuexi_m").click(function(){
    if(isWeiXin()){
         $("title").html("首页");
    }
});
$("#ziliao_m").click(function(){
    if(isWeiXin()){
        $("title").html("资料");
    }else{
        $(".title").html("资料");
    }
});
$("#ziliao_m2").click(function(){

    $("#ziliao_m").click();

});
$("#stuInfo_m").click(function(){
    if(isWeiXin()){
        $("title").html("个人中心");
    }else{
        $(".title").html("个人中心");
    }
});
$("#course_m").click(function(){

    if(isWeiXin()){
        $("title").html("公开课");
    }else{
        $(".title").html("公开课");
    }
})

//判断是否是企业微信
function isWeiXin(){
    var resource=GetlocalStorage("resource");
    if(resource&&(resource==2||resource=="2")){
        return true;
    }else{
        return false;
    }
}
//绑定基本信息
function stuInfo(){
    var userInfo=getUserInfo();
    //男
    if(userInfo.user_Sex!=undefined&&userInfo.user_Sex==1){
        $("#usersex").html("<i class='iconfont icon-unie71c' style='color: #39f'></i>");
    //女
    }else if(userInfo.user_Sex!=undefined&&userInfo.user_Sex==0){
        $("#usersex").html("<i class='iconfont icon-unie71a' style='color: #fe5d81'></i>");
    }
     $("#userimg").attr("src",userInfo.user_Img);
     $("#uname").html(userInfo.username);
     $("#orgname").html(userInfo.organization_Name);
     $("#userno").html("编号："+userInfo.user_No);
     getTotleInfo(userInfo);
}
//请求用户的总信息
function getTotleInfo(userinfo){

     getAjax(javaserver + "/exampaper/stuTotleInfo", { orgid: userinfo.organization_ID, userid: userinfo.user_ID,org_Id:userinfo.allorgid,role_Id:userinfo.allroleid,user_groupId:userinfo.allgroupid }, function (data) {
            data = strToJson(data);
            if (data.errorcode == 0 && data.data != null) {
               $("#totleStudyTime").html(data.data.totleStudyTime.toFixed(2));
                $("#totleStudyCourse").html(data.data.totleStudyCourse);
                $("#totleExam").html(data.data.totleExam);
            }
        });

}
 // 格式话时间
    Date.prototype.format = function(fmt) {
         var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt)) {
                fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
         for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                 fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
             }
         }
        return fmt;
    }
//监听浏览器返回  修改title
//后腿事件
$(window).on('popstate', function () {
    var myhash = window.location.hash; //获得#后的内容
     if(isWeiXin()){
           if(myhash =="#ziliao"||myhash=="ziliao"){
                $("title").html("资料");
           }else if(myhash =="#renwu"  || myhash == "renwu"){
                $("title").html("任务");
           }else if(myhash =="#stuInfo"  || myhash == "stuInfo"){
                $("title").html("个人中心");
           }else if(myhash == "#course" || myhash == "course"){
                $("title").html("公开课");
           }else if(myhash == "#xuexi" || myhash == "xuexi"){
                $("title").html("首页");
           }else if(myhash == "#history" || myhash == "history"){
                $("title").html("历史考试");
           }else if(myhash == "#collection" || myhash == "collection"){
                $("title").html("课程收藏");
           }
     }else if(myhash =="#ziliao"||myhash=="ziliao"){
        $("#ziliao_yulan").find("video").remove();
        try{
          bPlayer.close();
        }catch(e){}
     }
});
//**********************************************************************
//登录界面
//**********************************************************************
$(document).on("pageInit", "#login", function (e, id, $page) {
    sysUserInfo=strToJson(GetlocalStorage("userinfo"));
    var t=GetlocalStorage("userinfo_token");
    var token = strToJson(GetlocalStorage("userinfo_token"));
    if(sysUserInfo!=null&&sysUserInfo!=""&&sysUserInfo!=undefined&&token!=null&&token!=""&&token!=undefined){
         //登录(*防止学员用户已更换组织架构，缓存数据不对)
        //login(sysUserInfo.user_Account,sysUserInfo.user_Pwd);
        getParam();
        $("#username").val(sysUserInfo.user_Account);
        $("#userpwd").val(sysUserInfo.user_Pwd);
        document.title = sysUserInfo.organization_Name;
        window.location.href = "html/home.html#xuexi";
    }
    //登录按钮
    $(document).on('click', '#login_btn', function () {
        var useraccount = $("#username").val();
        var userpwd = $("#userpwd").val();

        //登录
        login(useraccount,userpwd)
    });
    var isPlayer = false;
     function login(username,pwd){
        localStorage.setItem("resource", "0");
        if(isPlayer)
          return;
        isPlayer = true;
        error_login('登录中','#0894ec');
        getAjax(javaserver + "/ApiUser/login",{ useraccount: username, userpwd: pwd },function (users) {
            error_login('登录完成','#0894ec');
            isPlayer = false;
            users = strToJson(users);
            //用户登录错误次数 >5 <10 显示验证码 ，>10 锁定帐号
            // errorcode  0登录成功 11账号被锁定1小时 12账户或密码有错误 13该用户已经登录 5连接不上数据库 14验证码错误
            //                    console.log(users.name);
            if (users.errorcode == "11") {
                error_login("账号被锁定1小时");
                //$.alert("账号被锁定1小时！");
            } else if (users.errorcode == "13") {
                error_login("该用户已经登录");
                //$.alert("该用户已经登录！");
            } else if (users.errorcode == "5") {
                error_login("连接不上数据库");
               // $.alert("连接不上数据库！");
            } else if (users.errorcode == "14") {
                error_login("验证码错误");
                //$.alert("验证码错误！");
            } else if (users.errorcode == "6") {
                 error_login("系统错误");
                //$.alert("系统错误！");
            } else if (users.errorcode == "28") {
                error_login(users.errormsg)
                //$.alert(users.errormsg);
            } else if (users.errorcode == "12") {
                if (users.errnum <= 1) {
                    //验证帐号是否存在、
                    getAjax(javaserver + "/ApiUser/isAccount", { useraccount: username }, function (retData) {
                        if (retData.errorcode == "4") {
                             error_login("帐号不存在，请重新输入");
                        } else {
                             error_login("账号或密码错误, 请重新输入");
                        }
                    });
                } else {
                    error_login("账号或密码错误, 请重新输入");
                }
            } else if (users.errorcode == "0") {
                SetlocalStorage("userinfo_token", users.token);
                if (users.data.userstate == "0") {

                    getAjax(javaserver + "/PersonnelManagement/PersonnelGetKey", { user_ID: users.data.userId }, function (retobj) {
                        retobj = strToJson(retobj);
                        if (retobj.errorcode == 0) {
                            retobj.data.userId = retobj.data.user_ID;
                            retobj.data.username = retobj.data.user_Name;
                            if (retobj.data.user_Img == "" || retobj.data.user_Img == null || retobj.data.user_Img == undefined) {
                                retobj.data.user_Img = "res/img/avatar.png";
                            }
                            sysUserInfo = retobj.data;
                        }
//                           //账号来源 控制样式
//                          if(sysUserInfo.userOrgList[0].orgSource&&sysUserInfo.userOrgList[0].orgSource==2){
//                            //该账号来源 --企业微信
//                            SetlocalStorage("resource", "2");
//                          }else{
//                            SetlocalStorage("resource", "0");
//                          }
                            getParam();
                            //id
                            retobj.data.allorgid = allorgid;
                            retobj.data.allgroupid = allgroupid;
                            retobj.data.allroleid = allroleid;
                            //名称
                            retobj.data.allorgname = allorgname;
                            retobj.data.allgroupname = allgroupname;
                            retobj.data.allrolename = allrolename;
                            //放入缓存
                            SetlocalStorage("userinfo", JSON.stringify(retobj.data));
                            document.title = sysUserInfo.organization_Name;
                            window.location.href = "html/home.html#xuexi";
                    });
                } else if (users.data.userstate == "1") {
                     error_login("帐号已冻结");
                    //console.log("帐号已冻结！");
                } else if (users.data.userstate == "2") {
                    error_login("账号已锁定");
                   // console.log("帐号锁定！");
                }
            }
        });
        }

});

function nofunction(){
//  alert("a");

    $.toast('暂未开放！');


}
//**********************************************************************
//首页的加载
//**********************************************************************

$(document).on("pageInit", "#xuexi", function (e, id, $page,window) {
  try{
    bPlayer.close();
  }catch(e){}
    sysUserInfo=getUserInfo();
    //请求过期任务提醒
    getAjax(javaserver + "/exampaper/getSevenArrange",
                   { orgid: sysUserInfo.organization_ID,
                   userid: sysUserInfo.user_ID,
                   org_Id:sysUserInfo.allorgid,
                   role_Id:sysUserInfo.allroleid,
                   user_groupId:sysUserInfo.allgroupid }, function (data) {
                        data = strToJson(data);
                        if (data.errorcode == 0 ) {
                            var block="";
                           for(var i=0;i<data.datas.length;i++){
                                var d1=new Date(data.datas[i].endDate).getDay();
                                //任务
                                if(data.datas[i].messageType==1)
                                block+="<li><a href='#renwu'><div><img  src='"+data.datas[i].arrange.img+"' onerror='javascript:this.src=\"../images/train/fengmian098.png\"' height=70  /><span class='tishi fjinji'>星期"+ "日一二三四五六".charAt(d1)+"过期</span><span class='ckm'>"+data.datas[i].typeName+"<br /></span><span class='ckjz'>截止日期"+data.datas[i].endDate+"</span></div></a></li>";
                                //线下  课程
                                else
//                                block+="<li><a href='#renwu' class='item-link item-content'><div class='item-media'>星期" + "日一二三四五六".charAt(d1)+"</div><div class='item-inner'><div class='item-title-row'><div class='item-title'>线下地址："+data.datas[i].typeName+"</div></div><div class='item-text'>线下结束时间："+data.datas[i].endDate+"</div></div></a></li>";
                                block+="<li><div onClick='openKe_collection(" + JSON.stringify(data.datas[i].courseId) + ")'> <img  src='"+data.datas[i].courseInfo.course_img+"' onerror='javascript:this.src=\"/images/train/fengmian000.gif\"' height=70  /><span class='tishi jinji'>星期"+ "日一二三四五六".charAt(d1)+"过期</span><span class='ckm'>"+data.datas[i].typeName+"<br /></span><span class='ckjz'>截止日期"+data.datas[i].endDate+"</span></div></li>";
                           }
console.log(block);
                                if(block!=""){
                                        $(".lishi").show();
                                        $("#tixingTask").html(block);
                                 }else{
                                        $("#tixingTask").html("<center style='   margin-left: -15px;'><img src='../res/img/knownull.png'><br/>暂无数据</center>");
                                 }
                        }  else {
                            $.toast('请求错误！');
                        }
   });
   //请求最近学习的前三个课程记录
   getAjax(javaserver + "/exampaper/studyCourseTopThree",{userid: sysUserInfo.user_ID }, function (data) {
                        data = strToJson(data);
                        if (data.errorcode == 0 ) {
                            var block="";
                           for(var i=0;i<data.datas.length;i++){
                                block+="<div class='lishi_div' onClick='openKe_collection(" + JSON.stringify(data.datas[i].courseId)+","+null+","+ JSON.stringify(data.datas[i].arrangeId)+ ")'><div class='shuqian-down'>";
                                //已完成
                                if(data.datas[i].learningProgress=="100.00%"){
                                    block+="<span class='shuqian  end' ></span><span class='shuqiantext'>已完成</span>";
                                //未开始
                                }else if(data.datas[i].learningProgress=="00.00%"){
                                    block+="<span class='shuqian  start' ></span><span class='shuqiantext'>未开始</span>";
                                //进行中
                                }else{
                                    block+="<span class='shuqian  ing' ></span><span class='shuqiantext'>进行中</span>";
                                }
                                if(data.datas[i].courseImg.indexOf("/images/train") >= 0){
                                block+="</div><img  src='.."+data.datas[i].courseImg+"' height=124  width=220 /><span class='cstitle'>"+data.datas[i].courseName+"（"+(data.datas[i].arrangeId&&data.datas[i].arrangeId==1?'公开课':'任务')+"）</span></div>";
                              }else {
                                {
                                  block+="</div><img  src='"+data.datas[i].courseImg+"' height=124  width=220 /><span class='cstitle'>"+data.datas[i].courseName+"（"+(data.datas[i].arrangeId&&data.datas[i].arrangeId==1?'公开课':'任务')+"）</span></div>";
                                }
                              }
                           }
                                if(block!=""){
                                        $(".lishi").show();
                                        $("#historyStudy").html(block);
                                 }else{
                                        $(".lishi").hide();
                                 }
                        }  else {
                            $.toast('请求错误！');
                        }
   });
});

//登录错误显示
function error_login(msg,color){
    $("#login_btn").html(msg);
    $("#login_btn").css("background-color",color?color:"rgb(241, 104, 107)");
}
//**********************************************************************
//打开任务列表是触发
//**********************************************************************
function renwuinit() {
    var pageIndex=1;
    var pageSize=10;
    var nowState=1;//当前查询状态
        //任务缺省图
        var renwunull="<dl style='height:100%;width:100%;position: absolute;margin-top: 25%;color:#cecece;'><dd style='text-align:center;margin:0'><img src='../res/img/none.png' style='width: 50%;'></dd><dt style='text-align: center;'>暂无数据</dt></dl>";
        $.showIndicator();//loading
        //所有的任务集合
        var allrenwu={};
     //查询全部
      getrenwuList(1,1, pageIndex, pageSize);
      //刷新
      $("#renwushuaxin").click(function(){
              // 加载完毕需要重置
              getrenwuList(nowState,1);
              $.pullToRefreshDone('.renwu');
              $.toast('刷新成功！');
              console.log("刷新任务");
      });
      //进行中
      $(document).on('click', '#renwu_jxz', function () {
            initPage(3);
           $("#renwu_all").removeClass("active")
            $("#renwu_wks").removeClass("active")
            $("#renwu_jxz").addClass("active")
            $("#renwu_ywce").removeClass("active")
      });
     //未开始
       $(document).on('click','#renwu_wks', function () {
           initPage(2);
             $("#renwu_all").removeClass("active")
            $("#renwu_jxz").removeClass("active")
            $("#renwu_wks").addClass("active")
            $("#renwu_ywce").removeClass("active")
     });
     //已完成
       $(document).on('click','#renwu_ywce', function () {
            initPage(4);
            $("#renwu_all").removeClass("active")
            $("#renwu_jxz").removeClass("active")
            $("#renwu_wks").removeClass("active")
            $("#renwu_ywce").addClass("active")
     });
      //全部
       $(document).on('click','#renwu_all', function () {
            initPage(1);
            $("#renwu_ywce").removeClass("active");
            $("#renwu_jxz").removeClass("active");
            $("#renwu_wks").removeClass("active");
            $("#renwu_all").addClass("active");
     });
     //任务名称筛选
        $('#search').keypress(function (e) { //这里给function一个事件参数命名为e，叫event也行，随意的，e就是IE窗口发生的事件。
            var key = e.which; //e.which是按键的值
            if (key == 13) {
                initPage(1);//筛选全部
                $("#renwu_ywce").removeClass("active");
                $("#renwu_jxz").removeClass("active");
                $("#renwu_wks").removeClass("active");
                $("#renwu_all").addClass("active");
            }
        });

     //下拉刷新处理(重新查询绑定)
  FreshRW(nowState, pageIndex, pageSize);
  /*********************************初始化分页查询**************************************/
  function initPage(state){
       $.showIndicator();//loading
      nowState=state;
      pageIndex=1;
      pageSize=10;
      getrenwuList(state,1, pageIndex, pageSize);
  }
   /*********************************分页查询**************************************/
   $(document).on('click','#stageLoadMore', function () {
        $.showIndicator();//loading
        pageIndex=parseInt($("#stagePageIndex").html())+1;
        getrenwuList(nowState,2, pageIndex, pageSize);
   });

};

//**********************************************************************
//打开任务详情界面触发
//**********************************************************************
$(document).on("pageInit", "#renwu_info", function (e, id, $page) {

    sysoUserInfo = getUserInfo(); //用户信息
    var arrangeId = QueryString("arrangeId")//任务id
    var completeStr = "";
    //获取单个任务的已完成课程、试卷、的id
    getAjax(javaserver + "/stage/findOneProgress", { arrangeId: arrangeId, userId: sysoUserInfo.user_ID }, function (data) {
        data = strToJson(data);
        if (data.errorcode == 0 && data.data != null) {
            var block = "";
            completeStr = data.data.json_details;
        }
    });
    //获取单个任务对象
    getAjax(javaserver + "/stage/findArrangeById", { arrangeId: arrangeId }, function (data) {
        data = strToJson(data);

         if(isWeiXin()){
            $("title").html(data.data.name);
        }else{
            if(data.data.name.length>12){
                $(".title").html(data.data.name.substr(0,12)+"...");
            }else{
                $(".title").html(data.data.name);
            }
        }
        if (data.errorcode == 0 && data.data != null) {
            var block = "";
            data.data.arragetype = strToJson(data.data.arragetype);
            //遍历阶段
            for (var i = 0; i < data.data.arragetype.length; i++) {
                block = "  <div class='content-block-title'>第" + data.data.arragetype[i].key + "阶段</div><div class='list' id='index_" + i + "'>正在读取中</div>";
                $("#content_xq").append(block);
                findInArrange(data.data.arragetype[i], i);
            }
            if(isWeiXin){
                $("#content_xq").find(".content-block-title").css("margin","0.75rem .75rem .5rem !important");
            }
        }
    });

    //遍历arrangeType  json 获取json
    //取出json里的课程ids  试卷ids  文件ids  知识架构ids进行查询
    //item  任务的单个阶段的json
    //返回html代码
    function findInArrange(item, xx) {
        $.showIndicator(); //loading
        var courseids = "";
        var paperids = "";
        var upids = "";
        var knowledgeids ="";
        var userid = sysoUserInfo.user_ID;
        //遍历课程获取id
        for (var i = 0; i < item.kscList.length; i++) {
            courseids += item.kscList[i].course_Id + ",";
        }
        //遍历试卷
        for (var i = 0; i < item.kseList.length; i++) {
            paperids += item.kseList[i].paperId + ",";
        }
        //遍历文件
        for (var i = 0; i < item.ksfList.length; i++) {
            upids += item.ksfList[i].upId + ",";
        }
        var knowledgeBlock="";
        //遍历知识架构
        for (var i = 0; i < item.kssList.length; i++) {
            //knowledgeids += item.kssList[i].knowledge_Id + ",";
            //需要判断该知识架构是否包含课程、试卷、题库
            //如果有题库，直接算1个快
             var objknow={};
             var knowId="";
             var type="";
             //有题库
            if(item.kssList[i].know_select_que!=undefined&&item.kssList[i].know_select_que){
                //把知识架构放入对象  前端拼接
                 if (completeStr != null && completeStr != "" && (completeStr.indexOf(item.kssList[i].knowledge_Id) != -1 || completeStr == item.kssList[i].knowledge_Id)) {
                    knowledgeBlock += "<a href='#' onClick='openTi(" + JSON.stringify(item.kssList[i]) + ")'><div class='card color-default'><div class='shuqian-down'><span class='shuqian end'></span><span class='shuqiantext'>已完成</span></div><div style='' valign='bottom' class='card-header color-white no-border no-padding'><img class='card-cover' src='../../images/train/quenull.png' alt='' onerror='javascript:this.src=\"../../images/train/quenull.png\"'></div><div class='card-content'><div class='card-content-inner'><p>" + item.kssList[i].knowledge_Name + "</p></div></div><div class='card-footer'><span class='link'><i class='iconfont icon-shenhetongguo' style='color:#339966'></i> 题库练习</span><span class='link'><i class='iconfont icon-listtable'></i> </span></div></div></a>";
                }else{
                    knowledgeBlock += "<a href='#' onClick='openTi(" + JSON.stringify(item.kssList[i]) + ")'><div class='card color-default'><div style='' valign='bottom' class='card-header color-white no-border no-padding'><img class='card-cover' src='../../images/train/quenull.png' alt='' onerror='javascript:this.src=\"../../images/train/quenull.png\"'></div><div class='card-content'><div class='card-content-inner'><p>" + item.kssList[i].knowledge_Name + "</p></div></div><div class='card-footer'><span class='link'><i class='iconfont icon-shenhetongguo' style='color:#339966'></i> 题库练习</span><span class='link'><i class='iconfont icon-listtable'></i> </span></div></div></a>";
                }
            }

            //有课程1
            if(item.kssList[i].know_select_course!=undefined&&item.kssList[i].know_select_course){
                type="1";
                knowId=item.kssList[i].knowledge_Id;
            }
             //有试卷2
            if(item.kssList[i].know_select_exam!=undefined&&item.kssList[i].know_select_exam){
                type+=type.length>0?",2":"2";
                knowId=item.kssList[i].knowledge_Id;
            }
            //如果有课程  和  试卷
            if(type.length>0&&knowId.length>0){
                objknow={knowledgeId:knowId,type:type};
                knowledgeids+=knowledgeids.length>0?",":""+JSON.stringify(objknow);
            }

        }
        $("#index_" + xx).html(knowledgeBlock);
        var block = "";
        if(knowledgeids!=null||knowledgeids.length>0||courseids||paperids||upids){
            //请求获取对象
            getAjax(javaserver + "/stage/findArrangeStage", { courseids: courseids, paperids: paperids, upids: upids, knowledgeids: knowledgeids }, function (data) {
                data = strToJson(data);
                if (data.errorcode == 0 && data.datas.length > 0) {

                    //遍历阶段
                    for (var i = 0; i < data.datas.length; i++) {
                        //课程 href='"+javaserver+"/resources/template/"+data.datas[i].courseId+".html?arrangeId="+arrangeId+"'
                        if (data.datas[i].style == 1) {
                            //data.datas[i].detailedJSON = data.datas[i].detailedJSON;
                            //data.datas[i].detailedJSON = base64encode(data.datas[i].detailedJSON);
                            data.datas[i].detailedJSON  = jisuEncode(data.datas[i].detailedJSON);
                            var courimgMid = data.datas[i].courseImg;
                            if(courimgMid.indexOf("http://") >= 0){
                              courimgMid = "../.." + courimgMid;
                            }
                            if (completeStr != null && completeStr != "" && (completeStr.indexOf(data.datas[i].courseId) != -1 || completeStr == data.datas[i].courseId)) {
                                block += "<a href='#' onClick='openKe(" + JSON.stringify(data.datas[i]) + ",\"" + arrangeId + "\")'><div class='card color-default'><div class='shuqian-down'><span class='shuqian end'></span><span class='shuqiantext'>已完成</span></div><div style='' valign='bottom' class='card-header color-white no-border no-padding'><img class='card-cover' src='" + courimgMid + "' alt='' onerror='javascript:this.src=\"../../res/img/fengmian001.gif\"' height=200></div><div class='card-content'><div class='card-content-inner'><p>" + data.datas[i].courseName + "</p></div></div><div class='card-footer'><span class='link'><i class='iconfont icon-shenhetongguo' style='color:#339966'></i> 课程</span><span class='link'><i class='iconfont icon-listtable'>" + data.datas[i].courseSum + "章</i> </span></div></div></a>";
                            } else {
                                block += "<a href='#' onClick='openKe(" + JSON.stringify(data.datas[i]) + ",\"" + arrangeId + "\")'><div class='card color-default'><div style='' valign='bottom' class='card-header color-white no-border no-padding'><img class='card-cover' src='" + courimgMid + "' alt='' onerror='javascript:this.src=\"../../res/img/fengmian001.gif\"' height=200></div><div class='card-content'><div class='card-content-inner'><p>" + data.datas[i].courseName + "</p></div></div><div class='card-footer'><span class='link'><i class='iconfont icon-shenhetongguo' style='color:#339966'></i> 课程</span><span class='link'><i class='iconfont icon-listtable'>" + data.datas[i].courseSum + "章</i> </span></div></div></a>";
                            }
                            //试卷
                        } else if (data.datas[i].style == 2) {
                            if (completeStr != null && completeStr != "" && (completeStr.indexOf(data.datas[i].paperId) != -1 || completeStr == data.datas[i].paperId)) {
                                block += "<a href='#' onClick='openSj(" + JSON.stringify(data.datas[i]) + ",\"" + arrangeId + "\")'><div class='card color-default'><div class='shuqian-down'><span class='shuqian end'></span><span class='shuqiantext'>已完成</span></div><div style='' valign='bottom' class='card-header color-white no-border no-padding'><img class='card-cover' src='../../res/img/examnull.png'  alt='' ></div><div class='card-content'><div class='card-content-inner'><p>" + data.datas[i].paperName + "</p></div></div><div class='card-footer' style='display:none;'><span class='link'><i class='iconfont icon-shenhetongguo' style='color:#339966'></i> 已学</span><span class='link'><i class='iconfont icon-listtable'></i> </span></div></div></a>";
                            } else {
                                block += "<a href='#' onClick='openSj(" + JSON.stringify(data.datas[i]) + ",\"" + arrangeId + "\")'><div class='card color-default'><div style='' valign='bottom' class='card-header color-white no-border no-padding'><img class='card-cover' src='../../res/img/examnull.png'  alt='' ></div><div class='card-content'><div class='card-content-inner'><p>" + data.datas[i].paperName + "</p></div></div><div class='card-footer' style='display:none;'><span class='link'><i class='iconfont icon-shenhetongguo' style='color:#339966'></i> 已学</span><span class='link'><i class='iconfont icon-listtable'></i> </span></div></div></a>";
                            }
                            //文件(*预留)
                        } else {
                            block += "<a href='../html/peixun/detail.html'><div class='card color-default'><div style='' valign='bottom' class='card-header color-white no-border no-padding'><img class='card-cover' src='" + data.datas[i].filecover + "'  alt='' onerror='javascript:this.src=\"../../res/img/filenull.png\"'></div><div class='card-content'><div class='card-content-inner'><p>" + data.datas[i].fileName + "</p></div></div><div class='card-footer'><span class='link'><i class='iconfont icon-shenhetongguo' style='color:#339966'></i> 文件</span><span class='link'><i class='iconfont icon-listtable'></i> </span></div></div></a>";

                        }
                    }

                }
                $("#index_" + xx).append(block);
            });
            $.hideIndicator();
        }else {
              if((!knowledgeBlock&&!block)){
                $("#index_" + xx).html("暂无数据");
              }
        }
    }


});
 //后退
    function renwu_info_black(){
        $.showIndicator(); //loading
        $.router.back("/app/home.html#renwu");
        $(".title").html("任务");
    }
     //后退
    function renwu_detail_black(){
        $.showIndicator(); //loading
        $.router.back("/app/peixun/info.html?arrangeId="+QueryString("arrangeId"));
        //关闭播放器
        try{bPlayer.close();}catch(e){}
        //$(".title").html("任务");
    }
    //打开试卷
function openSj(data,arrangeId) {
    sysUserInfo=getUserInfo();

    //历史试卷
    if(arrangeId==99||arrangeId=="99"){
        //随机卷
        if(data.exampaper.paper_Random == "0"){
            window.location.href =javafile+"/resources/exam/"+data.paperId+","+data.randomCount+"/"+((data.randomNum==undefined)?1:data.randomNum)+".html"+"?userid="+sysUserInfo.user_ID+"&id=99&scoreId="+data.scoreId+"&token="+strToJson(GetlocalStorage("userinfo_token"));
       //固定卷
        }else{
            window.location.href =javafile+data.exampaper.url+"?userid="+sysUserInfo.user_ID+"&id=99&scoreId="+data.scoreId+"&token="+strToJson(GetlocalStorage("userinfo_token"));
        }
    //打开试卷
    }else{
        //随机卷
        if(data.paper_Random == "0"){
             data.url =  getPaperUrl(data.url,data.paperCount)
             window.location.href =javafile+data.url+"&userid="+sysUserInfo.user_ID+"&arrangeId="+arrangeId+"&token="+strToJson(GetlocalStorage("userinfo_token"));
         }else{
            window.location.href =javafile+data.url+"?random=0&userid="+sysUserInfo.user_ID+"&arrangeId="+arrangeId+"&token="+strToJson(GetlocalStorage("userinfo_token"));
         }

    }

}
//打开题库
function openTi(obj){
    //$.toast("暂未开放");
    var arrangeId=QueryString("arrangeId");
    //window.location.href =domain+"/member/index.html#/home/stuquelist/"+obj.knowledge_Id+"/"+arrangeId+"&arrangeId="+arrangeId+"&passtype="+obj.know_select_que_type+"&pass="+obj.know_select_que_num+"&typeId=0&knowledgeName="+obj.knowledge_Name;
    //:xid/:knowledgeId/:passtype/:pass/:typeId/:knowledgeName/:arrangeId/:userId
    sysoUserInfo = getUserInfo();
    console.log(domain+"/member/index.html#/home/stuquelist/"+arrangeId+"/"+obj.knowledge_Id+"/"+obj.know_select_que_type+"/"+obj.know_select_que_num+"/0/"+obj.knowledge_Name+"/"+arrangeId+"/"+obj.knowledge_Id+"/"+obj.knowledge_Name+"/0/"+sysoUserInfo.user_ID+"/0/phone?a=" + sysoUserInfo.user_ID);
    window.location.href =domain+"/member/index.html#/home/stuquelist/"+arrangeId+"/"+obj.knowledge_Id+"/"+obj.know_select_que_type+"/"+obj.know_select_que_num+"/0/"+obj.knowledge_Name+"/"+arrangeId+"/"+obj.knowledge_Id+"/"+obj.knowledge_Name+"/0/"+sysoUserInfo.user_ID+"/0/phone";

    //$.router.loadPage(domain+"/member/index.html#/home/stuquelist/"+arrangeId+"/"+obj.knowledge_Id+"/"+obj.know_select_que_type+"/"+obj.know_select_que_num+"/0/"+obj.knowledge_Name+"/"+arrangeId+"/"+obj.knowledge_Id+"/"+obj.knowledge_Name+"/0/"+sysoUserInfo.user_ID+"/0/phone?a=" + sysoUserInfo.user_ID);
}
//获得随机卷的地址
function getPaperUrl(paperUrl,coun){
        var paperReadNum;
        var paperUrlList = paperUrl.split("/");
        var paperNum = paperUrlList[paperUrlList.length-1].split(".")[0];
        if(paperNum != undefined && paperNum != null && paperNum != "" ){
            paperNum;
            paperReadNum = parseInt(Math.random() * coun);
            paperUrlList[paperUrlList.length-1] = (paperReadNum == 0)? "1.html": paperReadNum+".html";
            paperUrl = paperUrlList.join("/");
        }
        return paperUrl+"?random="+((paperReadNum== 0)?1:paperReadNum);
    }
// 编码
function jisuEncode(txt){
    return base64encode(encodeURI(txt));
}
// 解码
function jisuDecode(txt){
    return decodeURI(base64decode(txt));
}
//**********************************************************************
//打开课程播放界面
//基础功能
//目前还有细节未优化，包括：
//1、当一个课程学习完成后，自动系一个章节
//2、视频暂停，计时器自动停止
//**********************************************************************
var csm = {};//播放记忆存储容器
csm.list=[];
var Tstate = 1; // 计时器，0暂停，1正常
var pedding=false;
var newStudyDetailsJson={timeStart:"",timeEnd:"",cousreid:"",csid:"",sectionName:"",courseType:"",dateLearn:""};
$(document).on("pageInit", "#renwu_detail", function(e, id, $page) {
    newStudyDetailsJson={timeStart:"",timeEnd:"",cousreid:"",csid:"",sectionName:"",courseType:"",dateLearn:""};
    newStudyDetailsJson.timeStart=new Date().format("yyyy-MM-dd hh:mm:ss");
    newStudyDetailsJson.dateLearn=newStudyDetailsJson.timeStart;
    playerHeight = $("#kecheng_play_mian_top_play").height();
    //浏览器刷新
    window.onbeforeunload =function(){
        tongbu("aaa",true);
        console.log("刷新了");
        setTimeout(function() {
            return true;
        }, 2000);
    }

    //判断是否收藏  修改样式
    function collectionStatusJudge(id){
        if(id!=null&&id!=undefined&&id!=""){
            $("#collectionbutton").css("color","#39f");
            $("#collectionbutton span").html("已收藏");
        }else{
            $("#collectionbutton").css("color","#000");
            $("#collectionbutton span").html("收藏");
        }
    }
	//后腿事件
    $(window).on('popstate', function () {
          if(!pedding){
                pedding=true;
                tongbu("aaa");
          }
          if(CKobject&&CKobject.getObjectById('ckplayer_a1'))
          CKobject.getObjectById('ckplayer_a1').videoPause();
          try{
            bPlayer.close();
          }catch(e){}
     });
    csm = {};//播放记忆存储容器
    csm.list=[];
   // $.showPreloader();//显示Loading
    var PlayCourse = GetlocalStorage("PlayCourse"); //获得课程对象
    //如果从微信跳转，只有课程id
    //需要从新获取课程信息
    if((PlayCourse==""||PlayCourse==null||PlayCourse==undefined||PlayCourse.courseId!=QueryString("courseId"))&&QueryString("courseId")){
         openKe_collection(QueryString("courseId"),"微信学课");
         PlayCourse=sysUserInfo;
         SetlocalStorage("PlayCourse",JSON.stringify(PlayCourse));
    }
    //*****************************
    //1、绑定界面中显示的内容
    //*****************************
    csm.key = PlayCourse.courseId;
    var courseCollectionsId ="";
    //是否收藏课程
    getAjax(javaserver+"/course/findCourseProperties",{
			courseId : PlayCourse.courseId,
            arrangeId:QueryString("arrangeId"),
			userId : getUserInfo().user_ID
		},function(data) {
			var courseInfoJson = data.data;
			if(courseInfoJson != undefined){
				courseCollectionsId = courseInfoJson.collections_id;
				// 判断是否有收藏该课程
				collectionStatusJudge(courseCollectionsId);
			}
		},"","json");
    $("#collectionbutton").click(function() {
					getAjax(javaserver+"/course/modifyCollectionCourse",{
						userId : getUserInfo().user_ID,
                        arrangeId:QueryString("arrangeId"),
						collectionsId : courseCollectionsId,
						courseId : PlayCourse.courseId,
						courseName:PlayCourse.courseName
					},function(data){
						var collectionsJson = data;
						if(collectionsJson.data == undefined){  //取消收藏
							courseCollectionsId = undefined;
						}else
						{
							courseCollectionsId = collectionsJson.data.id;
						}
						collectionStatusJudge(courseCollectionsId);
					},"","json");
	})

    //课程名称
    var coursename=PlayCourse.courseName.replace(/<\/?[^>]*>/g,'');

     if(isWeiXin()){
            $("title").html(coursename);
     }
    $("#cname").text(coursename.length>15?coursename.substring(0,12)+"...":coursename)

    $("#lecturer").text(PlayCourse.lecturer);
    if(PlayCourse.style== 1){
        PlayCourse.detailedJSON = jisuDecode(PlayCourse.detailedJSON);
    }
    var detailedJSON = JSON.parse(PlayCourse.detailedJSON);//课程章节目录
    var zjhtml = "";//章节转HTML
    for (var i =0; i< detailedJSON.length ; i++) {
        zjhtml +="<div class=\"content-block-title\">"+detailedJSON[i].chapter+"</div>";
        var kelist = detailedJSON[i].content;//课程章节目录
        zjhtml += "<div class=\"list-block\"><ul>";
        if(kelist.length >0){
            for (var j = 0; j<kelist.length; j++) {
               var csobj = kelist[j];
               if(csobj.CSTYPE == 8){
                    csobj.fileTxt = jisuEncode(csobj.fileTxt);
                    csobj.CSTITLE = jisuEncode(csobj.CSTITLE);
               }
               //拼接下载按钮
               var xiazaihtml = "";
               if(csobj.stypename == "视频"){
                  var chapterobj = csobj.chapterJson;
                  console.log(chapterobj);
                  if(chapterobj.fileType != "m3u8"){
                    xiazaihtml = "<i class=\"iconfont icon-xiazai\" style=\"font-size:18px;\" onclick=\"downfile({url: '"+chapterobj.filepreview+"',savePath: 'cacheDir://"+csobj.CSFILEID + "/" + chapterobj.fileName +"',iconPath:'"+chapterobj.filecover+"',cache: true,allowResume: true,title: '"+csobj.CSNAME+"',networkTypes: 'all'})\"> </i>";
                  }
               }
               zjhtml+= "<li class=\"item-content\" id='kecheng_"+csobj.CSID+"' onClick='bofang("+JSON.stringify(csobj)+")'><div class=\"item-inner\"><div class=\"item-title\" style=\"min-width:75%;\">"+csobj.CSNAME.replace(/<\/?[^>]*>/g,'')+"</div>";
               if(csobj.CSTYPE == "1" ||csobj.CSTYPE == 1 || csobj.CSTYPE == "2" || csobj.CSTYPE == 2)
               {
                 zjhtml += "<div style=\"font-size:0.5rem;\"><span id='kecheng_"+ csobj.CSID +"_learnTime'>0</span>/<span id='kecheng_"+ csobj.CSID +"_cstime'>"+  csobj.CSTIME+":00</span> </div>";
               }
               zjhtml += "<div class=\"item-after\"></div></div>"+xiazaihtml+"</li>";
            }
        }
        else{
            zjhtml +="暂未设置课程";
        }
        zjhtml += "</ul></div>";
    }
    $("#kechengmingxi").html(zjhtml);
    if(PlayCourse.courseDetailed ==""){
        PlayCourse.courseDetailed = "<center>暂未填写课程简介</center>";
    }
    $("#courseDetailed").html(PlayCourse.courseDetailed);

    if(!QueryString("courseId")){
        $("#gongsi").html(getUserInfo().organization_Name);
    }
    //*****************************
    //2、读取课程记忆
    //*****************************
    if(!QueryString("courseId")){
                        getAjax(javaserver+"/course/findCourseStudyRecord",
       {
          courseId : PlayCourse.courseId,
          userId : getUserInfo().user_ID,
          arrangeId:QueryString("arrangeId")
        },
            function(data) {
                var dataobj =  eval( '(' + data + ')' );

                if (dataobj.errorcode != "0") {
                    $.toast('播放记忆读取异常！');
                    return;
                }
                var studyDetailsJson = dataobj.data;//确定是否有学习记录
                if (studyDetailsJson == undefined) {
                   studyDetailsJson = {};
                }

                if(studyDetailsJson.hasOwnProperty("id")) //有ID，说明有记录，无ID创建一个ID，已被下次记录
                {
                    jiluid = studyDetailsJson.id;
                }
                else{
                    jiluid = (((1+Math.random())*0x10000)|0).toString(16) + (((1+Math.random())*0x10000)|0).toString(16);//随机产生个10位字符串
                }


                var studyJsonDetailsJson = eval( '(' + studyDetailsJson.json_details + ')' );//解析记忆内容

               // 读取本地缓存，替换原来的
               // var localmemary=GetlocalStorage("C_"+PlayCourse.courseId);
                //判断日期

               // if(localmemary!=null&&localmemary!=""&&localmemary!=undefined){
                     // if(new Date(studyDetailsJson.date_time)<new Date(localmemary.datetime)||studyJsonDetailsJson==null||studyJsonDetailsJson==undefined||studyJsonDetailsJson==""){
                        // studyJsonDetailsJson=localmemary;
                        // studyDetailsJson.json_details=localmemary;
                    // }
                // }
                //console.log(studyJsonDetailsJson);//这里才是真正有用的东西
                if (studyJsonDetailsJson != null) {
                    // 异步读取书签正常
                    if (studyDetailsJson != undefined && studyDetailsJson != null
                                        && studyDetailsJson.json_details != ""
                                        && studyDetailsJson.json_details != "null") {
                        //console.log("读取学习记录");
                        csm = studyJsonDetailsJson;
                        //进入，如果已学习提交进度（防止不同任务同一课程不提交进度）
                        //isConfirmTongbu("aaa");
                        //console.log("已同步学习时间");
                    }
                    for (var i = 0; i < studyJsonDetailsJson.list.length; i++) { //遍历记录修改状态图标
                        // 学过的小节编号
                        var sectionId = studyJsonDetailsJson.list[i].pid;
                        // 是否完成该小节
                        var sectionLearnState = studyJsonDetailsJson.list[i].pstate;
                        // 小节学习了多长时间
                        var sectionTime_m = parseInt(studyJsonDetailsJson.list[i].learnTime/60);
                        var sectionTime_s = studyJsonDetailsJson.list[i].learnTime%60 <10 ? "0"+studyJsonDetailsJson.list[i].learnTime%60 : studyJsonDetailsJson.list[i].learnTime%60;
                        $("#kecheng_"+ sectionId +"_learnTime").html(sectionTime_m+":"+sectionTime_s);
                        if (sectionLearnState == "1") { //状态为1代表学习完成
                           $("#kecheng_"+sectionId).find(".item-after").html("<i class=\"iconfont icon-shenhetongguo\" title=\"已学完\" style=\"color:#339966\"></i>");
                        }
                        else //有学习记录，但没完成，改为学习中
                        {
                            $("#kecheng_"+sectionId).find(".item-after").html("<i class=\"iconfont icon-icon27\" title=\"学习中\" style=\"color:#39f\"></i>");
                        }
                    }
                }

                 //$.hidePreloader();//隐藏Loading
                //*****************************
                //3、正是开始播放课程内容
                //*****************************
                var isPaper=false;
                if (csm.playpid) {
                  //下拉刷新处理(重新查询绑定)
                   for (var i = 0; i < csm.list.length; i++) {
                        //有播放的小节id有对应的学习记录，小节是试卷，已完成
                        if(csm.playpid==csm.list[i].pid&&csm.list[i].ptype==3&&csm.list[i].pstate==1){
                            isPaper=true;
                            break;

                        }
                   }
                   //当前小结是试卷，并且试卷已完成
                   if(!isPaper){
				        if($("#kecheng_" + csm.playpid)){
					        $("#kecheng_" + csm.playpid).click();
					        $("#kecheng_" + csm.playpid).click();
				        }else{
					        $("#kechengmingxi .item-content").eq(0).click();
                            $("#kechengmingxi .item-content").eq(0).click();
				        }
                   }
                } else { // 发现记忆的课程小节不存在的时候，跳到第一小节
                    // 找不到播放记忆，默认播放第一个
                    if ($("#kechengmingxi .item-content").length > 0) {
                        $("#kechengmingxi .item-content").eq(0).click();
                        $("#kechengmingxi .item-content").eq(0).click();

                    } else {
                        $.toast('课程还未增加内容哦！');
                    }
                }
        });
        }else{
                     // 没有记忆，默认播放第一个
                    if ($("#kechengmingxi .item-content").length > 0) {
                        $("#kechengmingxi .item-content").eq(0).click();
                        $("#kechengmingxi .item-content").eq(0).click();

                    } else {
                        $.toast('课程还未增加内容哦！');
                    }
        }

});
//播放不同清晰度的视频
function switchVideo(okayUrl,title){

    //关闭层
    $.closeModal('.popover-qingxidu');
   //判断清晰度
   $(".qingxidu").text(title);//清晰度

   //视频播放
   $("#kecheng_play_mian_top_play").show();
   $("#playText").hide();
   $("#kechengContent").css("top","12rem");
   mainplayer("kecheng_play_mian_top_play", 634, okayUrl);

}
//开始播放记忆课程
function bofang(xiaojie) {
     //停止上一个课程的计时器
    //if(jisuJSQ != null){
     //       clearInterval(jisuJSQ);
    //        jisuJSQ = null;
   // }
  $(".qingxidu").hide();
    //更新播放记录（本地）
    csm.playpid = xiaojie.CSID;

   // console.log(xiaojie);
    var sectionUrl = "";//文件地址
    // 判断非ckt 的文件
    if(xiaojie.hasOwnProperty("CSFILEID")&&(xiaojie.CSTYPE==1||xiaojie.CSTYPE=='1')&&xiaojie.CSURLNAME.substr(xiaojie.CSURLNAME.lastIndexOf('.')).indexOf('.html')==-1){ //有多版本的情况下
       // console.log("xxxxxxxxxx");
        //获取清晰度
        getAjax(javaserver+"/course/findDefinition", {
               upid:xiaojie.CSFILEID
        }, function(data) {

          $(".qingxidu").show();
            var jsonlist = JSON.parse(data);

            if(jsonlist.errorcode == "0"){

                    //console.log(jsonlist.datas);
                    var BDvideoList = new Array();
                    var QNvideoList = new Array();
                    var ServerVideoList = new Array();
                    $.each(jsonlist.datas,function(i,item)
                    {
                        var videoType = item.Name.split('_')[0];  //获取视频的清晰度  LG 蓝关  GQ 高清 CQ 超清  BQ 标清
                        if(item.Name.indexOf('enc') > 0){  //名称中含有encryption，视频则为加密视频
                            console.log(item.Name+"因版权原因,本视频仅对APP或PC端进行播放！");
                            return true;
                        }
                        var videoYuan = item.Yuan;
                        var videodesc = 1;  //默认标清
                        var videoQXD = "标清(420P)";  //默认标清
                        if (videoType == "LG") {
                              videodesc = 4;
                              videoQXD = "蓝光";
                              videosite = "LG";
                          } else if (videoType == "GQ") {
                              videodesc = 2;
                              videoQXD = "高清(720P)";
                              videosite = "GQ";
                          } else if (videoType == "CQ") {
                              videodesc = 3;
                              videoQXD = "超高清(1080P)";
                              videosite = "CQ";
                          } else if(videoType == "BQ"){
                              videodesc = 1;
                              videoQXD = "标清";
                              videosite = "BQ";
                          } else{
                              videodesc = 5;
                              videoQXD = "原清";
                              videosite = "BQ";
                        }
                        if (videoYuan == "1") { //百度云
                              BDvideoList.push({
                                  file: item.filepreview,
                                  desc: videodesc,
                                  qxd: videoQXD,
                                  site: videosite
                              });
                          } else if (videoYuan == "2") { //七牛云
                              QNvideoList.push({
                                  file: item.filepreview,
                                  desc: videodesc,
                                  qxd: videoQXD,
                                  site: videosite
                              });
                          } else {  //本地服务器
                              ServerVideoList.push({
                                  file: item.filepreview,
                                  desc: videodesc,
                                  qxd: videoQXD,
                                  site: videosite
                              });
                          }
                    });
                    for (var i = 0; i < BDvideoList.length; i++)
                    {
                        for (var j = i; j < BDvideoList.length-1; j++)
                        {
                            if (BDvideoList[i].desc > BDvideoList[j].desc)
                            {
                                var temp = BDvideoList[i];
                                BDvideoList[i] = BDvideoList[j];
                                BDvideoList[j] = temp;
                            }
                        }
                    }
                    for (var i = 0; i < QNvideoList.length; i++)
                    {
                        for (var j = i; j < QNvideoList.length-1; j++)
                        {
                            if (QNvideoList[i].desc > QNvideoList[j].desc)
                            {
                                var temp = QNvideoList[i];
                                QNvideoList[i] = QNvideoList[j];
                                QNvideoList[j] = temp;
                            }
                        }
                    }
                    for (var i = 0; i < ServerVideoList.length; i++)
                    {
                        for (var j = i; j < ServerVideoList.length-1; j++)
                        {
                            if (ServerVideoList[i].desc > ServerVideoList[j].desc)
                            {
                                var temp = ServerVideoList[i];
                                ServerVideoList[i] = ServerVideoList[j];
                                ServerVideoList[j] = temp;
                            }
                        }
                    }
                    var videoHtml = "";
                    if(BDvideoList != null && BDvideoList.length>0){
                        videoHtml += "<li><a class='list-button item-link' style=\"border-bottom: 1px #ddd solid; cursor: default;color:#999\">百度云</a></li>";
                        $.each(BDvideoList, function(i, item){
                            videoHtml += "<li class=\"" + item.site + "\" data=\""+item.file+"\" ><a href='#' class='list-button item-link'  onclick='switchVideo(\""+item.file+"\",\""+item.qxd+"\")'>"+item.qxd+"</a></li>";
                        });
                    }
                    if(QNvideoList != null && QNvideoList.length>0){
                        videoHtml += "<li><a class='list-button item-link' style=\"border-bottom: 1px #ddd solid; cursor: default;color:#999\">七牛云</a></li>";
                        $.each(QNvideoList, function(i, item){
                            videoHtml += "<li class=\"" + item.site + "\" data=\""+item.file+"\" ><a class='list-button item-link' href='#' onclick='switchVideo(\""+item.file+"\",\""+item.qxd+"\")'>"+item.qxd+"</a></li>";
                        });
                    }

                    if(ServerVideoList != null && ServerVideoList.length>0){
                        videoHtml += "<li><a class='list-button item-link' style=\"border-bottom: 1px #ddd solid; cursor: default;color:#999\">本地</a></li>";
                        $.each(ServerVideoList, function(i, item){
                            videoHtml += "<li class=\"" + item.site + "\" data=\""+item.file+"\" ><a class='list-button item-link' href='#' onclick='switchVideo(\""+item.file+"\",\""+item.qxd+"\")'>"+item.qxd+"</a></li>";
                        });
                    }

                    if(videoHtml != ""){
                        $(".videotypelist").html(videoHtml);



                        var okayUrl ="";
                        var qxd ="";
                        //寻找多版本视频中，默认播放的地址（优先级与PC端有所区别）
                        if($(".videotypelist li[class='BQ']").eq(0).length > 0){
                              okayUrl = $(".videotypelist li[class='BQ']").eq(0).attr("data");
                              qxd =  $(".videotypelist li[class='BQ']").eq(0).text();
                        }else if($(".videotypelist li[class='GQ']").eq(0).length > 0){
                              okayUrl = $(".videotypelist li[class='GQ']").eq(0).attr("data");
                             qxd =  $(".videotypelist li[class='BQ']").eq(0).text();
                        }else if($(".videotypelist li[class='CQ']").eq(0).length > 0){
                              okayUrl = $(".videotypelist li[class='CQ']").eq(0).attr("data");
                             qxd =  $(".videotypelist li[class='BQ']").eq(0).text();
                        }else if($(".videotypelist li[class='LG']").eq(0).length > 0){
                              okayUrl = $(".videotypelist li[class='LG']").eq(0).attr("data");
                              qxd =  $(".videotypelist li[class='BQ']").eq(0).text();
                        }else if($(".videotypelist li[class='bendi']").eq(0).length > 0){
                              okayUrl = $(".videotypelist li[class='bendi']").eq(0).attr("data");
                              qxd =  $(".videotypelist li[class='BQ']").eq(0).text();
                        }
                        else
                        {
                            qxd ="临时";
                            //文件转化中或转化出错了！(先播放转化前的版本)
                            okayUrl = jsonlist.datas[0].URL;

                        }

                        switchVideo(okayUrl,qxd);
                        //console.log("xxx"+okayUrl);

                    }else{

                         $.toast('无法解析到课程播放视频！');
                        $(".qingxidu").removeClass("qingxidu");
                    }
                }else{
                     $.toast('课程视频解析错误！');
                    $(".qingxidu").removeClass("qingxidu");
                }
        });

        // 清除计时器
        clearInterval(jisuJSQ);
        jisuJSQ = null;
        jsqkq = false;

        // 防止暂停时值被更新
        setTimeout(function() { Tstate = 1;},500);
        //判断是否需要播放计时，如果需要启动计时器
        learningJSQ(xiaojie);


        //修改播放课程图标显示
        $("#kechengmingxi .item-content").removeClass("active");
        $("#kecheng_"+xiaojie.CSID).addClass("active");

      return;
    }
    else{ //v1.0录入的数据
        sectionUrl = xiaojie.CSURL;//文件地址
    }

    var CSTIME = xiaojie.CSTIME;//要求学习时间

    // 根据小节判断接下来的动作
    switch (xiaojie.CSTYPE) {
    case '1':
    case 1:
        // 视频类型
        $("#kecheng_play_mian_top_play").show();
        $("#playText").hide();
        $("#kechengContent").css("top","12rem");
        mainplayer("kecheng_play_mian_top_play", 634, sectionUrl);
        break;
    case '2':
    case 2:
        // 文档类型
        $("#kechengContent").css("top", "1.7rem");
        $("#kecheng_play_mian_top_play").hide();
        $("#playText").show();
        if(CKobject&&CKobject.getObjectById('ckplayer_a1')){
			CKobject.getObjectById('ckplayer_a1').videoPause();
		}
        mainplayer("playText", 634, sectionUrl);
        break;
    case '3':
    case 3:
        // 考试类型
        $("#kecheng_play_mian_top_play").show();
        $("#playText").hide();
        $("#kechengContent").css("top","12rem");
        $("#kecheng_play_mian_top_play").html("<div class='shanguang'><img src='/app/framework/img/logo_fff.png' alt='加载中...'><div class='baiguang'></div></div>");
        playSectionalExamination(xiaojie);

        break;
    case '4':
    case 4:
        $("#kecheng_play_mian_top_play").hide();
        $("#playText").show();
        $("#kechengContent").css("top","1.7rem");
        if(CKobject.getObjectById('ckplayer_a1')){
			CKobject.getObjectById('ckplayer_a1').videoPause();
			//mainplayer("playText", 634, sectionUrl);
		}
        // 线下授课类型
        playTeachingOffline("playText", xiaojie);
        break;
    case '8':
    case 8:
        $("#kecheng_play_mian_top_play").hide();
        $("#playText").show();
        // 图文类型
        $("#kechengContent").css("top", "1.7rem");
        if(CKobject.getObjectById('ckplayer_a1')){
			CKobject.getObjectById('ckplayer_a1').videoPause();
			//mainplayer("playText", 634, sectionUrl);
		}
        xiaojie.fileTxt = jisuDecode(xiaojie.fileTxt);
        xiaojie.CSTITLE = jisuDecode(xiaojie.CSTITLE);
        playImageText("playText", xiaojie);
        break;
    default:
        $("#kecheng_play_mian_top_play").show();
        $("#playText").hide();
        $("#kechengContent").css("top","12rem");
        $("#kecheng_play_mian_top_play").html("<div class='shanguang'><img src='/app/framework/img/logo_fff.png' alt='加载中...'><div class='baiguang'></div></div>");
       $.toast("此课程暂未开放");
        break;
    }

    // 清除计时器
    clearInterval(jisuJSQ);
    jisuJSQ = null;
    jsqkq = false;
    //CKobject.getObjectById('ckplayer_a1').videoPause();
    // 防止暂停时值被更新
    setTimeout(function() {	Tstate = 1;},500);
    //判断是否需要播放计时，如果需要启动计时器
    learningJSQ(xiaojie);


    //修改播放课程图标显示
    $("#kechengmingxi .item-content").removeClass("active");
    $("#kecheng_"+xiaojie.CSID).addClass("active");

}
//考试功能
var playSectionalExamination = function(courseDetailedJson) {
    if(!QueryString("courseId")){
    var userid=getUserInfo().user_ID;
    var playid=courseDetailedJson.CSID;
    $.confirm("本章节为在线考试，是否确认打开试卷？", function () {
         tongbu("aaa");
        if (courseDetailedJson.CRANDIM == 0) {
            var num = Math.floor(Math.random() * courseDetailedJson.CSPCOUNT + 1);
            window.location = javafile+"/resources/exam/" + courseDetailedJson.CSPID + "," + courseDetailedJson.CSPCOUNT + "/" + num + ".html?cid=" + csm.key + "&playid="+playid+"&userid="+userid+"&arrangeId=" + QueryString("arrangeId")+"&token="+strToJson(GetlocalStorage("userinfo_token"));
        } else {
            window.location = javafile+"/resources/exam/" + courseDetailedJson.CSPID
                    + "/" + courseDetailedJson.CSPID + ".html?cid="
                    + csm.key + "&playid="+playid+"&userid="+userid+"&arrangeId=" + QueryString("arrangeId")+"&token="+strToJson(GetlocalStorage("userinfo_token"));
        }
    });
    }else{
        goLogin();
    }
}
//跳转登录页
function goLogin(){
    $("#kecheng_play_mian_top_play").show();
    $("#playText").hide();
    $("#kechengContent").css("top","12rem");
    $("#kecheng_play_mian_top_play").html("<div class='shanguang'><img src='../res/img/logo_fff.png' alt='加载中...'><div class='baiguang'></div></div>");
    $.confirm("查看该小节需要用户登录，是否前往登录？", function () {
        //需要记录当前地址
        $.router.back("/app/login.html");
    });
}
// 线下授课
this.playTeachingOffline = function(divid,courseDetailedJson) {
    //是否只拿到地址进入
    if(!QueryString("courseId")){
        //放入对象中
        var xxobj={pid:courseDetailedJson.CSID,ptype:4,pstate:1};


        var days = null;
        var nowDate = new Date();
        if (courseDetailedJson.CSSTIME == undefined || courseDetailedJson.CSSTIME =="")
            days = "999";
        else {

            var datereplace=startTime = courseDetailedJson.CSSTIME.replace(/\-/g, "/");
            console.log(datereplace);
            var startDate = new Date(datereplace);

            var nowDateTime = nowDate.getTime();
            var startDateTime = startDate.getTime();

            // 计算相差天数
            if (nowDateTime >= startDateTime)
                days = 0;
            else
                days = -(Math.floor((nowDateTime - startDateTime)
                        / (24 * 3600 * 1000)));


        }

        // 线下授课
        // html 内容
        var enrolHtml = "<div class='content-padded'>"
                + "         <h2>"+courseDetailedJson.CSNAME+"</h2>"
                + "                 <ul>"
                + "                     <li><i class='iconfont icon-dizhi'></i> 报名地址："
                + courseDetailedJson.CSURL
                + "</li>"
                + "                     <li><i class='iconfont icon-44'></i> 报名人数：<span class='enrol_prople_num' id=\"enrol_prople_num\">0</span> / "
                + (courseDetailedJson.CSPNUM == null ? "无限制"
                        : courseDetailedJson.CSPNUM)
                + "</li>"
                + "                     <li><i class='iconfont icon-riqi2'></i> 截止时间："
                + (courseDetailedJson.CSSTIME == undefined ? "无限制"
                        : courseDetailedJson.CSSTIME)
                + "</li>"
                + "                     <li><i class='iconfont icon-jilu'></i> 课程简介：</li>"
                + "                     <li class='enrol_content_li_indent'>"
                + "                         <span>"
                + (courseDetailedJson.hasOwnProperty("CSDESCRIBE") ? courseDetailedJson.CSDESCRIBE
                        : "该线下授课课程暂时没有课程简介")
                + "</span></li>"
                + "                 </ul>"
                + "             <div class='enrol_course_info_btn'>"
                + "                 <div class='enrol_course_info_btn_content'>"
                + "                     <div class='enrol_course_info_btn_content_header'>距离开始时间<span class='enrol_course_info_overplus_day'><span class='enrol_course_info_overplus_day_num'>"
                + days
                + "</span>"
                + (courseDetailedJson.CSSTIME == undefined ? "" : "天")
                + "</span></div>"
                + "                 <div class='enrol_course_info_btn_bottom'><button disabled='disabled' id='enrol_course_info_bottom_button' class='enrol_course_info_btn_bottom_closed' type='button'></button></div>"
                + "             </div>";


        $("#"+divid).html(enrolHtml);
        // 查看当前用户是否报名小节

            getAjax(javaserver+"/courseSectionEnrol/findSectionEnrolStatus", { //查询报名记录
                sectionId : courseDetailedJson.CSID,
                userId : getUserInfo().user_ID
            }, function(json) {
                //console.log(json)
                // 成功
                var enrolJson = JSON.parse(json);
                // 判断后台是否出现异常
                if (enrolJson.errorcode != "0") {
                    $.toast("获得报名信息")
                    return;
                }
                if (days <= 0) {
                    // 截止
                    return;
                }
                var enrolButtonTag = $(".enrol_course_info_btn_bottom_noenrol,.enrol_course_info_btn_bottom_closed");
                // 报名过了
                if (enrolJson.datas.length > 0) {
                    enrolButtonTag
                            .removeClass("enrol_course_info_btn_bottom_noenrol enrol_course_info_btn_bottom_closed")
                            .addClass("enrol_course_info_btn_bottom_info");
                    return;
                }
                enrolButtonTag.removeClass("enrol_course_info_btn_bottom_closed")
                        .addClass("enrol_course_info_btn_bottom_noenrol").removeAttr(
                                "disabled");
                // 监听按钮的 click 事件
                enrolButtonTag.click(
                      function() {
                        if(courseDetailedJson.CSSTIME != undefined){
                            var nowDateTime = nowDate.getTime();
                            // 防止用户在点击报名时
                            // 客户端时间(刚进页面时相同,但是在页面挂机挂了好几天，已经过了截止日期什么的)和本地时间不相同
                            if (nowDateTime >= startDateTime) {
                                $("#enrol_course_info_bottom_button").removeClass(
                                "enrol_course_info_btn_bottom_noenrol").addClass(
                                        "enrol_course_info_btn_bottom_closed");
                                showAlert("info", "alert", "课程播放提示", "已过报名时间!", 200);
                                return;
                            }
                        }

                        // 进行报名小节(section)
                        getAjax(javaserver+"/courseSectionEnrol/enrolSection", {
                            userInfoJson : JSON.stringify(getUserInfo()),
                            courseId : csm.key,
                            sectionId : courseDetailedJson.CSID,
						    //线下结束时间
						    //用于向消息提醒表添加数据
						    //展示于学员段未来七天结束的任务或线下
						    endDate:courseDetailedJson.CSSTIME,
						    address:courseDetailedJson.CSURL//线下报名地址
                        }, function(data) {
                            var json = JSON.parse(data);
                            // 报名完毕后
                            // alert(json.errorcode + ":" + json.errormsg);
                           // 小节 id
                            var svgTag = $("svg[class$='" + courseDetailedJson.pid
                                    + "']")
                            svgTag.parent().removeClass("svg-icon-jyx")
                                    .addClass("svg-icon-ywc");
                            svgTag.children("use").attr("xlink:href",
                                    "#icon-chenggong1");
                            $("#enrol_prople_num").html(
                                    parseInt($("#enrol_prople_num").html()) + 1);
                            $("#enrol_course_info_bottom_button").removeClass(
                            "enrol_course_info_btn_bottom_noenrol").addClass(
                            "enrol_course_info_btn_bottom_info");
                        })
                    })
            })

        // 获取报名人数
        getAjax(javaserver+"/courseSectionEnrol/findSectionEnrolPeopleNum", {
            sectionId : courseDetailedJson.CSID
        }, function(json) {
            var enrolJson = JSON.parse(json);
            // 判断后台是否出现异常
            if (enrolJson.errorcode != "0") {
                $.toast("获得报名信息");
                return;
            }
            $("#enrol_prople_num").html(enrolJson.data);
            //已达到最大人数
            if(courseDetailedJson.CSPNUM!=null&&courseDetailedJson.CSPNUM<=enrolJson.data){
                $("#enrol_course_info_bottom_button").attr("disabled","disabled");
                 $("#enrol_course_info_bottom_button").removeClass(
                            "enrol_course_info_btn_bottom_noenrol").addClass(
                            "enrol_course_info_btn_bottom_closed");
            }
        });

        //检查是否已存在
        var isHavexx=false;
         for (var i = csm.list.length - 1; i >= 0; i--) {
               if(courseDetailedJson.CSID==csm.list[i].pid){
                    isHavexx=true;
               }
         }
         //已存在就不需要再提交了
        if(!isHavexx){
             csm.list.push(xxobj);
             courseDetailedJson.pstate = 1; // 修改当前小节的完成状态
             //更新数据
             xuewan(courseDetailedJson);
        }
    }else{

        goLogin();
    }
}


// 图文类型
this.playImageText = function(divid,courseDetailedJson) {
    var enrolHtml = "<div class='content-padded'>"
            + "<h2>"
            + courseDetailedJson.CSNAME + "</h2>"
            + courseDetailedJson.fileTxt + "</div>";

    $("#"+divid).html(enrolHtml);
    //检查是否已存在
    var isHavetw=false;
     for (var i = csm.list.length - 1; i >= 0; i--) {
           if(courseDetailedJson.CSID==csm.list[i].pid){
                isHavetw=true;
           }
     }
     //已存在就不需要再提交了
    if(!isHavetw){
          var twobj={pid:courseDetailedJson.CSID,ptype:8,pstate:1};
          csm.list.push(twobj);
           xuewan(courseDetailedJson);//点完就学完
   }
}
//小节学完，更新数据
this.xuewan = function(courseDetailedJson){
//     //更新本地数据
//    for (var i = csm.list.length - 1; i >= 0; i--) {
//         if(csm.list[i].pid == courseDetailedJson.CSID)//找到这个记录
//         {
//            csm.list.splice(i,1);//清除原有记录

//            csm.list[i].push(courseDetailedJson);//更新新数据

//            break;//找到合适的了，就要跳出循环，性能！
//          }
//    }
    //更新服务器信息
     isConfirmTongbu();
    //更新界面样式
     $("#kecheng_"+courseDetailedJson.CSID).find(".item-after").html("<i class=\"iconfont icon-shenhetongguo\" title=\"已学完\" style=\"color:#339966\"></i>");
}
//计时器，分析课程是否需要计时，如果需要进行统计
function learningJSQ(xiaojie){
    //只有在指定要求学习时间不为0，并且学习时间未满时启动计时器
    //console.log(xiaojie);
    if(xiaojie.hasOwnProperty("CSTIME"))//需要计时才有这个属性
    {

        //获得课程记录，判断是否已经学完
        var newjilu = 0;
        if(csm.hasOwnProperty("list")){
            for (var i = csm.list.length - 1; i >= 0; i--) {
                if(csm.list[i].pid == xiaojie.CSID)//找到这个记录
                {

                    //csm.list[i].learnTime 学习时间
                    //csm.list[i].pstate 1为完成
                    if(csm.list[i].pstate != 1){
                        csm.list[i].cstime = xiaojie.CSTIME;//为了解决如果课程要求学习变化这种情况
                        //启动计时器开始计时
                        jishiqi(csm.list[i]);
                    }
                    else{
                        console.log("本课程已经达到指定学时，不进行计时业务");
                    }
                    newjilu = 1;//找到了
                    break;//找到合适的了，就要跳出循环，性能！
                }
            }
        }
        else{
            csm.list=[];
        }

        //如果没有找到学习记录，则创建新纪录
        if(newjilu == 0)
        {
            var newcms = {};
            newcms.pid = xiaojie.CSID; //记录小节DI
            newcms.ptype = xiaojie.CSTYPE;//课程类型
            newcms.cstime = xiaojie.CSTIME;//要求学习时间
            newcms.playTime = 0; //视频播放时长
            newcms.learnTime = 0; //已经学习时长
            newcms.pstate = 0; //完成状态
            csm.list.push(newcms);
            jishiqi(newcms);
        }


    }
    //学够制定的学时后，更新学习记录，同步记录到服务器
    //tongbu();
}
var jisuJSQ = null,//声明个计时器容器
jsqkq = false;//是否开启计时
function jishiqi(jilu){
    var jsdw = 1;//计时器执行间隔时间，单位（秒）
    //console.log("计时器走秒："+jilu.learnTime);
    //console.log(new Date().getSeconds());//测试执行情况
    jilu.learnTime = jilu.learnTime+jsdw;//叠加学时
    var m = parseInt(jilu.learnTime/60); // 分钟
    var s = jilu.learnTime%60 <10 ? "0"+jilu.learnTime%60 : jilu.learnTime%60;
    if(parseInt(jilu.learnTime) >= parseInt(jilu.cstime)*60)//已经达标，更新完成状态
    {
        jilu.pstate = 1;
        $("#kecheng_"+ jilu.pid +"_learnTime").html(jilu.cstime); // 更新页面时间
        $("#kecheng_"+jilu.pid).find(".item-after").html("<i class=\"iconfont icon-shenhetongguo\" title=\"已学完\" style=\"color:#339966\"></i>");
    }else{
        $("#kecheng_"+ jilu.pid +"_learnTime").html(m+":"+s); // 更新页面时间
    }
    //更新总体学习记录
    for (var i = csm.list.length - 1; i >= 0; i--) {
            if(csm.list[i].pid == jilu.pid)//找到这个记录
            {
                csm.list.splice(i,1);//清除原有记录

                csm.list.push(jilu);//更新新数据

                break;//找到合适的了，就要跳出循环，性能！
            }
    }

    if(parseInt(jilu.learnTime) >= parseInt(jilu.cstime)*60)//已经达标，学完了
    {
        console.log("课程已完成");
        if(jsqkq == true){
            clearInterval(jisuJSQ);
            jisuJSQ = null;
            jsqkq = false;
        }
         isConfirmTongbu("aaa");//学完了同步下数据
    }
    else{
        if(jsqkq == false){
            //alert("axc");
            jsqkq = true;
            jisuJSQ = setInterval(function () { if(Tstate == 1)jishiqi(jilu)},jsdw*1000);
        }
    }
}
//将学习记录与服务器同步
var jiluid = "";
function tongbu(msg,istongbu){
   // console.log("xxx");
   //从微信过来会有courseId
       //将数据同步到服务器
      // {timeStart:"",timeEnd:"",cousreid:"",csid:"",sectionName:"",courseType:"",dateLearn:""};
      var newjson="";
      if(newStudyDetailsJson!=null&&newStudyDetailsJson!=""){
           newStudyDetailsJson.timeEnd=new Date().format("yyyy-MM-dd hh:mm:ss");//结束时间
            newStudyDetailsJson.cousreid=csm.key;//课程id
            newStudyDetailsJson.csid=csm.playpid;//播放的小节id
            newStudyDetailsJson.sectionName=$("#kecheng_"+csm.playpid+" .item-title").html();//播放小节的名称

            for(var i=0;i<csm.list.length;i++){
                if(csm.list[i].pid==csm.playpid){
                    newStudyDetailsJson.courseType=csm.list[i].ptype;//播放小节的类型
                    if(csm.list[i].ptype!=1&&csm.list[i].ptype!="1"&&csm.list[i].ptype!="2"&&csm.list[i].ptype!=2){
                        newStudyDetailsJson=null;
                    }
                    break;
                }
            }

            if(newStudyDetailsJson!=null&&(newStudyDetailsJson.courseType==1||newStudyDetailsJson.courseType=="1"||newStudyDetailsJson.courseType==2||newStudyDetailsJson.courseType=="2")){
                newjson="["+JSON.stringify(newStudyDetailsJson)+"]"
            }
        }
       var canshu ={
            jsonDetails : JSON.stringify(csm),//课程学习记录
            studyDetailsId : jiluid,//存档ID
            courseId : csm.key,//课程ID
            dateTime:"[]",//暂无用处
            arrangeId : QueryString("arrangeId"),//培训任务ID
            orgId : getUserInfo().organization_ID,//组织架构ID
            newStudyDetailsJson :newjson ,//学习时段
            userId :  getUserInfo().user_ID //学习人员ID
        };
       //console.log(canshu);
       getAjax(javaserver+
        "/coursedetailed/Uploadprogress",
        canshu,
        function(data){
            if (data != "") {
              //  jiluid = data;//返回值为记录ID
            }
            if(msg==undefined)
             $.toast("学习记录同步成功！");
             //localStorage.removeItem("C_"+csm.key);
        },'','','',istongbu);


}
function isConfirmTongbu(msg){
     if(!QueryString("courseId")){
            if(msg==undefined){
                 tongbu();
            }else{
                tongbu(msg);
            }

     }
}
// 内容加载器
var mainplayer = function(Cantent, Height, mima) {
    // / <summary>
    // / 总内容加载器，可装载各类内容
    // / </summary>
    // 设置外框架
    $("#" + Cantent).height("10rem");
    // 设置课程列表
    $("#kechengContent").css("top","12rem");
    this.AddHtml = function(Cantent, Height, mima) {
        // / <summary>
        // / 静态类内容
        // / </summary>
        $("#" + Cantent).html("");
        $("#" + Cantent).append(
                "<iframe class=\"embed-responsive-item\" style=\"height:16rem\" src='" + mima
                        + "'></iframe>");
        // 设置外框架
        $("#" + Cantent).height("16rem");
        // 设置课程列表
        $("#kechengContent").css("top","18.2rem");
        try{
          bPlayer.close();
        }catch(e){}
    }
    this.AddVideo = function(Cantent, Height, mima) {
        // / <summary>
        // / 增加视频组件
        // / </summary>
        //videoplayer.play(Cantent, Height, mima);
        BaiDuPlayer.play(Cantent, Height, mima);
    }
    this.ADDflash = function(Cantent, Height, mima) {
        // / <summary>
        // / 增加FLASH组件
        // / </summary>
        $("#" + Cantent).html("<div id='a1'></div>");
        var params = {
            bgcolor : '#000',
            allowFullScreen : true,
            allowScriptAccess : 'always',
            wmode : 'opaque'
        };
        var flashvars = {};
        var attributes = {
            id : 'game_ring',
            name : 'game_ring'
        };
        swfobject.embedSWF(mima, "a1", "100%", Height, "10.2.0",
                "expressInstall.swf", flashvars, params, attributes);//这个swf是flash安装包
                try{
                  bPlayer.close();
                }catch(e){}
    }
    this.AddSanFang = function(Cantent, Height, mima) {
        // / <summary>
        // / 暂时不支持的后缀名格式，提供下载
        // / </summary>
         $("#" + Cantent)
         .html(
         "<div class=\"jumbotron\"><center><a class=\"btn btn-info btn-lg\" href=\""
         + mima + "\" target=\"_blank\" role=\"button\"><i class=\"glyphicon glyphicon-download\"></i> 点击下载</a></center></div>");
         try{
           bPlayer.close();
         }catch(e){}
    }
    this.AddOffice = function(Cantent, Height, mima) {
       // 设置外框架
        $("#" + Cantent).height("auto");
        // 设置课程列表
        $("#kechengContent").css("top","2.2rem");
        // / <summary>
        // / 增加文档播放组件
        // / </summary>
         $("#" + Cantent).html("<iframe class=\"embed-responsive-item\" src='"
         +  "/app/framework/pdf2/officeshow/web/viewer.html?file=" +
          base64encode(encodeURI(mima)) + "'></iframe>");
          try{
            bPlayer.close();
          }catch(e){}
    }

    var houzhui = mima.substring(mima.lastIndexOf(".") + 1).toLowerCase(); // 获得主视频后缀名(转小写)
    if (houzhui.indexOf("?") >= 0) {
        houzhui = mima.substring(mima.lastIndexOf(".") + 1, mima
                .lastIndexOf("?"));
    }
    if (houzhui == "htm" || houzhui == "html" || houzhui == "shtml") {
        // 静态类内容
        AddHtml(Cantent, Height, mima);
    } else if (houzhui == "flv" || houzhui == "mp4" || houzhui == "f4v"
            || houzhui == "m3u8" || houzhui == "webm" || houzhui == "ogg") {
        // 网络视频类内容
        AddVideo(Cantent, Height, mima);
    } else if (houzhui == "pdf") {
        AddOffice(Cantent, Height, mima);
    } else if (houzhui == "doc" || houzhui == "docx" || houzhui == "xls"
            || houzhui == "xlsx" || houzhui == "ppt" || houzhui == "pptx") {
        $.toast("文档格式需要转成PDF格式");

        return false;
    } else if (houzhui == "swf") {
        // flash动画或播放器格式
        ADDflash(Cantent, Height, mima);
    } else if (houzhui == "jpg" || houzhui == "png" || houzhui == "gif") {
        $("#" + Cantent)
                .append(
                        "<img src=\""
                                + mima
                                + "\" class=\"img-responsive\" alt=\"Responsive image\">");
    } else {
        // 其他乱七八糟视频格式
        AddSanFang(Cantent, Height, mima);
        return false;
    }
}

//封装百度播放器
var BaiDuPlayer = new function(){
try{
  //播放

  this.play = function (Cantent, Height, mima){
    bPlayer = api.require('bPlayer');  //实例化百度播放器
    var systemType = api.systemType;
    if(systemType == 'ios'){
      bPlayer.open({
            rect: {
                x: 0,
                y: 38,
                w: winapi.winWidth,
                h: playerHeight,
            },
            path: mima.replace('\\', '/'),
            autoPlay: true
        }, function(ret, err) {
            if (ret) {
              bPlayer.full();
            }
      });
      bPlayer.addEventListener({name : ['all','click', 'playbackState']}, function(ret) {
        console.log(JSON.stringify(ret) + "||" + Tstate );
        if(JSON.stringify(ret) == "click"){
            if(Tstate == 1){ //当前正在播放
               BaiDuPlayer.BDpause();
               $.toast('已暂停播放，点击播放');
             }else {
               BaiDuPlayer.BDplay();
             }
           }
        });
    }else {
    bPlayer.open({
          rect: {
              x: 0,
              y: 38,
              w: 0,
              h: 0,
          },
          path: '',//mima.replace('\\', '/'),
          autoPlay: true
      }, function(ret, err) {
          if (ret) {

            //引入成功之后又重新对播放器的位置进行重定位，因为不知道为啥上面那个定位不起作用，所以没办法。。。
            bPlayer.setRect({
                      rect:{
                      x: 0,
                      y: 38,
                      w: winapi.winWidth,
                      h: playerHeight,
                            },
                });
                /*****添加播放器的监听事件********/
                bPlayer.addEventListener({name : ['all','click','playbackState']}, function(ret) {
                  var EventType = eval(ret);
                  console.log(EventType.eventType);
                  if(EventType.eventType == "click"){
                    if(Tstate == 1){ //当前正在播放
                       bPlayer.pause();
                       Tstate = 0;
                       $.toast('已暂停播放，点击播放');
                     }else {
                       bPlayer.play();
                       Tstate = 1;
                     }
                   }
                   //快进
                   if(EventType.eventType ==  "swipeRight"){
                    BaiDuPlayer.BDforward();
                   }
                   //快退
                   if(EventType.eventType ==  "swipeLeft"){
                    BaiDuPlayer.BDrewind();
                   }
                   //减小音量
                   if(EventType.eventType ==  "rightDown"){

                   }
                   // 增加音量
                   if(EventType.eventType ==  "rightUp"){

                   }
                   // 增加亮度
                   if(EventType.eventType ==  "leftUp"){
                     var brightness = api.require('brightness2016');
                     brightness.getBrightness(function(ret) {
                       brightness.setBrightness({ brightness: eval(ret).brightness + 20 });
                    });

                   }
                   // 降低亮度
                   if(EventType.eventType ==  "leftDown"){
                     var brightness = api.require('brightness2016');
                     brightness.getBrightness(function(ret) {
                        brightness.setBrightness({ brightness: eval(ret).brightness - 20 });
                    });
                   }
                   //播放完成
                   if(EventType.eventType == "complete"){
                      BaiDuPlayer.BDPlayEnded();
                   }
                  });
          }
    });
    bPlayer.stop();
    bPlayer.reset();
    setTimeout(function () {
      bPlayer.replay({
                 path : mima.replace("\\", "/"),
                 autoPlay : true,
        },function(ret) {
            if (ret) {
            }
      });
    }, 3000);
    }
}
  this.BDPlayEnded() = function(){
    mainplayerStop();
  }
  //用于暂停后的播放或者是非自动播放，点击播放事件
  this.BDplay = function  () {
    bPlayer.play();
    Tstate = 1;
  }
  //暂停
  this.BDpause = function(){
    bPlayer.pause();
    Tstate = 0;
  }
  //关闭播放器
  this.BDremove = function(){
    try {
      bPlayer.pause();
      bPlayer.close();
    } catch (e) {

    } finally {
      console.log("移除播放器");
    }
  }
  //快速定位播放位置
  this.BDtimego = function(times) {
    bPlayer.seek({
         currentPlaybackTime : times
    });
  }
  //设置播放器的播放速率：取值范围：[0.0, 4.0]，默认：1.0
  this.BDsetplayRate = function (typeRate) {
    bPlayer.playbackRate({
         playbackRate : typeRate
    });
  }
  //快进  默认：2秒
  this.BDforward = function () {
    bPlayer.forward({
       seconds : 6.0
    });
  }
  //快退  默认：2秒
  this.BDrewind = function () {
    bPlayer.rewind({
      seconds : 6.0
   });
  }
  //设置水印
  this.BDsetWatermark = function () {
    bPlayer.setWatermark({
         origin : {
               x : 10,
              y : 10
           },
         path : 'widget://res/tab-01.png'
    });
  }
}catch(e){}
}


// 封装一个flash+HTML5播放器
var videoplayer = new function() {

    // / <summary>
    // / 播放器操作类（FLASH+HTML5）
    // / </summary>
    this.play = function(Cantent, Height, mima) {
        // / <summary>
        // / 播放方法
        // / </summary>
        // / <param>
        // / Cantent容器ID，Height显示高度，mima密文
        // / </param>
        $("#" + Cantent).html("<div id='a1'></div>");
        var params = {
            bgcolor : '#fff',
            allowFullScreen : true,
            allowScriptAccess : 'always',
            wmode : 'opaque'
        };
        var video = [ mima + '->video/mp4' ];
        var flashvars = {
            f : mima.replace('\\', '/'),
            c : 0,
            p : 1,
            b : 0,
            h : 3,
            my_url : encodeURIComponent(window.location.href),
            loaded : 'loadedHandler'
        }; // 还要增加其他参数
        // 本处预留课程脚本加载
        // 为flashvars补充k参数，n参数
        var curWwwPath = window.document.location.href;
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        var host = curWwwPath.substring(0, pos);
        var support=['iPad','iPhone','ios','android+false','msie10+false'];
        CKobject.embed('/resources/ckplayer/ckplayer.swf', 'a1', 'ckplayer_a1','100%', '100%', false, flashvars, video, params);

   }
    window.zantingdian = -1; // 上一次暂停点记录（防止重复暂停）
    window.loadedHandler = function() {

    CKobject.getObjectById('ckplayer_a1').videoPlay();
        // / <summary>
        // / 播放器加载完成监听
        // / </summary>
        Tstate = 1;
        if(CKobject.getObjectById('ckplayer_a1').getType()){    // html5
            // 播放与暂停监听
            CKobject.getObjectById('ckplayer_a1').addListener('play', Ckplay);
            CKobject.getObjectById('ckplayer_a1').addListener('pause', Ckpause);

            // 增加播放时间监听
            CKobject.getObjectById('ckplayer_a1').addListener('time', timego);

            // 增加播放完成的监听,延时是因为需要等播放器加载完成
            CKobject.getObjectById('ckplayer_a1').addListener('ended',
                    VideoPlayEndedHandler);
        }else{
                  // 播放与暂停监听
            CKobject.getObjectById('ckplayer_a1').addListener('play', 'Ckplay');
            CKobject.getObjectById('ckplayer_a1').addListener('pause', 'Ckpause');

            // 增加播放时间监听
            CKobject.getObjectById('ckplayer_a1').addListener('time', 'timego');

            // 增加播放完成的监听,延时是因为需要等播放器加载完成
            CKobject.getObjectById('ckplayer_a1').addListener('ended',
                    'VideoPlayEndedHandler');
        }

    }
    window.Ckplay = function() {
        // / <summary>
        // / 播放器开始播放触发
        // / </summary>
        Tstate = 1;
        // CKobject.getObjectById('ckplayer_a1').videoPlay();
    }
    window.Ckpause = function() {
        // / <summary>
        // / 播放器暂停时触发
        // / </summary>
        Tstate = 0;
        // CKobject.getObjectById('ckplayer_a1').videoPause();
    }
    window.timego = function(times) {
        // / <summary>
        // / 监听视频播放时间
        // / </summary>
        courseMemoryObj.playTime = times;

        // 时间脚本事件在这里运行
    }
    window.CkSeek = function(jytime) {
        try {
        } catch (e) {
        }

    }
    window.VideoPlayEndedHandler = function() {
        mainplayerStop();
    }

}
//播放时间监控
function ckplayer_status(str){
    //console.log(str);
}
//课程播放完成后触发
function mainplayerStop() {
    // body...
    $.alert("课程播放完成！");
}

//打开课程播放界面，将课程数据保存，已被下个界面使用
//xxxxxxxxxxxxxxxxxxxxxxxxxxxx
function openKe(stringjson,renwuid) {
    SetlocalStorage("PlayCourse", JSON.stringify(stringjson));
    $.router.loadPage("../html/peixun/detail.html?arrangeId="+renwuid);
}
//从收藏  打开课程播放界面
//需要获取  课程阶段 信息
function openKe_collection(courseId,type,renwuid) {

     //请求获取对象
        getAjax(javaserver + "/stage/findCourseInfoByCourseId", { courseId: courseId}, function (data) {
            data = strToJson(data);
            if (data.errorcode == 0 && data.data!=null) {
                if(type==undefined||type==null||type==""){
                    //打开课程
                     openKe(data.data,renwuid?renwuid:1);
                 }else{
                    sysUserInfo=data.data;
                 }
            } else {
                 $.toast("获取章节信息失败");
            }
        });
}

/*************************************/
//chapterList  单击事件
//展开章节列表
//为解决文档过长切换其他小节时操作不便
/*************************************/
//var isScrol=false;//变量，是否点击
function chapterZK() {
	var dqqh = $("#chapterList").offset().top; // 当前题目高度
    var winHeight=$(document.body).outerHeight(true);
    console.log("章节 距离 content 高度："+dqqh);
     console.log("浏览器总高度："+winHeight);
     console.log("允许最大高度："+winHeight*0.6);
    if(dqqh>=(winHeight*0.6)){
         $('#kechengContent').scrollTop(dqqh);
//         isScrol=true;
    }
//    else if(isScrol){
//        $('#kechengContent').scrollTop(dqqh);
//        isScrol=true;
//    }
}

//******************结束***********************//

//**********************************************************************
//打开文件列表是触发
//**********************************************************************
function ziliaoinit() {
    $.showIndicator();//loading
    $("#zhiliaoback").hide();
    var fid = 0;
    var fpath = "/"; // 文件父级路径 带自己名称的
    var fidorg=0;
    //分页
    var pageIndex=1;
    var pageIndexorg=1;
    var pageSize=20;
    var pageSizeorg=20;

    var pageCount=0;
    var pageCountorg = 0;

    //面包屑路径
    var path="";
    sysUserInfo=getUserInfo();
    getfilelist(0,'','','',2,pageSize,pageIndex,true);
    $.hideIndicator();//隐藏loading

   //文件名称筛选
        $('#searchFileName').keypress(function (e) { //这里给function一个事件参数命名为e，叫event也行，随意的，e就是IE窗口发生的事件。
            var key = e.which; //e.which是按键的值
            if (key == 13) {
                $.showIndicator();//loading
                pageSize=20;
                pageIndex=1;
                var fileName=$("#searchFileName").val();
                //如果在共享文件里
                if(intoOrg){
                    getorglist(2,"",fileName);
                }else{
                    getfilelist(0,3,"","desc",2,pageSize,pageIndex,false,fileName);
                }


            }
        });


    //多选框 选中事件
  $(document).on("click","#filelist input", function(){
        $("#SosoShow").hide();
         //如果选中个数为0，隐藏删除和重命名按钮
        var length = $("input[type='checkbox']:checked").length;
           //如果是选中状态
        if($(this).is(":checked")){
            $("#deleteblock").show();
        }else{
           if(length<=0){
                $("#deleteblock").hide();
            }
        }
        //多选隐藏重命名
        if(length==1){
            $("#renamefile").show();
          $(".col-50").css("width","46%");
        }else{
            $("#renamefile").hide();
            $(".col-50").css("width","100%");
        }

  });
  //删除的单击事件
  $(document).on("click", "#deletefile", function () {

      var delId = "";
      $($("input[type='checkbox']:checked")).each(function () {
          delId += this.value + ',';    //遍历被选中CheckBox元素的集合 得到Value值
      });
      console.log("删除的id:" + delId);
      $.confirm("确认删除文件？", function () {
          $.showIndicator(); //loading
          //删除文件请求
          getAjax(javaserver + "/Kapi/delfile",
                { userId: sysUserInfo.user_ID,
                    fileid: delId,
                    confirmdel: 1, //学员端删除关系
                    orgId: sysUserInfo.organization_ID
                }, function (data) {
                    data = strToJson(data);
                    if (data.errorcode == 0) {
                        $.toast('删除成功！');
                        $("#deleteblock").hide();
                        if (fid == 0 || fid == undefined || fid === "") {
                            getfilelist(fid, "", "", "", 2, pageSize, pageIndex, true);
                        } else {
                            getfilelist(fid, "", "", "", 2, pageSize, 1);
                        }
                        return true;
                    } else if (data.errorcode == 34) {
                        $.toast('有关联数据！');
                        $("#deleteblock").hide();
                    } else {
                        $.toast('请求错误！');
                        $("#deleteblock").hide();
                        return false;
                    }

                });
          $.hideIndicator();
      });
  });
    //重命名的单击事件
   $(document).on("click","#renamefile", function(){

        var fileId=$("input[type='checkbox']:checked").val();//修改的id
        var name=$("input[type='checkbox']:checked").prev().children().get(0).innerText;//原来的名称

        $.prompt('请输入文件的名字','', function (value) {
                     if(name!=value){
                             //文件重命名请求
                            getAjax(javaserver+"/Kapi/UpFileName",
                            {upUserId:sysUserInfo.user_ID,
                            fileName:value,
                            upId:fileId,
                            fid:fid,
                            upOrgId:sysUserInfo.organization_ID},function(data){
                             data=strToJson(data);
                              if (data.errorcode==0) {
                                  $.toast('修改成功！');
                                  $("#deleteblock").hide();
                                    if(fid==0||fid==undefined||fid===""){
                                            getfilelist(fid,"","","",2,pageSize,pageIndex,true);
                                   }else{
                                        getfilelist(fid,"","","",2,pageSize,1);
                                   }
                                   return true;
                               } else if (data.errorcode == 29) {
                                   $("#deleteblock").hide();
                                    $.toast('当前目录已存在此名称！');
                                    return false;
                              }else{
                                    $.toast('请求错误！');
                                    $("#deleteblock").hide();
                                    return true;
                              }

                              });
                        }
                    }, null, name);

   });
                var backId = "";
                var parentid = 0;
  //查询父级文件下的子文件
                $(document).on("click", "#filelist a", function () {
                    $("#deleteblock").hide(); //隐藏上边删除和重命名按钮
                    $.showIndicator(); //loading
                    pageIndex = 1;
                    pageSize = 20;
                    //      pageIndexorg=1;
                    //      pageSizeorg=20;
                    parentid = $(this).attr("data");
                    var type = $(this).attr("other");
                    fpath = $(this).attr("fpath");
                    fid = $(this).attr("fid"); //给全局变量fid赋值
                    if (type == "folder") {
                        //如果在企业文件夹下
                        if (intoOrg) {
                            getorglist(2, parentid); //查询企业共享文件夹下的文件
                            $(".ios-is-show").hide();
                            $("#zhiliaoadd").hide();//隐藏添加
                            // $(".title").html($(this).html()); //改变title的名字
                        } else {
                            getfilelist(parentid, "", "", "", 2, pageSize, pageIndex);
                            var filename=$(this).html();
                            if(filename.length>12){
                                filename=filename.substr(0,12)+"...";
                            }
                            $(".title").html(filename); //改变title的名字
                            if(browser.versions.ios){
                                $(".ios-is-show").show();
                            }else{
                                $("#zhiliaoadd").show();
                            }
                        }
                        $("#zhiliaoback").show(); //显示返回键
                        $("#zhiliaoshuaxin").hide();//文件夹内隐藏刷新按钮
                        $("#zhiliaoadd").addClass("pull-right").removeClass("pull-left");
                    }
                    $.hideIndicator();
                });
$(document).on("click", "#zhiliaoshuaxin", function () {
                console.log(intoOrg);
                     if(intoOrg){
                         if(fid=="main"){
                             getorglist(2,"");
                         }else{
                             getorglist(2,fid);
                         }
                     //普通查询
                     }else{
                       if(fid=="main")fid=0;
                       if(fid==0||fid==""||fid==undefined||fid=="0"){
                         getfilelist(fid,"","","",2,pageSize,1,true);
                       }else{
                         getfilelist(fid,"","","",2,pageSize,1);
                       }
                     }
                      $.toast('刷新成功！');
                       //$.pullToRefreshDone('.ziliao');
                });
  //返回上一级
                $(document).on("click", "#zhiliaoback", function () {
                    $("#deleteblock").hide();
                    $.showIndicator(); //loading
                    var pid = "";
                    //非企业文件夹返回
                    if (!intoOrg&&fid!="main") {
                        if (fid != 0 && fid != "0" && fid != null && fid != null && fid != undefined && fid != "share") {
                            getAjax(javaserver + "/Kapi/findfileById", { upId: fid }, function (data) {
                                $.hideIndicator();
                                data = strToJson(data);
                                fid = data.data.fid; //返回上级时 ，上级（父级）的父级id  ——再次返回用
                                pid = data.data.upId; //返回上级时，上级（父级）的id  ——根据父id  查询文件
                                if(data.data.fileName.length>12){
                                    $(".title").html(data.data.fileName.substr(0,12)+"...");
                                }else{
                                    $(".title").html(data.data.fileName);
                                }

                                 if (fid == "share" && intoOrg) {
                                    $(".title").html("共享文件");
                                    getorglist(2, ""); //查询企业共享文件夹下的文件
                                    fid = 0;
                                } else if (fid == "main" && !intoOrg) {
                                    intoOrg = false; //0层，保证绝对没有=在企业文件夹下
                                    getfilelist(pid, "", "", "", 2, pageSize, 1, true);
                                    $(".title").html("资料");
                                    $("#zhiliaoback").hide();
                                } else if (fid != "share" && fid != 0 && fid != "0" && fid != "main" && intoOrg) {
                                    getorglist(2, fid);
                                    fid = 0;
                                    $(".title").html("共享文件");
                                } else if ((fid == 0 || fid == "0") && intoOrg) {
                                    $(".title").html("共享文件");
                                    getorglist(2, ""); //查询企业共享文件夹下的文件
                                    fid = "main";
                                }  else {
                                    //如果是0层，需要显示出企业文件夹
                                    if (pid == 0 || pid == "0" || pid == undefined||pid=="") {
                                        $("#zhiliaoback").hide();
                                        intoOrg = false; //0层，保证绝对没有=在企业文件夹下
                                        getfilelist(pid, "", "", "", 2, pageSize, 1, true);
                                        $(".title").html("资料");
                                    } else {
                                        $("#zhiliaoback").show();
                                        $("#zhiliaoshuaxin").hide();//文件夹内隐藏刷新按钮
                                        $("#zhiliaoadd").addClass("pull-right").removeClass("pull-left");
                                        getfilelist(pid, "", "", "", 2, pageSize, 1);
                                    }
                                }

                               // $.hideIndicator();
                            });
                        }else if(fid==0||fid=="0"){
                             $("#zhiliaoback").hide();
                             intoOrg = false; //0层，保证绝对没有=在企业文件夹下
                             getfilelist(pid, "", "", "", 2, pageSize, 1, true);
                             $(".title").html("资料");
                        }
                    }else{
                         if (fid == "share" && intoOrg) {
                                    $(".title").html("共享文件");
                                    getorglist(2, ""); //查询企业共享文件夹下的文件
                                    fid = 0;
                                } else if (fid == "main" && intoOrg) {
                                    intoOrg = false; //0层，保证绝对没有=在企业文件夹下
                                    getfilelist(pid, "", "", "", 2, pageSize, 1, true);
                                    $(".title").html("资料");
                                    $("#zhiliaoback").hide();
                                } else if (fid != "share" && fid != 0 && fid != "0" && fid != "main" && intoOrg) {
                                    getorglist(2, fid);
                                    fid = 0;
                                    $(".title").html("共享文件");
                                } else if ((fid == 0 || fid == "0") && intoOrg) {
                                    $(".title").html("共享文件");
                                    getorglist(2, ""); //查询企业共享文件夹下的文件
                                    fid = "main";
                                }  else {
                                    //如果是0层，需要显示出企业文件夹
                                    if (pid == 0 || pid == "0" || pid == undefined||pid=="") {
                                        $("#zhiliaoback").hide();
                                        intoOrg = false; //0层，保证绝对没有=在企业文件夹下
                                        getfilelist(pid, "", "", "", 2, pageSize, 1, true);
                                        $(".title").html("资料");
                                    } else {
                                        $("#zhiliaoback").show();
                                        $("#zhiliaoshuaxin").hide();//文件夹内隐藏刷新按钮
                                        $("#zhiliaoadd").addClass("pull-right").removeClass("pull-left");
                                        getfilelist(pid, "", "", "", 2, pageSize, 1);
                                    }
                                }
                    }
                     //如果在企业文件夹下，隐藏创建按钮
                                if(intoOrg){
                                    if(browser.versions.ios){
                                        $(".ios-is-show").hide();
                                    }else{
                                        $("#zhiliaoadd").hide();
                                    }
                                }else{
                                    if(browser.versions.ios){
                                        $(".ios-is-show").show();
                                    }else{
                                        $("#zhiliaoadd").show();
                                    }
                                }
                   $.hideIndicator();
                });

//分页
$(document).on('click', '#loadMore', function () {
    pageIndex=parseInt( $("#filepage").html())+1;
    getfilelist(fid,"","","",1,pageSize,pageIndex);
})
// 生成uuid
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}
// 清除文件
function clearFile() {
    if (document.getElementById('fileIosId').outerHTML) {
        document.getElementById('fileIosId').outerHTML = document.getElementById('fileIosId').outerHTML;
    } else { // FF(包括3.5)
        document.getElementById('fileIosId').val = "";
    }
    document.getElementById('fileIosId').select();
}
// ios 上传
$(document).on('change','#fileIosId',function(){
    // 生成统一的文件id
    var file_id = guid();
    console.log("文件id"+file_id,"企业id"+ sysUserInfo.organization_ID,"用户id"+sysUserInfo.user_ID,"用户名称"+sysUserInfo.user_Name,"企业名称"+sysUserInfo.organization_Name,"staus:状态1","optype 1 2上传还是更新","state 2","fid"+fid,"fpath"+fpath);
    $.toast("开始文件上传请不要离开！");
    var file=document.getElementById('fileIosId').files[0];//获取文件流
    var fileName = file.name; //获取文件名
    console.log(file);
    if ((file.size / 1024 / 1024) > 30) {
        alert("请您上传30M，以内的文件");
        clearFile();
        return;
    }
    var fileParams = {
        upid:file_id,
        orgid:sysUserInfo.organization_ID,
        stattus:2,
        fid:fid,
        fpath:fpath,
        username:sysUserInfo.user_Name,
        orgname:sysUserInfo.organization_Name,
        userid:sysUserInfo.user_ID,
        optype:1,
        state:2
    }
    // 请求业务服务器存储配置文件
    var formData = new FormData();
	formData.append('upid', fileParams.upid);
	formData.append('orgid', fileParams.orgid);
    $.showIndicator();
    var xhr = new XMLHttpRequest();
    xhr.timeout = 10000;
    //http://192.168.1.148:8085/file/uploadCover
    xhr.open("POST", javaserver+"/Kapi/sendout");
    xhr.onload = function (e) {
        if (this.status == 200 || this.status == 304) {
            var resServer = strToJson(this.responseText);
            // 请求文件服务器
            if(resServer.errorcode == 0){
                var fdFile = new FormData();
                fdFile.append("file",document.getElementById('fileIosId').files[0]);
                fdFile.append("orgid",fileParams.orgid);
                fdFile.append("userid",fileParams.userid);
                fdFile.append("upid",fileParams.upid);
                fdFile.append("status",2);
                fdFile.append("fid",fileParams.fid);
                fdFile.append("fpath",fileParams.fpath);
                fdFile.append("username",fileParams.username);
                fdFile.append("orgname",fileParams.orgname);
                fdFile.append("optype",1)
                fdFile.append("state",2)
                 fileParams.file =  document.getElementById('fileIosId').files[0];
                $.ajax({
                    type: "post",
                      url: javafile+"/Md5File/fileUpload",
                      data: fdFile,
                      contentType:'application/x-www-form-urlencoded; charset=UTF-8',
                      cache: false,
                      processData: false,
                      contentType: false,
                      success: function (msg, status, xhr) {
                       console.log(strToJson(msg));
                        // 重新获取一下文件
                        if(fid == 0 || fid == "0"){
                            getfilelist(fid,"","","desc","",20,1,true,"");
                        }else{
                            getfilelist(fid,"","","desc","",20,1,false,"");
                        }

                        clearFile();
                      }});
            }

        }
    }
    xhr.send(formData);
})
//是否进入了企业文件夹
var intoOrg = false;
  //企业文件夹的单击事件
$(document).on('click', '#orgfile', function () {
    intoOrg = true;
    $(".title").html("共享文件");
    $('.ios-is-show').hide();
    $("#zhiliaoadd").hide();//隐藏添加
    $("#zhiliaoback").show();
    $("#zhiliaoshuaxin").hide();//文件夹内隐藏刷新按钮
    $("#zhiliaoadd").addClass("pull-right").removeClass("pull-left");
    fid = "main";
    getorglist(2, ""); //fid等于null，查询企业共享文件，不等于null，查询文件夹下的文件
});
  //企业文件的分页下拉
$(document).on('infinite', '#orgfile',function() {
    setTimeout(function() {
     pageIndexorg=pageIndexorg+1;
     //当前页小于总页数
     if(pageIndexorg<=pageCountorg){
            //触发向下滚动，查询新数据
           getorglist(2,"");
    }
    }, 1000);
  });
  function getorglist(optype,filefid,name){
   $.showIndicator();//loading
    //文件缺省图
    var wenjiannull="<dl style='height:100%;width:100%;position: absolute;margin-top: 25%;color:#cecece;'><dd style='text-align:center;margin:0'><img src='../res/img/knownull.png' style='width: 50%;'></dd><dt style='text-align: center;'>暂无数据</dt></dl>";
    //获取共享文件
    getAjax(javaserver + "/Kapi/getSharelist",
        { userid: sysUserInfo.user_ID,
            searchText:name,
            fid: filefid,
            orgid: sysUserInfo.organization_ID,
            xid: sysUserInfo.allorgid + sysUserInfo.allroleid + sysUserInfo.allgroupid + sysUserInfo.user_ID, //权限id
            pageSize: pageSizeorg,
            pageIndex: pageIndexorg
        }, function (data) {
            $.hideIndicator();
            data = strToJson(data);
            if (data.errorcode == 0 && data.datas != null&&data.datas.length>0) {
                var block = "";
                //遍历文件
                for (var i = 0; i < data.datas.length; i++) {
                    //查询子集
                    if (data.datas[i].fileType == "folder") {
                        if (fid == "main" ) {
                            block += "<li ><label class='label-checkbox item-content'><div class='item-media'><img src='../res/fileicon/" + data.datas[i].fileType + "_56.png'  onerror='javascript:this.src=\"../res/fileicon/qita_56.png\"'/></div><div class='item-inner'><div class='item-title'><a href='#' class='item-link' data=" + data.datas[i].upId + " other=" + data.datas[i].fileType + " fid=share>" + data.datas[i].fileName + "</a></div></div></label></li>";
                        } else {
                            block += "<li ><label class='label-checkbox item-content'><div class='item-media'><img src='../res/fileicon/" + data.datas[i].fileType + "_56.png'  onerror='javascript:this.src=\"../res/fileicon/qita_56.png\"'/></div><div class='item-inner'><div class='item-title'><a href='#' class='item-link' data=" + data.datas[i].upId + " other=" + data.datas[i].fileType + " fid=" + data.datas[i].fid  + ">" + data.datas[i].fileName + "</a></div></div></label></li>";
                        }

                        //预览
                    } else {
                        block += "<li ><label class='label-checkbox item-content'><div class='item-media' onclick='openfile(" + JSON.stringify(data.datas[i]) + ")'><img src='../res/fileicon/" + data.datas[i].fileType + "_56.png'  onerror='javascript:this.src=\"../res/fileicon/qita_56.png\"'/></div><div class='item-inner'><div class='item-title'><a onclick='openfile(" + JSON.stringify(data.datas[i]) + ")' class='item-link'>" + data.datas[i].fileName + "</a></div></div></label></li>";
                    }
                }
                if (optype == 1) {
                    $("#filelist").append(block);
                    //总页数
                    pageCountorg = data.pageCount;
                    //隐藏分页
                    if (pageCount <= pageIndex) {
                        $(".infinite-scroll-preloader").remove();
                    }
                } else {
                    $("#filelist").html(block);
                    //隐藏分页
                    if (data.numCount <= pageSize) {
                        $(".infinite-scroll-preloader").remove();
                    }
                }
                //没有共享文件
            } else if (data.errorcode == 32 || (data.errorcode == 0 && data.datas.length <= 0)) {
                $("#filelist").html(wenjiannull);
                $(".infinite-scroll-preloader").remove();
            }
        });
  }
  //排序
  $(document).on('click','#wenjian_paixu', function () {
      var buttons1 = [
        {
          text: '按文件名升序',
          onClick: function() {
          if(fid==0||fid==undefined||fid==""){
                getfilelist(fid,1,"","",2,pageSize,pageIndex,true);
          }else{
                getfilelist(fid,1,"","",2,pageSize,pageIndex);
          }
          }
        },
        {
          text: '按文件名降序',
          onClick: function() {
          if(fid==0||fid==undefined||fid==""){
                getfilelist(fid,1,"","desc",2,pageSize,pageIndex,true);
          }else{
                getfilelist(fid,1,"","desc",2,pageSize,pageIndex);
          }

          }
        },
        {
          text: '按文件上传时间倒序',
          onClick: function() {
             if(fid==0||fid==undefined||fid==""){
                getfilelist(fid,3,"","desc",2,pageSize,pageIndex,true);
             }else{
                getfilelist(fid,3,"","desc",2,pageSize,pageIndex);
             }
          }
        },
        {
          text: '按文件大小倒序',
          onClick: function() {
             if(fid==0||fid==undefined||fid==""){
                getfilelist(fid,4,"","desc",2,pageSize,pageIndex,true);
             }else{
                getfilelist(fid,4,"","desc",2,pageSize,pageIndex)
             }
          }
        }
      ];
      var buttons2 = [
        {
          text: '取消',
          bg: 'danger'
        }
      ];
      var groups = [buttons1, buttons2];
      $.actions(groups);
});
//**********************************************************************************
//                                                          搜索文件名称
//**********************************************************************************
//$(document).on("", "#ziliao_so", function(e, id, $page) {

//    var pageSize=10;
//    var pageIndex=1;
//    var pageCount=0;
//    //文件名称筛选
//    $(".infinite-scroll-preloader").hide();
//        $('#search').keypress(function (e) { //这里给function一个事件参数命名为e，叫event也行，随意的，e就是IE窗口发生的事件。
//            var key = e.which; //e.which是按键的值
//            if (key == 13) {
//                 $.showIndicator();//loading
//                getfilelist("","","","",2,pageSize,pageIndex);
//                $.hideIndicator();
//            }
//        });

//     //查询父级文件下的子文件
////  $(document).on("click","#filelist li", function(){
////       var fid=$(this).attr("data");
////       var type=$(this).attr("other");
////       pageIndex=1;
////      pageSize=10;
////       if(type=="folder"){
////            getfilelist(fid,"","","",2,pageSize,pageIndex)
////       }
////  });
//    //下拉事件
//    $(document).on('infinite', '#ziliao_so',function() {
//
//    setTimeout(function() {
//         pageIndex=pageIndex+1;
//         //当前页小于总页数
//         if(pageIndex<=pageCount){
//                //触发向下滚动，查询新数据
//               getfilelist(fid,"","","",1,pageSize,pageIndex)
//        }
//    }, 1000);
//  });
//});

//***********************************************************************************************
//                                      操作表
//***********************************************************************************************
$(document).on('click','#ios-create',function(){
       $.prompt('请输入文件夹的名字','', function (value) {
                 addfolder(value,parentid);
            },null,'新建文件夹');
        $(".modal-inner input").attr("placeholder","新建文件夹");
			if($(".modal-inner input").val()=="新建文件夹"){
				$(".modal-inner input").val("");
			}
});

  $(document).on('click','.create-actions', function () {
      var buttons1 = [
        {
          text: '上传文件',
          bold: true,
          color: 'danger',
          onClick: function () {
            console.log(browser.versions.ios);
            if(browser.versions.ios){
                $("#fileIosId").click();
            }else{fileOnload($(".title").html(), parentid, fpath);}
          }
        },
        {
          text: '创建文件夹',
          onClick: function() {
              $.prompt('请输入文件夹的名字','', function (value) {
                 addfolder(value,parentid);
            },null,'新建文件夹');
            $(".modal-inner input").attr("placeholder","新建文件夹");
				if($(".modal-inner input").val()=="新建文件夹"){
					$(".modal-inner input").val("");
				}
          }
        }
      ];
      var buttons2 = [
        {
          text: '取消',
          bg: 'danger'
        }
      ];
      var groups = [buttons1, buttons2];
      $.actions(groups);

      if(isWeiXin()){
        $(".color-danger").css("color","#0894ec");
        $(".bg-danger").css("background-color","gray");
        $(".actions-modal-button").css("font-size","16px");
      }
});
//**********************************************************************************
//                               文件预览
//**********************************************************************************
$(document).on("pageInit", "#ziliao_yulan", function (e, id, $page) {

    $.showIndicator(); //loading
    //var upId = QueryString("upId")
    //getAjax(javaserver + "/Kapi/findfileById", { upId: upId }, function (data) {
    //    data = strToJson(data);
    //    if (data.errorcode == 0 && data.data != null) {
            //可转码文件
      var data = {data:GetlocalStorage("fileobj")};
			if (data.data.fileType==undefined){
                data.data.fileType=data.data.filepreview.substr(data.data.filepreview.lastIndexOf(".")+1);
            }
            if (data.data.fileType == "pdf" || data.data.fileType == "docx" || data.data.fileType == "doc" || data.data.fileType == "xls" || data.data.fileType == "xlsx" || data.data.fileType == "ppt" || data.data.fileType == "pptx") {
                $(".content_yulan").html("<iframe src='../../res/pdf2/officeshow/web/viewer.html?file=" + base64encode(encodeURI(data.data.filepreview)) + "' style='width:100%;border:0;height:100%;position:absolute;' ></iframe>");
            } else if (data.data.fileType == "txt") {
                $(".content_yulan").html("<iframe src='" + data.data.filepreview + "' style='width:100%;border:0' ></iframe>");
            } else if (data.data.fileType == "mp4") {
                //$(".content_yulan").html("<video controls autoplay style='width:100%'><source src='" + data.data.filepreview + "'  type='video/mp4' ></video>  ");
                //文件预览引入播放器
                console.log("文件预览引入播放器");
                bPlayer = api.require('bPlayer');  //实例化百度播放器
                bPlayer.open({
                      rect: {
                          x: 0,
                          y: 38,
                          w: 0,
                          h: 0,
                      },
                      path: data.data.filepreview,//mima.replace('\\', '/'),
                      autoPlay: true
                  }, function(ret, err) {
                      if (ret) {
                        //引入成功之后又重新对播放器的位置进行重定位，因为不知道为啥上面那个定位不起作用，所以没办法。。。
                        bPlayer.setRect({
                                  rect:{
                                  x: 0,
                                  y: 50,
                                  w: winapi.winWidth,
                                  h: 200,
                                        },
                            });
                            /*****添加播放器的监听事件********/
                            bPlayer.addEventListener({name : ['click']}, function(ret) {
                              console.log(JSON.stringify(ret) + "||" + Tstate );
                              //if(JSON.stringify(ret) == "click"){
                                  if(Tstate == 1){ //当前正在播放
                                     BaiDuPlayer.BDpause();
                                     $.toast('已暂停播放，点击播放');
                                   }else {
                                     BaiDuPlayer.BDplay();
                                   }
                                 //}
                              });
                      }
                });
            } else if (data.data.fileType == "mp3") {
                $(".content_yulan").html("<video controls autoplay style='width:100%'><source src='" + data.data.filepreview + "'  type='audio/mpeg' ></video>  ");
            } else if (data.data.fileType == "jpg" || data.data.fileType == "png" || data.data.fileType == "gif" || data.data.fileType == "bmp" || data.data.fileType == "wbmp" || data.data.fileType == "jpeg"
                                 || data.data.fileType == "JPEG" || data.data.fileType == "GIF" || data.data.fileType == "WBMP" || data.data.fileType == "PNG") {
                $(".content_yulan").html(" <div ><img id='fileimg'  src='" + data.data.filepreview + "'   style='width:100%' /></div> ");
            } else {
                $(".content_yulan").html(" <div style='text-align: center;margin-top: 60%;color: #CCC;font-size: 20px;' >文件不支持预览！</div> ");
            }
      //  }
    //});
    $.hideIndicator();

});



//标签筛选
    $(document).on('click', '.biaoqian li', function () {
        $.showIndicator(); //loading
        var pageIndex = 1;
        var pageSize = 20;
        var tag = $(this).children(".ng-binding").get(0).attributes.data.nodeValue;

        var color = $(this).get(0).innerText;
        console.log("当前选中颜色" + color);

        //移除遮盖层
        $(".modal-in").removeClass("modal-in");
        $(".popup-tag").addClass("modal-out");
        $(".modal-overlay-visible").remove();


        var lable_block = "";
        if (tag == "01c9cfcb-ffec-4778-be6f-31e633czo33a") {
            lable_block = "hongse";
        } else if (tag == "01c9cfcb-ffec-4778-abcd-31e6321zo33b") {
            lable_block = "chengse";
        } else if (tag == "01c9cfcb-ffec-3208-abcd-31e633czo33c") {
            lable_block = "huangsese";
        } else if (tag == "01c1259cb-ffec-4778-abcd-31e633czo33d") {
            lable_block = "lvse";
        } else if (tag == "05bae156-9d94-482b-a120-86e694e40abe") {
            lable_block = "lanse";
        } else if (tag == "078cbeeb-f78f-312e-9de0-9efe1ee766af") {
            lable_block = "zise";
        } else if (tag == "08283666-15b4-4135-b0aa-3ecfdeed6e7g") {
            lable_block = "huise";
        } else if (tag == "0") {
            lable_block = "toumingquanbu";
        } else {
            $("#lable_color").html("<i class='iconfont icon-xueyuanpinglun'></i> 标签");
            //查询方法
            getfilelist(0, "", "", "", 2, pageSize, pageIndex, true);
        }
        if (lable_block != null && lable_block != "") {
            //$("#lable_color").html("<div style='height:30px;width:100%;display: block;clear: both;'><div class='knowledgebiaoqianyuan'><svg class='icon' aria-hidden='true'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-biaoqian" + lable_block + "'></use></svg><div title='" + color + "' class='ng-binding' data='" + tag + "'>" + color + "</div></div></div> ");
            $("#lable_color").html("<svg style='height:30px;width:30px;vertical-align: middle;' aria-hidden='true'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-biaoqian" + lable_block + "'></use></svg> " + color);
            //查询方法
            getfilelist("", "", tag, "", 2, pageSize, pageIndex, false);
        }
        $.hideIndicator();
    });
//***********************************************************************************
//                               人员资料
//***********************************************************************************
$(document).on('click','.left-alert-text', function () {
    $.alert("暂未开放 敬请期待","提示");
});
//***********************************************************************************
//                               添加文件夹
//***********************************************************************************
    function addfolder(value,thisfid){
        $.showIndicator();//loading
            sysUserInfo=getUserInfo();
            //创建文件夹
            getAjax(javaserver + "/Kapi/CreateFolder",
                {
                    upUserId: sysUserInfo.user_ID,
                    fid: thisfid,
                    upOrgId: sysUserInfo.organization_ID,
                    fileName: value,
                    filepath: fpath != null && fpath ? fpath : "/",
                    userName: sysUserInfo.user_Name
                }, function (data) {
                    $.hideIndicator();
                    data = strToJson(data);
                    // 处理父级路径
                    var dataFpath = data.data.filepath;
                    if (dataFpath == undefined || dataFpath == null || dataFpath == "" || dataFpath == "/") {
                        dataFpath = "/" + data.data.fileName;
                    } else {
                        dataFpath = data.data.filepath + "/" + data.data.fileName;
                    }
                    if (data.errorcode == 0 && data.data != null) {
                        $("#filelist").append("<li><label class='label-checkbox item-content'><div class='item-media'><img src='/app/framework/fileicon/folder_56.png'  onerror='javascript:this.src=\"/app/framework/fileicon/qita_56.png\"'/></div><div class='item-inner'><div class='item-title'><a href='#' class='item-link' data=" + data.data.upId + " fpath=" + dataFpath + " other=folder fid=" + data.data.fid + ">" + data.data.fileName + "</a></div><input type='checkbox' name='my-radio' value='" + data.data.upId + "'><div class='item-media'><i class='icon icon-form-checkbox'></i></div></div></label></li>");
                        $.toast('创建成功！');
                    } else if (data.errorcode == 29) {
                        $.toast('已存在同名文件！');
                    } else {
                        $.toast('请求错误！');
                    }
                }, function () {
                    $.hideIndicator();
                    $.toast('请求错误！');
                });

    }

};


function openTag() {
    $.popup('.popup-tag');
    $(".popup-tag").css("display","block");
    sysUserInfo = getUserInfo();
    var tagId = "";

    //请求个人标签
    getAjax(javaserver + "/Kapi/gettaglist",
                    { userid: sysUserInfo.user_ID, orgid: sysUserInfo.organization_ID }, function (data) {
                        data = strToJson(data);
                        if (data.errorcode == 0 && data.datas.length > 0) {

                            //处理查询的标签与原来的标签绑定事件
                            //外层遍历已查询到的标签
                            for (var i = 0; i < data.datas.length; i++) {
                                //内层遍历赋值
                                $($(".biaoqian .ng-binding")).each(function () {
                                    tagId = $(this).attr("data");   //遍历被选中CheckBox元素的集合 得到Value值
                                    //把比对上tagid的名称替换成查询出来的名称
                                    if (data.datas[i].tagid == tagId) {
                                        //data.datas[i].tagname
                                        $(this).get(0).innerText = data.datas[i].tagname;
                                    }
                                });
                            }
                        } else if (data.errorcode == 0 && data.datas.length <= 0) {
                            //直接放过
                            console.log("进入");
                        } else {
                            $.toast('请求错误！');
                        }
                    });

};

//***********************************************************************************
//                               文件上传开始
//***********************************************************************************
//fileOnload("资料");
function fileOnload(title, fid, fpath) {
    $('#popup-file-close').attr('onClick', 'closeFilePanel("' + title + '")');
    $('.title').html("上传文件列表");
    $.popup('.popup-file');
    if(fid == undefined || fid == null || fid == "")
    fid =0;
    if(fpath == undefined || fpath == null || fpath == "")
    fpath = "/";
    fileInit(fid,fpath); // 文件上传初始化
    console.log("hello file");

}
/*******************************文件搜索*********************************************/
function showSoInupt(index){
    //显示搜索框
    if(index==1){
         $("#SosoShow").show();
         $("#searchFileName").focus();
    }else{
         $("#SosoShow").hide();
         getfilelist(0, "", "", "", 2, 20,1, true);
    }
}

var chunkSize = 1024 * 1024*10;    //以后端的约定  分片的大小
// 获取用户信息
var sysUserInfo = strToJson(GetlocalStorage("userinfo"));
var uploadParams = {}; //上传参数
var $htmlUploadListBody = $('#htmlUploadListBody'); // 上传列表
//var $countUpFileNum = $("#countUpFileNum"); //上传的总文件数
var countUpFile = []; // 一共上传中的文件 id 文件id name 文件名 size 文件大小 fpath 父级目录 state 文件状态 type 文件类型
//var $successUpFileNum = $("#successUpFileNum"); // 上传完成了文件数
// 初始化参数
function fileInit(fid,fpath) {
    sysUserInfo = strToJson(GetlocalStorage("userinfo"));
    $htmlUploadListBody = $('#htmlUploadListBody'); // 上传列表
    uploadParams = {     //请求参数
        upid: "",       // 文件id 可空
        status: 4,     // 文件状态 0成功 1转码失败 2上传中 3上传失败
        fid: fid == 0 ? 0 : fid,        // 文件父级id
        fpath: fpath == null?"/":fpath,      // 文件父级地址
        filename: "",       // 文件名称
        filetype: "",       //文件类型
        size: "",           // 文件大小
        optype: 1,   // 文件上传
        orgid: sysUserInfo.organization_ID,            // 企业id
        orgname: sysUserInfo.organization_Name,        // 企业名称
        userid: sysUserInfo.user_ID,                    // 用户id
        username: sysUserInfo.user_Name               //  用户名称
    }
    fileTosast("");
    $.showIndicator();
    // 获取这个人之前上传的数据
    getAjax(javafile + "/Md5File/findRedissFile", { userid: sysUserInfo.user_ID }, function (response) {
        $.hideIndicator();
        $htmlUploadListBody.html("");
        if (response.errorcode == 0) {
            response.datas.forEach(function (item, ind) { // 路径需要处理
                //处理参数
                item.id = null; //队列id
                item.upId = item.upid;  //文件id
                item.fileType = item.filetype;  //文件类型
                item.fileName = item.filename;  // 文件名称
                item.fileSize = item.size; // 文件大小
                item.filepath = item.fpath; //文件地址
                addFileHtml(item); //生成html
            });
            countUpFile = response.datas;
        }
    },"","json");
}
// 打开选择文件初始化请求参数
function openUploadFile() {
    //fileTosast("打开");
    // 调用单击事件
    document.getElementById("uploadInfoBtn").childNodes[1].childNodes[1].click();
}

// HOOK 这个必须要再uploader实例化前面
WebUploader.Uploader.register({
    'before-send-file': 'beforeSendFile',
    'before-send': 'beforeSend'
}, {
    //add-file(files): File对象或者File数组	用来向队列中添加文件。
    //before-send-file	(file) file : 对象    在文件发送之前request，此时还没有分片（如果配置了分片的话），可以用来做文件整体md5验证。
    //before-send(block)	block: 分片对象	   在分片发送之前request，可以用来做分片验证，如果此分片已经上传成功了，可返回一个rejected promise来跳过此分片上传
    //after-send-file(file): File对象	在所有分片都上传完毕后，且没有错误后request，用来做分片验证，此时如果promise被reject，当前文件上传会触发错误。
    beforeSendFile: function (file) {
        console.log("beforeSendFile");
        // Deferred对象在钩子回掉函数中经常要用到，用来处理需要等待的异步操作。
        var task = new jQuery.Deferred();
        // 根据文件内容来查询MD5
        uploader.md5File(file).progress(function (percentage) {   // 及时显示进度
            fileTosast("正在加入队列" + file.name + "..." + parseInt(percentage * 100));
            console.log('计算md5进度:', percentage);
            getProgressBar(file, percentage, "MD5");
        }).then(function (val) { // 完成
            console.log('md5 result:', val);
            fileTosast("");
            file.md5 = val;
            // 模拟用户id
            // file.uid = new Date().getTime() + "_" + Math.random() * 100;
            file.uid = WebUploader.Base.guid();
            // 创建文件对象
            // 第一次发出请求要数据库 文件对象 如果是实时的需要添加钩子（*）
            uploadParams.filename = file.name;  //文件名称
            uploadParams.size = (file.size / 1024); // 文件大小
            uploadParams.filetype = file.ext;   //文件类型
            uploadParams.md5 = val;
            getAjax(javaserver + "/Kapi/upfiles", uploadParams, function (response) {
                countUpFile.forEach(function (item, index) {
                    if (item.upId == file.id) {
                        countUpFile.splice(index, 1);
                    }
                });
                $("#"+file.id).remove();
                //计算进度
                console.log("文件对象获取：" + response);         // 30 更新子版本
                // 不存在
                var responseIsExist = true;
                if (response.errorcode == "0") {
                    //文件唯一id赋值
                    file.upId = response.data.upId;
                } else if (response.errorcode == "30") {
                    //更新文件
                    file.upId = response.data.id;
                }
                // 判断文件是否存在
                countUpFile.forEach(function (item, index) {
                    if (item.upId == response.data.upId) {
                        responseIsExist = false;
                    }
                });
                if (responseIsExist) {
                    var obj = response.data;
                    obj.md5 = val;
                    if (response.errorcode == "0") { // 获取对象成功

                        //处理参数
                        obj.id = file.id; //文件队列中id
                        obj.status = 4; //文件上传状态
                        obj.optype = 1; //文件上传
                        addFileHtml(obj); //生成html
                        // 添加文件
                        addFile(obj, true);
                    } else if (response.errorcode == "30") { // 暂时复杂  更新子版本
                        //处理参数
                        obj.upId = obj.id;  //文件id
                        obj.id = file.id // 文件队列中id
                        obj.fileType = obj.Extended;  //文件类型
                        obj.fileName = obj.Name;  // 文件名称
                        obj.fileSize = obj.Size; // 文件大小
                        obj.filepath = ""; //文件地址
                        obj.status = 4; // 文件上传状态
                        obj.optype = 2; //更新文件
                        addFileHtml(obj); //生成html
                        // 添加文件
                        addFile(obj, true);

                    }else if (response.errorcode == "39") {    // 文件空间超出最大限制
                       $.prompt('存储空间超过最大限制','', function (value) {
                        },null,'警告');
                        task.reject();
                    }
                }
                // 进行md5判断
                getAjax(javafile + "/Md5File/checkFileMd5", { userid: sysUserInfo.user_ID, md5: file.md5 }, function (data) {
                    // 返回的状态码
                    status = data.errorcode;
                    console.log(data.errormsg);
                    task.resolve();
                    if (status == 101) {
                        // 文件不存在，那就正常流程
                    } else if (status == 100) {
                        // 忽略上传过程，直接标识上传成功；文件已经上传
                        uploader.skipFile(file);
                        file.pass = true;
                    } else if (status == 102) {
                        // 部分已经上传到服务器了，但是差几个模块。
                        console.log(data.datas);
                        file.missChunks = data.datas;
                    }
                }, function () {  //上传失败
                    task.reject();
                    // 参数二不传则为暂停上传
                    //uploader.removeFile(file, true);
                    $('#' + file.upId + ' .jindu').html('<div onclick="fileRetry()"><i class="iconfont" style="color: red" >&#xe6b9;</i> 上传中断</div> ');
                }, "json", "post");

            }, function () {
                task.reject();
                console.log("文件异常");
                fileTosast("文件异常");
                // 参数二不传则为暂停上传
                uploader.removeFile(file, true);

            },"json");
            // 日志
            console.log("beforeSendFile", file, uploader);
        });
        return jQuery.when(task);
    },
    beforeSend: function (block) {
        console.log("block")
        var task = new jQuery.Deferred();
        var file = block.file;
        var missChunks = file.missChunks;
        var blockChunk = block.chunk;
        console.log("当前分块：" + blockChunk);
        console.log("missChunks:" + missChunks);
        if (missChunks !== null && missChunks !== undefined && missChunks !== '') {
            var flag = true; //验证分片是否完成上传了。
            for (var i = 0; i < missChunks.length; i++) {
                if (blockChunk == missChunks[i]) {
                    console.log(file.name + ":" + blockChunk + ":还没上传，现在上传去吧。");
                    flag = false;
                    break;
                }
            }
            if (flag) {
                task.reject();
            } else {
                task.resolve();
            }
        } else {
            task.resolve();
        }
        // 返回回调方法
        return jQuery.when(task);
    }
});



// 实例化
var uploader = WebUploader.create({
    pick: {
        id: '#uploadInfoBtn',
        label: '点击选择文件'
    },
    formData: {
        uid: 0,
        md5: '',
        chunkSize: chunkSize
    },
    //dnd: '#dndArea',  // 指定接受拖拽上传的容器
    //paste: '#uploader',   //指定复制粘贴的容器
    swf: '/app/framework/webuploader/js/Uploader.swf',
    chunked: true, //分片上传
    chunkSize: chunkSize, // 字节 1M分块
    threads: 3, //当前为3个线程同时请求到达
    chunkRetry:5, // 自动重连5次
    server: javafile + '/Md5File/fileUpload', //上传的路径
    auto: true, // 是否自动上传
    // duplicate : true, //去重， 根据文件名字、文件大小和最后修改时间来生成hash Key.
    disableGlobalDnd: true,// 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
    fileNumLimit: 1024,     // 队列最大限制总数量
    fileSizeLimit: 1024 * 1024 * 1024 * 1024,    // 200 M队列总大小
    fileSingleSizeLimit: 1024 * 1024 * 1024 * 1024   // 50 M 单个文件大小限制
});
// 当有文件被添加进队列的时候
uploader.on('fileQueued', function (file) {
    fileTosast("正在加入队列" + file.name);
    // 第一次发出请求要数据库 文件对象 如果是实时的需要添加钩子（*）
    uploadParams.filename = file.name;  //文件名称
    uploadParams.size = (file.size / 1024); // 文件大小
    uploadParams.filetype = file.ext;   //文件类型
    var obj = {};
    //处理参数
    obj.upId = file.id;  //文件id
    obj.id = file.id // 文件队列中id
    obj.fileType = file.ext;  //文件类型
    obj.fileName = file.name;  // 文件名称
    obj.fileSize = (file.size / 1024); // 文件大小
    obj.filepath = ""; //文件地址
    obj.status = 4; // 文件上传状态
    obj.optype = 1; //新增文件
    addFileHtml(obj); //生成html
});

//当文件被删除队列的时候触发
uploader.on('fileDequeued', function (file) {
    console.log(file);

});

//当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次。
uploader.onUploadBeforeSend = function (obj, data) {
    console.log("onUploadBeforeSend");
    var file = obj.file;
    console.log(obj);
    data.md5 = file.md5 || ''; //会出现空值需要看一下
    data.uid = file.uid;
    var dataBaseFileObj = getOneFileObj(file);
    if (dataBaseFileObj == null) {
        console.log("文件丢失");
        return;
    }
    data.orgid = sysUserInfo.organization_ID;     // 企业id
    data.orgname = sysUserInfo.organization_Name;     // 企业名称
    data.userid = sysUserInfo.user_ID;   // 用户id
    data.username = sysUserInfo.user_Name;  //  用户名称
    data.status = 2;
    data.optype = 1;    // 操作类型
    data.upid = dataBaseFileObj.upId;
    data.ziid = dataBaseFileObj.fileid;    // 子表id
    data.fid = dataBaseFileObj.fid; // 父级id
    data.fpath = dataBaseFileObj.filepath;  // 父级路径

};
// 上传中
uploader.on('uploadProgress', function (file, percentage) {
    getProgressBar(file, percentage,"上传");
});
// 上传成功返回结果
uploader.on('uploadSuccess', function (file) {
    var text = '已上传';
    if (file.pass) {
        text = "文件妙传功能，文件已上传。"
    }
    updataFile(file, 0);
    uploader.removeFile(file, true);
    //$('#' + file.id).find('p.state').text(text);
    console.log('uploadSuccess chenggong', file);
    jQuery('#' + file.upId + ' .jindu').html('<i class="iconfont" style="color: green">&#xe772;</i>成功 ');

});
// 上传失败
uploader.on('uploadError', function (file, reason) {
    console.log('uploadError shibai', file, reason);
    if (reason == "abort") {
        jQuery('#' + file.upId + ' .jindu').html('<div onclick="fileRetry()"><i class="iconfont" style="color: red" >&#xe6b9;</i> 中断</div> ');
        return;
    }
    updataFile(file, 3);
    uploader.removeFile(file, true);
    jQuery('#' + file.upId + ' .jindu').html('<i class="iconfont" style="color: red">&#xe6b9;</i> 失败 ' + reason);
    //$('#' + file.id).find('p.state').text('上传出错');
});
// 上传完成
uploader.on('uploadComplete', function (file) {
    console.log('uploadComplete wancheng', file);
    // 隐藏进度条
    fadeOutProgress(file);
    fileTosast(""); //清空消息
    //$successUpFileNum.html(parseInt($successUpFileNum.html()) + 1);
    // 计算进度
    //allProgress();
    //$('#' + file.id + ' .jindu').html('<i class="iconfont" style="color: #39f">&#xe781;</i> 正在转化');
    // fadeOutProgress(file, 'FILE');
});






/**
重试上传
@file 出错文件
*/
function fileRetry() {
    uploader.retry();
}

/**
*  生成进度条封装方法
* @param file 文件
* @param percentage 进度值
* @param titleName 标题名
*/
function getProgressBar(file, percentage, titleName) {
    var $li = jQuery('#' + file.upId); // 当前文件
    var $td = jQuery('#' + file.upId + ' .jindu');
    var $childProgress = $li.find('.progress');   //进度条
    var $childProgressflag = $td.find('#' + file.upId + '-progress-bar');   //进度条
    var $childProgressText = $td.find('#' + file.upId + 'progress-text'); // 进度内容
    // 避免重复创建 进度条
    if (!$childProgressflag.length) {
        $td.html("");
        $childProgressflag = jQuery('<div id="' + file.upId + '-progress"><span id="' + file.upId + 'progress-text">0%</span><br /><span class="progress" style="display:none;"><span style="width: 0%" class="progress-bar" id="' + file.upId + '-progress-bar"></span></span></div>').appendTo($td).find('#' + file.upId + '-progress-bar');
    }
    // 进度计算
    var progressPercentage = (percentage * 100).toFixed(2) + '%';
    // 修改进度条的样式
    $childProgress.css('width', progressPercentage);
    // 填充进度条的文字
    $childProgressText.html(titleName + ":" + parseInt(percentage * 100));
}


/**
* 隐藏进度条
* @param file 文件对象
*/
function fadeOutProgress(file, id_Prefix) {
    jQuery('#' + file.upId).find('.progress').css('width', '0%'); // 当前文件
    //$('#' + file.upId + '-progress').fadeOut();
}
/**
   隐藏删除按钮
*/
function hideDelBtn(file) {
    var $tr = $('#' + file.upId);
    var $td = $tr.find(".delete");
    $td.hide(); // 隐藏
}
/**
    查找第一上传后的文件对象
    @file
*/
function getOneFileObj(file ) {
    var obj = null;
    countUpFile.forEach(function (item, ind) {
        if (item.upId == file.upId) {
            obj = item;
        }
    });
    return obj;
}
/**
    生成html
*/
function addFileHtml(item) {
    var statusHtml = "等待";
    switch (parseInt(item.status)) {
        case 4: //等待上传
        statusHtml = '等待';
        break;
        case 3: //失败
        statusHtml = '<i class="iconfont" style="color: red" >&#xe6b9;</i> 失败';
        break;
        case 2: //正在进行中
        statusHtml = '<i class="iconfont" style="color: red" >&#xe6b9;</i> 未完';
        break;
        case 1: // 转换失败
        statusHtml = '<i class="iconfont" style="color: red" >&#xe6b9;</i> 失败';
        break;
        case 0: //成功
        statusHtml = '<i class="iconfont" style="color: green">&#xe772;</i>成功';
        break;

    }
$htmlUploadListBody.append('<li class="card-header item-content" id="' + item.upId + '">' +
        '<div class="progress"></div>'+
        '<div style="text-align: center;width:35%;"><marquee direction="right">' + (item.optype == 1 ? '新增' : '更新') + item.fileName + '</marquee></div>' +
        '<div style="text-align: center;width:15%">' + getFileSize(item.fileSize) + '</div>' +
        '<div style="text-align: center;width:20%">' + (item.filepath == null || item.filepath == '/' ? "/" : item.filepath) + '</div>' +
        '<div style="text-align: center;width:25%" class="jindu">'+statusHtml+'</div> ' +
        '<div style="text-align: center;width:5%" class="xuanzhuan-45" onclick=\'delSelectFileObj('+JSON.stringify(item)+')\'>+</div>' +
    '</li>');
}
/**
  添加文件记录进度
  @ file 文件对象
  @ flag 是否更新进度
*/
function addFile(file,flag){
    var isExist = false;
    // 判断文件是否存在
    countUpFile.forEach(function(item,index){
        if(item.upId == file.upId){
            isExist == true;
            return;
        }
    });
    //id 文件id name 文件名 size 文件大小 fpath 父级目录 state 文件状态 0传输完毕 1传输中 type 文件类型
    countUpFile.push(file);
    //消息提醒
    fileTosast("开始上传"+file.fileName);
    //allProgress();
}
/**
    文件更新 状态只有完成
*/
function updataFile(file, flag) {
    var index = 0;
    countUpFile.forEach(function (item, ind) {
        if (item.upId == file.upId) {
            index = ind;
        }
    });
    countUpFile[index].status = flag; // 文件状态
    //allProgress();  //更新进度
}
/**
队列中移除文件
@ id 文件队列id
@ upId 文件对象id
*/
function delSelectFileObj(fileobj) {
    if (fileobj.id != null && fileobj.id != "null") {   //重新上传 删除的时候这个为空值
        console.log(fileobj.id);
        // 参数二不传则为暂停上传
        try {
            uploader.removeFile(fileobj.id, true);
        } catch (e) { }
    }
    // 删除页面上的元素
    $("#" + fileobj.upId).remove();
    //计算进度
    countUpFile.forEach(function (item, index) {
        if (item.upId == fileobj.upId) {
            countUpFile.splice(index, 1);
        }
    });
    var redisparams = {};
    redisparams.upId = fileobj.upId;
    redisparams.status = fileobj.status;
    redisparams.md5 = fileobj.md5;
    redisparams.userid = fileobj.userid;
    redisparams.optype = fileobj.optype;
    // 清楚redis的数据
    getAjax(javaserver + "/Kapi/delcachefiles", redisparams, function (data) {
        if (data.errorcode != "0") {
            $.toast('删除失败！');
        }
    }, function () {  //上传失败
    }, "json", "post");
    //allProgress();
}


/**
总进度计算
*/
function allProgress() {
    $successUpFileNum.html(0);  //初始化完成数
    // 总文件数
    $countUpFileNum.html(countUpFile.length);
    countUpFile.forEach(function(item,index){
        if (item.status == 0) {
            // 上传完毕文件数
            $successUpFileNum.html(parseInt($successUpFileNum.html()) + 1);
        }
    });
    var allProgressNum = parseInt($successUpFileNum.html()) / parseInt($countUpFileNum.html());
    jQuery('#all-progress-bar').css('width', (allProgressNum * 100).toFixed(2) + '%');
}

//关闭文件上传
function closeFilePanel(title){
    $('.title').html(title);
    $.closeModal('.popup-file');
}
//左侧打开文件上传
$(document).on('click','#open-file', function () {
    // 关闭左侧
    $.closePanel();
    // 弹出上传层 上传到根目录
    fileOnload($(".title").html(),0,null);
});

// 文件提示
function fileTosast(msg){
    var $fileMsg = jQuery('.fileMsg');
    var $fileMsgTxt = jQuery('.fileMsgTxt');
    var $uploadFileText = jQuery("#uploadFileText");
    if (msg == undefined || msg == null || msg == "") {
        $uploadFileText.html("选择上传文件");
        //$fileMsg.hide();
    } else {
        //$fileMsg.show();
        $uploadFileText.html(msg);
        $fileMsgTxt.html(msg);
    }

}
/***************************************************************************/
//个人信息保存
/**************************************************************************/
function saveStuInfo(){
   //对电子邮件的验证
var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
var mobile=/^((1[345789]{1}))+\d{9}$/;

    sysUserInfo=getUserInfo();
    //赋值
    sysUserInfo.email=$("#userEmail").val();
    sysUserInfo.phone=$("#userPhone").val();
    sysUserInfo.identifyCard=$("#idcard").val();
	$("#errmsg").html("&nbsp;");

if(sysUserInfo.email==""){
	$("#errmsg").html("邮箱地址不能为空！");
	$("#userEmail").focus();
	return;
}else if(sysUserInfo.phone==""){
	$("#errmsg").html("手机号码不能为空！");
	$("#userPhone").focus();
	return;
}else if(sysUserInfo.identifyCard==""){
	$("#errmsg").html("身份证号不能为空！");
	$("#idcard").focus();
	return;
}else{
	if(!myreg.test(sysUserInfo.email)){
		$("#errmsg").html("邮箱地址格式错误！");
		$("#userEmail").focus();
		return;
	}else if(!mobile.test(sysUserInfo.phone)){
		$("#errmsg").html("手机号码格式错误！");
		$("#userPhone").focus();
		return;
	}else if(!/^\d{17}(\d|x)$/i.test(sysUserInfo.identifyCard)){
		$("#errmsg").html("身份证号格式错误！");
		$("#idcard").focus();
		return;
	}
  $.showIndicator(); //loading
}


    //请求
    getAjax(javaserver + "/exampaper/updateStuInfo",
                    { userid: sysUserInfo.user_ID, //用户id
                      email: sysUserInfo.email,//用户email
                      identifyCard:sysUserInfo.identifyCard,//用户身份证号
                      phone:sysUserInfo.phone//用户电话
                       }, function (data) {
                        data = strToJson(data);
                        if (data.errorcode == 0 ) {
                            $.toast('修改成功！');
                             //修改成功，则放入缓存
                             SetlocalStorage("userinfo",sysUserInfo);
                        }  else {
                            $.toast('请求错误！');
                        }
       });
}
/***************************************************************************/
//考试历史的加载事件
/**************************************************************************/
$(document).on("pageInit", "#historyExam", function(e, id, $page) {
    if(isWeiXin()){
            $("title").html("历史考试");
     }
    var pageIndex=1;
    var pageSize=20;
    //登录用户
    sysUserInfo=getUserInfo();
    //请求,第一次加载  替换页面
    historyExam(1,pageSize,pageIndex);

})

 //分页
   function getMoreHistory(){
        var pageIndex=$("#pageIndex").html();
        pageIndex=parseInt(pageIndex)+1;
      //  console.log("每页条数："+pageSize);
        console.log("当前第几页："+pageIndex);

        //这里条数（每页20条，给死了）
        historyExam(2,20,pageIndex);//追加
   }
   //查询考试历史，调出来
   //optype   1,替换，2拼接
   /******************************************查询方法开始*************************************************/
   function historyExam(optype,pageSize,pageIndex){
   sysUserInfo=getUserInfo();
    //请求
    getAjax(javaserver + "/exampaper/historyPaper",
                    { userid: sysUserInfo.user_ID, //用户id
                      pageIndex: pageIndex,
                      pageSize:pageSize
                       }, function (data) {
                        data = strToJson(data);
                        if (data.errorcode == 0 ) {
                            var block="";
                           for(var i=0;i<data.datas.length;i++){
                                data.datas[i].exampaper.scoreId=data.datas[i].scoreId;
                                block+="<li><a href='#' onclick='openSj("+JSON.stringify(data.datas[i])+",99)' class='item-link item-content'><div class='item-inner'><div class='item-title-row'><div class='item-title'>"+data.datas[i].paperName+"</div></div><div class='item-subtitle'>得分：<b style='color: #fe5945'>"+data.datas[i].score+"</b>分</div><div class='item-text'>考试时间："+data.datas[i].scoreTime+"</div></div></a></li>";
                           }
                           //替换
                           if(optype==1){

                                 if(block!=""){
                                        $("#historyList").html(block);
                                        $("#moreHis").show();
                                 }else{
                                        $("#lishinodate").show();
                                        $("#moreHis").hide();
                                 }
                           //拼接
                           }else{
                                if(block!=""){
                                        $("#historyList").append(block);
                                 }else{
                                        //没有数据可获取了
                                        $("#moreHis").hide();
                                 }
                           }
                           //把当前页给页面
                          $("#pageIndex").html(pageIndex);

                            //如果总条数小于等于每页显示条数
                          //隐藏加载更多，
                           if(pageIndex>=data.pageCount){
                                 $("#moreHis").hide();
                          }else{
                                $("#moreHis").show();
                          }
                        }  else {
                            $.toast('请求错误！');
                        }
   });
   }
   /******************************************查询方法结束*************************************************/
   $(document).on("pageInit", "#studentInfo", function (e, id, $page) {
    if(isWeiXin()){
            $("title").html("个人信息");
            $("#idcard").parent().parent().parent().parent().remove();
     }
     sysUserInfo=getUserInfo();
    //个人中心信息
   $("#userImg").attr("src",sysUserInfo.user_Img);
   $("#userEmail").val(sysUserInfo.email);
   $("#userPhone").val(sysUserInfo.phone);
   $("#idcard").val(sysUserInfo.identifyCard);
   $("#userName").html(sysUserInfo.username);
   $("#userNo").html(sysUserInfo.user_No);

   //学员组织架构信息
   $("#userOrg").html(sysUserInfo.allorgname==""?"暂无":sysUserInfo.allorgname);
   $("#userGroup").html(sysUserInfo.allgroupname==""?"暂无":sysUserInfo.allgroupname);
   $("#userRole").html(sysUserInfo.allrolename==""?"暂无":sysUserInfo.allrolename);
})
//*************************************跳转公开课************************************/
function goPublicCourse(){
    if(isWeiXin()){
            $("title").html("公开课");
     }else{
            $(".title").html("公开课");
    }
    var courseName=$('#publicCourseName').val();

    $("#publicCourseNameParams").val(courseName);
    getPublicCourse(true);
}
//文件名称筛选
$('#publicCourseNameParams').keypress(function (e) { //这里给function一个事件参数命名为e，叫event也行，随意的，e就是IE窗口发生的事件。
    var key = e.which; //e.which是按键的值
    if (key == 13) {
        goPublicCourse();
    }
});
/***************************************************************************/
// 公开课加载事件
/**************************************************************************/
// 筛选类型
var publicType = [{ name: '视频', flag: false, value: 1 },
        { name: '文件', flag: false, value: 2 },
        { name: '试卷', flag: false, value: 3 },
        { name: '线下', flag: false, value: 4 },
        { name: '题库', flag: false, value: 5 },
        { name: '直播', flag: false, value: 6 },
        { name: '图文', flag: false, value: 8 }];
$(document).on("pageInit", "#course", function(e, id, $page) {
    // 当前页
    var pageIndex = 1;
    // 每页显示的条数
    var pageSize = 10;
    // 筛选类型
    var publicTypeHtml = "";
    for (var i = 0; i < publicType.length; i++) {
        publicTypeHtml += "<span class=\"shaixuan\" onClick='publicCourseType("+JSON.stringify(publicType[i])+",this)'>"+publicType[i].name+"</span>";
    }
    $('#publicType').append(publicTypeHtml);
    // 登录用户
    sysUserInfo = getUserInfo();

    getKnowledgeList("",0);
});
var publicCourseParams = {
    orgid:"",
    knowledgeids:"",
    searchText:"",
    searchType:3,
    cstype:"",
    pageIndex:1,
    pageSize:10
}

// 公开课总数
var publicCourseCount = 0;
// 公开课完整html
var courseHtml = "";
// 公开课内容更html
var courseContext = "";
// loading
var publicCourseLoading = false;
// 获取公开课
function getPublicCourse(flag){
    sysUserInfo=getUserInfo();
    publicCourseParams.orgid = sysUserInfo.organization_ID;
    publicCourseParams.userid = sysUserInfo.user_ID;
    var txtName = $('#publicCourseNameParams')[0].value;
    if(!isNull(txtName)){
        // 公开课完整html
        courseHtml = "";
        // 公开课内容更html
        courseContext = "";
        publicCourseParams.searchText = txtName;
    }else{
        publicCourseParams.searchText = "";
    }
    if(publicCourseLoading){
        $.toast('正在请求数据');
    }
    publicCourseLoading = true;
    getAjax(javaserver + "/course/findOpen",publicCourseParams,function(response){
        publicCourseLoading = false;
        $('#courseContent').html("");

        if(response.errorcode == "0"){
            if(flag){
                // 公开课完整html
                courseHtml = "";
                // 公开课内容更html
                courseContext = "";
            }
            for (var i = 0; i < response.datas.length; i++) {
                //console.log(response.datas[i]);
                var courseimgMid = response.datas[i].course_img;
                if(courseimgMid.indexOf("/images/train") >= 0){
                  courseimgMid = ".." + response.datas[i].course_img;
                }
                courseContext +='<div class="col-50">'+
                             '  <div class="card color-default" style="margin: .5rem 0">'+
                            '      <a href="#" onClick=\'openKe_collection("'+response.datas[i].course_Id+'")\'>'+
                            '          <div  style="background: #eee;height: 120px;" valign="bottom" class="card-header color-white no-border no-padding" >'+
                            '              <img class="card-cover" src="'+courseimgMid+'" alt="" onerror="javascript:this.src=\"../res/img/fengmian001.gif\"" style="max-width: 100%;margin: 0 auto;width:auto;height: 120px;">'+
                            '          </div>'+
                            '           <div class="card-content">'+
                            '               <div class="card-content-inner">'+
                            '                   <p>'+
                            response.datas[i].course_Name.replace(/<\/?[^>]*>/g,'')+'</p>'+
                            '                   <p class="color-gray">'+
                            '                           <i class="iconfont">&#xe6ce;</i>包含'+response.datas[i].sectionSum+'节课'+
                            '                   </p>'+
                            '               </div>'+
                            '           </div>'+
                            '       </a>'+
                            '       <div class="card-footer">'+
                            '           <span class="link"><i class="iconfont">&#xe91b;</i>'+response.datas[i].viewCount+'</span> '+
                            //收藏
                            '           <span class="link" onClick=\'collCourse('+JSON.stringify(response.datas[i]).replace(/<\/?[^>]*>/g,'')+',this)\'>'+(response.datas[i].collections?'<i class="iconfont">&#xe72f;</i>':'<i class="iconfont">&#xe748;</i>')+
                            '<span>'+(isNull(response.datas[i].collectionCount) || response.datas[i].collectionCount < 0?0:response.datas[i].collectionCount)+'</span></span>'+
                            '       </div>'+
                            '   </div>'+
                            '</div>';
            }
            // 没有任何数据
            if(courseContext  == ""){
                courseHtml = '<div style="text-align:center;"><img src="../res/img/none.png" style="width: 50%;margin-top: 20%;"><div>暂无数据</div></div>';
            }else{
                courseHtml = '<div class="row">'+courseContext+'</div>';
            }
            $('#courseContent').append(courseHtml);
            // 获取展现出来的个数
            var contextNum = $('#courseContent>div').find('.col-50').length;
            if(contextNum < response.numCount){
                // 判断加载更多是否存在
                if(!document.getElementById('moreHis')){
                    $('#courseContent').append('<div style="margin: 1rem auto;padding-bottom: 2.5rem;" id="moreHis" onClick=\'nextPublicCourse('+JSON.stringify(publicCourseParams)+')\'><center>点击加载更多('+contextNum+'/'+response.numCount+')</center></div>');
                }
            }else{ // 没有更多了
                $('#moreHis').remove();
            }
            publicCourseCount = response.numCount;
        }else{
             $.toast('公开课信息获取失败！');
        }
    },"","json");
}
// 下一页
function nextPublicCourse(params){
    params.pageIndex ++;
    publicCourseParams = params;
    getPublicCourse()
}
// 排序
function publicCourseSort(int,text){
    // 关闭层
    $.closeModal('.corseSort');
    // 排序文字
    $('#publicCourseText').html(text);
    publicCourseParams.searchType = int;
    publicCourseParams.pageIndex = 1;

    // 清空课程名称搜索
    $('#publicCourseNameParams')[0].value = "";
    publicCourseParams.searchText = "";
    // 知识分类清空
    $("#"+publicCourseParams.knowledgeids).removeClass('active');
    publicCourseParams.knowledgeids = "";
    getPublicCourse(true);
}
// 选择类型
function publicCourseType(item,obj){
    if(item.flag){
        item.flag = false;
        $(obj).removeClass('active');
    }else{
        item.flag = true;
        $(obj).addClass('active');
    }
    $(obj).attr('onClick','publicCourseType('+JSON.stringify(item)+',this)');
    var paramsText = "";
    for (var i = 0; i < publicType.length; i++) {
        if(publicType[i].value == item.value){
            publicType[i].flag = item.flag;
            if(item.flag){
                paramsText+=item.value+",";
            }
        }else{
            if(publicType[i].flag){
                paramsText+=publicType[i].value+",";
            }
        }
    }
    // 筛选类型
    publicCourseParams.cstype = paramsText;
    publicCourseParams.pageIndex = 1;
    // 发送请求
    getPublicCourse(true);
}
// 获取知识分类
var knowledgeList = [];
var knowHtml = $('#knowList');
knowHtml.html('');
// 知识库id  索引
function getKnowledgeList(know,index){
    sysUserInfo = getUserInfo();
    var knowledgeParams = {
        userId: sysUserInfo.user_ID,
        startDate: "",    // 起始时间
        endDate: "", // 结束时间
        searchName: "", //搜索内容
        knowledge_Id: know, // 子集搜索
        orgId: sysUserInfo.organization_ID,   // 企业id
        org_Name: sysUserInfo.organization_Name,   // 企业id
        powerLV: 2 //登录人的系统角色
    }
    // 遍历数据
    for (var i = knowledgeList.length; i > index; i--) {
        $('#P'+i).remove();
    }
    // 清除
    if(isNull(know)){
       publicCourseParams.knowledgeids = "";
    }else{
       $("#"+publicCourseParams.knowledgeids).removeClass('active');
       if(publicCourseParams.knowledgeids == know){
           publicCourseParams.knowledgeids = "";
       }else{
           publicCourseParams.knowledgeids = know;
           $("#"+publicCourseParams.knowledgeids).addClass('active');
       }
    }
    getPublicCourse(true);
    // 删除数据
    knowledgeList.splice(index,knowledgeList.length-index);
    getAjax(javaserver + "/knowledge/findKnowledgeList",knowledgeParams,function(response){
        if(response.errorcode == 0){
            var knowObj = response.datas;
            if(!isNull(knowObj) && knowObj.length >0){
                knowledgeList.push(knowObj);
                var itemHtml = "<p id='P"+knowledgeList.length+"'>第"+knowledgeList.length+"分类:</br>";
                for (var knowItem = 0; knowItem < knowObj.length; knowItem++) {
                    itemHtml+= '<span class="shaixuan" id="'+knowObj[knowItem].knowledge_Id+'" onClick="getKnowledgeList(\''+knowObj[knowItem].knowledge_Id+'\','+knowledgeList.length+',this)">'+knowObj[knowItem].knowledge_Name+'</span>'
                }
                itemHtml += "</p>";
                knowHtml.append(itemHtml);
            }
        }else{
            $.toast('请求失败');
        }
    },"","json");
}


// 收藏/取消
function collCourse(item,obj){
    if(publicCourseLoading){
        $.toast('正在提交');
        return;
    }
    sysUserInfo=getUserInfo();
    var collParams = {
        collectionsId:"",
        courseName:item.course_Name,
        userId:sysUserInfo.user_ID,
        courseId: item.course_Id
    };
    if(item.hasOwnProperty('collections')){ // 存在说明取消收藏
        collParams.collectionsId =  item.collections.id;
    }
    publicCourseLoading = true;
    getAjax(javaserver + "/course/modifyCollectionCourse",collParams,function(response){
        publicCourseLoading = false;
        if(response.errorcode == 0){
            if(item.hasOwnProperty('collections')){ // 存在说明取消收藏
                delete item.collections;
                if(isNull(item.collectionCount) || item.collectionCount <= 0){
                    item.collectionCount = 0;
                }else{
                    item.collectionCount--;
                }
                obj.innerHTML='<i class="iconfont">&#xe748;</i>'+item.collectionCount;
            }else{ // 取消收藏
                item.collections = {id: response.data}
                if(isNull(item.collectionCount) || item.collectionCount <= 0){
                    item.collectionCount = 1;
                }else{
                    item.collectionCount++;
                }
                obj.innerHTML='<i class="iconfont">&#xe72f;</i>'+item.collectionCount;
            }
            console.log(item,obj.childNodes[1].innerText);
            // 赋值
            $(obj).attr('onClick',"collCourse("+JSON.stringify(item)+",this)");
            obj.childNodes[1].innerText = item.collectionCount;
        }else{
            $.toast('提交失败！');
        }
    },'','json');
}
// 公开课判空事件
function isNull(text){
    if(text==null||text==undefined||text==""){
        return true;
    }else{
        return false;
    }

}



/***************************************************************************/
//课程收藏的加载事件
/**************************************************************************/
$(document).on("pageInit", "#courseCollection", function(e, id, $page) {
    if(isWeiXin()){
            $("title").html("课程收藏");
     }
    var pageIndex=1;
    var pageSize=20;
    //登录用户
    sysUserInfo=getUserInfo();
    //请求,第一次加载  替换页面
    courseCollection(1,pageSize,pageIndex);

})

 //分页
   function getMoreCollection(){
        var pageIndex=$("#pageIndex").html();
        pageIndex=parseInt(pageIndex)+1;
      //  console.log("每页条数："+pageSize);
        console.log("当前第几页："+pageIndex);

        //这里条数（每页20条，给死了）
        courseCollection(2,20,pageIndex);//追加
   }
   //查询考试历史，调出来
   //optype   1,替换，2拼接
   /******************************************查询方法开始*************************************************/
   function courseCollection(optype,pageSize,pageIndex){
   sysUserInfo=getUserInfo();
    //请求
    getAjax(javaserver + "/exampaper/courseCollection",
                   { userid: sysUserInfo.user_ID, //用户id
                       orgid: sysUserInfo.organization_ID,
                      pageIndex: pageIndex,
                      pageSize:pageSize
                       }, function (data) {
                        data = strToJson(data);
                        if (data.errorcode == 0 ) {
                            var block="";
                           for(var i=0;i<data.datas.length;i++){
                                //如果最后修改日期为null，吧创建日期给他
                                if(data.datas[i].upd_Date==undefined||data.datas[i].upd_Date==null){
                                    data.datas[i].upd_Date=data.datas[i].create_Date
                                }
                                if(data.datas[i].course_img.indexOf("http://") <= 0){
                                block+="<a href='#' onClick='openKe_collection(" + JSON.stringify(data.datas[i].course_Id) + ","+null+","+ JSON.stringify((data.datas[i].course_Detailed&&data.datas[i].course_Detailed)?data.datas[i].course_Detailed:null)+ ")' class='item-link item-content'><div class='item-media'><img src='../.."+data.datas[i].course_img+"'  style='width: 5rem;height:3rem;'></div><div class='item-inner'><div class='item-title-row'><div class='item-title' style='width:10rem;'>"+data.datas[i].course_Name+"</div></div><div class='item-text'>课程最后更新时间："+data.datas[i].upd_Date+"</div></div></a></li>";
                              }else {
                                {
                                  block+="<a href='#' onClick='openKe_collection(" + JSON.stringify(data.datas[i].course_Id) + ","+null+","+ JSON.stringify((data.datas[i].course_Detailed&&data.datas[i].course_Detailed)?data.datas[i].course_Detailed:null)+ ")' class='item-link item-content'><div class='item-media'><img src='"+data.datas[i].course_img+"'  style='width: 5rem;height:3rem;'></div><div class='item-inner'><div class='item-title-row'><div class='item-title' style='width:10rem;'>"+data.datas[i].course_Name+"</div></div><div class='item-text'>课程最后更新时间："+data.datas[i].upd_Date+"</div></div></a></li>";
                                }
                              }
                           }
                           //替换
                           if(optype==1){

                                 if(block!=""){
                                        $("#courseCollecList").html(block);
                                        $("#moreCollec").show();
                                 }else{
                                        $("#shoucangnodate").show();
                                        $("#moreCollec").hide();
                                 }
                           //拼接
                           }else{
                                if(block!=""){
                                        $("#courseCollecList").append(block);
                                 }else{
                                        //没有数据可获取了
                                        $("#moreCollec").hide();
                                 }
                           }
                           //把当前页给页面
                          $("#pageIndex").html(pageIndex);
                          //如果总条数小于等于每页显示条数
                          //隐藏加载更多，
                          if(pageIndex>=data.pageCount){
                                 $("#moreCollec").hide();
                          }else{
                                $("#moreCollec").show();
                          }
                        }  else {
                            $.toast('请求错误！');
                        }
   });
   }
   /******************************************查询方法结束*************************************************/
/***************************************************************************/
//任务过期提醒的加载事件
/**************************************************************************/
$(document).on("pageInit", "#geren_tixing", function(e, id, $page) {

sysUserInfo=getUserInfo();
    //请求
    getAjax(javaserver + "/exampaper/getSevenArrange",
                   { orgid: sysUserInfo.organization_ID,
                   userid: sysUserInfo.user_ID,
                   org_Id:sysUserInfo.allorgid,
                   role_Id:sysUserInfo.allroleid,
                   user_groupId:sysUserInfo.allgroupid }, function (data) {
                        data = strToJson(data);
                        if (data.errorcode == 0 ) {
                            var block="";
                           for(var i=0;i<data.datas.length;i++){
                                var d1=new Date(data.datas[i].endDate).getDay();;
                                if(data.datas[i].messageType==1)
                                block+="<li><a href='#renwu' class='item-link item-content'><div class='item-media'>星期" + "日一二三四五六".charAt(d1)+"</div><div class='item-inner'><div class='item-title-row'><div class='item-title'>任务名称："+data.datas[i].typeName+"</div></div><div class='item-text'>任务结束时间："+data.datas[i].endDate+"</div></div></a></li>";
                                else
                                block+="<li><a href='#renwu' class='item-link item-content'><div class='item-media'>星期" + "日一二三四五六".charAt(d1)+"</div><div class='item-inner'><div class='item-title-row'><div class='item-title'>线下地址："+data.datas[i].typeName+"</div></div><div class='item-text'>线下结束时间："+data.datas[i].endDate+"</div></div></a></li>";
                           }

                                if(block!=""){
                                        $("#tixingList").html(block);
                                 }else{
                                        $("#tixingList").html("<div>暂无数据</div>");
                                 }
                        }  else {
                            $.toast('请求错误！');
                        }
   });

})
   /******************************************查询方法结束*************************************************/
//====================公共方法===========================
/*
获取格式化后文件大小
*/
function getFileSize(byteSize) {
    if (byteSize != undefined) {
        if (byteSize === 0) return '0 KB';
        var k = 1024; // or 1000
        sizes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        i = Math.floor(Math.log(byteSize) / Math.log(k));
        if (i > 0) {
            return (byteSize / Math.pow(k, i)).toFixed(0) + ' ' + sizes[i];
        } else {
            var num = Math.round(byteSize * 100) / 100;
            if (num <= 0) {
                return '0.01 ' + sizes[0];
            }
            return num + ' ' + sizes[0];
        }
    }
}
//***********************************************************************************
//                              遍历参数
//***********************************************************************************
function getParam(){
    //所有的部门id
    for(var i=0;i<sysUserInfo.userOrgList.length;i++){
        allorgid+=sysUserInfo.userOrgList[i].organization_ID+",";
        allorgname=allorgname.length>0?allorgname+","+sysUserInfo.userOrgList[i].organization_Name:sysUserInfo.userOrgList[i].organization_Name;
    }
    //所有的角色id
    for(var i=0;i<sysUserInfo.userRoleList.length;i++){
        allroleid+=sysUserInfo.userRoleList[i].roles_ID+",";
        // allrolename+=sysUserInfo.userRoleList[i].roles_Name+",";
          allrolename=allrolename.length>0?allrolename+","+sysUserInfo.userRoleList[i].roles_Name:sysUserInfo.userRoleList[i].roles_Name;
    }
    //所有的用户组id
    for(var i=0;i<sysUserInfo.userGroupList.length;i++){
        allgroupid+=sysUserInfo.userGroupList[i].userGroup_ID+",";
       // allgroupname+=sysUserInfo.userGroupList[i].userGroup_Name+",";
         allgroupname=allgroupname.length>0?allgroupname+","+sysUserInfo.userGroupList[i].userGroup_Name:sysUserInfo.userGroupList[i].userGroup_Name;
    }
}
//***********************************************************************************
//                              字符串转json
//***********************************************************************************
function strToJson(str){
    //如果本来就是对象，强转会异常
   try {
         if(str!=null&&str!=""&&str!=undefined){
            return JSON.parse(str);
        }else{
            return null;
        }
    } catch (e) {
        return str;
    }
}
//**********************************************************************
//                              全局方法系列
//**********************************************************************



//夜间模式
var $dark = $("#dark-switch").on("change", function() {
  $(document.body)[$dark.is(":checked") ? "addClass" : "removeClass"]("theme-dark");
});

$.init();//加载组件


//**********************************************************************
//全局异步请求数据
//**********************************************************************
function getAjax(url, parm, callBack, callBackError, callBackType, mode,istongbu) {
    var token = "userinfo_token is none";
    if (callBackType == null || callBackType == "" || callBackType == undefined)
        callBackType = "text";
    if (mode == null || mode == "" || mode == undefined)
        mode = "get";
    if (istongbu == null || istongbu == "" || istongbu == undefined)
        istongbu =true;

  try{
      $.ajax({
          type: mode,
          beforeSend: function (xhr) {
             if(!QueryString("courseId")){
                  token = strToJson(GetlocalStorage("userinfo_token"),token);
                  xhr.setRequestHeader("X-Session-Token",token);
              }
          },
          //手机端需要加上token验证
          headers: {
              //"Accept": "text/plain; charset=utf-8",
              //"Content-Type": "text/plain; charset=utf-8",
              "Accept": "application/json, text/javascript, */*; charset=utf-8",
              "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          },
          async:istongbu,
          url: url,
          data: parm,
          dataType: callBackType,
          cache: false,
          success: function (msg, status, xhr) {
            pedding=false;
              callBack(msg);
               $.hideIndicator(); //隐藏loading
          },
          error: function (err) {
              $.hideIndicator(); //loading
              if(callBackError != undefined && callBackError != null && callBackError != "")
              callBackError(err);
              // $.alert(err);
              console.log('请求服务器错误！');
              pedding=false;
              console.error("服务器访问异常：" + err.readyState);
          }
      });

  }
  catch(error) {
    $.alert("请求错误,请刷新重试！");
    $.hideIndicator();
  }
}

//*************************任务的查询单独取出来，方便再次调用*********************************
function getrenwuList(state,optype, pageIndex, pageSize){
//  debugger;
  var name=$("#search").val();
      sysUserInfo=getUserInfo();
          //默认登录进来就请求任务列表
          //请求所有任务
          getAjax(javaserver+"/stage/findStudentStage",
          { name:name,
              orgID:sysUserInfo.organization_ID,
              user_id:sysUserInfo.user_ID,
              org_Id:sysUserInfo.allorgid,
              role_Id:sysUserInfo.allroleid,
              user_groupId:sysUserInfo.allgroupid,
              pageSize:pageSize,
              pageIndex:pageIndex,
              state:state},
          function (data) {
               data=strToJson(data);
                  if (data.errorcode==0&&data.numCount>0&&data.datas.length>0) {
                      //当前所有的任务
                      allrenwu=data;
                      //任务列表
                      var renwu="";
                       for(var i = 0; i<data.datas.length; i++){
                           //进度标识
                          var center="";
                          //单独把string 拿出来转一下（否则比较不了）
                          var coursecout=data.datas[i].courser_count;
                          //已完成
                          if(data.datas[i].completeCount>=coursecout){
                              center="<div class='item-after'><i class='iconfont icon-shenhetongguo' style='color:#339966'></i></div>";
                          //进行中
                          }else if(data.datas[i].completeCount<coursecout&&data.datas[i].completeCount>0){
                              center="<div class='item-after'><i class='iconfont icon-icon27' title='学习中' style='color:#39f'></i></div>";
                          }
                          //追加的任务列表
                          renwu+="<li> <a href='../html/peixun/info.html?arrangeId="+data.datas[i].id+"'  target='_black' class='item-link item-content'> <div class='item-inner'><div class='item-title'>"+data.datas[i].name+"</div>"+center+" </div>  </a> </li>    ";
                      }
                      //给页面附上列表
                      if(optype==1){
                          $(".renwulist").html(renwu);
                      }else{
                          $(".renwulist").append(renwu);
                      }
                      if(pageIndex>=data.pageCount){
                          $("#stageLoadMore").hide();
                      }else{
                          $("#stageLoadMore").show();
                      }
                      if(state==1){
                          $("#renwu_all").html("全部<span class='badge'>"+data.numCount+"</span>");
                          $("#renwu_wks").html("未开始");
                          $("#renwu_jxz").html("进行中");
                          $("#renwu_ywce").html("已完成");
                      }else if(state==2){
                          $("#renwu_all").html("全部");
                          $("#renwu_wks").html("未开始<span class='badge'>"+data.numCount+"</span>");
                          $("#renwu_jxz").html("进行中");
                          $("#renwu_ywce").html("已完成");
                      }else if(state==3){
                          $("#renwu_all").html("全部");
                          $("#renwu_wks").html("未开始");
                          $("#renwu_jxz").html("进行中<span class='badge'>"+data.numCount+"</span>");
                          $("#renwu_ywce").html("已完成");
                      }else if(state==4){
                          $("#renwu_all").html("全部");
                          $("#renwu_wks").html("未开始");
                          $("#renwu_jxz").html("进行中");
                          $("#renwu_ywce").html("已完成<span class='badge'>"+data.numCount+"</span>");
                      }

                  }else if(data.errorcode==0&&(data.numCount==0||data.datas.length<=0)){
                      if(optype==1){
                          $(".renwulist").html(renwunull);
                      }else{
                          $("#stageLoadMore").hide();
                      }
                  }
                  $("#stagePageIndex").html(pageIndex);
                  $.hideIndicator();
        });

}
 //查询文件列表
 //fid  父id
 //type     排序条件
 //tagid     标签
 //orderby   排序
 //optype   1.追加html，2.替换html
 //pageSize   每页条数
 //pageIndex   当前页数
 //needOrg    是否显示企业文件夹
  function getfilelist(fid,type,tagid,orderby,optype,pageSize,pageIndex,needOrg,name){

     //文件缺省图
    var wenjiannull="<dl style='height:100%;width:100%;position: absolute;margin-top: 25%;color:#cecece;'><dd style='text-align:center;margin:0'><img src='../res/img/knownull.png' style='width: 50%;'></dd><dt style='text-align: center;'>暂无数据</dt></dl>";
    //var name=$("#search").val();
    sysUserInfo=getUserInfo();
    //获取文件
    getAjax(javaserver + "/Kapi/getuserfile",
        { userid: sysUserInfo.user_ID,
            fid: fid,
            orgid: sysUserInfo.organization_ID,
            searchText: name,
            searchType: type,
            tagid: tagid,
            orderby: orderby,
            pageSize: pageSize,
            pageIndex: pageIndex,
            fileType: "",
            powerLV: 99
        }, function (data) {
            data = strToJson(data);
            if (data.errorcode == 0 && data.datas.length > 0) {


                //是否显示企业文件夹
                if (needOrg != undefined && needOrg) {
                    block = "<li id='orgfile'><label class='label-checkbox item-content'><div class='item-media'><img src='../res/fileicon/fenxiang_folder_56.png' /></div><div class='item-inner'><a class='item-link' fid=0><div class='item-title'>共享文件</div></a></div></label></li>";
                } else {
                    block = "";
                }
                //遍历文件
                for (var i = 0; i < data.datas.length; i++) {
                    // 处理父级路径
                    var dataFpath = data.datas[i].filepath;
                    if (dataFpath == undefined || dataFpath == null || dataFpath == "" || dataFpath == "/") {
                        dataFpath = "/" + data.datas[i].fileName;
                    } else {
                        dataFpath = data.datas[i].filepath + "/" + data.datas[i].fileName;
                    }
                    //查询子集
                    if (data.datas[i].fileType == "folder") {
                        block += "<li ><label class='label-checkbox item-content'><div class='item-media' ><img src='../res/fileicon/" + data.datas[i].fileType + "_56.png'  onerror='javascript:this.src=\"../res/fileicon/qita_56.png\"'/></div><div class='item-inner'><div class='item-title'><a href='#' class='item-link' data=" + data.datas[i].upId + " other=" + data.datas[i].fileType + " fpath=" + dataFpath + " fid=" + data.datas[i].fid + ">" + data.datas[i].fileName + "</a></div><input type='checkbox' name='my-radio' value='" + data.datas[i].upId + "'><div class='item-media'><i class='icon icon-form-checkbox'></i></div></div></label></li>";
                        //预览
                    } else {
                        block += "<li ><label class='label-checkbox item-content'><div class='item-media' onclick='openfile(" + JSON.stringify(data.datas[i]) + ")'><img src='../res/fileicon/" + data.datas[i].fileType + "_56.png'  onerror='javascript:this.src=\"../res/fileicon/qita_56.png\"'/></div><div class='item-inner'><div class='item-title'><a onclick='openfile(" + JSON.stringify(data.datas[i]) + ")' class='item-link'>" + data.datas[i].fileName + "</a></div><input type='checkbox' name='my-radio' value='" + data.datas[i].upId + "'><div class='item-media'><i class='icon icon-form-checkbox'></i></div></div></label></li>";
                    }
                }
                //追加html   （分页）
                if (optype == 1) {
                    $("#filelist").append(block);
                    //总页数
                    pageCount = data.pageCount;
                    //隐藏分页
                    if (pageCount <= pageIndex) {
                        $("#loadMore").hide();
                    }
                    //替换html  （刷新，排序，搜索）
                } else {
                    $("#filelist").html(block);
                    //隐藏分页
                    if (data.pageCount <= pageIndex) {
                        $("#loadMore").hide();
                    }
                }
                $.hideIndicator(); //隐藏loading
                //如果查询的数据为空
            } else if (data.errorcode == 0 && data.datas.length <= 0) {
                if (optype == 2) {
                    if ((fid == 0 || fid == "0") && needOrg) {
                        $("#filelist").html("<li id='orgfile'><label class='label-checkbox item-content'><div class='item-media'><img src='../res/fileicon/fenxiang_folder_56.png' /></div><div class='item-inner'><a class='item-link' fid=0><div class='item-title'>企业共享</div></a></div></label></li>");
                    } else {
                        $("#filelist").html(wenjiannull);
                    }
                }
                $("#loadMore").hide();
                $.hideIndicator(); //隐藏loading
            } else {
                $.hideIndicator(); //隐藏loading
                $("#loadMore").hide();
            }
            $("#filepage").html(pageIndex)
            $.hideIndicator(); //隐藏loading
        });
  }



  //获取缓存用户信息，如果为空，跳转登录页
  function getUserInfo(){
    var sysUserInfo=strToJson(GetlocalStorage("userinfo"));
    if(sysUserInfo==null||sysUserInfo==undefined||sysUserInfo==""){
        window.location.href ="/app/login.html";
    }else{
        return sysUserInfo;
    }
  }
  function GetlocalStorage(name) {
    // / <summary>
    // / 获得本地数据
    // / </summary>
    if (window.localStorage) {
        // 获取token
        if(name == "userinfo_token"){
            return getToKen();
        }
        //获取本地缓存
        var value = localStorage.getItem(name);
        if (value != null&&value!=""&&value!=undefined) {
                //如果获取的值已经是对象，强转会报错，直接返回
               try {
                   return JSON.parse(value);
               } catch (e) {
                    return value;
              }
       } else {
              return value;
         }

    } else {
       $.toast("您的浏览器不支持本系统，或开启了隐身模式");
    }
}
// 获取token
function getToKen (){
    var localtoken={};
    try{
        var localtoken = JSON.parse(localStorage.getItem("userinfo_token"));
    }catch(e){
        return null;
    }
    var exp = 1000 * 60 * 60 * 24; // 过期时间 1 天
    if (localtoken == undefined || localtoken == null || localtoken == "") {
        localtoken = "";
    } else if (!localtoken.hasOwnProperty('outTime') || !localtoken.hasOwnProperty('token')) {
        localtoken = "";
    } else if (localtoken.hasOwnProperty('outTime') && parseInt(new Date().getTime() - exp) > new Date(localtoken.outTime).getTime()) {
        localtoken = "";
    } else if (localtoken.hasOwnProperty('token')) {
        localtoken = localtoken.token.toString();
    }
    return localtoken;
}
function SetlocalStorage(name, obj) {
    // / <summary>
    // / 重写本地数据
    // / </summary>
    if (window.localStorage) {

        try {
            if(name == "userinfo_token"){
                var tokenObj = { token: obj, outTime: "" };
                tokenObj.outTime = new Date().getTime();
                localStorage.setItem("userinfo_token", JSON.stringify(tokenObj));
            }else{
                //localStorage.setItem(name, JSON.stringify(obj));
                localStorage.setItem(name, obj);
            }
        }
        catch (oException) {
            if (oException.name  == 'QuotaExceededError') {
                $.toast("超出本地存储限额！");
                //如果历史信息不重要了，可清空后再设置
                localStorage.clear();
                if(name == "userinfo_token"){
                    var tokenObj = { token: obj, outTime: "" };
                    tokenObj.outTime = new Date().getTime();
                    localStorage.setItem("userinfo_token", JSON.stringify(tokenObj));
                }else{
                    //localStorage.setItem(name, JSON.stringify(obj));
                    localStorage.setItem(name, obj);
                }
            }
        }
    } else {
       $.toast("您的浏览器不支持本系统，或开启了隐身模式");
    }
}
function QueryString(fieldName) {
    /// <summary>
    ///   获得URL GET参数
    /// </summary>
    /// <param name="fieldName" type="String">
    ///   参数名
    /// </param>
    /// <returns type="void" />如果不存在返回NULL
    var reg = new RegExp("(^|&)" + fieldName.toLowerCase() + "=([^&]*)(&|$)", "i");
    var r = window.location.search.toLowerCase().substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
function goto(url) {
    $.router.loadPage(url);
}

///***api相关事件以及各个控件的调用方法*************///
//下拉刷新任务
function FreshRW(nowState, pageIndex, pageSize){
  //绑定下来刷新
  // winapi.setCustomRefreshHeaderInfo({
  //         bgColor: '#C0C0C0',
  //         dropColor:'#9BA2AC',
  //         refreshHeaderHeight:60, //下拉高度达到时触发刷新
  //         image: FreshLoadimgImg
  //    }, function() {
  //      setTimeout(function () {
  //               // 加载完毕需要重置
  //               getrenwuList(nowState,1);
  //               $.pullToRefreshDone('.renwu');
  //               $.toast('刷新成功！');
  //               console.log("刷新任务");
  //               api.refreshHeaderLoadDone();
  //        }, 1000);
  // });
}
//获取手机当前的网络状态
function GetConnectionType(){
  var connectionT = winapi.connectionType;
  if(connectionT == "none"){  //无网络链接
    $.toast('当前网络不可用，请检查网络设置！');
  }
}
//打开文件预览
function openfile(stringjson) {
    SetlocalStorage("fileobj", JSON.stringify(stringjson));
    $.router.loadPage("../html/wenjian/yulan.html");
}
