define("util/dialog",["leaflet","core/namespace"],function(t){t.ICT.Util.Dialog=t.Class.extend({_body:'<div class="modal fade" id="modal-dialog"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h5 class="modal-title" id="modal-title">标题</h5></div><div class="modal-body"><img class="infoImg" src="themes/images/dialog/error.png" style="width:30px;height:30px;"><p id="modal-text">内容</p></div><div class="modal-footer"><button type="button" class="btn btn-primary" id="modal-todo">确认</button><button type="button" class="btn btn-primary" data-dismiss="modal" id="modal-close">取消</button></div></div></div></div>',_container:null,initialize:function(){this._container=t.DomUtil.create("div","",document.body),this._container.innerHTML=this._body,this._setCss(),t.DomEvent.addListener(t.DomUtil.get("modal-close"),"click",function(){this._close()},this)},alert:function(t,o){this._setClose(!1),this._setDialog(t,o),this._setImg(null),this._show(),$("#modal-todo").unbind(),$("#modal-todo").bind("click",this,function(t){t.data._close()})},success:function(t,o){this._setClose(!1),this._setDialog(t,o),this._setImg("success"),this._show(),$("#modal-todo").unbind(),$("#modal-todo").bind("click",this,function(t){t.data._close()})},error:function(t,o){this._setClose(!1),this._setDialog(t,o),this._setImg("error"),this._show(),$("#modal-todo").unbind(),$("#modal-todo").bind("click",this,function(t){t.data._close()})},warn:function(t,o){this._setClose(!1),this._setDialog(t,o),this._setImg("warn"),this._show(),$("#modal-todo").unbind(),$("#modal-todo").bind("click",this,function(t){t.data._close()})},confirm:function(t,o,i){this._setClose(!0),this._setDialog(t,o),this._setImg(null),this._show(),$("#modal-todo").unbind(),$("#modal-todo").bind("click",this,function(t){t.data._close(),i()}),$("#modal-close").bind("click",this,function(t){t.data._close()})},_setImg:function(t){var o=$(this._container).find(".infoImg");"success"===t?o.attr("src","themes/images/dialog/success.png"):"error"===t?o.attr("src","themes/images/dialog/error.png"):"warn"===t?o.attr("src","themes/images/dialog/warn.png"):o.remove()},_setCss:function(){$(this._container).find(".modal-dialog").css({margin:"260px auto"}),$(this._container).find(".modal-header").css({padding:"5px","text-align":"center",color:"#fff","background-color":"#1c5da9"}),$(this._container).find(".modal-header button span").css({"font-size":"16px",color:"#fff","line-height":"20px"}),$(this._container).find(".modal-body").css({"text-align":"center"}),$(this._container).find(".modal-body p").css({"font-size":"16px","font-weight":"500",margin:"5px"}),$(this._container).find(".modal-footer").css({"text-align":"center",padding:"5px",border:"none"}),$(this._container).find(".modal-footer .btn").css({})},_close:function(){$("#modal-dialog").modal("hide")},_show:function(){$("#modal-dialog").modal("show")},_setDialog:function(o,i){t.DomUtil.get("modal-title").innerHTML=o,t.DomUtil.get("modal-text").innerHTML=i},_setClose:function(o){t.DomUtil.get("modal-close").style.display=1==o?"":"none"}})});