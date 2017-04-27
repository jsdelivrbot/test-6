define("func/oceanWeather",["leaflet","func/base"],function(e){e.ICT.Func.add("OceanWeather",{Class:e.Class.extend({initialize:function(){this.menu=e.ict.app.menu,this.menuid="ict_menu_main_hyqx"},start:function(){this.menu.submenu.has(this.menuid)||this.menu.submenu.add(this.menuid,this.getSubMenuHTML()),this.menu.submenu.show(this.menuid),this._initSubMenuEvts()},stop:function(){this.menu.submenu.destory(this.menuid),this.removeSWLayer(),this.removeWeatherLayer()},getSubMenuHTML:function(){var e=[];return e.push('<ul class="submenu_oceanWeather">'),e.push('<li class="menu_item swxx" data-key="1"><img src="themes/images/frame/menu-hrdrology.png">&nbsp<label>水文信息</label></li>'),e.push('<li class="menu_item qxxx" data-key="2"><img src="themes/images/frame/menu-weather.png">&nbsp<label>气象信息</label></li>'),e.push("</ul>"),e.join("")},_initSubMenuEvts:function(){var e=this,t=this.menu.getContainer();t.find(".submenu_oceanWeather .menu_item").on("click",function(t){t.stopPropagation();var n=$(this);n.data("key")=="1"?n.hasClass("active")?e.removeSWLayer():e.addSWLayer():n.data("key")=="2"&&(n.hasClass("active")?e.removeWeatherLayer():e.addWeatherLayer()),n.toggleClass("active")})},addSWLayer:function(){},removeSWLayer:function(){},addWeatherLayer:function(){},removeWeatherLayer:function(){}})})});