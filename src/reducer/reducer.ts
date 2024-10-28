//получение списка сообщений
//получение одного сообщения
//отправка сообщения
//получение списка пользователей
//поиск по чату
import { combineReducers, configureStore, Dispatch } from "@reduxjs/toolkit";
import { IMessage, IMessageFunctions } from "./iMessage";
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
// export type Action =
//     | {
//         type: "getList";
//     }
//     | {
//         type: "getMessage";
//         payload: { id: number };
//     }
//     | {
//         type: "sendMessage";
//         payload: { message: string; name: string };
//     }
//     | {
//         type: "getUsers";
//     }
//     | {
//         type: "findMessageFromUser";
//         payload: { name: string };
//     }
//     | {
//         type: "findMessageByWord";
//         payload: { find: string };
//     };

/*export type Store<State = any, Action = { type: string }> = {
  getState(): State;
  dispatch(action: Action): any;
  subscribe(cb: () => void): () => void;
};*/

/*export type Reducer<State, Action> = (state: State, action: Action, state1:State) => State;

export type Middleware<State, Action> = (
  store: Store<State, Action>,
) => (next: (action: Action) => any) => (action: Action) => any;

export type ConfigureStore<State, Action> = (
  reducer: Reducer<State, Action>,
  initialState?: State | undefined,
  middlewares?: Middleware<State, Action>[],
) => Store<State, Action>;
*/

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
    case "REQUEST_MESSAGES": {
      const theme = action.theme ?? "";
      const mess = Object.assign({}, initialMessages);
      mess.isFetching = true;
      mess.didInvalidate = false;

      return { ...state, messages: mess, selectTheme: theme };
    }
    case "RECEIVE_MESSAGES":
    case "RECEIVE_ERROR": {
      const theme = action.theme ?? "";
      const receive = action.receivedAt ?? Date.now();
      const items = action.messages ?? [];
      const error = action.error ?? "";
      const mess = Object.assign({}, initialMessages, {
        lastUpdated: receive,
        items: items,
        error: error,
      });
      mess.isFetching = false;
      return { ...state, messages: mess, selectTheme: theme };
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
