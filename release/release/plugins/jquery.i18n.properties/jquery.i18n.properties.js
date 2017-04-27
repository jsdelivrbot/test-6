/******************************************************************************
 * jquery.i18n.properties
 *
 * Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and
 * MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses.
 *
 * @version     1.2.2
 * @url         https://github.com/jquery-i18n-properties/jquery-i18n-properties
 * @inspiration Localisation assistance for jQuery (http://keith-wood.name/localisation.html)
 *              by Keith Wood (kbwood{at}iinet.com.au) June 2007
 *

 *****************************************************************************/

/* Cross-Browser Split 1.0.1
       (c) Steven Levithan <stevenlevithan.com>; MIT License
       An ECMA-compliant, uniform cross-browser split method */

define("plugins/jqueryi18n",["jquery"],function(){(function($){function callbackIfComplete(e){e.async&&(e.filesLoaded+=1,e.filesLoaded===e.totalFiles&&e.callback&&e.callback())}function loadAndParseFile(e,t){$.ajax({url:e,async:t.async,cache:t.cache,dataType:"text",success:function(e,n){parseData(e,t.mode),callbackIfComplete(t)},error:function(n,r,i){console.log("Failed to download or parse "+e),callbackIfComplete(t)}})}function parseData(data,mode){var parsed="",parameters=data.split(/\n/),regPlaceHolder=/(\{\d+})/g,regRepPlaceHolder=/\{(\d+)}/g,unicodeRE=/(\\u.{4})/ig;for(var i=0;i<parameters.length;i++){parameters[i]=parameters[i].replace(/^\s\s*/,"").replace(/\s\s*$/,"");if(parameters[i].length>0&&parameters[i].match("^#")!="#"){var pair=parameters[i].split("=");if(pair.length>0){var name=decodeURI(pair[0]).replace(/^\s\s*/,"").replace(/\s\s*$/,""),value=pair.length==1?"":pair[1];while(value.match(/\\$/)=="\\")value=value.substring(0,value.length-1),value+=parameters[++i].replace(/\s\s*$/,"");for(var s=2;s<pair.length;s++)value+="="+pair[s];value=value.replace(/^\s\s*/,"").replace(/\s\s*$/,"");if(mode=="map"||mode=="both"){var unicodeMatches=value.match(unicodeRE);if(unicodeMatches)for(var u=0;u<unicodeMatches.length;u++)value=value.replace(unicodeMatches[u],unescapeUnicode(unicodeMatches[u]));$.i18n.map[name]=value}if(mode=="vars"||mode=="both"){value=value.replace(/"/g,'\\"'),checkKeyNamespace(name);if(regPlaceHolder.test(value)){var parts=value.split(regPlaceHolder),first=!0,fnArgs="",usedArgs=[];for(var p=0;p<parts.length;p++)regPlaceHolder.test(parts[p])&&(usedArgs.length==0||usedArgs.indexOf(parts[p])==-1)&&(first||(fnArgs+=","),fnArgs+=parts[p].replace(regRepPlaceHolder,"v$1"),usedArgs.push(parts[p]),first=!1);parsed+=name+"=function("+fnArgs+"){";var fnExpr='"'+value.replace(regRepPlaceHolder,'"+v$1+"')+'"';parsed+="return "+fnExpr+";"+"};"}else parsed+=name+'="'+value+'";'}}}}eval(parsed)}function checkKeyNamespace(key){var regDot=/\./;if(regDot.test(key)){var fullname="",names=key.split(/\./);for(var i=0;i<names.length;i++)i>0&&(fullname+="."),fullname+=names[i],eval("typeof "+fullname+' == "undefined"')&&eval(fullname+"={};")}}function getFiles(e){return e&&e.constructor==Array?e:[e]}function unescapeUnicode(e){var t=[],n=parseInt(e.substr(2),16);n>=0&&n<Math.pow(2,16)&&t.push(n);var r="";for(var i=0;i<t.length;++i)r+=String.fromCharCode(t[i]);return r}$.i18n={},$.i18n.map={},$.i18n.properties=function(e){var t={name:"Messages",language:"",path:"",mode:"vars",cache:!1,encoding:"UTF-8",async:!1,checkAvailableLanguages:!1,callback:null};e=$.extend(t,e),e.language=this.normaliseLanguageCode(e.language);var n=function(t){e.totalFiles=0,e.filesLoaded=0;var n=getFiles(e.name);if(e.async)for(var r=0,i=n.length;r<i;r++){e.totalFiles+=1;var s=e.language.substring(0,2);if(t.length==0||$.inArray(s,t)!=-1)e.totalFiles+=1;if(e.language.length>=5){var o=e.language.substring(0,5);if(t.length==0||$.inArray(o,t)!=-1)e.totalFiles+=1}}for(var u=0,a=n.length;u<a;u++){loadAndParseFile(e.path+n[u]+".properties",e);var s=e.language.substring(0,2);(t.length==0||$.inArray(s,t)!=-1)&&loadAndParseFile(e.path+n[u]+"_"+s+".properties",e);if(e.language.length>=5){var o=e.language.substring(0,5);(t.length==0||$.inArray(o,t)!=-1)&&loadAndParseFile(e.path+n[u]+"_"+o+".properties",e)}}e.callback&&!e.async&&e.callback()};e.checkAvailableLanguages?$.ajax({url:e.path+"languages.json",async:e.async,cache:!1,success:function(e,t,r){n(e.languages||[])}}):n([])},$.i18n.prop=function(e){var t=$.i18n.map[e];if(t==null)return"["+e+"]";var n;arguments.length==2&&$.isArray(arguments[1])&&(n=arguments[1]);var r;if(typeof t=="string"){r=0;while((r=t.indexOf("\\",r))!=-1)t.charAt(r+1)=="t"?t=t.substring(0,r)+"	"+t.substring(r++ +2):t.charAt(r+1)=="r"?t=t.substring(0,r)+"\r"+t.substring(r++ +2):t.charAt(r+1)=="n"?t=t.substring(0,r)+"\n"+t.substring(r++ +2):t.charAt(r+1)=="f"?t=t.substring(0,r)+"\f"+t.substring(r++ +2):t.charAt(r+1)=="\\"?t=t.substring(0,r)+"\\"+t.substring(r++ +2):t=t.substring(0,r)+t.substring(r+1);var i=[],s,o;r=0;while(r<t.length)if(t.charAt(r)=="'")if(r==t.length-1)t=t.substring(0,r);else if(t.charAt(r+1)=="'")t=t.substring(0,r)+t.substring(++r);else{s=r+2;while((s=t.indexOf("'",s))!=-1){if(s==t.length-1||t.charAt(s+1)!="'"){t=t.substring(0,r)+t.substring(r+1,s)+t.substring(s+1),r=s-1;break}t=t.substring(0,s)+t.substring(++s)}s==-1&&(t=t.substring(0,r)+t.substring(r+1))}else if(t.charAt(r)=="{"){s=t.indexOf("}",r+1);if(s==-1)r++;else{o=parseInt(t.substring(r+1,s));if(!isNaN(o)&&o>=0){var u=t.substring(0,r);u!=""&&i.push(u),i.push(o),r=0,t=t.substring(s+1)}else r=s+1}}else r++;t!=""&&i.push(t),t=i,$.i18n.map[e]=i}if(t.length==0)return"";if(t.length==1&&typeof t[0]=="string")return t[0];var a="";for(r=0;r<t.length;r++)typeof t[r]=="string"?a+=t[r]:n&&t[r]<n.length?a+=n[t[r]]:!n&&t[r]+1<arguments.length?a+=arguments[t[r]+1]:a+="{"+t[r]+"}";return a},$.i18n.normaliseLanguageCode=function(e){if(!e||e.length<2)e=navigator.languages?navigator.languages[0]:navigator.language||navigator.userLanguage||"en";return e=e.toLowerCase(),e=e.replace(/-/,"_"),e.length>3&&(e=e.substring(0,3)+e.substring(3).toUpperCase()),e};var cbSplit;cbSplit||(cbSplit=function(e,t,n){if(Object.prototype.toString.call(t)!=="[object RegExp]")return typeof cbSplit._nativeSplit=="undefined"?e.split(t,n):cbSplit._nativeSplit.call(e,t,n);var r=[],i=0,s=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.sticky?"y":""),t=new RegExp(t.source,s+"g"),o,u,a,f;e+="",cbSplit._compliantExecNpcg||(o=new RegExp("^"+t.source+"$(?!\\s)",s));if(n===undefined||+n<0)n=Infinity;else{n=Math.floor(+n);if(!n)return[]}while(u=t.exec(e)){a=u.index+u[0].length;if(a>i){r.push(e.slice(i,u.index)),!cbSplit._compliantExecNpcg&&u.length>1&&u[0].replace(o,function(){for(var e=1;e<arguments.length-2;e++)arguments[e]===undefined&&(u[e]=undefined)}),u.length>1&&u.index<e.length&&Array.prototype.push.apply(r,u.slice(1)),f=u[0].length,i=a;if(r.length>=n)break}t.lastIndex===u.index&&t.lastIndex++}return i===e.length?(f||!t.test(""))&&r.push(""):r.push(e.slice(i)),r.length>n?r.slice(0,n):r},cbSplit._compliantExecNpcg=/()??/.exec("")[1]===undefined,cbSplit._nativeSplit=String.prototype.split),String.prototype.split=function(e,t){return cbSplit(this,e,t)}})(jQuery)});