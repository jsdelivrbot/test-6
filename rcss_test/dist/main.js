define("corea",[],function(){console.log("core/a")}),define("coreb",[],function(){console.log("core/b")}),define("normalize",[],function(){function e(e,r,u){if(e.match(c)||e.match(s))return e;e=o(e);var i=u.match(s),a=r.match(s);return!a||i&&i[1]==a[1]&&i[2]==a[2]?n(t(e,r),u):t(e,r)}function t(e,t){if("./"==e.substr(0,2)&&(e=e.substr(2)),e.match(c)||e.match(s))return e;var n=t.split("/"),r=e.split("/");for(n.pop();curPart=r.shift();)".."==curPart?n.pop():n.push(curPart);return n.join("/")}function n(e,t){var n=t.split("/");for(n.pop(),t=n.join("/")+"/",i=0;t.substr(i,1)==e.substr(i,1);)i++;for(;"/"!=t.substr(i,1);)i--;t=t.substr(i+1),e=e.substr(i+1),n=t.split("/");var r=e.split("/");for(out="";n.shift();)out+="../";for(;curPart=r.shift();)out+=curPart+"/";return out.substr(0,out.length-1)}var r=/([^:])\/+/g,o=function(e){return e.replace(r,"$1/")},s=/[^\:\/]*:\/\/([^\/])*/,c=/^(\/|data:)/,u=function(t,n,r){n=o(n),r=o(r);for(var s,c,t,u=/@import\s*("([^"]*)"|'([^']*)')|url\s*\((?!#)\s*(\s*"([^"]*)"|'([^']*)'|[^\)]*\s*)\s*\)/gi;s=u.exec(t);){c=s[3]||s[2]||s[5]||s[6]||s[4];var i;i=e(c,n,r);var a=s[5]||s[6]?1:0;t=t.substr(0,u.lastIndex-c.length-a-1)+i+t.substr(u.lastIndex-a-1),u.lastIndex=u.lastIndex+(i.length-c.length)}return t};return u.convertURIBase=e,u.absoluteURI=t,u.relativeURI=n,u}),define("css",[],function(){if("undefined"==typeof window)return{load:function(e,t,n){n()}};var e=document.getElementsByTagName("head")[0],t=window.navigator.userAgent.match(/Trident\/([^ ;]*)|AppleWebKit\/([^ ;]*)|Opera\/([^ ;]*)|rv\:([^ ;]*)(.*?)Gecko\/([^ ;]*)|MSIE\s([^ ;]*)|AndroidWebKit\/([^ ;]*)/)||0,n=!1,r=!0;t[1]||t[7]?n=parseInt(t[1])<6||parseInt(t[7])<=9:t[2]||t[8]||"WebkitAppearance"in document.documentElement.style?r=!1:t[4]&&(n=parseInt(t[4])<18);var o={};o.pluginBuilder="./css-builder";var s,c,u,i=function(){s=document.createElement("style"),e.appendChild(s),c=s.styleSheet||s.sheet},a=0,l=[],f=function(e){c.addImport(e),s.onload=function(){d()},a++,31==a&&(i(),a=0)},d=function(){u();var e=l.shift();return e?(u=e[1],void f(e[0])):void(u=null)},p=function(e,t){if(c&&c.addImport||i(),c&&c.addImport)u?l.push([e,t]):(f(e),u=t);else{s.textContent='@import "'+e+'";';var n=setInterval(function(){try{s.sheet.cssRules,clearInterval(n),t()}catch(e){}},10)}},h=function(t,n){var o=document.createElement("link");if(o.type="text/css",o.rel="stylesheet",r)o.onload=function(){o.onload=function(){},setTimeout(n,7)};else var s=setInterval(function(){for(var e=0;e<document.styleSheets.length;e++){var t=document.styleSheets[e];if(t.href==o.href)return clearInterval(s),n()}},10);o.href=t,e.appendChild(o)};return o.normalize=function(e,t){return".css"==e.substr(e.length-4,4)&&(e=e.substr(0,e.length-4)),t(e)},o.load=function(e,t,r,o){(n?p:h)(t.toUrl(e+".css"),r)},o}),define("css!css/c",[],function(){}),define("funcc",["css!css/c"],function(){console.log("func/c")}),define("funcd",[],function(){console.log("func/d")}),define("funce",[],function(){console.log("func/e")}),require(["corea","coreb","funcc","funcd","funce"],function(){}),define("main",function(){}),function(e){var t=document,n="appendChild",r="styleSheet",o=t.createElement("style");o.type="text/css",t.getElementsByTagName("head")[0][n](o),o[r]?o[r].cssText=e:o[n](t.createTextNode(e))}("#c{color:red;}");