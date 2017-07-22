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
var nonew = require('class-nonew-decorator');

var MAX_PACKET_LENGTH = 255 + 5;

var ccTalkParser = (_dec = nonew(), _dec(_class = function (_Transform) {
  _inherits(ccTalkParser, _Transform);

  function ccTalkParser() {
    _classCallCheck(this, ccTalkParser);

    var _this = _possibleConstructorReturn(this, (ccTalkParser.__proto__ || Object.getPrototypeOf(ccTalkParser)).call(this));

    _this.buffer = Buffer.alloc(MAX_PACKET_LENGTH); // maxium ccTalkMessage length
    _this.ccTalkMessageLength = 5; // minumum ccTalkMessage length
    _this.cursor = 0;
    return _this;
  }

  _createClass(ccTalkParser, [{
    key: '_transform',
    value: function _transform(data, _, cb) {
      var dataCursor = 0;

      // copy data into the buffer until we're out of data
      while (dataCursor < data.length) {
        this.buffer[this.cursor] = data[dataCursor];

        // adjust ccTalkMessageLength after getting data.length byte of the ccTalkMessage
        if (this.cursor === 2) {
          this.ccTalkMessageLength = data[dataCursor];
        }

        dataCursor++;
        this.cursor++;

        // detect a finished ccTalkMessage!
        if (this.cursor >= this.ccTalkMessageLength) {
          var ccTalkMessage = this.buffer.slice(0, this.ccTalkMessageLength);
          this.push(ccTalkMessage);
          this.buffer = Buffer.alloc(MAX_PACKET_LENGTH);
          this.ccTalkMessageLength = 5;
          this.cursor = 0;
        }
      }
      cb();
    }
  }]);

  return ccTalkParser;
}(Transform)) || _class);
;
exports.default = ccTalkParser;

module.exports = ccTalkParser;