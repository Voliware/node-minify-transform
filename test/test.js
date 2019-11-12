const MinifyTransform = require('./../lib/minifyTransform');
const {Readable, Writable} = require('stream');

/**
 * Test function for basic tests
 * @param {MinifyTransform} minifyTransform 
 * @param {String} readable_data
 * @param {String} expectation 
 * @returns {Promise} 
 */
function run(minifyTransform, readable_data, expectation){
    let readable = new Readable();
    readable._read = () => {};
    let data = Buffer.from([]);
    let writable = new Writable();
    writable._write = (chunk, enc, next) => { 
        data = Buffer.concat([data, chunk])
        next();
    }

    readable.push(readable_data);
    readable.push(null);

    return new Promise((resolve, reject) => {
        readable
            .pipe(minifyTransform)
            .pipe(writable)
            .on('finish', () => {
                if(data.compare(Buffer.from(expectation)) === 0){
                    resolve();
                }
                else {
                    reject(new Error(`Data does not match ${data.toString()}`));
                }
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

it('minifies a JS stream', function(){
    let readable_data = " const a = 1 ; let x = {a:1}; x.b=2;";
    let expectation = "const a=1;let x={a:1,b:2};";
    let minifyTransform = new MinifyTransform("js");
    return run(minifyTransform, readable_data, expectation);
});

it('minifies a CSS stream', function(){
    let readable_data = " body{color:red;} body{background:#fff;}";
    let expectation = "body{color:red}body{background:#fff}";
    let minifyTransform = new MinifyTransform("css");
    return run(minifyTransform, readable_data, expectation);
});

it('minifies an HTML stream', function(){
    let readable_data = '<div id = "test" class="a" class="b">  words </div>';
    let expectation = "<div id=test class=a class=b>words</div>";
    let minifyTransform = new MinifyTransform("html");
    return run(minifyTransform, readable_data, expectation);
});