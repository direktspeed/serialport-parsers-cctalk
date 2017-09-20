'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Buffer = require('safe-buffer').Buffer;
var Transform = require('stream').Transform;
var MAX_PACKET_LENGTH = 255 + 5;
var debug = require('debug');
var nonew = require('class-nonew-decorator');

var ccTalkParser = (_dec = nonew(), _dec(_class = function (_Transform) {
  _inherits(ccTalkParser, _Transform);

  function ccTalkParser() {
    _classCallCheck(this, ccTalkParser);

    var _this = _possibleConstructorReturn(this, (ccTalkParser.__proto__ || Object.getPrototypeOf(ccTalkParser)).call(this));

    _this.buffer = Buffer.alloc(MAX_PACKET_LENGTH); // maxium ccTalkMessage length
    _this.cursor = 0;
    return _this;
  }

  _createClass(ccTalkParser, [{
    key: '_transform',
    value: function _transform(buffer, _, cb) {
      debug('parser set')(this.buffer, buffer, this.cursor);
      debug('parser set')(this.buffer.toString('hex'), buffer.buffer, this.cursor);

      this.buffer.set(buffer, this.cursor);
      this.cursor += buffer.length;
      debug('parse befor loop')(buffer, this.cursor);
      while (this.cursor > 1 && this.cursor >= this.buffer[1] + 5) {
        // full frame accumulated
        var length = this.buffer[1] + 5;
        //console.log("length", length);

        //copy command from the buffer
        var frame = new Uint8Array(length);
        frame.set(this.buffer.slice(0, length));

        // copy remaining buffer to the begin of the buffer to prepare for next command
        this.buffer.set(this.buffer.slice(length, this.cursor));
        this.cursor -= length;
        debug('parse push', frame, this.buffer, this.cursor);
        this.push(frame);
      }
      cb();
    }
  }]);

  return ccTalkParser;
}(Transform)) || _class);
;

exports.default = ccTalkParser;

module.exports = ccTalkParser;