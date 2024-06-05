const { isCounterMessage } = require('./counter');

// テストコード
describe('isCounterMessage', () => {
    it('should return true for valid counter messages', () => {
        const message = "123 456";
        expect(isCounterMessage(message)).toBe(true);
    });

    it('should return false for invalid counter messages', () => {
        const message = "123abc456";
        expect(isCounterMessage(message)).toBe(false);
    });
});

describe('executeCounterMessage', () => {

});
