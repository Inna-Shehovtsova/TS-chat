import { rootReducer, StateMessages, StateUsers } from "./reducer";
import { configureStore, Dispatch } from "@reduxjs/toolkit";
import { MockStorage } from "./mockStorage";
import {
  requestUser,
  requestMessages,
  receiveMessages,
  receiveUser,
  setStorage,
  sendOneMessage,
  requestMessage,
  endTypeMessage,
} from "./Action";
import { emptyMessage, IMessage } from "./iMessage";

const messStorage = new MockStorage();
describe("configureStore", () => {
  describe("public interface", () => {
    it("is a function", async () => {
      expect(configureStore).toBeInstanceOf(Function);
      expect(MockStorage).toBeInstanceOf(Function);
      const a = await messStorage.read();
      expect(a.length).toBe(0);
    });
  });

  describe("functional interface", () => {
    it("returns state based on initial state", () => {
      const store1 = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({ serializableCheck: false }),
      });

      let state = store1.getState();
      expect(state.message.delay).toEqual(3);
      store1.dispatch(setStorage(messStorage));
      state = store1.getState();
      expect(state.message.messageStorage).toBeInstanceOf(MockStorage);
    });
  });
  describe("functional interface", () => {
    it("message list", async () => {
      const store1 = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({ serializableCheck: false }),
      });
      store1.dispatch(requestMessages(""));

      const state = store1.getState();
      expect(state.message.messages.isFetching).toBeTruthy();
      expect(state.message.messages.items.length).toBe(0);
      const c = new Array<IMessage>();
      c.push({ ...emptyMessage, name: "test", message: "Hello!" });

      store1.dispatch(receiveMessages("", c));

      const state2 = store1.getState();
      expect(state2.message.messages.isFetching).toBeFalsy();
      expect(state2.message.messages.items.length).toBe(1);
      expect(state2.message.messages.items[0].name).toStrictEqual("test");
      store1.dispatch(
        endTypeMessage({
          ...emptyMessage,
          name: "test2",
          message: "Hello!",
        }),
      );
      const state3 = store1.getState();
      expect(state3.message.messageSend?.isSend).toBeFalsy();
      store1.dispatch(
        sendOneMessage({
          ...emptyMessage,
          name: "test2",
          message: "Hello!",
        }),
      );
      const state4 = store1.getState();
      expect(state4.message.messageSend?.isSend).toBeTruthy();
      store1.dispatch(requestMessage(1));
      const state5 = store1.getState();
      expect(state5.message.selectedID).toBe(1);
    });
  });
  describe("functional interface", () => {
    it("users list", () => {
      const store1 = configureStore({ reducer: rootReducer });
      store1.dispatch(requestUser());

      const state = store1.getState();
      expect(state.users.users.isFetching).toBeTruthy();
      expect(state.users.users.items.length).toBe(0);
      const c = new Array<string>();
      c.push("test");

      store1.dispatch(receiveUser(c));

      const state2 = store1.getState();
      //console.log(state2);
      expect(state2.users.users.isFetching).toBeFalsy();
      expect(state2.users.users.items.length).toBe(1);
      expect(state2.users.users.items[0]).toStrictEqual("test");
    });
  });
});
