var token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJkclwiOmZhbHNlLFwiaWRcIjoxMTUsXCJpcFwiOlwiNTguMjE2LjIwMy45MFwiLFwicGFzc3dvcmRcIjpcImYzNzllYWYzYzgzMWIwNGRlMTUzNDY5ZDFiZWMzNDVlXCIsXCJwaG9uZVwiOlwiMTM1ODQzMzEyMTJcIixcInJlYWxOYW1lXCI6XCJ6bVwiLFwicm9sZVwiOlwiYWRtaW5cIixcInN0YXR1c1wiOlwiTk9STUFMXCIsXCJ0c0luc2VydFwiOjE1NTM1MDMxMTIwMDAsXCJ1c2VyTmFtZVwiOlwiMTM1ODQzMzEyMTJcIn0iLCJyb2xlcyI6Im1lbWJlciIsImlhdCI6MTU1NTQ2NzQzMCwiZXhwIjoxNTU1ODk5NDMwfQ.KJDwIps3sRx19g5WT46qErGkLPOKRMVVP_e_PvSBh54';
// const login = function() {
//     var sendData = { 'userName': 'admin', 'password': '123qwe' };
//     $.ajax({
//         type: "post",
//         url: "https://www.yidianbox.com/api/login",
//         data: JSON.stringify(sendData),
//         headers: { "Content-Type": "application/json" },
//         success: function (res) {
//             console.log('token:', res)
//             token = res;
//             cameraList()
//             diffDate()
//             sevenDay()
//             sexAndAge()
//             psnList()
//         },
//         error: function (res) {
//         }
//     })
// }
const cameraList = function() {
    $.ajax({
        type: "post",
        url: "https://www.yidianbox.com/api/wx/my/camList?userId=111&storeId=40",
        headers: { "Content-Type": "application/json" },
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", 'Bearer ' + token);
        },
        success: function (res) {
            var code = res.returnCode;
            if ('301' == code || '302' == code) {
                //token登录过期需要重新登录
                console.log('token过期:', res)
            } else if ('1' == code) {
                // 成功
                console.log('cameraLIst成功:', res)
                let cameraList = document.querySelector("#cameraList")
                let currentcamera = document.querySelector("#currentcamera")
                let list = res.data.camlist
                let innerHTML = ''
                for (let i = 0; i < list.length;i++) {
                    innerHTML += "<p class='dropdown-item' camno='" + list[i].camNo + "' tabindex='-1'>" + list[i].camNickName
                }
                cameraList.innerHTML = innerHTML
                currentcamera.innerHTML = list[0].camNickName
                currentcamera.setAttribute('camno', list[0].camNo)
                getLiveUrl()
            } else if ('0' == code) {
                // 失败
                console.log('失败:', res)
            } else { }
        },
        error: function (res) {
        }
    })
}
const diffDate = function() {
    let date = getNowFormatDate()
    var sendData = {
        storeId: '40',
        date: date
    };
    $.ajax({
        type: "post",
        url: "https://www.yidianbox.com/api/wx/statist/diffDateScopeIntoStoreTimeStatist",
        data: JSON.stringify(sendData),
        headers: { "Content-Type": "application/json" },
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", 'Bearer ' + token);
        },
        success: function (res) {
            var code = res.returnCode;
            if ('301' == code || '302' == code) {
                //token登录过期需要重新登录
                console.log('token过期:', res)
            } else if ('1' == code) {
                // 成功
                console.log('本月今日昨日列表成功:', res)
                let month = document.querySelector("#month")
                let today = document.querySelector("#today")
                let yesterday = document.querySelector("#yesterday")
                let result = res.data.resultList
                today.innerHTML = result[0].value
                month.innerHTML = result[1].value
                yesterday.innerHTML = result[2].value
            } else if ('0' == code) {
                // 失败
                console.log('失败:', res)
            } else { }
        },
        error: function (res) {
        }
    })
}
const sevenDay = function() {
    //获取最近7天客流趋势, 下方storeId是使用烟草店做测试。
    var date1 = new Date();
    var month = '';
    if(date1.getMonth()+1<10){
        month = '0'+(date1.getMonth()+1)
    }else{
        month = date1.getMonth()+1
    }

        time1=date1.getFullYear()+"-"+month+"-"+date1.getDate();
    var sendData = {
        storeId: '40',
        date: time1,
        group1: { type: 'all', typeId: 'all' }, //总人次
        group2: { type: 'age', typeId: '20-29' } //20-30岁
    };
    console.log(sendData)
    $.ajax({
        type: "post",
        url: "https://www.yidianbox.com/api/wx/statist/sevenDayGroupCompareStatist",
        data: JSON.stringify(sendData),
        headers: { "Content-Type": "application/json" },
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", 'Bearer ' + token);
        },
        success: function (res) {
            var code = res.returnCode;
            if ('301' == code || '302' == code) {
                //token登录过期需要重新登录
                console.log('token过期:', res)
            } else if ('1' == code) {
                // 成功
                console.log('最近7天客流趋势成功:', res)
                let data = res.data.resultList
                console.log("7天data",data)
                var box = document.getElementById('7day');
                var w = box.offsetWidth;
                const chart = new G2.Chart({
                    container: document.getElementById('7day'), // 或直接填 'c1'
                    width: w,
                    height: 500,
                    forceFit: true,
                })
                chart.source(data, {
                    date:'time'
                })
                chart.tooltip({
                    crosshairs: {
                    type: 'line'
                   }
                 });
                 chart.axis('type', false)
                 chart.line().position('date*value').color('typeId');
                 chart.point().position('date*value').color('typeId').size(4).shape('circle').style({
    stroke: '#fff',
    lineWidth: 1
  });
  chart.render();
                          chart.render();
            } else if ('0' == code) {
                // 失败
                console.log('失败:', res)
            } else { }
        },
        error: function (res) {
        }
    })
}
const sexAndAge = function() {
    //获取男女比例以及年龄分布, 下方storeId是使用烟草店做测试。
        var date1 = new Date();
        var month1 = '';
        if(date1.getMonth()+1<10){
            month1 = '0'+(date1.getMonth()+1)
        }else{
            month1 = date1.getMonth()+1
        }
        time1=date1.getFullYear()+"-"+month1+"-"+date1.getDate();
        var date2 = new Date(date1);
        date2.setDate(date1.getDate()-7);
        var month2 = '';
        if(date1.getMonth()+1<10){
            month2 = '0'+(date2.getMonth()+1)
        }else{
            month2 = date2.getMonth()+1
        }
        var time2 = date2.getFullYear()+"-"+month2+"-"+date2.getDate();

        // alert(time2+time1)
    $.ajax({
        type: "post",
        url: "https://www.yidianbox.com/api/wx/statist/sexAndAgeStatist?storeId=40&startDate="+time2+"&endDate="+time1,
        headers: { "Content-Type": "application/json" },
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", 'Bearer ' + token);
        },
        success: function (res) {
            var code = res.returnCode;
            if ('301' == code || '302' == code) {
                //token登录过期需要重新登录
                console.log('token过期:', res)
            } else if ('1' == code) {
                // 成功
                console.log('男女比例及年龄分布成功:', res)
                let age = []
                let sex = []
                let resultList = res.data.resultList
                for( let i = 0; i < 6; i++) {
                    age.push(resultList[i])
                }
                for( let i = 6; i < 8; i++) {
                    sex.push(resultList[i])
                }
                var chart1 = new G2.Chart({
    container: 'age',
    forceFit: true,
    height: 300
  });
  chart1.source(age, {
    percent: {
      formatter: function formatter(val) {
        val = val * 100 + '%';
        return val;
      }
    }
  });
  chart1.coord('theta', {
    radius: 0.75
  });
  chart1.tooltip({
    showTitle: false,
    itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
  });
  chart1.intervalStack().position('percent').color('name').label('percent', {
    formatter: function formatter(val, item) {
      return item.point.name + ': ' + val;
    }
}).tooltip('name*percent', function(item, percent) {
    percent = percent * 100+ '%';
    return {
      name: item,
      value: percent
    };
  }).style({
    lineWidth: 1,
    stroke: '#fff'
  });
  chart1.render();

  var chart2 = new G2.Chart({
container: 'sex',
forceFit: true,
height: 300
});
chart2.source(sex, {
percent: {
formatter: function formatter(val) {
val = val * 100 + '%';
return val;
}
}
});
chart2.coord('theta', {
radius: 0.75
});
chart2.tooltip({
showTitle: false,
itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
});
chart2.intervalStack().position('percent').color('name').label('percent', {
formatter: function formatter(val, item) {
return item.point.name + ': ' + val;
}
}).tooltip('name*percent', function(item, percent) {
percent = percent * 100 + '%';
return {
name: item,
value: percent
};
}).style({
lineWidth: 1,
stroke: '#fff'
});
chart2.render();
            } else if ('0' == code) {
                // 失败
                console.log('失败:', res)
            } else { }
        },
        error: function (res) {
        }
    })
}
const psnList = function() {
    //获取访客记录, 下方storeId是使用烟草店做测试。
    var time = getNowFormatTime()
    var date = getNowFormatDate()
    $.ajax({
        type: "post",
        url: "https://www.yidianbox.com/api/wx/customer/getPsnList?storeId=40&date=" + date + "&time=" + time + "&page=1&count=10",
        headers: { "Content-Type": "application/json" },
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", 'Bearer ' + token);
        },
        success: function (res) {
            var code = res.returnCode;
            if ('301' == code || '302' == code) {
                //token登录过期需要重新登录
                console.log('token过期:', res)
            } else if ('1' == code) {
                // 成功
                console.log('访客记录成功:', res)
                let list = res.data.psnlist
                let psnlist = document.querySelector("#psnlist")
                let innerHTML = ''
                for(let i = 0;i<list.length;i++) {
                    if(list[i].groupName.length!=0){
                        let groupname = list[i].groupName.join();
                        innerHTML += "<div class='row users-unit'>" +
                                    "<img class='users right-margin' src='http://www.yidianbox.com:8081/output" +
                                    list[i].image +
                                    "'>" +
                                    "<div>" +
                                    "<div class='row users-unit'>" +
                                    "<div class='right-margin'>" +
                                    "无姓名" +
                                    "</div>" +
                                    "<div class='right-margin'>" +
                                    "<img src='../dist/img/" + list[i].sex + ".png'>" +
                                    "</div>" +
                                    "<span class='badge badge-warning'>" + list[i].age + "岁" +
                                    "</span>" +
                                    "</div>" +
                                    "<div class='row users-unit'>" +
                                    "<span class='badge badge-secondary right-margin'>" +
                                    groupname + "</span>" +
                                    "<span class='badge badge-info'>" + "7天入店" + list[i].timeOfSeven + "次"  +"</span>" +
                                    "</div>" +
                                    "</div>" +
                                    "</div>";
                    }else{
                          innerHTML += "<div class='row users-unit'>" +
                                    "<img class='users right-margin' src='http://www.yidianbox.com:8081/output" +
                                    list[i].image +
                                    "'>" +
                                    "<div>" +
                                    "<div class='row users-unit'>" +
                                    "<div class='right-margin'>" +
                                    "无姓名" +
                                    "</div>" +
                                    "<div class='right-margin'>" +
                                    "<img src='../dist/img/" + list[i].sex + ".png'>" +
                                    "</div>" +
                                    "<span class='badge badge-warning'>" + list[i].age + "岁" +
                                    "</span>" +
                                    "</div>" +
                                    "<div class='row users-unit'>" +
                                    // "<span class='badge badge-secondary right-margin'>" +
                                    // groupname + "</span>" +
                                    "<span class='badge badge-info'>" + "7天入店" + list[i].timeOfSeven + "次"  +"</span>" +
                                    "</div>" +
                                    "</div>" +
                                    "</div>";
                    }
                  

                }
                psnlist.innerHTML = innerHTML
            } else if ('0' == code) {
                // 失败
                console.log('失败:', res)
            } else { }
        },
        error: function (res) {
        }
    })
}
const getLiveUrl = function (){
    let currentcamera = document.querySelector("#currentcamera")
    let camno = currentcamera.getAttributeNode('camno').value
    $.ajax({
        type: "get",
        url: "https://www.yidianbox.com/api/out//video/getLiveUrl?camNo=" + camno,
        headers: { "Content-Type": "application/json" },
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", 'Bearer ' + token);
        },
        success: function (res) {
            console.log("video res:",res)
			var liveurl = res.data.liveUrl
            console.log("video liveurl:",liveurl)

            var box = document.getElementById('video');
            var w = document.body.clientWidth/2.22;
            console.log('w',w)
            var h = box.offsetHeight;
            console.log('h',h)
            var player = cyberplayer("video").setup({
                        flashplayer: "cyberplayer.flash.swf",
                        stretching: "uniform",
                        file: liveurl,
                        width: w,
                        height: 830,
                        autostart: true,
                        repeat: false,
                        volume: 100,
                        controls: true,
                        controlbar: {
                            barLogo: false
                        },
                        ak:'9e37363caad647f2865c8e0a07f8366d'
                    });
        },
        error: function (res) {
        }
    })

}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

function getNowFormatTime() {
    var date = new Date();
    var seperator1 = ":";
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds()
    if (hour >= 1 && hour <= 9) {
        hour = "0" + hour;
    }
    if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
    }
    var currentdate = hour + seperator1 + minutes + seperator1 + seconds;
    return currentdate;
}

$(document).ready(function () {
    // 登录

    window.setInterval(function (){
        let date = document.querySelector("#date")
        let time = document.querySelector("#time")
        let _date = getNowFormatDate()
        let _time = getNowFormatTime()
        date.innerHTML = _date
        time.innerHTML = _time
    },1000)
        var date1 = new Date(),
        time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();
        var date2 = new Date(date1);
        date2.setDate(date1.getDate()-7);
        var time2 = date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate();
    // login()
        cameraList()
        diffDate()
        sevenDay()
        sexAndAge()
        psnList()
        setInterval(function(){
            psnList()
        },30000)

});
