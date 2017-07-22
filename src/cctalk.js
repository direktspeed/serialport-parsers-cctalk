const Buffer = require('safe-buffer').Buffer;
const Transform = require('stream').Transform;
const nonew = require('class-nonew-decorator');

const MAX_PACKET_LENGTH = 255 + 5;

@nonew()
class ccTalkParser extends Transform {
  constructor() {
    super();
    this.buffer = Buffer.alloc(MAX_PACKET_LENGTH); // maxium ccTalkMessage length
    this.ccTalkMessageLength = 5; // minumum ccTalkMessage length
    this.cursor = 0;
  }
  _transform(data, _, cb) {
    let dataCursor = 0;

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
        const ccTalkMessage = this.buffer.slice(0, this.ccTalkMessageLength);
        this.push(ccTalkMessage);
        this.buffer = Buffer.alloc(MAX_PACKET_LENGTH);
        this.ccTalkMessageLength = 5;
        this.cursor = 0;
      }
    }
    cb();
  }
};
export default ccTalkParser;
module.exports = ccTalkParser;
