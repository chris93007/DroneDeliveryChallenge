var exports = module.exports = {};

exports.findDistance= function(coords){
    var dist=0;
    var numbers = coords.match(/\d+/g).map(Number);
    console.log(numbers);
    return dist;
}