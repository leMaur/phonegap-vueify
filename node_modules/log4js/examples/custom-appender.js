var log4js = require('../lib/log4js');

log4js.configure('custom-appender.json');

var logger = log4js.getLogger("custom");
logger.info("this is using the custom appender");
