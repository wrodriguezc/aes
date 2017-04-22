/*
Copyright 2017 William Rodriguez Calvo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var aesjs = require("aes-js");
var pbkdf2 = require("pbkdf2");

var AES = function () {

    var self = this;
    var SALT = "@KA*i4uRec80S&pj";
    var HEADER_SIZE = 4;

    self.encrypt = function (data, password) {

        //Generates a key from the password
        var key_256 = pbkdf2.pbkdf2Sync(password, SALT, 1, 256 / 8, "sha512");

        var originalData = new Uint8Array(data);
        //Original size of the date without padding of size information
        var originalSize = data.byteLength;
        //Size of padded array used to store encrypted data. Size of the
        //original data increases by 4 bytes to store original file size 
        //Array must be padded to 16 bytes
        var padding = 16 - ((originalSize + HEADER_SIZE) % 16);
        //Converts the data buffer to an array of bytes
        var dataBytes = new Uint8Array(originalSize + HEADER_SIZE + padding);
        //Creates an instance of the cipher in ECB mode
        var aesEcb = new aesjs.ModeOfOperation.ecb(key_256);

        //Stores the original file size
        dataBytes[0] = ((originalSize & 0xFF000000) >> 24);
        dataBytes[1] = ((originalSize & 0x00FF0000) >> 16);
        dataBytes[2] = ((originalSize & 0x0000FF00) >> 8);
        dataBytes[3] = ((originalSize & 0x000000FF) >> 0);

        //Copy the plain data bytes to the padded data block
        dataBytes.set(originalData, 4);

        //Encrypt the data
        return aesEcb.encrypt(dataBytes);
    };

    self.decrypt = function (data, password) {

        //Generates a key from the password
        var key_256 = pbkdf2.pbkdf2Sync(password, SALT, 1, 256 / 8, "sha512");
        var encryptedBytes = new Uint8Array(data);

        //Creates an instance of the cipher in ECB mode
        var aesEcb = new aesjs.ModeOfOperation.ecb(key_256);
        //Decrypts the data
        var decryptedData = aesEcb.decrypt(encryptedBytes);
        var originalSize = decryptedData[0] << 24 | decryptedData[1] << 16 | decryptedData[2] << 8 | decryptedData[3];

        //Retuns the data minus the header
        return decryptedData.slice(HEADER_SIZE, HEADER_SIZE + originalSize);
    };
};

module.exports = AES;