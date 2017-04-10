// UMD initialization to work with CommonJS, AMD and basic browser script include
//linghuam 修改后版本 V1.0  20161228
(function (factory) {
    var L;
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['leaflet'], factory);
    } else if (typeof module === 'object' && typeof module.exports === "object") {
        // Node/CommonJS
        L = require('leaflet');
        module.exports = factory(L);
    } else {
        // Browser globals
        if (typeof window.L === 'undefined')
            throw 'Leaflet must be loaded first';
        factory(window.L);
    }
}(function (L) {

L.Playback = L.Playback || {};

L.Playback.MoveableMarker = L.Marker.extend({    

    initialize: function (startLatLng, options, feature) {    
        var marker_options = options.marker || {};
        
        //根据track dataobj生成marker_options
        if (jQuery.isFunction(marker_options)){        
            marker_options = marker_options(feature);
        }
        
        L.Marker.prototype.initialize.call(this, startLatLng, marker_options);
        
        this.popupContent = '';
        this.feature = feature;
        
        if (marker_options.getPopup){
            this.popupContent = marker_options.getPopup(feature);            
        }
        
        if(options.popups)
        {
            this.bindPopup(this.getPopupContent() + startLatLng.toString());
        }
            
        if(options.labels)
        {
            if(this.bindLabel)
            {
                this.bindLabel(this.getPopupContent(),{ noHide: true});
            }
            else
            {
                console.log("Label binding requires leaflet-label (https://github.com/Leaflet/Leaflet.label)");
            }
        }
    },
    
    getPopupContent: function() {
        if (this.popupContent !== ''){
            return '<b>' + this.popupContent + '</b><br/>';
        }
        
        return '';
    },

    move: function (latLng, transitionTime) {
        // Only if CSS3 transitions are supported
        if (L.DomUtil.TRANSITION) {
            if (this._icon) { 
                this._icon.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear'; 
                if (this._popup && this._popup._wrapper)
                    this._popup._wrapper.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear'; 
            }
            if (this._shadow) { 
                this._shadow.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear'; 
            }
        }
        this.setLatLng(latLng);
        if (this._popup) {
            this._popup.setContent(this.getPopupContent() + this._latlng.toString());
        }    
    },
    
    // modify leaflet markers to add our roration code
    /*
     * Based on comments by @runanet and @coomsie 
     * https://github.com/CloudMade/Leaflet/issues/386
     *
     * Wrapping function is needed to preserve L.Marker.update function
     */
    _old__setPos:L.Marker.prototype._setPos,

     /*原始代码
    _updateImg: function (i, a, s) {
        a = L.point(s).divideBy(2)._subtract(L.point(a));
        var transform = '';
        transform += ' translate(' + -a.x + 'px, ' + -a.y + 'px)';
        transform += ' rotate(' + this.options.iconAngle + 'deg)';
        transform += ' translate(' + a.x + 'px, ' + a.y + 'px)';
        i.style[L.DomUtil.TRANSFORM] += transform;
    },*/

     //linghuam edit
    _updateImg: function(i, a, s) {       
        a = L.point(s).divideBy(2)._subtract(L.point(a));
        var transform = '';       
        transform += ' rotate(' + this.options.iconAngle + 'deg)';
        i.style[L.DomUtil.TRANSFORM] += transform;
        i.style.transformOrigin = "50% 50%"; //linghuam 设置旋转的参照点为中心点，解决船舶偏移问题
    },
     
    setIconAngle: function (iconAngle) {
        this.options.iconAngle = iconAngle;
        if (this._map)
            this.update();
    },

    _setPos: function (pos) {
        if (this._icon) {
            this._icon.style[L.DomUtil.TRANSFORM] = "";
        }
        if (this._shadow) {
            this._shadow.style[L.DomUtil.TRANSFORM] = "";
        }

        this._old__setPos.apply(this, [pos]);
        if (this.options.iconAngle) {
            var a = this.options.icon.options.iconAnchor;
            var s = this.options.icon.options.iconSize;
            var i;
            if (this._icon) {
                i = this._icon;
                this._updateImg(i, a, s);
            }

            if (this._shadow) {
                // Rotate around the icons anchor.
                s = this.options.icon.options.shadowSize;
                i = this._shadow;
                this._updateImg(i, a, s);
            }

        }
    }

});

L.Playback.Track = L.Class.extend({

    initialize : function (map,dataObj, options) {
        this._map = map;
        this.options = options || {};                             
        this._dataObj = dataObj;            
        this._ticks = [];
        this._times = [];
        this._marker = null;
        
        var sampleTimes = dataObj.timePosList;

        for(var i=0,len=sampleTimes.length;i<len;i++){
            var ti = sampleTimes[i].time; 
            this._times.push(ti);           
            this._ticks[ti] = sampleTimes[i];
            if(i === 0){
                this._startTime = ti;
            }
            if(i === len-1){
                this._endTime = ti;
            }
        }  
         
        if(!this._trackLineFeatureGroup){
            this._trackLineFeatureGroup = L.featureGroup([]).addTo(this._map);
        }  

        if(!this._trackPointFeatureGroup){
            this._trackPointFeatureGroup = L.featureGroup([]).addTo(this._map);
        } 
    },

    getFirstTick: function () {
        return this._ticks[this._startTime];
    },

    getLastTick: function () {
        return this._ticks[this._endTime];
    },

    getStartTime: function () {
        return this._startTime;
    },

    getEndTime: function () {
        return this._endTime;
    },

    getTimes:function(){
        return this._times;
    },

    getTimeInterval:function(timestamp){
        var index = this._times.indexOf(timestamp);
        if(index !== -1 && index !== this._times.length-1){
           var next = this._times[index+1];
           var inteval = next-timestamp;
        }
        return inteval;
    },

    tick: function (timestamp) {
        return this._ticks[timestamp];
    },

    getLatLng:function(timestamp){
        var tick = this.tick(timestamp);
        if(tick) return L.latLng(tick.lat,tick.lng);
    },
            
    setMarker : function(timestamp, options){
        var latlng = null;
        
        // if time stamp is not set, then get first tick
        if (timestamp) {
            latlng = this.getLatLng(timestamp);
        }
        else {
            latlng = this.getLatLng(this._startTime);
        }        
    
        if (latlng) {               
            this._marker = new L.Playback.MoveableMarker(latlng, options, this._dataObj);                 
        }
        
        return this._marker;
    },

    getMarker: function() {
        return this._marker;
    },

    createTrackPoint:function(timestamp){
        var latlng = this.getLatLng(timestamp);
        if(latlng) var cricleMarker = L.circleMarker(latlng,this.options.OriginCircleOptions);
        var infoObj = this.tick(timestamp); 
        if(infoObj) cricleMarker.bindTooltip(this.getTooltipText(infoObj),this.getTooltipOptions()); 
        //将最后一个点的信息绑定到船舶上
        if(this._marker) {
            this._marker.unbindTooltip();
            this._marker.bindTooltip(this.getTooltipText(infoObj),this.getTooltipOptions()); 
        }
        return  cricleMarker;      
    },

    getTooltipText:function(targetobj){
        var ph = $.i18n.prop('common_ship_ph');
        var lon = $.i18n.prop('common_ship_lng');
        var lat = $.i18n.prop('common_ship_lat');
        var time = $.i18n.prop('common_time_info1');
        var hx = $.i18n.prop('common_ship_dir');
        var hsx = $.i18n.prop('common_ship_heading');
        var sp = $.i18n.prop('common_ship_speed');

        var content = [];
        content.push('<table>');
        content.push('<tr><td>'+ ph +'</td><td>'+ targetobj.info_ph +'</td></tr>');
        content.push('<tr><td>'+ lon +'</td><td>'+ targetobj.info_lng +'</td></tr>');
        content.push('<tr><td>'+ lat +'</td><td>'+ targetobj.info_lat +'</td></tr>');
        content.push('<tr><td>'+ time +'</td><td>'+ targetobj.info_time +'</td></tr>');
        content.push('<tr><td>'+ hx +'</td><td>'+ targetobj.info_dir +'</td></tr>');
        content.push('<tr><td>'+ hsx +'</td><td>'+ targetobj.info_heading +'</td></tr>');
        content.push('<tr><td>'+ sp +'</td><td>'+ targetobj.info_speed +'</td></tr>');
        content.push('</table>');
        content = content.join("");
        return content;        
    },

    getTooltipOptions:function(){
        return {
            offset:[0,0],
            direction:'top'
        };
    },
    
    /*
    * latLng 要移到的坐标点
    * transitionTime 移到最新点经历的时间
    * timestamp 当前的时间点
    */
    moveMarker : function(latLng, transitionTime,timestamp) {
        if (this._marker) {
            
            var latlngold = this._marker.getLatLng();
            var tick = this.tick(timestamp);

            this._marker.move(latLng, transitionTime);

            this._marker.setIconAngle(tick.dir);
            
            if(transitionTime !== 0 ){
                  //绘制上一次到当前时间的历史轨迹线
                  var latlngs = [[latlngold.lat,latlngold.lng],[latLng.lat,latLng.lng]];
                  var polyline = L.polyline(latlngs,this.options.trackLineOptions);  
                  this._trackLineFeatureGroup.addLayer(polyline);
                  //绘制当前时间的轨迹点
                  var point = this.createTrackPoint(timestamp); 
                  this._trackPointFeatureGroup.addLayer(point); 
            } else{
                  //绘制从开始到当前时间的历史轨迹线
                  // this._trackLineFeatureGroup.clearLayers();
                  // this.drawHistoryTrackLine(timestamp);                      
                  //绘制从开始到当前时间的历史轨迹点
                  // this._trackPointFeatureGroup.clearLayers();
                  // this.drawHistoryTrackPoints(timestamp); 
            }
            
        }
    },

    drawHistoryTrackLine:function(timestamp){        
        var latlngs = [];
        for(var i=0,len=this._times.length;i<len;i++){
            if(this._times[i] <= timestamp){
                var latlng = this.getLatLng(this._times[i]);
                if(latlng){
                    latlngs.push(latlng);
                }
            }
        }
        var polylineHis = L.polyline(latlngs,this.options.trackLineOptions);
        this._trackLineFeatureGroup.addLayer(polylineHis); 
    },

    drawHistoryTrackPoints:function(timestamp){
        for(var i=0,len=this._times.length;i<len;i++){
            if(this._times[i] <= timestamp){
                var pt = this.createTrackPoint(this._times[i]);
                if(pt){
                    this._trackPointFeatureGroup.addLayer(pt);
                }
            }
        }
    },

    //清除历史轨迹
    clearTrackInfo:function(){
        if(this._trackLineFeatureGroup) {
            this._trackLineFeatureGroup.clearLayers();
            // this._trackLineFeatureGroup = null;
        }
        if(this._trackPointFeatureGroup) {
            this._trackPointFeatureGroup.clearLayers();
            // this._trackPointFeatureGroup = null;
        }
    }

});

L.Playback.TrackController = L.Class.extend({

    initialize : function (map, tracks, options) {
        this.options = options || {};
    
        this._map = map;

        this._tracks = [];

        // initialize tick points
        this.setTracks(tracks);
    },
    
    clearTracks: function(){
        while (this._tracks.length > 0) {
            var track = this._tracks.pop();
            var marker = track.getMarker();
            
            if (marker){
                this._map.removeLayer(marker);
            }

            track.clearTrackInfo();
        }            
    },
   
    clearLineAndPoint:function(){
        for(var i=0,len=this._tracks.length;i<len;i++){
            var track = this._tracks[i];
            track.clearTrackInfo();
        }
    },

    setTracks : function (tracks) {
        // reset current tracks
        this.clearTracks();
        
        this.addTracks(tracks);
    },
    
    addTracks : function (tracks) {
        // return if nothing is set
        if (!tracks) {
            return;
        }
        
        if (tracks instanceof Array) {            
            for (var i = 0, len = tracks.length; i < len; i++) {
                this.addTrack(tracks[i]);
            }
        } else {
            this.addTrack(tracks);
        }            
    },
    
    // add single track
    addTrack : function (track, timestamp) {
        // return if nothing is set
        if (!track) {
            return;
        }

        var marker = track.setMarker(timestamp, this.options);

        if (marker) {
            marker.addTo(this._map);
            //定位到track所在位置 
            this._map.panTo(marker.getLatLng());
            
            this._tracks.push(track);
        }            
    },

    tock : function (timestamp, transitionTime) {
        for (var i = 0, len = this._tracks.length; i < len; i++) {
            var latLng = this._tracks[i].getLatLng(timestamp);       
            if(latLng){
                // var interval = this._tracks[i].getTimeInterval(timestamp);
                // var transitionTime = interval/speed;
                this._tracks[i].moveMarker(latLng, transitionTime,timestamp); 
            }                           
        }
    },

    getStartTime : function () {
        var earliestTime = 0;

        if (this._tracks.length > 0) {
            earliestTime = this._tracks[0].getStartTime();
            for (var i = 1, len = this._tracks.length; i < len; i++) {
                var t = this._tracks[i].getStartTime();
                if (t < earliestTime) {
                    earliestTime = t;
                }
            }
        }
        
        return earliestTime;
    },

    getEndTime : function () {
        var latestTime = 0;
    
        if (this._tracks.length > 0){
            latestTime = this._tracks[0].getEndTime();
            for (var i = 1, len = this._tracks.length; i < len; i++) {
                var t = this._tracks[i].getEndTime();
                if (t > latestTime) {
                    latestTime = t;
                }
            }
        }
    
        return latestTime;
    },

    getAllTimes:function(){

        var alltimes = [];
        //concat
        if (this._tracks.length > 0){        
            for (var i = 0, len = this._tracks.length; i < len; i++) {
                var timesi = this._tracks[i].getTimes();
                alltimes = alltimes.concat(timesi);
            }
        }
        //unique 
        alltimes = this.uniqueArr(alltimes);
        //sort
        for(var i=0,leni=alltimes.length;i<leni-1;i++){
            for(var j=0;j<leni-1-i;j++){
                if(alltimes[j] > alltimes[j+1]){
                    var temp = alltimes[j];
                    alltimes[j] = alltimes[j+1];
                    alltimes[j+1] = temp;
                }
            }
        } 

        return alltimes;    
    },

    uniqueArr: function (arr) {             
        var temp = [];
        for (var i = 0,len=arr.length; i < len; i++) {
            if (temp.indexOf(arr[i]) === -1) {
                temp.push(arr[i]);
            }
        }
        return temp;
    },

    getTracks : function () {
        return this._tracks;
    }

});

L.Playback.Clock = L.Class.extend({

    initialize: function (trackController, callback, options) {
        this._trackController = trackController;
        this._callbacksArry = [];
        if (callback) this.addCallback(callback);
        L.setOptions(this, options);
        this._speed = this.options.speed;    
        this.max_speed = this.options.Max_Speed;
        this._alltime = this._trackController.getAllTimes();        
        this._cursor = trackController.getStartTime();
        // this._tickLen = this.options.tickLen;
        if(this._alltime.length){  //规定n分钟内播放完，除以时间点个数得到每一次变化的时间
            this._tickLen = 5*60*1000/this._alltime.length; 
        }        
        this._transitionTime = this._tickLen / this._speed;
        
    },

    _tick: function (self) {
        if (self._cursor > self._trackController.getEndTime()) {
            clearInterval(self._intervalID);
            self._intervalID = null; //Linghuam add 播放停止后，再开始无法播放问题
            return;
        }
        if(self._cursor == self._trackController.getEndTime()){
            self._trackController.tock(self._cursor, self._transitionTime);
            self._callbacks(self._cursor);
            clearInterval(self._intervalID);
            self._intervalID = null; //Linghuam add 播放停止后，再开始无法播放问题
            return;
        } 
        self._trackController.tock(self._cursor, self._transitionTime);
        // self._trackController.tock(self._cursor, this._speed);        
        self._callbacks(self._cursor);
        self._cursor = self.getNextTime();
    },

    _callbacks: function(cursor) {
        var arry = this._callbacksArry;
        for (var i=0, len=arry.length; i<len; i++) {
          arry[i](cursor);
        }
    },

    addCallback: function(fn) {
        this._callbacksArry.push(fn);
    },

    start: function () {
        if (this._intervalID) return;
        this._intervalID = window.setInterval(
          this._tick, 
          this._transitionTime, 
          this);
    },

    stop: function () {
        if (!this._intervalID) return;
        clearInterval(this._intervalID);
        this._intervalID = null;
    },

    getSpeed: function() {
        return this._speed;
    },

    isPlaying: function() {
        return this._intervalID ? true : false;
    },

    setSpeed: function (speed) {
        this._speed = speed;
        this._transitionTime = this._tickLen / speed;
        if (this._intervalID) {
          this.stop();
          this.start();
        }
    },

    //加速
    quickSpeed:function(){
        this._speed = this._speed >= this.max_speed ? this._speed : this._speed*2;
        this._transitionTime = this._tickLen/this._speed;
        if(this._intervalID){
            this.stop();
            this.start();
        }
    },

    //减速
    slowSpeed:function(){ 
        this._speed = this._speed<= 1 ? this._speed : this._speed/2;
        this._transitionTime = this._tickLen/this._speed;
        if(this._intervalID){
            this.stop();
            this.start();
        }
    },     

    //重新播放
    rePlaying:function(){
        this._trackController.clearLineAndPoint(); 
        if(this.isPlaying()){
            this.stop();    
        }
        this.setCursor(this.getStartTime());
        this.start();
    },   

    setCursor: function (ms) {
        var time = parseInt(ms);
        if (!time) return;
        this._cursor = time;
        this._trackController.tock(this._cursor, 0);
        this._callbacks(this._cursor);
    },

    getTime: function() {
        return this._cursor;
    },

    getAllTime:function(){
        return this._alltime;
    },

    getStartTime: function() {
        return this._trackController.getStartTime();
    },

    getEndTime: function() {
        return this._trackController.getEndTime();
    },

    getLastTime:function(){
        var index = this._alltime.indexOf(this._cursor);
        if(index === -1) return this._alltime[0];
        else if(index === 0) return this._alltime[this._alltime.length-1];
        else return this._alltime[index-1];
    },

    getNextTime:function(){
        var index = this._alltime.indexOf(this._cursor);
        if(index === -1) return this._alltime[this._alltime.length-1];
        else if(index === this._alltime.length-1) this.stop();
        else return this._alltime[index+1];
    },

    getTickLen: function() {
        return this._tickLen;
    }

});

}));