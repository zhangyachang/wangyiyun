/*https://route.showapi.com/213-1?keyword=海阔天空&page=1&showapi_appid=52796&showapi_test_draft=false&showapi_timestamp=20171222213508&showapi_sign=a78ad4e413f04bb5993f99546ea0071e*/

$(function(){
    var $Tbody = $("#tbody"),
        $Audio = $("audio"),
        //歌曲的头像 信息栏
        $person = $(".person"),
        timerArr,
        num = 0;


    searchMusic("我好想你",1);

    //遍历歌曲
    function searchMusic(val,page){
    //  val代表了搜索的名字
        var url = "https://route.showapi.com/213-1?keyword="+val+"&page="+page+"&showapi_appid=52796&showapi_test_draft=false&showapi_timestamp="+getTime()+"&showapi_sign=e4da99c4a26a4f7dada888591dfb9efe";
    //初始化歌曲列表
        $.getJSON(url,function(msg){
            $Tbody.html("");
            var $music = msg.showapi_res_body.pagebean;
            //console.log(msg);
            $Tbody.data({
                "currentPage" : $music.currentPage,
                "val" : val
            });
            //第一首歌的时候保存下来正确的页面数
            if($Tbody.data("currentPage")===1){
                $Tbody.data("allPages",$music.allPages);
            }
            var $List = $music.contentlist;
            //把属性都存到td标签的属性中
            for(var key in $List){
                var $tr = $("<tr></tr>");
                $tr.data({
                    "m4a" : $List[key].m4a,
                    "songid" : $List[key].songid,
                    "downUrl" : $List[key].downUrl,
                    "singername" : $List[key].singername,
                    "songname" : $List[key].songname,
                    "albumpic_big" : $List[key].albumpic_big,
                    "albumpic_small" : $List[key].albumpic_small,
                    "albumname" : $List[key].albumname
                }).append("<td>"+FM(key*1+1)+"</td><td>"+$tr.data("songname")+"</td><td>"+$tr.data("singername")+"</td><td>"+$tr.data("albumname")+"</td>").appendTo($Tbody);
            }
    //初始化滚动条高度
            var $conRight = $(".con-right");
            scrollBar($("#bar1"),$conRight.find(".con-right-height"),$conRight);
        });
    }
    //滑块滚动事件
    function scrollBar(obj1,obj2,obj3){
        // obj1 滚动条的滑块
        // obj2 监听高度的对象
        // obj3 绑定滚动事件的对象，可视区域
        obj1.height((obj3.height()/obj2.height())*obj1.parent().height());

        obj3.on("mousewheel",function(e,d){
            e.preventDefault();
            var top = obj1.position().top,
                //滚动块可以移动的最大范围
                maxHeight = obj3.height()-obj1.height(),
                //歌曲列表的那里可以移动的最大距离
                maxConScrollHeight = obj2.height()-obj3.height();
            if(d>0){//向上滚动
                top -= 30;
            }else{//向下滚动
                top += 30;
            }
            top = Math.min(top,maxHeight);
            top = Math.max(top,0);
            obj1.css("top",top);
            obj2.css("top",-top/maxHeight*maxConScrollHeight);
        })

    }

    //双击音乐播放
    $Tbody.on("dblclick","tr",function(){
        //更新第几首歌曲
        var $singerImage = $person.find("img"),
            $songName = $person.find(".songname"),
            $singerName = $person.find(".singername");

        var $TrThis = $(this),
            showTime = $(this).index();

        //播放当前点击的歌曲
        $Audio.prop("src",$TrThis.data("m4a"))[0].play();
        $("#play1").removeClass("play").addClass("pause");


        $Audio.data({
            "showTime" : showTime,
            "songname" : $TrThis.data("songname"),
            "singername" : $TrThis.data("singername"),
            "albumpic_small" : $TrThis.data("albumpic_small"),
            "albumpic_big" : $TrThis.data("albumpic_big"),
            "songid" : $TrThis.data("songid")
        });

    });


    //翻页
    (function(){
        //首页
        $("#firstPage").on("click",function(){
            if($Tbody.data("currentPage") === 1) return;
            FMHeight();
            searchMusic($Tbody.data("val"),1);
        });

        //上一页
        $("#prevPage").on("click",function(){
            if($Tbody.data("currentPage") === 1) return;
            FMHeight();
            searchMusic($Tbody.data("val"),$Tbody.data("currentPage")-1);
        });

        //下一页
        $("#nextPage").on("click",function(){
            if($Tbody.data("currentPage") === $Tbody.data("allPages")) return;
            FMHeight();
            searchMusic($Tbody.data("val"),$Tbody.data("currentPage")+1);

        });

        //尾页
        $("#lastPage").on("click",function(){
            //不能大于那个第一页存下来的最大值
            if($Tbody.data("currentPage") === $Tbody.data("allPages")) return;
            FMHeight();
            searchMusic($Tbody.data("val"),$Tbody.data("allPages"));
        });
        //点击上一页下一页 格式化高度
        function FMHeight(){
            $(".con-right-height").css("top",0);
            $("#bar1").css("top",0);
        }

    })();




    // 上一首 下一首 播放 暂停
    (function(){
        //上一首下一首 暂停的按钮
        var $Button = $(".button"),
            $prev = $Button.find(".prevSong"),
            $play = $Button.find("#play1"),
            $next = $Button.find(".nextSong");

        //播放 暂停
        $play.on("click",function(){
            if($(this).hasClass("play")){//暂停中
                $Audio[0].play();
            }else{//正在播放音乐
                $Audio[0].pause();
            }
            //增加删除图标样式
            $(this).toggleClass("play pause");
        });

        //上一首
        $prev.on("click",function(){
            var showTime = $Audio.data("showTime")-1,
                $Tr = $Tbody.children();
            showTime = showTime===-1?0:showTime;
            //歌曲src赋值
            var $TrThis = $Tr.eq(showTime);

                $Audio.prop("src",$TrThis.data("m4a"))[0].play();

            $Audio.data({
                "showTime" : showTime,
                "songname" : $TrThis.data("songname"),
                "singername" : $TrThis.data("singername"),
                "albumpic_small" : $TrThis.data("albumpic_small"),
                "albumpic_big" : $TrThis.data("albumpic_big"),
                "songid" : $TrThis.data("songid")
            });

            $("#play1").removeClass("play").addClass("pause");
        });

        //下一首
        $next.on("click",function(){
            var showTime = $Audio.data("showTime")+1,
                $Tr = $Tbody.children();
            showTime = showTime===$Tr.length-1?$Tr.length-1:showTime;

            var $TrThis = $Tr.eq(showTime);

            $Audio.prop("src",$TrThis.data("m4a"))[0].play();

            $Audio.data({
               "showTime" : showTime,
               "songname" : $TrThis.data("songname"),
               "singername" : $TrThis.data("singername"),
               "albumpic_small" : $TrThis.data("albumpic_small"),
               "albumpic_big" : $TrThis.data("albumpic_big"),
               "songid" : $TrThis.data("songid")
            });

            $("#play1").removeClass("play").addClass("pause");
        });


    })();




    //当资源开始加载的时候
    $Audio.on("loadstart",function(){
        num = 0;
        $("#lyricList").html("");
         $("#lyricList").css("top",0);


        var $songImage = $person.find("img"),
            $songName = $person.find(".songname"),
            $singerName = $person.find(".singername");
        //歌词层
        var $lyric = $(".lyric"),
            $h1 = $lyric.find("h1"),
            $lyricSong = $lyric.find(".songname"),
            $lyricSingername = $lyric.find(".singername");


            //更新图像和文字
        $songImage.prop("src",$Audio.data("albumpic_small"));
        $songName.html($Audio.data("songname"));
        $singerName.html($Audio.data("singername"));

        $h1.html($Audio.data("songname"));
        $lyricSong.html($Audio.data("songname"));
        $lyricSingername.html($Audio.data("singername"));


        getLyric($Audio.data("songid"));

    });

    //同步进度条
    function Synchronize(){
        var $footer = $(".footer"),
            $nowTime = $footer.find("#nowTime"),
            $bar = $footer.find(".bar"),
            $footerBar = $footer.find("#footer-bar"),
            $allTime = $footer.find("#allTime"),
            $nowRed = $footer.find(".red");


        var $TotalTime = $Audio[0].duration,
            currentTime = $Audio[0].currentTime;

        var x = Math.floor(currentTime)/Math.floor($TotalTime)*$bar.width();
        $nowRed.width(x);
        $footerBar.css("left",x);

        var nowTime = FM(Math.floor(currentTime/60)) +":"+ FM(Math.floor(currentTime%60)),
            allTime = FM(Math.floor($TotalTime/60)) +":"+ FM(Math.floor($TotalTime%60));

        $nowTime.html(nowTime);
        //这个地方判断有点麻烦了 问问老师哪里可以放过去
        if($TotalTime){
            $allTime.html(allTime);
        }

    }


    //audio的事件
    // audio的currentTime发生改变触发
    $Audio.on("timeupdate",function(){
        var $aLi = $("#lyricList").children();

        Synchronize();


        if($Audio[0].currentTime > timerArr[num]*1){
            if($Audio[0].currentTime > timerArr[num+1]*1){
                num++;
                $aLi.each(function(index,li){
                    if(index < num){
                        $(li).css("color","#666");
                    }else if(index === num){
                        if(index>4 && index<$aLi.length-4){
                            $("#lyricList").css("top",-(index-4)*$aLi.eq(1).height());
                        }
                        $(li).css("color","#f60");
                    }
                })
            }
        }

    });


    //歌曲进度条 同步
    (function(){
        //  当前时间  进度条  总时间 红色的进度条
        var $footer = $(".footer"),
            $nowTime = $footer.find("#nowTime"),
            $footerBar = $footer.find("#footer-bar"),
            $allTime = $footer.find("#allTime"),
            $nowRed = $footer.find(".red");

        $footerBar.on("mousedown",function(e){
            $Audio.off("timeupdate");
            var x = e.clientX,
                y = e.clientY,
                BarX = $(this).position().left,
                BarY = $(this).position().top,
                width = $footerBar.parent().width(),
                OldWidth = $nowRed.width();

            $(document).on("mousemove",function(e){
                var moveX = e.clientX,
                    moveY = e.clientY,
                    left = moveX-x+BarX;
                //处理移动的距离大小
                left = Math.max(0,left);
                left = Math.min(left,width);
                //红色进度条和 滚动条赋值
                OldWidth = left;
                $footerBar.css("left",left-$footerBar.width()/2);
                $nowRed.width(left);
            });

            $(document).one("mouseup",function(){
                $Audio[0].currentTime = OldWidth/width * Math.floor($Audio[0].duration);
                $Audio.on("timeupdate",function(){
                    Synchronize();
                });
                $(this).off("mousemove");
            });
        });

    })();

    //音量拖动
    (function(){
        var $volume = $(".footer .volume"),
            $volumeP = $volume.find("#volume-p"),
            $volumeSpan = $volume.find("#volume-span"),
            $volumeRed = $volume.find(".red2");

        $volumeSpan.on("mousedown",function(e){
            var x = e.clientX,
                y = e.clientY,
                BarX = $(this).position().left,
                BarY = $(this).position().top,
                width = $(this).parent().width(),
                OldWidth = $volumeRed.width();

            $(document).on("mousemove",function(e){
                var moveX = e.clientX,
                    moveY = e.clientY,
                    left = moveX-x+BarX;
                //处理移动的距离大小
                left = Math.max(0,left);
                left = Math.min(left,width);
                //红色进度条和 滚动条赋值
                OldWidth = left;
                $Audio[0].volume = OldWidth/width;
                $volumeSpan.css("left",left-$volumeSpan.width()/2);
                $volumeRed.width(left);
            });

            $(document).one("mouseup",function(){
                $(this).off("mousemove");
            });
        });

    })();


    //打开歌词层
    (function(){
        var $container = $(".container"),
            $person = $container.find(".person"),
            $containerMain = $container.find(".containerMain"),
            $cover = $container.find(".contentDetails"),
            $closeCover = $container.find(".icon-zuixiaohua");

        $person.on("click",function(){
            $containerMain.fadeOut(1000,function(){
                $cover.fadeIn(600);
            });

        });

        $closeCover.on("click",function(){
            $cover.fadeOut(1000,function(){
                $containerMain.fadeIn(600);
            });
        });
    //https://route.showapi.com/213-2?musicid=4833285&showapi_appid=51346&showapi_test_draft=false&showapi_timestamp=20171225020829&showapi_sign=b9f10a24ee6187dd9ec82d2c6b259323

    })();

    //关闭歌词层
    function closeCover(){
        $(".contentDetails").fadeOut(1000,function(){
            $(".containerMain").fadeIn(600);
        });
    }
    //请求歌词
    function getLyric(songid){
        var url = "https://route.showapi.com/213-2?musicid="+songid+"&showapi_appid=52796&showapi_test_draft=false&showapi_timestamp="+getTime()+"&showapi_sign=e4da99c4a26a4f7dada888591dfb9efe";
        var $FMlyric = $(".FMlyric");
        $.getJSON(url,function(msg){
            var content = msg.showapi_res_body.lyric;
            $FMlyric.html(content);
            $FMlyric.html().replace(/\[([\d:.]+)\](.+)/g,function(a,$1,$2){
                $("<li></li>").data("time",$1).html($2).appendTo($("#lyricList"));
            });
            scrollLyric();
        })
    }

    //歌词滚动
    function scrollLyric(){
        var $Ul = $("#lyricList"),
            $aLi = $Ul.children();

        timerArr = $aLi.map(function(value,li){
            return $(li).data("time").replace(/(\d{2}):(\d{2}).(\d{2})/,function(a,$1,$2,$3){
                return $1*60 + $2*1 + $3/1000;
            })
        })
    }





    //搜索框搜索音乐
    $("#searchInput").on("keyup",function(e){
        if($(this).val() && e.keyCode===13){
            searchMusic($(this).val(),1);
            closeCover();
        }
    });

    //点击搜索框右边
    $(".search .icon-sousuo").on("click",function(e){
        var input = $("#searchInput");
        if(input.val()){
            $Tbody.html("");
            searchMusic(input.val(),1);
            closeCover();
        }
    });


















    //获得本地时间戳
    function getTime(){
        var date = new Date();
        var YY = date.getFullYear(),
            MM = FM(date.getMonth()+1),
            DD = FM(date.getDate()),
            hh = FM(date.getHours()),
            mm = FM(date.getMinutes()),
            ss = FM(date.getSeconds());
        return YY+MM+DD+hh+mm+ss;
    }
    //格式化时间
    function FM(n){
        return n<10?"0"+n:n+"";
    }




});


