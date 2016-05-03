function appender(cheese) {
  return function(loggingEvent) {
    console.log("[%s]: %s", cheese, loggingEvent.data[0]);
  };
};

function configure(config) {
  return appender(config.cheese);
}

exports.appender = appender;
exports.configure = configure;
