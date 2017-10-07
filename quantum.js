/**
 * Copyright Dave Conway-Jones
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
    "use strict";
    var mustache = require("mustache");
    var spawn = require('child_process').spawn;
    var fs = require('fs');

    function QuantumNode(n) {
        RED.nodes.createNode(this,n);
        this.name = n.name;
        this.template = n.template;
        this.shots = parseInt(n.shots || 1024);
        var node = this;

        node.on("input", function(msg) {
            var result = ""
            if (this.credentials.hasOwnProperty("qnodekey") && (this.credentials.qnodekey.length > 0)) {
                var child = spawn(__dirname+"/q.py", [this.credentials.qnodekey,this.shots], {timeout:60000});
                child.stdin.end(mustache.render(node.template, msg.payload));
                node.status({fill:"blue",shape:"dot",text:" "});
                child.stdout.on('data', function (data) {
                    result += data.toString();
                });
                child.stderr.on('data', function (data) {
                    var err = data.toString().split("\n");
                    for (var e in err) {
                        if (err[e].indexOf("IBMQuantumExperience.IBMQuantumExperience.") !== -1) {
                            node.error(err[e].split("IBMQuantumExperience.IBMQuantumExperience.")[1],mustache.render(node.template, msg.payload));
                        }
                        else {
                            //console.log("Error:",data.toString());
                            node.error(data.toString());
                        }
                    }
                    node.status({fill:"red",shape:"ring",text:"Error"});
                });
                child.on('close', function (code,signal) {
                    try {
                        if (result !== "") {
                            msg.payload = JSON.parse(result.replace(/'/g,'"'));
                            node.send(msg);
                        }
                    }
                    catch(e) { node.error("Bad Parse:"+e); }
                    node.status({});
                });
                child.on('error', function (code) {
                    node.error("Error",code)
                    node.status({fill:"red",shape:"ring",text:"Error"});
                });
            }
            else {
                node.error("No API key set");
            }

        });
    }

    RED.nodes.registerType("quantum",QuantumNode, {
        credentials: {
            qnodekey: {type:"password"}
        }
    });
    RED.library.register("qasm");
}
