/*
Copyright 2017 William Rodriguez Calvo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var Utils = function () {

    this.arrayToHex = function (array) {
        var str = "";
        for (var i = 0; i < array.length; i++) {
            str += array[i] <= 15 ? "0" + array[i].toString(16) : array[i].toString(16);
        }
        return str;
    };

    this.stringToASCII = function (string) {
        var chars = new Uint8Array(string.length);
        for (var i = 0; i < string.length; i++) {
            chars[i] = string.charCodeAt(i);
        }
        return chars;
    };

    this.ASCIIToString = function (chars) {
        var string = "";
        for (var i = 0; i < chars.length; i++) {
            string += String.fromCharCode(chars[i]);
        }
        return string;
    };

    this.hexToASCII = function (hexx) {
        
        var chars = new Uint8Array(hexx.length / 2);
        var hex = hexx.toString();
        var charIndex = 0;

        for (var i = 0; i < hex.length; i += 2) {
            chars[charIndex] = parseInt(hex.substr(i, 2), 16);
            charIndex++;
        }
        return chars;
    };

};

module.exports = Utils;