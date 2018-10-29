var exports = module.exports = {};

exports.findDistance = function (coords) {
    var dist = 0;
    var numbers = coords.match(/\d+/g).map(Number);
    dist = Math.sqrt(Math.pow(numbers[0], 2) + Math.pow(numbers[1], 2));
    return Math.round(dist * 100) / 100;
}




