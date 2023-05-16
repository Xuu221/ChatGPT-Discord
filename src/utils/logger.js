const moment = require("moment");

module.exports = class Logger {
	static log (content, type = "log") {
		const date = moment().utcOffset('+07:00').format("DD-MM-YYYY hh:mm:ss A");
		switch (type) {
	
		case "log": {
			return console.log(`[${date}]: [${type.toUpperCase()}] ${content}`);
		}
		case "warn": {
			return console.log(`[${date}]: [${type.toUpperCase()}] ${content}`);
		}
		case "error": {
			return console.log(`[${date}]: [${type.toUpperCase()}] ${content}`);
		}
		case "debug": {
			return console.log(`[${date}]: [${type.toUpperCase()}] ${content}`);
		}
		case "cmd": {
			return console.log(`[${date}]: [${type.toUpperCase()}] ${content}`);
		}
		case "event": {
			return console.log(`[${date}]: [${type.toUpperCase()}] ${content}`);
		}
		case "ready": {
			return console.log(`[${date}]: [${type.toUpperCase()}] ${content}`);
		} 
		default: throw new TypeError("Logger phải là warn, debug, log, ready, cmd, error.");
		}
	}
};