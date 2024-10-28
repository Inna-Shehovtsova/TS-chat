import { IMessage, IMessageFunctions } from "./iMessage";
import { MessageFirebase } from "./messageFirebase";
import { combineState, StateMessages, StateUsers } from "./reducer";
import { Action, Dispatch } from "redux";
export const REQUEST_MESSAGES = "REQUEST_MESSAGES";
export const REQUEST_MESSAGE = "REQUEST_MESSAGE";
export const RECEIVE_MESSAGES = "RECEIVE_MESSAGES";
export const SELECT_THEME = "SELECT_THEME";
export const REQUEST_USERS = "REQUEST_USERS";
export const RECEIVE_USERS = "RECEIVE_USERS";
export const SEND_MESSAGE = "SEND_MESSAGE";
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

export const a1 = () => (dispatch: Dispatch, getState: () => combineState) => {
  const theme = getState().message.selectedTheme ?? "";
  const messageStorage = getState().message.messageStorage!;
  dispatch(requestMessages(theme));
  if (theme.trim() === "")
    return messageStorage.read().then(
      (mesAr: IMessage[]) => dispatch(receiveMessages(theme, mesAr)),
      (error) => dispatch(receiveError(error)),
    );
  else {
    return messageStorage
      .getDesk(theme)
      .then()
      .then(
        (mesAr: IMessage[]) => dispatch(receiveMessages(theme, mesAr)),
        (error) => dispatch(receiveError(error)),
      );
  }
};

export function asyncGet() {
  return (dispatch: Dispatch, getState: any) => {
    dispatch(requestMessages(""));
    getState()
      .message.messageStorage!.read()
      .then((mesAr: IMessage[]) => dispatch(receiveMessages("", mesAr)));
  };
}

export function asyncGetMessages(
  theme: string,
  messageStorage: IMessageFunctions,
) {
  return () => (dispatch: (action: Action) => void) => {
    dispatch(requestMessages(theme));
    if (theme.trim() === "")
      messageStorage.read().then(
        (mesAr: IMessage[]) => dispatch(receiveMessages(theme, mesAr)),
        (error) => dispatch(receiveError(error)),
      );
    else {
      messageStorage.getDesk(theme).then(
        (mesAr: IMessage[]) => dispatch(receiveMessages(theme, mesAr)),
        (error) => dispatch(receiveError(error)),
      );
    }
  };
}
export function asyncGetOne(id: number) {
  return (dispatch: any, getState: any) => {
    dispatch(requestMessage(id));

    messageStorage
      .getByFilter((el) => el.id == id)
      .then(
        (mesAr: IMessage[]) => dispatch(receiveMessages("", mesAr)),
        (error) => dispatch(receiveError(error)),
      );
  };
}

function shouldBrowseMessages(state: StateMessages, theme: string) {
  const timestampnow = Date.now() + state.delay;
  const selectedTheme = theme === (state.selectedTheme ?? "");
  let invalidate = state.messages.didInvalidate;
  let lastUpdTime = state.messages.lastUpdated ?? 0;
  if (!selectedTheme) {
    return true;
  }
  if (selectedTheme) {
    lastUpdTime = state.messages.lastUpdated ?? 0;
    invalidate = state.messages.didInvalidate;
  }
  if (timestampnow > lastUpdTime) {
    return true;
  }
  return invalidate;
}
export function browseMessagesIfNeeded(theme: string) {
  return (dispatch: any, state: any) => {
    if (shouldBrowseMessages(state, theme)) {
      return dispatch(asyncGet());
    }
  };
}
