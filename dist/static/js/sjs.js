var widht = 1920;

function _pages() {
  var _dw = document.documentElement.clientWidth,
    _sc = _dw / widht;
  document.body.style.zoom = _sc;

}

function adaptUILayout() {
  var deviceWidth = window.innerWidth;
  scale = deviceWidth / widht;
  let body = $("body");
  body.css("position")
  body.css("width", widht + "px");
  body.css("height", widht / deviceWidth * window.innerHeight + "px");
  body.css("transform-origin", "0 0");
  body.css("transform", "scale(" + scale + ", " + scale + ")");
}

$(window).bind('resize', function (e) {
  adaptUILayout()
});
$(window).load(function () {
  adaptUILayout();
});


