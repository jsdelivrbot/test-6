define("control/loading",["leaflet","core/namespace"],function(e){e.ICT.Control.Loading=e.Class.extend({initialize:function(){this._container=$('<div class="ict_control_loading"><span class="icon-loading"></span></div>')},addTo:function(e){e.prepend(this._container);var t=e.outerWidth(),n=e.outerHeight();return this._container.css({position:"absolute",top:0,left:0,width:t+"px","line-height":n+"px","text-align":"center","z-index":99999,"background-color":"#a9a6a6",opacity:.5,overflow:"hidden",display:"none"}),this},show:function(){return this._container.css("display","block"),this},hide:function(){return this._container.css("display","none"),this},remove:function(){return this._container.remove(),this}})});