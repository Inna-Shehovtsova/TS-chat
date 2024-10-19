import { configureStore, reducer, Action, Tmessage } from "./reducer";
describe("reducer", () => {
  describe("public interface", () => {
    it("is a function", () => {
      expect(reducer).toBeInstanceOf(Function);
    });
    it("get empty message list", () => {
      const state = {
        allMess: new Array<Tmessage>(),
        messages: undefined,
        users: undefined,
        error: undefined,
      };
      const action: Action = {
        type: "getList",
      };
      const resState = reducer(state, action);
      expect(resState.messages).toBeInstanceOf(Array<Tmessage>);
      expect(resState.messages?.length).toBe(0);
    });
    it("send message ", () => {
      const state = {
        allMess: new Array<Tmessage>(),
        messages: undefined,
        users: undefined,
        error: undefined,
      };
      const action: Action = {
        type: "getList",
      };
      const resState = reducer(state, action);
      expect(resState.messages?.length).toBe(0);
      const actionSend: Action = {
        type: "sendMessage",
        payload: { message: "test message", name: "test user" },
      };
      const resAfterSend = reducer(state, actionSend);
      expect(resAfterSend.messages?.length).toBe(1);
      expect(resAfterSend.messages?.[0].message).toStrictEqual("test message");
      expect(resAfterSend.messages?.[0].name).toStrictEqual("test user");
    });

    it("find message by id ", () => {
      const state = {
        allMess: new Array<Tmessage>(),
        messages: undefined,
        users: undefined,
        error: undefined,
      };

      const actionSend: Action = {
        type: "sendMessage",
        payload: { message: "test message", name: "test user" },
      };
      const resAfterSend = reducer(state, actionSend);
      const actionSend2: Action = {
        type: "sendMessage",
        payload: { message: "test message2", name: "test user2" },
      };
      const resAfterSend2 = reducer(state, actionSend2);
      const actionGet: Action = {
        type: "getMessage",
        payload: { id: 1 },
      };

      const resAfterGet = reducer(state, actionGet);

      expect(resAfterGet.messages?.length).toBe(1);
      expect(resAfterGet.messages?.[0].message).toStrictEqual("test message");
      expect(resAfterGet.messages?.[0].name).toStrictEqual("test user");

      const actionGet2: Action = {
        type: "getMessage",
        payload: { id: 2 },
      };

      const resAfterGet2 = reducer(state, actionGet2);

      expect(resAfterGet2.messages?.length).toBe(1);
      expect(resAfterGet2.messages?.[0].message).toStrictEqual("test message2");
      expect(resAfterGet2.messages?.[0].name).toStrictEqual("test user2");
    });
    it("get user list", () => {
      const state = {
        allMess: new Array<Tmessage>(),
        messages: undefined,
        users: undefined,
        error: undefined,
      };
      const actionUsers: Action = {
        type: "getUsers",
      };
      const resUsers1 = reducer(state, actionUsers);
      expect(resUsers1.users?.length).toBe(0);
      const actionSend: Action = {
        type: "sendMessage",
        payload: { message: "test message", name: "test user" },
      };
      const resAfterSend = reducer(state, actionSend);

      const resUsers3 = reducer(state, actionUsers);
      expect(resUsers3.users?.length).toBe(1);
      expect(resUsers3.users![0]).toStrictEqual("test user");
      const actionSend2: Action = {
        type: "sendMessage",
        payload: { message: "test message2", name: "test user2" },
      };
      const resAfterSend2 = reducer(state, actionSend2);
      const resUsers2 = reducer(state, actionUsers);
      expect(resUsers2.users?.length).toBe(2);
    });
    it("find message from user", () => {
      const state = {
        allMess: new Array<Tmessage>(),
        messages: undefined,
        users: undefined,
        error: undefined,
      };
      const actionSend: Action = {
        type: "sendMessage",
        payload: { message: "test message", name: "test user" },
      };
      const resAfterSend = reducer(state, actionSend);

      const actionSend2: Action = {
        type: "sendMessage",
        payload: { message: "test message2", name: "test user2" },
      };
      const resAfterSend2 = reducer(state, actionSend2);

      const actionFind: Action = {
        type: "findMessageFromUser",
        payload: { name: "test user2" },
      };
      const resUsers2 = reducer(state, actionFind);
      expect(resUsers2.users?.length).toBe(1);
      expect(resUsers2.messages?.length).toBe(1);
      expect(resUsers2.users![0]).toStrictEqual("test user2");
      expect(resUsers2.messages![0].message).toStrictEqual("test message2");
    });
    it("find message from word", () => {
      const state = {
        allMess: new Array<Tmessage>(),
        messages: undefined,
        users: undefined,
        error: undefined,
      };
      const actionSend: Action = {
        type: "sendMessage",
        payload: { message: "test message", name: "test user" },
      };
      const resAfterSend = reducer(state, actionSend);

      const actionSend2: Action = {
        type: "sendMessage",
        payload: { message: "test message2", name: "test user2" },
      };
      const resAfterSend2 = reducer(state, actionSend2);

      const actionFind: Action = {
        type: "findMessageByWord",
        payload: { find: "message2" },
      };
      const resUsers2 = reducer(state, actionFind);

      expect(resUsers2.messages?.length).toBe(1);

      expect(resUsers2.messages![0].message).toStrictEqual("test message2");
    });
  });
});
