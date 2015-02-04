/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var pictureSource;   // picture source
var destinationType; // sets the format of returned value

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
 
};

function clearCache() {
    navigator.camera.cleanup();
};
 
var retries = 0;
function onCapturePhoto(fileURI) {
    var win = function (r) {
        clearCache();
        retries = 0;
        alert('Done!');
    };
 
    var fail = function (error) {
        if (retries == 0) {
            retries ++;
            setTimeout(function() {
                onCapturePhoto(fileURI);
            }, 1000);
        } else {
            retries = 0;
            clearCache();
            alert('Ups. Something wrong happens!');
        }
    };
 
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
    // options.mimeType = "image/jpeg";
    options.mimeType="text/plain";
    
    options.params = {}; // if we need to send parameters to the server request
    var ft = new FileTransfer();
    ft.upload(fileURI, encodeURI("http://213.74.186.114:8181/JAXRS-HelloWorld/rest/hello/upload"), win, fail, options);
    
    // ft.upload(fileURI, encodeURI("http://10.0.1.61:8080/JavaWebService/SendImage"), win, fail, options);
     // $.post( "http://213.74.186.114:8181/JAXRS-HelloWorld/rest/hello/upload", {data: fileURI}, function(data) {
        // alert("Image uploaded!");
      // });
// };
 
function capturePhoto() {
    navigator.camera.getPicture(onCapturePhoto, onFail, {
        quality: 100,
        destinationType: destinationType.FILE_URI
    });
};
 
function onFail(message) {
    alert('Failed because: ' + message);
};




$('#button').click(function(){
    var formData = new FormData($('form')[0]);
    alert(formData)
    $.ajax({
        url: '/testupload2/',  //server script to process data
        type: 'POST',
        xhr: function() {  // custom xhr
            myXhr = $.ajaxSettings.xhr();
            if(myXhr.upload){ // check if upload property exists
            myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // for handling the progress of the upload
            }
            return myXhr;
        },
        //Ajax events

        success: function(data){
            alert('Done')
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert("Some Error!")
        },
        // Form data
        data: formData,
        //Options to tell JQuery not to process data or worry about content-type
        cache: false,
        contentType: false,
        processData: false
});
    
function progressHandlingFunction(e){
    if(e.lengthComputable){
        $('progress').attr({value:e.loaded,max:e.total});
    }
}
