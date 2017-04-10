define("control/fullscreen",["leaflet"],function(e){e.Control.Fullscreen=e.Control.extend({options:{position:"topleft",title:{"false":"View Fullscreen","true":"Exit Fullscreen"}},onAdd:function(l){var n=e.DomUtil.create("div","leaflet-control-fullscreen leaflet-bar leaflet-control");return this.link=e.DomUtil.create("a","leaflet-control-fullscreen-button leaflet-bar-part",n),this.link.href="#",this._map=l,this._map.on("fullscreenchange",this._toggleTitle,this),this._toggleTitle(),e.DomEvent.on(this.link,"click",this._click,this),n},_click:function(l){e.DomEvent.stopPropagation(l),e.DomEvent.preventDefault(l),this._map.toggleFullscreen(this.options)},_toggleTitle:function(){this.link.title=this.options.title[this._map.isFullscreen()]}}),e.Map.include({isFullscreen:function(){return this._isFullscreen||!1},toggleFullscreen:function(e){var l=this.getContainer();this.isFullscreen()?e&&e.pseudoFullscreen?this._disablePseudoFullscreen(l):document.exitFullscreen?document.exitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitCancelFullScreen?document.webkitCancelFullScreen():document.msExitFullscreen?document.msExitFullscreen():this._disablePseudoFullscreen(l):e&&e.pseudoFullscreen?this._enablePseudoFullscreen(l):l.requestFullscreen?l.requestFullscreen():l.mozRequestFullScreen?l.mozRequestFullScreen():l.webkitRequestFullscreen?l.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT):l.msRequestFullscreen?l.msRequestFullscreen():this._enablePseudoFullscreen(l)},_enablePseudoFullscreen:function(l){e.DomUtil.addClass(l,"leaflet-pseudo-fullscreen"),this._setFullscreen(!0),this.fire("fullscreenchange")},_disablePseudoFullscreen:function(l){e.DomUtil.removeClass(l,"leaflet-pseudo-fullscreen"),this._setFullscreen(!1),this.fire("fullscreenchange")},_setFullscreen:function(l){this._isFullscreen=l;var n=this.getContainer();l?e.DomUtil.addClass(n,"leaflet-fullscreen-on"):e.DomUtil.removeClass(n,"leaflet-fullscreen-on"),this.invalidateSize()},_onFullscreenChange:function(){var e=document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement||document.msFullscreenElement;e!==this.getContainer()||this._isFullscreen?e!==this.getContainer()&&this._isFullscreen&&(this._setFullscreen(!1),this.fire("fullscreenchange")):(this._setFullscreen(!0),this.fire("fullscreenchange"))}}),e.Map.mergeOptions({fullscreenControl:!1}),e.Map.addInitHook(function(){this.options.fullscreenControl&&(this.fullscreenControl=new e.Control.Fullscreen(this.options.fullscreenControl),this.addControl(this.fullscreenControl));var l;if("onfullscreenchange"in document?l="fullscreenchange":"onmozfullscreenchange"in document?l="mozfullscreenchange":"onwebkitfullscreenchange"in document?l="webkitfullscreenchange":"onmsfullscreenchange"in document&&(l="MSFullscreenChange"),l){var n=e.bind(this._onFullscreenChange,this);this.whenReady(function(){e.DomEvent.on(document,l,n)}),this.on("unload",function(){e.DomEvent.off(document,l,n)})}}),e.control.fullscreen=function(l){return new e.Control.Fullscreen(l)}});