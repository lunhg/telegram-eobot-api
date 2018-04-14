const foreach = require('foreach');
const agent = require('supertest').agent('https://www.eobot.com')
global.Promise = require('bluebird');

Promise.config({
    // Enable warnings
    warnings: true,
    // Enable long stack traces
    longStackTraces: true,
    // Enable cancellation
    cancellation: true,
    // Enable monitoring
    monitoring: true
})

let get = function(query){
    return new Promise(function(resolve, reject){
	let req = agent.get('/api.aspx')
	foreach(query, function(v,k,a){
	    let obj = {}
	    obj[k.toString()] = v.toString()
	    req = req.query(obj)
	})

	req.expect(200).expect(function(res){
	    resolve({
		header:res.header,
		body:res.body
	    })
	}).catch(function(err){
	    reject(err)
	})
    })
}

module.exports = {
    get: function(query){
	query.json = true
	return get(query)
    }
}
