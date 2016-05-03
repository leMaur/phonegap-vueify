/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.

       Source modified from:

           https://git-wip-us.apache.org/repos/asf?p=cordova-wp8.git
*/

// parse command line arguments
var args = WScript.Arguments,
    zipPath = args(0),
    sourcePath = args(1);

// setup objects
var fso = WScript.CreateObject('Scripting.FileSystemObject'),
    shell = WScript.CreateObject('shell.application');

// create empty ZIP file and open for adding files
var file = fso.CreateTextFile(zipPath, true);

// create twenty-two byte "fingerprint" for .zip
file.write('PK');
file.write(String.fromCharCode(5));
file.write(String.fromCharCode(6));
file.write('\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0');
file.Close();

// open .zip foder and copy contents of sourcePath
var zipFolder = shell.NameSpace(zipPath),
    sourceItems = shell.NameSpace(sourcePath).items();

if (zipFolder !== null) {
    zipFolder.CopyHere(sourceItems, 4|20|16);
    var maxTime = 5000;
    while(zipFolder.items().Count < sourceItems.Count) {
        maxTime -= 100;
        if(maxTime > 0 ) {
            WScript.Sleep(100);
        }
        else {
            WScript.StdErr.WriteLine('wscript failed while adding files.');
            break;
        }
    }
}
else {
    WScript.StdErr.WriteLine('wscript failed to create a zip file.');
}
