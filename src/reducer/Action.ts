import { IMessage, IMessageFunctions } from "./iMessage";
import { MessageFirebase } from "./messageFirebase";
import {
  combineState,
  ISendMessage,
  StateMessages,
  StateUsers,
} from "./reducer";
import { Action, Dispatch } from "redux";
export const REQUEST_MESSAGES = "REQUEST_MESSAGES";
export const REQUEST_MESSAGE = "REQUEST_MESSAGE";
export const RECEIVE_MESSAGES = "RECEIVE_MESSAGES";
export const SELECT_THEME = "SELECT_THEME";
export const REQUEST_USERS = "REQUEST_USERS";
export const RECEIVE_USERS = "RECEIVE_USERS";
export const SEND_MESSAGE = "SEND_MESSAGE";
export const TYPE_MESSAGE = "TYPE_MESSAGE";
export const RECEIVE_ERROR = "RECEIVE_ERROR";
export const RECEIVE_ERROR_USER = "RECEIVE_ERROR_USER";
export const SET_STORAGE = "SET_STORAGE";

export interface actionMessage extends Action {
  type: string;
  theme?: string;
  id?: number;
  messages?: Array<IMessage>;
  error?: string;
  receivedAt?: number;
  items?: Array<string>;
  storage?: IMessageFunctions;
  message?: IMessage;
}
export function selectTheme(theme: string) {
  return {
    type: SELECT_THEME,
    theme,
  };
}

export function requestUser() {
  return {
    type: REQUEST_USERS,
  };
}

export function receiveUser(items: Array<string>) {
  return {
    type: RECEIVE_USERS,
    items,
    receivedAt: Date.now(),
  };
}
export function requestMessages(theme: string) {
  return {
    type: REQUEST_MESSAGES,
    theme,
  };
}
export function requestMessage(id: number) {
  return {
    type: REQUEST_MESSAGE,
    id,
  };
}

export function receiveMessages(theme: any, messages: Array<IMessage>) {
  return {
    type: RECEIVE_MESSAGES,
    theme,
    messages: messages,
    receivedAt: Date.now(),
  };
}
export function sendOneMessage(message: IMessage) {
  return {
    type: SEND_MESSAGE,

    message,
  };
}

export function typeMessage(message: IMessage) {
  return {
    type: TYPE_MESSAGE,

    message,
  };
}
export function receiveError(error: string) {
  return {
    type: RECEIVE_ERROR,
    error,
    receivedAt: Date.now(),
  };
}
export function receiveErrorUser(error: string) {
  return {
    type: RECEIVE_ERROR_USER,
    error,
    receivedAt: Date.now(),
  };
}
export function setStorage(storage: IMessageFunctions) {
  return {
    type: SET_STORAGE,
    storage,
  };
}
