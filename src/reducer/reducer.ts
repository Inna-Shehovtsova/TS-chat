//получение списка сообщений
//получение одного сообщения
//отправка сообщения
//получение списка пользователей
//поиск по чату
import { combineReducers, configureStore, Dispatch } from "@reduxjs/toolkit";
import { emptyMessage, IMessage, IMessageFunctions } from "./iMessage";
import {
  actionMessage,
  BEGIN_SEND_MESSAGE,
  BEGIN_TYPE_MESSAGE,
  END_SEND_MESSAGE,
  END_TYPE_MESSAGE,
  selectTheme,
} from "./Action";
import { smileInText } from "./smileCollection";

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
  isTyping: boolean;
  error?: string;
}

export type StateMessages = {
  selectedTheme?: string;
  selectedID?: string;
  messages: IThemeMessages;
  messageSend?: ISendMessage;
  messageStorage?: IMessageFunctions;
  delay: number;
  isSend: boolean;
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
  isSend: true,
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
export type combineState = { message: StateMessages; users: StateUsers };
export const reducer = (state = initalState, action: actionMessage) => {
  const nS = { ...state };
  switch (action.type) {
    case "SET_STORAGE": {
      //console.log("SET_STORAGE", action.storage!);
      return { ...state, messageStorage: action.storage };
    }
    case "REQUEST_MESSAGE": {
      const id = action.id ?? 0;
      const mess = Object.assign({}, initialMessages);
      mess.isFetching = true;
      mess.didInvalidate = false;

      return { ...state, messages: mess, selectedID: id };
    }
    case BEGIN_TYPE_MESSAGE: {
      const mess = action.message ?? emptyMessage;
      const ms: ISendMessage = {
        isSend: false,
        message: mess,
        error: "",
        isTyping: true,
      };
      return { ...state, messageSend: ms, isSend: false };
    }
    case END_TYPE_MESSAGE: {
      const mess = action.message ?? emptyMessage;
      const ms: ISendMessage = {
        isSend: false,
        message: mess,
        error: "",
        isTyping: false,
      };
      return { ...state, messageSend: ms, isSend: false };
    }

    case END_SEND_MESSAGE: {
      const mess = action.message ?? emptyMessage;
      const ms: ISendMessage = {
        isSend: true,
        message: mess,
        error: "",
        isTyping: false,
      };
      return { ...state, messageSend: ms, isSend: true };
    }
    case "REQUEST_MESSAGES": {
      //console.log("REQUEST_MESSAGES");
      const theme = action.theme ?? "";
      const mess = Object.assign({}, state.messages);
      mess.isFetching = true;
      mess.didInvalidate = false;

      return { ...state, messages: mess, selectTheme: theme };
    }
    case "RECEIVE_MESSAGES":
    case "RECEIVE_ERROR": {
      //console.log("RECEIVE_MESSAGES");
      const theme = action.theme ?? "";
      const receive = action.receivedAt ?? Date.now();
      const items = action.messages ?? [];

      const error = action.error ?? "";
      const id = action.id;

      const mess = Object.assign({}, state.messages, {
        lastUpdated: receive,
        items: items,
        error: error,
      });

      mess.isFetching = false;
      return { ...state, messages: mess, selectTheme: theme, selectedID: id };
    }
    case "APPLY_SMILE": {
      const mess = action.message ?? emptyMessage;
      mess.message = smileInText(mess?.message);
      const ms: ISendMessage = { isSend: true, message: mess, error: "" };
      return { ...state, messageSend: ms };
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

export const rootReducer = combineReducers({
  // Define a top-level state field named `todos`, handled by `todosReducer`
  message: reducer,
  users: reducerUsers,
});
