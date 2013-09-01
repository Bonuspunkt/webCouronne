#!/usr/bin/env node
var path = require('path');

var browsermodules = require('browsermodules');

module.exports = function() {
  console.log('rebuilding');
  browsermodules({
    in: path.resolve(__dirname, 'wwwScript/main.js'),
    out: path.resolve(__dirname, 'wwwRoot/script.js')
  });
};

if (!module.parent) {
  module.exports();
}