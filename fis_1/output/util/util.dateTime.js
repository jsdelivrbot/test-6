define("util/dateTime",["leaflet","core/namespace"],function(t){t.ICT.Util.DateTime=t.Class.extend({initialize:function(){},getNewDateTimeBeforHour:function(t){var e=new Date;return e=e.valueOf(),e-=60*t*60*1e3,e=new Date(e)},getCusUnixTime:function(t){var e=t.split(" "),n=e[0].split("-"),r=e[1].split(":"),g=parseInt(n[0]),o=parseInt(n[1])>0?parseInt(n[1])-1:0,a=parseInt(n[2]),s=parseInt(r[0]),u=parseInt(r[1]),i=parseInt(r[2]),M=new Date(g,o,a,s,u,i);return M.valueOf()/1e3},getCurrentUnixTime:function(){var t=new Date;return parseInt(t.valueOf()/1e3)},getDateFromformatFull:function(t){var e=t.split(" "),n=e[0].split("-"),r=e[1].split(":"),g=parseInt(n[0]),o=parseInt(n[1]),a=parseInt(n[2]),s=parseInt(r[0]),u=parseInt(r[1]),i=parseInt(r[2]),M=new Date(g,o,a,s,u,i);return M},formatDateFULL:function(t){var e=t.getFullYear(),n=t.getMonth()+1<10?"0"+(t.getMonth()+1):t.getMonth()+1,r=t.getDate()<10?"0"+t.getDate():t.getDate(),g=t.getHours()<10?"0"+t.getHours():t.getHours(),o=t.getMinutes()<10?"0"+t.getMinutes():t.getMinutes(),a=t.getSeconds()<10?"0"+t.getSeconds():t.getSeconds(),s=e+"-"+n+"-"+r+" "+g+":"+o+":"+a;return s},formatDateH:function(t){var e=t.getFullYear(),n=t.getMonth()+1<10?"0"+(t.getMonth()+1):t.getMonth()+1,r=t.getDate()<10?"0"+t.getDate():t.getDate(),g=t.getHours()<10?"0"+t.getHours():t.getHours(),o=e+"-"+n+"-"+r+" "+g;return o},formatDateHM:function(t){var e=t.getFullYear(),n=t.getMonth()+1<10?"0"+(t.getMonth()+1):t.getMonth()+1,r=t.getDate()<10?"0"+t.getDate():t.getDate(),g=t.getHours()<10?"0"+t.getHours():t.getHours(),o=t.getMinutes()<10?"0"+t.getMinutes():t.getMinutes(),a=e+"-"+n+"-"+r+" "+g+":"+o;return a},getTimeStrFromUnix:function(t){if(t=parseInt(t),isNaN(t))return"";var e=new Date(1e3*t),n=e.getFullYear(),r=e.getMonth()+1<10?"0"+(e.getMonth()+1):e.getMonth()+1,g=e.getDate()<10?"0"+e.getDate():e.getDate(),o=e.getHours()<10?"0"+e.getHours():e.getHours(),a=e.getMinutes()<10?"0"+e.getMinutes():e.getMinutes(),s=e.getSeconds()<10?"0"+e.getSeconds():e.getSeconds(),u=n+"-"+r+"-"+g+" "+o+":"+a+":"+s;return u},getTimeString:function(){var t=new Date,e=t.getFullYear().toString(),n=t.getMonth()+1<10?"0"+(t.getMonth()+1).toString():(t.getMonth()+1).toString(),r=t.getDate()<10?"0"+t.getDate().toString():t.getDate().toString(),g=t.getHours()<10?"0"+t.getHours().toString():t.getHours().toString(),o=t.getMinutes()<10?"0"+t.getMinutes().toString():t.getMinutes().toString(),a=t.getSeconds()<10?"0"+t.getSeconds().toString():t.getSeconds().toString();return e+n+r+g+o+a},getDate:function(t,e){var n=e?e:new Date,r=n.getFullYear().toString(),g=n.getMonth()+1<10?"0"+(n.getMonth()+1).toString():(n.getMonth()+1).toString(),o=(n.getMonth()+1).toString(),a=n.getDate()<10?"0"+n.getDate().toString():n.getDate().toString(),s=n.getDate().toString(),u=n.getHours()<10?"0"+n.getHours().toString():n.getHours().toString(),i=n.getHours().toString(),M=n.getMinutes()<10?"0"+n.getMinutes().toString():n.getMinutes().toString(),S=n.getMinutes().toString(),l=n.getSeconds()<10?"0"+n.getSeconds().toString():n.getSeconds().toString(),c=n.getSeconds().toString();switch(t){case"yyyyMMddhhmmss":return r+g+a+u+M+l;case"yyyyMMdd":return r+g+a;case"yyyy/MM/dd":return r+"/"+g+"/"+a;case"yyyy/M/d":return r+"/"+o+"/"+s;case"yyyy-MM-dd":return r+"-"+g+"-"+a;case"yyyy-M-d":return r+"-"+o+"-"+s;default:return{year:r,month:o,day:s,hour:i,minutes:S,seconds:c}}},checkStrartEndTime:function(t,e,n){var r=this.getDateFromformatFull(t),g=this.getDateFromformatFull(e);if(r=r.valueOf(),g=g.valueOf(),r>g)return{result:!1,msg:"开始时间不能晚于结束时间！"};var o=24*n*60*60*1e3,a=g-r;if(a>o){var s=n>=90?"三个月":n+"天";return{result:!1,msg:"时间范围不能超过"+s+"！"}}return{result:!0,msg:""}}})});