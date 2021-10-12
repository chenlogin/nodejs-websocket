const os = require('os');

/**
 * 获取本机IP,Mac地址
 * 未连接局域网时会返回null
 * 多个网卡时只返回首个
 */
function getLocalIPv4() {
    var interfaces = os.networkInterfaces();
    
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                
                return alias;
            }
        }
    }
    return null;
}

module.exports = {
    getLocalIPv4
}