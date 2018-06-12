//创建和初始化地图函数：
function initMap() {
    createMap(); //创建地图
    setMapEvent(); //设置地图事件
    addMapControl(); //向地图添加控件
    addMarker(); //向地图中添加marker
    addRemark(); //向地图中添加文字标注
    mapStyle ();
}

//创建地图函数：
function createMap() {
    var map = new BMap.Map("dituContent"); //在百度地图容器中创建一个地图
    var point = new BMap.Point(114.061032,22.539391); //定义一个中心点坐标
    map.centerAndZoom(point,24); //设定地图的中心点和坐标并将地图显示在地图容器中
    window.map = map; //将map变量存储在全局
}

//地图事件设置函数：
function setMapEvent() {
    map.enableDragging(); //启用地图拖拽事件，默认启用(可不写)
    //map.enableScrollWheelZoom(); //启用地图滚轮放大缩小
    map.enableDoubleClickZoom(); //启用鼠标双击放大，默认启用(可不写)
    map.enableKeyboard(); //启用键盘上下左右键移动地图

}

//地图控件添加函数：
function addMapControl() {
    //向地图中添加缩放控件
   // var ctrl_nav = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE });
   // map.addControl(ctrl_nav);
    //向地图中添加比例尺控件
    var ctrl_sca = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
    map.addControl(ctrl_sca);
}

//标注点数组
var markerArr = [
    { title: "深圳东门茂业" ,content: "深圳市罗湖区东门中路茂业EACHWAY专柜 <br/> 电话：020-3440 1255", point: "114.061032|22.539391", isOpen: 1, icon: { w: 48, h: 48, l: 0, t: 0, x: -6, lb: 5} },
];

//修改地图样式
function mapStyle (){
    var myStyleJson=[ {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    },
        {
            "featureType": "subway",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "local",
            "elementType": "all",
            "stylers": {
                "color": "#ffffff",
                "weight": "0.3"
            }
        },
        {
            "featureType": "green",
            "elementType": "all",
            "stylers": {
                "color": "#e6e6e6"
            }
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": {
                "color": "#ededed"
            }
        },
        {
            "featureType": "land",
            "elementType": "all",
            "stylers": {
                "color": "#f7f7f7"
            }
        },
        {
            "featureType": "manmade",
            "elementType": "all",
            "stylers": {
                "color": "#f7f7f7",
                "visibility": "off"
            }
        },
        {
            "featureType": "building",
            "elementType": "all",
            "stylers": {
                "color": "#f2f2f2"
            }
        },
        {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "color": "#ffffff",
                "weight": "0.5"
            }
        },
        {
            "featureType": "arterial",
            "elementType": "all",
            "stylers": {
                "color": "#ffffff",
                "weight": "0.3"
            }
        },
        {
            "featureType": "railway",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "highway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#9f9f9f"
            }
        },
        {
            "featureType": "arterial",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#b4b4b4",
                "weight": "0.1"
            }
        },
        {
            "featureType": "label",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#666666"
            }
        },
        {
            "featureType": "administrative",
            "elementType": "all",
            "stylers": {}
        },
        {
            "featureType": "local",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#dfdfdf"
            }
        },
        {
            "featureType": "highway",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffff"
            }
        },
        {
            "featureType": "highway",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "label",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffff"
            }
        },
        {
            "featureType": "boundary",
            "elementType": "all",
            "stylers": {}
        }
    ];
    map.setMapStyle({styleJson: myStyleJson });

}

//创建marker
function addMarker() {
    for (var i = 0; i<markerArr.length; i++) {
        var json = markerArr[i];
        var p0 = json.point.split("|")[0];
        var p1 = json.point.split("|")[1];
        var point = new BMap.Point(p0, p1);
        var iconImg = createIcon(json.icon);
        var marker = new BMap.Marker(point, { icon: iconImg });
        var iw = createInfoWindow(i);
        var label = new BMap.Label(json.title, { "offset": new BMap.Size(json.icon.lb - json.icon.x + 1, 14) });
        marker.setLabel(label);
        map.addOverlay(marker);
        label.setStyle({
            borderColor: "#808080",
            color: "#333",
            cursor: "pointer"
        });

        (function () {
            var _iw = createInfoWindow(i);
            var _marker = marker;
            _marker.addEventListener("click", function () {
                this.openInfoWindow(_iw);
            });
            _iw.addEventListener("open", function () {
                _marker.getLabel().hide();
            })
            _iw.addEventListener("close", function () {
                _marker.getLabel().show();
            })
            label.addEventListener("click", function () {
                _marker.openInfoWindow(_iw);
            })
            if (!!json.isOpen) {
                label.hide();
                _marker.openInfoWindow(_iw);
            }
        })()
    }
}
//创建InfoWindow
function createInfoWindow(i) {
    var json = markerArr[i];
    var iw = new BMap.InfoWindow("<b class='iw_poi_title' title='" + json.title + "'>" + json.title + "</b><div class='iw_poi_content'>" + json.content + "</div>");
    return iw;
}
//创建一个Icon
function createIcon(json) {
    var icon = new BMap.Icon("../assets/images/icons/bmap.png", new BMap.Size(json.w, json.h), { imageOffset: new BMap.Size(-json.l, -json.t), infoWindowOffset: new BMap.Size(json.lb +10, 10  ), offset: new BMap.Size(json.x, json.h) })
    return icon;
}
//文字标注数组
var lbPoints = [{ point: "114.061032|22.539391", content: "" }];
//向地图中添加文字标注函数
function addRemark() {
    for (var i = 0; i < lbPoints.length; i++) {
        var json = lbPoints[i];
        var p1 = json.point.split("|")[0];
        var p2 = json.point.split("|")[1];
        var label = new BMap.Label("<div style='padding:2px;'>" + json.content + "</div>", { point: new BMap.Point(p1, p2), offset: new BMap.Size(3, -6) });
        map.addOverlay(label);
        label.setStyle({ borderColor: "#999" });
    }
}


/*initMap(); *///创建和初始化地图    .anchorBL{display:none;}