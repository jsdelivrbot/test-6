define("leaflet/shipDistLayer",["leaflet"],function(e){e.TileLayer.ShipDistLayer=e.TileLayer.extend({initialize:function(i,t){e.setOptions(this,t),this._url=i+"{s}/{z}-{x}-{y}.png",e.TileLayer.prototype.initialize.call(this,this._url,this.options)},getTileUrl:function(i){return e.Util.template(this._url,e.extend({s:function(){var e;if(i.z>6){var t=Math.pow(2,i.z-5),r="R"+Math.floor(i.y/t),l="C"+Math.floor(i.x/t);e=i.z+"/"+r+"/"+l}else e=i.z;return e},z:i.z,x:i.x,y:i.y}))}}),e.tileLayer.shipDistLayer=function(i,t){return new e.TileLayer.ShipDistLayer(i,t)}});