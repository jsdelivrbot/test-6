class TagPie {

  constructor(filename, elementId) {

    this._worldsData = null;
    this._echarts = echarts.init(document.getElementById(elementId));
    this.getData(filename).then(this._callbackFunc.bind(this));
  }

  async getData(filename) {
    this._worldsData = await Util.readFile(filename);
  }

  _callbackFunc() {
    var data = [];
    for(let i = 0, len = this._worldsData.length; i < len; i++) {
      data.push({
        name: this._worldsData[i].tag_name,
        value: parseInt(this._worldsData[i].tag_count)
      });
    }

    data = data.slice(0,10);

    var option = {
      title: {
        text: '饼图',
        subtext: '',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      // legend: {
      //   orient: 'vertical',
      //   left: 'left',
      //   data: data
      // },
      series: [{
        name: '访问来源',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: data,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };

    this._echarts.setOption(option);
  }

}