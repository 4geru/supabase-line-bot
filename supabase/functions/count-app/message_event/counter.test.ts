const { isCounterMessage, executeCounterMessage, replyCounterMessage } = require('./counter');
const { User } = require('../user');

jest.mock('../supabaseClient', () => ({
  supabaseClient: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  }),
}));

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
  let user: any;
  let defaultCount = 0;

  beforeEach(() => {
    user = new User({ userId: 'test-user-id' });
    user.info = {
      status: {
        count: defaultCount
      }
    };
    jest.spyOn(user, 'updateStatus').mockResolvedValue(undefined); // Fix: Provide an argument to mockResolvedValue
  });

  it('should increment the user status count', async () => {
    await executeCounterMessage(user, '1 2 3');

    expect(user.updateStatus).toHaveBeenCalledWith({ count: 6 });
  });
});

describe('replyCounterMessage', () => { 
  it('should return a message with the user count', () => {
    const user = {
      info: {
        status: {
          count: 10
        }
      }
    };
    const event = {};

    const result = replyCounterMessage(user, event);

    expect(result).toEqual([
      {
        "type": "text",
        "text": `カウント: ${user.info.status.count}`
      }
    ]);
  });
})