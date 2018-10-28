

const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

var fs = require('fs');
  

/*
    1. Take input from console
    2. Check if the input is a valid file path
    3. Check if file exists
    4. Process file
*/  

console.log('Please provide complete path to the input file');
rl.setPrompt('Enter Path > ');
rl.prompt();
rl.on('line', function(path) {
    if(!path.length){
        console.log(`Please provide a path`);
        rl.prompt();
    }
    else if (/^[a-zA-Z]:\\(\w+\\)*\w*.txt$/.test(path)){
        fs.exists(path, function(exists) {
            if(exists){
                rl.close();
                processFile(path);
            }
            else{
                console.log(`Sorry, the file doesn't exist. Please check the file path and try again.`);
                rl.prompt();
            }
        });
        
    }
    else{
        console.log(`Please provide a valid path to a .txt file`);
        rl.prompt();
    }
});

/*
    1. Process the file
*/

function processFile(path){
    console.log(`ddddddddddd`);
    genOutputFile(arr)
}

/*
    1. Write Array into .txt file
*/
var arr = [ [ 1373628934214, 3 ],
  [ 1373628934218, 3 ],
  [ 1373628934220, 1 ],
  [ 1373628934230, 1 ],
  [ 1373628934234, 0 ],
  [ 1373628934237, -1 ],
  [ 1373628934242, 0 ],
  [ 1373628934246, -1 ],
  [ 1373628934251, 0 ],
  [ 1373628934266, 11 ] ];
function genOutputFile(arr){
    var file = fs.createWriteStream('output.txt');
    file.on('error', function(err) { /* error handling */ });
    arr.forEach(function(v) { file.write(v.join(', ') + '\n'); });
    file.end();
}