define("func/oceanWeather",["leaflet","func/base"],function(e){e.ICT.Func.add("OceanWeather",{Class:e.Class.extend({initialize:function(){this.menu=e.ict.app.menu,this.menuid="ict_menu_main_hyqx"},start:function(){this.menu.submenu.has(this.menuid)||this.menu.submenu.add(this.menuid,this.getSubMenuHTML()),this.menu.submenu.show(this.menuid),this._initSubMenuEvts()},stop:function(){this.menu.submenu.destory(this.menuid)},getSubMenuHTML:function(){var e=[];return e.push('<ul class="submenu_oceanWeather">'),e.push('<li class="menu_item qxxx"><img src="themes/images/model/frame/menu-weather.png">&nbsp<label>气象信息</label></li>'),e.push('<li class="menu_item hyxx"><img src="themes/images/model/frame/menu-ocean.png">&nbsp<label>海洋信息</label></li>'),e.push("</ul>"),e.join("")},_initSubMenuEvts:function(){var e=this.menu.getContainer();e.find(".submenu_oceanWeather .menu_item").on("click",function(e){e.stopPropagation();var n=$(this);n.addClass("active").siblings().removeClass("active")})}})})});