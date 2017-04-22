/* global $ */
/* global alert */
/* global FileReader */
/* global Blob */
/*
Copyright 2017 William Rodriguez Calvo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var Dropzone = require("dropzone");
var FileSaver = require("file-saver");
var AESController = require("./aes-controller");
var Localization = {};

var AESView = function () {

    var self = this;
    var controller = new AESController();
    var dropzone = null;

    var MIME_TYPE = "application/octet-stream";
    var ENCRYPTED_FILE_SUFFIX = ".aes";

    self.init = function () {

        //Setup the localization strings
        if ($("#language").val() === "en") {
            Localization.PasswordError = "Please specify a password of at least 6 characters";
            Localization.FileError = "Please drag and drop a file to encrypt or decrypt";
        } else {
            Localization.PasswordError = "Por favor digite una contraseña de al menos 6 caracteres";
            Localization.FileError = "Por favor arrastre un archivo para encriptar o desencriptar";
        }

        //Setup the drag and drop component
        dropzone = new Dropzone("#file-dropzone", {
            url: "/",
            maxFiles: 1,
            autoProcessQueue: false,
            init: function () {
                this.on("maxfilesexceeded", function (file) {
                    dropzone.removeFile(file);
                });
            }
        });

        dropzone.element.classList.add("dropzone");

        //Setup the UI events
        $("#encode").click(function () {
            self.onEncode();
        });

        $("#reset").click(function () {
            self.onReset();
        });
    };

    self.onEncode = function () {

        //Gets the password
        var password = $("#password").val();
        //Gets the file form the ui
        var files = dropzone.getAcceptedFiles();
        var file = files.length === 1 ? files[0] : null;

        //Check the password sieze
        if (password === undefined || password === null || password === "" || password.length < 6 || password.length > 50) {
            alert(Localization.PasswordError);
            return;
        }

        //Check if we have a file
        if (file === null) {
            alert(Localization.FileError);
            return;
        }

        //Creates a file reader
        var reader = new FileReader();

        //Sets an event listener to handle the logic when the file finishes loading
        reader.addEventListener("load", function () {

            //Check the file extension, if the file ends in ENCRYPTED_FILE_SUFFIX decrypts it, otherwise encrypt it
            var data = file.name.endsWith(ENCRYPTED_FILE_SUFFIX) ? controller.decrypt(reader.result, password) :
                controller.encrypt(reader.result, password);

            var filename = file.name.endsWith(ENCRYPTED_FILE_SUFFIX) ? file.name.replace(ENCRYPTED_FILE_SUFFIX, "") :
                file.name + ENCRYPTED_FILE_SUFFIX;

            //Creates a new blob with the resulting data
            var blob = new Blob([data], {
                type: MIME_TYPE
            });

            //Saves the file to local storage
            FileSaver.saveAs(blob, filename);

            //Resets the drag and drog control
            dropzone.removeAllFiles(true);

        }, false);

        //Starts reading the file
        reader.readAsArrayBuffer(file);
    };

    //Resets the drag and drog control
    self.onReset = function () {
        dropzone.removeAllFiles(true);
    };

};

module.exports = AESView;