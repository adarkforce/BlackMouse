import { NetworkInfo } from 'react-native-network-info';
import SubnetmaskModule from 'get-subnet-mask';
var sip = require('shift8-ip-func');
var ipaddr = require('ipaddr.js');
var net = require('react-native-tcp');

var scanHost = function (hostIP, hostPort) {
    console.log('scanning')
    return new Promise(function (resolve, reject) {
        var client = net.connect({
            host: hostIP,
            port: hostPort
        },
            function () { //'connect' listener
                console.log('Connected');
            });

        client.setTimeout(2000, function () {
            // called after timeout -> same as socket.on('timeout')
            // it just tells that soket timed out => its ur job to end or destroy the socket.
            // socket.end() vs socket.destroy() => end allows us to send final data and allows some i/o activity to finish before destroying the socket
            // whereas destroy kills the socket immediately irrespective of whether any i/o operation is goin on or not...force destry takes place
            client.end();
            //console.log('Socket timed out');
        });

        client.on('connect', function () {
            client.end('finished');
            //client.destroy();
            var scan_result = {
                ip: hostIP,
                port: hostPort
            };
            resolve(scan_result);
        })

        client.on('timeout', function () {
            //console.log('Socket timed out !');
            client.end('Timed out!');
            // can call socket.destroy() here too.
        });

        client.on('end', function (data) {
            //console.log('Socket ended from other end!');
            //console.log('End data : ' + data);
        });

        client.on('close', function (error) {
            var bread = client.bytesRead;
            var bwrite = client.bytesWritten;
        });

        client.on('error', function (err) {
            client.destroy();
        });

        setTimeout(function () {
            var isdestroyed = client.destroyed;
            //console.log('Socket destroyed:' + isdestroyed);
            client.destroy();
        }, 4000);
    });
}

getIpRange = (local_ip) => {
    ip_range = [];  
    for (var i = 1; i < 256; i++) {
        var new_ip = local_ip.substring(0, local_ip.lastIndexOf('.')+1) + i;
        ip_range.push(new_ip);
    }
    return ip_range;
}

class LANScanner {
    portRange = ["3000",];
    async scan(callbackFunction) {
        try {
            var local_ip = await NetworkInfo.getIPAddress();
            var ipRange = getIpRange(local_ip);
            console.log(ipRange.length)
            for (var i = 0; i < ipRange.length; i++) {

                scanHost(ipRange[i], this.portRange[0])
                    .then(response => {
                        //console.log(response);
                        if (response.ip) {
                            console.log(response);
                            callbackFunction(response.ip, response.port);
                        }
                    })
            }
        } catch (err) {
            console.log(err);
        }


    }
}

export default LANScanner;