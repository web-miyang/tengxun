var MathUtils = {};


MathUtils.distance = function (pos1x, pos1y, pos2x, pos2y) {
  var dx = pos1x - pos2x;
  var dy = pos1y - pos2y;
  return Math.sqrt(dx * dx + dy * dy);
}

MathUtils.random = function (min, max) {
  var d = max - min;
  var value = min + Math.random() * d;
  return Math.floor(value);
}


export default MathUtils
