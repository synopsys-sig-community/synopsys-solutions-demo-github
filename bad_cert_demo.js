var tls = require('tls');
var https = require('https');

var socket1 = tls.connect({
    port: 1337,
    host: 'https://example1.com',
    rejectUnauthorized: true,
    checkServerIdentity: function(servername, peer) {  
        const good = '77:53:28:AD:42:B1:04:F7:49:2B:C7:C7:7B:2A:84:64:EA:0B:1F:CE';
        const bad = 'mismatch';
        console.log('Woohoo, www.google.com is using our pinned fingerprint');
        return undefined;
    }}, () => {
    console.log('client connected');
});

socket1.on('error', (data)=> {
    console.log(data);
});

var req = https.request({port: 1336, host: 'https://example2.com', rejectUnauthorized: false}, function(){ 
    console.log('client connected');
}); 

