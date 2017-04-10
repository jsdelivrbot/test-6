define("control/measure",["leaflet","leaflet/draw","core/namespace"],function(e){e.ICT=e.ICT||{},e.ICT.Measure=e.ICT.Measure||{},e.ICT.Measure.Length=e.Draw.Polyline.extend({options:{repeatMode:!1,icon:new e.DivIcon({iconSize:new e.Point(8,8),className:"ict_measure_vetixicon"}),touchIcon:new e.DivIcon({iconSize:new e.Point(8,8),className:"ict_measure_vetixicon"}),shapeOptions:{stroke:!0,color:"#116cc1",weight:2,opacity:1,fill:!1,clickable:!0},metric:!1,feet:!1,nautic:!0,showLength:!0,closeIcon:e.icon({iconUrl:"themes/images/shipIcons/hjxs_close.png",iconSize:[18,18],iconAnchor:[-9,14],className:"ict_measure_closeicon"})},initialize:function(t,i){e.Draw.Polyline.prototype.initialize.call(this,t,i)},addHooks:function(){this._map&&(this.clear(),this._infomarkerGroup=new e.LayerGroup,this._map.addLayer(this._infomarkerGroup),this._measurelens=[],this._closemarker=null),e.Draw.Polyline.prototype.addHooks.call(this)},removeHooks:function(){e.Draw.Feature.prototype.removeHooks.call(this),this._clearHideErrorTimeout(),this._cleanUpShape(),this._mouseMarker.off("mousedown",this._onMouseDown,this).off("mouseout",this._onMouseOut,this).off("mouseup",this._onMouseUp,this).off("mousemove",this._onMouseMove,this),this._map.removeLayer(this._mouseMarker),delete this._mouseMarker,this._clearGuides(),this._map.off("mouseup",this._onMouseUp,this).off("mousemove",this._onMouseMove,this).off("zoomlevelschange",this._onZoomEnd,this).off("zoomend",this._onZoomEnd,this).off("touchstart",this._onTouch,this).off("click",this._onTouch,this)},_endPoint:function(t,i,o){if(this._mouseDownOrigin){var s=e.point(t,i).distanceTo(this._mouseDownOrigin),n=this._calculateFinishDistance(o.latlng),r=this._calculateFinishDistance2(o.latlng);1/0!==n&&1/0!==r&&this._measurelens.push(r),10>n&&e.Browser.touch?(this._finishShape(),this._createCloseICon(o)):Math.abs(s)<9*(window.devicePixelRatio||1)&&(this.addVertex(o.latlng),this._createInfoICon(o)),this._enableNewMarkers()}this._mouseDownOrigin=null},_createMarker:function(t){var i=e.ict.app.util.tool.latlngTodfmStr(t.lat,"lat"),o=e.ict.app.util.tool.latlngTodfmStr(t.lng,"lng"),s="经度："+o+"，纬度："+i,n=new e.Marker(t,{icon:this.options.icon,title:s,zIndexOffset:2*this.options.zIndexOffset});return this._markerGroup.addLayer(n),n},_calculateFinishDistance2:function(t){var i;if(this._markers.length>0){var o;if(this.type===e.Draw.Polyline.TYPE)o=this._markers[this._markers.length-1];else{if(this.type!==e.Draw.Polygon.TYPE)return 1/0;o=this._markers[0]}var s=o.getLatLng(),n=new e.Marker(t,{icon:this.options.icon,zIndexOffset:2*this.options.zIndexOffset}),r=n.getLatLng();i=s.distanceTo(r),i=e.GeometryUtil.readableDistance(i,this.options.metric,this.options.feet,this.options.nautic)}else i=1/0;return i},clear:function(){this._markerGroup&&this._markers&&(this._map.removeLayer(this._markerGroup),delete this._markerGroup,delete this._markers),this._poly&&(this._map.removeLayer(this._poly),delete this._poly),this._infomarkerGroup&&(this._map.removeLayer(this._infomarkerGroup),delete this._infomarkerGroup),this._closemarker&&(this._map.removeLayer(this._closemarker),delete this._closemarker),delete this._measurelens},_createInfoICon:function(t){if(!(this._markers&&this._markers.length<=1)){var i=t.latlng,o=e.divIcon({iconSize:[100,20],iconAnchor:[-2,-2],className:"ict_measure_infoIcon",html:this._getSum()+"海里"}),s=e.marker(i,{icon:o});this._infomarkerGroup.addLayer(s)}},_createCloseICon:function(t){var i=t.latlng,o=this._closemarker=e.marker(i,{icon:this.options.closeIcon});this._map.addLayer(o),o.on("click",function(){this.clear()},this)},_getSum:function(){for(var e=0,t=0,i=this._measurelens.length;i>t;t++)e+=parseFloat(this._measurelens[t]);return e.toFixed(2)}})});