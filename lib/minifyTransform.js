const {Transform} = require('stream');
const Minify = require('@node-minify/core');
const UglifyEs = require('@node-minify/uglify-es');
const CleanCss = require('@node-minify/clean-css')
const HtmlMinifier = require('@node-minify/html-minifier');

/**
 * Minify JS, CSS, or HTML stream data.
 * @extends {Transform}
 * @example
 * let readable = Fs.createReadable("app.js");
 * let writable = Fs.createWritable("app.min.js");
 * let transform = new MinifyTransform("js");
 * readable.pipe(transform).pipe(writable);
 */
class MinifyTransform extends Transform {

    /**
     * Constructor
     * @param {String} type - minifier type: js, css, or html
     * @param {Object} options - minifier and transform options
     * @returns {MinifyTransform}
     */
    constructor(type, options){
        super(options);
        this.options = options;
        this.data = Buffer.from([]);
        this.compressor = this.getCompressor(type);
        return this;
    }

    /**
     * Get the compressor.
     * @param {String} type 
     * @return {Function}
     */
    getCompressor(type){
        switch(type){
            case "css":
                return CleanCss;
            case "html":
                return HtmlMinifier;
            case "js":
            default:
                return UglifyEs;
        }
    }

    /**
     * Accumulate chunk data.
     * @param {Buffer} chunk 
     * @param {String} encoding 
     * @param {Function} callback 
     */
    _transform(chunk, encoding, callback){
        let length = this.data.length + chunk.length;
        this.data = Buffer.concat([this.data, chunk], length);
        callback();
    }

    /**
     * Minify the accumulated data.
     * @param {Function} callback 
     */
    _flush(callback){
        Minify({
            compressor: this.compressor,
            content: this.data.toString()
        })
        .then(function(min) {
            callback(null, min);
        })
        .catch(function(error){
            console.error(error);
        });
    }
}

module.exports = MinifyTransform;