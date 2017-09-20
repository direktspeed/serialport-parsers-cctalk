import assert from 'assert';
import ccTalkParser from '../dist/cctalk';

describe('ccTalkParser', () => {
  it('create an instance from class with `new` keyword', () => assert(new ccTalkParser() instanceof ccTalkParser));
  it('create an instance from class without `new` keyword', () => assert(ccTalkParser() instanceof ccTalkParser));
});
