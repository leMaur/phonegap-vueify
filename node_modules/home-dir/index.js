exports = module.exports = function () {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
};

exports.directory = exports();
