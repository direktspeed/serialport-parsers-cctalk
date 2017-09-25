const Buffer = require('safe-buffer').Buffer;
const Transform = require('stream').Transform;
const debug = require('debug')
const nonew = require('class-nonew-decorator');

@nonew()
class CCTalkParser extends Transform {
  constructor() {
    super();
    this.array = [];
    this.cursor = 0;
  }
  _transform(buffer, _, cb) {
    this.cursor += buffer.length;
    
    const array = [...buffer];
    // TODO: ES7 allows directly push
    array.map((byte) => this.array.push(byte)); 

    while (this.cursor > 1 && this.cursor >= this.array[1] + 5) {
      // full frame accumulated
      // copy command from the array
      const FullMsgLength = this.array[1] + 5;
      const frame = new Uint8Array(FullMsgLength);
      frame.set(this.array.slice(0, FullMsgLength));

      // Preserve Extra Data
      this.array = this.array.slice(frame.length, this.array.length);
      this.cursor -= FullMsgLength;
      this.push(frame);
    }
    cb();
  }
};

export default CCTalkParser;
module.exports = CCTalkParser;
