//получение списка сообщений
//получение одного сообщения
//отправка сообщения
//получение списка пользователей
//поиск по чату
import { combineReducers, configureStore, Dispatch } from "@reduxjs/toolkit";
import { emptyMessage, IMessage, IMessageFunctions } from "./iMessage";
import { actionMessage, selectTheme } from "./Action";
import { initFirestore, MessageFirebase } from "./messageFirebase";

export interface IThemeMessages {
  isFetching: boolean;
  didInvalidate: boolean;
  lastUpdated?: number;
  items: Array<IMessage>;
  error?: string;
}
export interface IUsers {
  isFetching: boolean;
  didInvalidate: boolean;
  lastUpdated?: number;
  items: Array<string>;
  error?: string;
}
export interface ISendMessage {
  message: IMessage;
  isSend: boolean;
  error?: string;
}

export type StateMessages = {
  selectedTheme?: string;
  selectedID?: string;
  messages: IThemeMessages;
  messageSend?: ISendMessage;
  messageStorage?: IMessageFunctions;
  delay: number;
};
export type StateUsers = {
  users: IUsers;
  messageStorage?: IMessageFunctions;
  delay: number;
};

export const initalState: StateMessages = {
  delay: 3,
  messages: {
    isFetching: false,
    didInvalidate: false,
    items: [],
  },
};
export const initalStateUsers: StateUsers = {
  delay: 3,
  users: {
    isFetching: false,
    didInvalidate: false,
    items: [],
  },
};

const initialMessages: IThemeMessages = {
  isFetching: false,
  didInvalidate: false,
  items: [],
};
const initialUsers: IUsers = {
  isFetching: false,
  didInvalidate: false,
  items: [],
};

export const reducer = (state = initalState, action: actionMessage) => {
  const nS = { ...state };
  switch (action.type) {
    case "SET_STORAGE": {
      console.log("SET_STORAGE", action.storage!);
      return { ...state, messageStorage: action.storage };
    }
    case "REQUEST_MESSAGE": {
      const id = action.id ?? 0;
      const mess = Object.assign({}, initialMessages);
      mess.isFetching = true;
      mess.didInvalidate = false;

      return { ...state, messages: mess, selectedID: id };
    }
    case "TYPE_MESSAGE": {
      const mess = action.message ?? emptyMessage;
      const ms: ISendMessage = { isSend: false, message: mess, error: "" };
      return { ...state, messageSend: ms };
    }
    case "SEND_MESSAGE": {
      const mess = action.message ?? emptyMessage;
      const ms: ISendMessage = { isSend: true, message: mess, error: "" };
      return { ...state, messageSend: ms };
    }
    case "REQUEST_MESSAGES": {
      console.log("REQUEST_MESSAGES");
      const theme = action.theme ?? "";
      const mess = Object.assign({}, initialMessages);
      mess.isFetching = true;
      mess.didInvalidate = false;

      return { ...state, messages: mess, selectTheme: theme };
    }
    case "RECEIVE_MESSAGES":
    case "RECEIVE_ERROR": {
      console.log("RECEIVE_MESSAGES");
      const theme = action.theme ?? "";
      const receive = action.receivedAt ?? Date.now();
      const items = action.messages ?? [];
      const error = action.error ?? "";
      const id = action.id;
      const mess = Object.assign({}, initialMessages, {
        lastUpdated: receive,
        items: items,
        error: error,
      });
      mess.isFetching = false;
      return { ...state, messages: mess, selectTheme: theme, selectedID: id };
    }

    default:
      return state;
  }
};

export const reducerUsers = (
  state = initalStateUsers,
  action: actionMessage,
) => {
  const nS = { ...state };
  switch (action.type) {
    case "REQUEST_USERS": {
      const theme = action.theme ?? "";
      const u = Object.assign({}, initialUsers);
      u.isFetching = true;
      return { ...state, users: u };
    }
    case "RECEIVE_USERS":
    case "RECEIVE_ERROR_USER": {
      const receive = action.receivedAt ?? Date.now();
      const items = action.items ?? [];
      const error = action.error ?? "";
      const u = Object.assign({}, initialUsers, {
        lastUpdated: receive,
        items: items,
        error: error,
        isFetching: false,
      });

      return { ...state, users: u };
    }

    default:
      return state;
  }
};

/*export function configureStore(reducer: Reducer<State, Action>, state: State) {
  const functionsSave = new Set<Function>();
  const o = {
    getState() {
      return state;
    },
    dispatch(action: Action) {
      state = reducer(state, action);
      for (const cb of functionsSave) {
        cb();
      }
    },
    subscribe(cb: Function) {
      functionsSave.add(cb);
      return () => {
        functionsSave.delete(cb);
      };
    },
  };
  return o;
}
*/
/*
const store = configureStore(reducer, {
  allMess: new Array<IMessage>(),
  messages: undefined,
  users: undefined,
  error: undefined,
});*/
export type combineState = { message: StateMessages; users: StateUsers };

export const rootReducer = combineReducers({
  // Define a top-level state field named `todos`, handled by `todosReducer`
  message: reducer,
  users: reducerUsers,
});
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
