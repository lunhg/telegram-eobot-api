const dotenv = require('dotenv')
const path = require('path')
const eobot = require('./lib/eobot')
const TelegramBot = require('node-telegram-bot-api');
const foreach = require('foreach')
const schedule = require('node-schedule');

dotenv.config({path: path.join(__dirname, '.env')})
const bot = new TelegramBot(process.env.TELEGRAM_API_KEY, {polling: true});
let schedulers = {}
let activateds = {}
let counters = {}
let modes = {}
let crons = {}

function makeScheduler (chatId) {
    let strategy = require('./strategy')()
    bot.sendMessage(chatId, `list strategy: ${strategy.list.join(', ')}\ncron strategy: ${strategy.cron}`)
    activateds[chatId] = true
    counters[chatId] = 0
    modes[chatId] = strategy.list
    crons[chatId] = strategy.cron
    schedulers[chatId] = schedule.scheduleJob(crons[chatId], function(){
	let _modes = modes[chatId]
	let m = _modes[counters[chatId] === 0 ? 0 : counters[chatId] % _modes.length].toString()
	eobot.get({
	    id: process.env.EOBOT_USER_ID,
	    email: process.env.EOBOT_USER_EMAIL,
	    password: process.env.EOBOT_USER_API_KEY,
	    mining: m
	}).then(function(json){
	    counters[chatId] += 1
	    bot.sendMessage(chatId, `Mining mode changed to ${m}`)
	}).catch(function(err){
	    console.log(err)
	    bot.sendMessage(chatId, "An error occured, please try again later")
	})
    })
}

function activateScheduler(chatId) {
    if(!schedulers[chatId]) makeScheduler(chatId)
    counters[chatId] = 0
}

function deactivateScheduler(chatId) {
    if(schedulers[chatId]) schedulers[chatId].cancel()
}

bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id;
    let str = 'List of commands'
    let cmds = [
	'\/start -> show this command',
	'\/balances -> show all balances of the account defined in .env file',
	'\/balance <COIN> -> show a specific balance',
	'\/mining -> show the mining mode of the account definded in .env file',
	'\/mining_mode <COIN | DIVERSIFY> -> set the mining mode of the account definded in .env file',
	'\/speed -> show the mining speed of the account definded in .env file',,
	'\/estimate <AMMOUNT> <COIN> to <COIN> -> show a estimation of amounts to be exchanged between two coins in the account definded in .env file',
	'\/exchange <AMMOUNT> <COIN> to <COIN> -> execute a exchange between two coins in the account definded in .env file'
	
    ]
    bot.sendMessage(chatId, cmds.join('\n'))
})

bot.onText(/\/balances/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
    let str = "Balances:\n"
    eobot.get({total:process.env.EOBOT_USER_ID}).then(function(json){
	foreach(json.body, function(v,k,o){
	    str += `${k}: ${v}\n`
	})
	// send back the matched "whatever" to the chat
	bot.sendMessage(chatId, str);
    }).catch(function(err){
	console.log(err)
	bot.sendMessage(chatId, "An error occured, please try again later")//err.stack.split("\n"))
    })
})

bot.onText(/\/balance .*/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[0]; // the captured "whatever"
    let mode = resp.split(" ")[1]
    let str = mode+" balance: "
    eobot.get({total:process.env.EOBOT_USER_ID}).then(function(json){
	str += json.body[mode]
	// send back the matched "whatever" to the chat
	bot.sendMessage(chatId, str);
    }).catch(function(err){
	console.log(err)
	bot.sendMessage(chatId, "An error occured, please try again later")//err.stack.split("\n"))
    })
})

bot.onText(/\/mining/, (msg, match) => {
    const chatId = msg.chat.id;
    eobot.get({idmining:process.env.EOBOT_USER_ID}).then(function(json){
	let str = `Mining mode: ${json.body.mining}`
	// send back the matched "whatever" to the chat
	bot.sendMessage(chatId, str);
    }).catch(function(err){
	console.log(err)
	bot.sendMessage(chatId, "An error occured, please try again later")//err.stack.split("\n"))
    })
})

bot.onText(/\/mining_mode [A-Z0-9]+/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[0]; // the captured "whatever"
    const mode = resp.split(" ")[1]
    if (mode !== 'DIVERSIFY') {
	if(schedulers[chatId]){
	    deactivateScheduler(chatId)
	}
	eobot.get({
	    id: process.env.EOBOT_USER_ID,
	    email: process.env.EOBOT_USER_EMAIL,
	    password: process.env.EOBOT_USER_API_KEY,
	    mining: mode.toString()
	}).then(function(json){
	    bot.sendMessage(chatId, `Miniing mode changed to ${mode.toString()}`)
	}).catch(function(err){
	    console.log(err)
	    bot.sendMessage(chatId, "An error occured, please try again later")//err.stack.split("\n"))
	})
    }
    else {
	activateScheduler(chatId)
	bot.sendMessage(chatId, "DIVERSIFY scheduler activated")//err.stack.split("\n"))
    }
})

bot.onText(/\/speed/, (msg, match) => {
    const chatId = msg.chat.id;
    let str = "Current mining power:\n"
    eobot.get({idspeed:process.env.EOBOT_USER_ID}).then(function(json){
	foreach(json.body, function(v,k,o){
	    str += `${k}: ${v}\n`
	})
	// send back the matched "whatever" to the chat
	bot.sendMessage(chatId, str);
    }).catch(function(err){
	console.log(err)
	bot.sendMessage(chatId, "An error occured, please try again later")//err.stack.split("\n"))
    })
})

bot.onText(/\/estimate [0-9\.]+ [A-Z0-9]+ to [A-Z0-9]+/, (msg, match) => {
    const chatId = msg.chat.id;
    let resp = match[0]; // the captured "whatever"
    let amount = resp.split(" ")[1]
    let from = resp.split(" ")[2]
    let to = resp.split(" ")[4]
    eobot.get({
	exchangefee: true,
	convertfrom: from,
	convertto: to,
	amount: amount
    }).then(function(json){
	//send back the matched "whatever" to the chat
	console.log(json.body)
	let val = json.body.Result
	bot.sendMessage(chatId, `${val} ${to} was estimated from ${amount} ${from}`);
    }).catch(function(err){
	console.log(err)
	bot.sendMessage(chatId, "An error occured, please try again later")
    })
	})

bot.onText(/\/exchange [0-9\.]+ [A-Z0-9]+ to [A-Z0-9]+/, (msg, match) => {
    const chatId = msg.chat.id;
    let resp = match[0]; // the captured "whatever"
    let amount = resp.split(" ")[1]
    let from = resp.split(" ")[2]
    let to = resp.split(" ")[4]
    eobot.get({
	id: process.env.EOBOT_USER_ID,
	email: process.env.EOBOT_USER_EMAIL,
	password: process.env.EOBOT_USER_API_KEY,
	convertto: to,
	convertfrom: from,
	amount: amount
    }).then(function(json){
	//send back the matched "whatever" to the chat
	bot.sendMessage(chatId, json.body.convert);
    }).catch(function(err){
	console.log(err)
	bot.sendMessage(chatId, "An error occured, please try again later")
    })
})
