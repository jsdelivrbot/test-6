export class TileLayer {

  constructor(url, options) {
    this._url = url;
    this.options = Object.assign({
      tileSize: 256
    }, options);
    this._tileSize = this.options.tileSize;
  }

  onAdd(map) {
    this._map = map;
    this._initContainer();
    this._tileZoom = this._map._zoom;
    // 将地图中心点转为该级别下的投影中心点
    this._tileCenter = this._map.project(this._map._center, this._tileZoom);

    this._pixelOrigin = [Math.round(this._tileCenter[0] - this._map._width / 2), Math.round(this._tileCenter[1] - this._map._height / 2)];
    // 地图范围
    this._tileCenter[0] = Math.floor(this._tileCenter[0]);
    this._tileCenter[1] = Math.floor(this._tileCenter[1]);
    var mapMinX = this._tileCenter[0] - this._map._width / 2;
    var mapMinY = this._tileCenter[1] - this._map._height / 2;
    var maxX = this._tileCenter[0] + this._map._width / 2;
    var maxY = this._tileCenter[1] + this._map._height / 2;
    // 该范围内切片行列范围
    var rows = [Math.floor(mapMinX / this._tileSize), Math.ceil(maxX / this._tileSize) - 1];
    var cols = [Math.floor(mapMinY / this._tileSize), Math.ceil(maxY / this._tileSize) - 1];
    // 获取所有行列数据
    var coords = [];
    for(let i = cols[0]; i <= cols[1]; i++) {
      for(let j = rows[0]; j <= rows[1]; j++) {
        coords.push({
          x: j,
          y: i,
          z: this._tileZoom
        });
      }
    }
    // 获取所有图片
    for(let i = 0, len = coords.length; i < len; i++) {
      var origcor = coords[i];
      var cor = this.wrapCoords({ // 将超出范围的切片进行转换
        x:coords[i].x,
        y:coords[i].y,
        z:coords[i].z
      });
      this.creatTile(origcor,cor);
    }
  }

  creatTile(origcor, cor){
      var img = new Image();
      var pos = this._getTilePos(origcor);
      img.onload = function () {
        this._tileOnLoad.call(this,pos,img);
      }.bind(this);
      img.src = this.getTileUrl(cor);
  }

  _tileOnLoad(pos, tile){
    this._ctx.drawImage(tile,pos[0],pos[1],256,256);
  }

  _getTilePos(coord){
      var x1 = coord.x * this._tileSize;
      var y1 = coord.y * this._tileSize;
      return [x1 - this._pixelOrigin[0], y1 - this._pixelOrigin[1]];
  }

  wrapCoords(coord) {
    var wrapx = [Math.floor(this._map.project([-180, 0], this._tileZoom)[0] / this._tileSize),
      Math.ceil(this._map.project([180, 0], this._tileZoom)[0] / this._tileSize)
    ];
    coord.x = this.wrapNum(coord.x, wrapx);
    return coord;
  }

  wrapNum(x, range, includeMax) {
    var max = range[1],
      min = range[0],
      d = max - min;
    return x === max && includeMax ? x : ((x - min) % d + d) % d + min;
  }

  // 墨卡托投影的比例尺
  scale(zoom) {
    return 256 * Math.pow(2, zoom);
  }

  getTileUrl(coords) {
    return this._url.replace('{x}', coords.x).replace('{y}', coords.y).replace('{z}', coords.z)
  }

  onRemove(map) {
    this._container.remove();
  }

  _initContainer() {
    this._container = document.createElement('canvas');
    this._container.setAttribute('class', 'layer');
    this._container.setAttribute('width', this._map._width);
    this._container.setAttribute('height', this._map._height)
    this._map._container.appendChild(this._container);
    this._ctx = this._container.getContext('2d');
  }
}
