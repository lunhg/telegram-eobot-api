const foreach = require('foreach')

let main = ['ADA', 'BCH', 'BCN', 'BTC', 'DASH','DOGE', 'ETC', 'ETH', 'FCT', 'GNT','LSK', 'LTC', 'STEEM', 'XEM', 'XMR', 'XRP', 'USD', 'ZEC', 'PPD', 'BPPD']
let swap = ['GHS4', 'DOGE', 'GHS', 'BCN', 'GHS4']
let time = 60 * 12

let strategy= function() {
    let __final__ = []
    foreach(main, function(v, k, a){
	__final__.push(v)
	foreach(swap, function(_v, _k, _a){
	    __final__.push(_v)
	})
    })
    return __final__
}

let cron = function(time, strategy) {
    let count = strategy.length
    let cronStrategy = '*/{1} * * * *'
    cronStrategy = cronStrategy.replace('{1}', Math.floor(time/count))
    return cronStrategy
}


module.exports = function() {
    let list = strategy()
    return {list: list, cron: cron(time, list)}
}
