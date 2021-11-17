
var { cloneDeep } = require('lodash');
var { getLocalIPv4 } = require('./utils');
var net = require('net')
var Socket = net.Socket
var ping = require('node-http-ping')

/**
 * 根据子网掩码计算网段的ip区间
 * 
 * 子网掩码判断两台计算机是否属于同一网段:
 * 1、十进制的IP地址和子网掩码转换为二进制的形式
 * 2、然后进行二进制“与”(AND)计算，如果得出的结果是相同的，那么这两台计算机就属于同一网段 
 */
function getIp() {
    let obj = getLocalIPv4()
    const s1 = obj?.netmask
        .split('.')
        .map((item) => parseInt(item).toString(2).padStart(8, '0'))
        .join()
    const s2 = obj?.address
        .split('.')
        .map((item) => parseInt(item).toString(2).padStart(8, '0'))
        .join()
        .split('')
    const s3 = cloneDeep(s2)
    s1?.split('').forEach((item, index) => {
        if (item === '0') {
        s2[index] = '0'
        s3[index] = '1'
        }
    })
    return {
        ...obj,
        start_ip: s2
        .join('')
        .split(',')
        .map((item) => parseInt(item, 2))
        .join('.'),
        end_ip: s3
        .join('')
        .split(',')
        .map((item) => parseInt(item, 2))
        .join('.'),
    }
}

function getAllIp() {
    const ips = []
    const { start_ip, end_ip } = getIp()
    const s_ips = start_ip.split('.')
    const e_ips = end_ip.split('.')
    const arr = []
    const res = s_ips.reduceRight(
      (a, b, index) => () => {
        for (let i = parseInt(b); i <= parseInt(e_ips[index]); i++) {
          arr[index] = i
          a()
        }
      },
      () => {
        ips.push(arr.concat())
      },
    )
    res()
    console.log("ips length",ips.length)
    return ips
}

function scan(port) {
    return new Promise(async (resolve, reject) => {
      let config = { 
          maxIpScanLength: 5000 //扫描数量过大响应会变慢
        }
      const ips = getAllIp()
      if (ips.length > config.maxIpScanLength) {
        resolve('')
      } else {
        let active_ips = [], ip = []
        for (let i = 1; i < ips.length; i++) {
          ip.push(ips[i])
          //分组，1000个扫描一次
          if (i % 1000 === 0 || i === ips.length - 1) {
            const res = await Promise.allSettled(
              ip.map((item) => {
                return socketScan(item.join('.'),port)
              }),
            )
            ip = []
            res.forEach((item) => {
              if (item.status === 'fulfilled') {
                active_ips.push(item.value.host)
              }
            })
          }
        }
        
        resolve(active_ips)
      }
    })
}

function socketScan(host, port) {
    return new Promise((res, rej) => {
      var socket = new Socket()
      socket.setTimeout(2000)
      socket.on('connect', function () {
        res({ host })
        socket.end()
      })
      socket.on('timeout', function () {
        socket.destroy()
        rej(new Error('timeout'))
      })
      socket.on('error', function (err) {
        rej(err)
      })
      socket.on('close', function (err) {})
      socket.connect(port, host)
    })
}

function pingHealth(){
  // Using http by default
  ping('baidu.com', 80 /* optional */)
    .then(time => console.log(`Response time: ${time}ms`))
    .catch(() => console.log(`Failed to ping google.com`))
  
  // Or use https
  ping('https://www.baidu.com')
    .then(time => console.log(`Response time: ${time}ms`))
    .catch(() => console.log('Failed to ping google.com'))
}

scan(1700).then((res) => {

    console.log('active_ips: ', res)
    pingHealth()
    return res[0]//获取第一个
})







