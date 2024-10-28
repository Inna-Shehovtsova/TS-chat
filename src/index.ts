// import "./style/style.css";
import { StateMessages, combineState, rootReducer } from "./reducer/reducer";
import { combineReducers, configureStore, Dispatch } from "@reduxjs/toolkit";
import { getMessagesList, sendMessage } from "./reducer/messagesApi";
import {
  receiveMessages,
  receiveUser,
  requestMessages,
  sendOneMessage,
  typeMessage,
} from "./reducer/Action";
import { IMessage } from "./reducer/iMessage";

//const el = document.getElementById("app") as HTMLElement;
const el = document.querySelector("#app") as HTMLElement;
el.innerHTML = `
     <input class="text_input" value="message text"></input>
    <input class="text_name" value="name"></input>
    <p><button class="send">Send message</button></p>
    <p class="attention"></p>
    <p class="theme"></p>
    <h1 style="color: red" class="error"></h1>
    <ul class="messages"></ul>`;
const elUsers = document.querySelector("#users") as HTMLElement;
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export function asyncGet() {
  return (dispatch: Dispatch, getState: any) => {
    dispatch(requestMessages(""));
    console.log("request messate");
    getMessagesList().then((mesAr: IMessage[]) => {
      console.log("before");
      const m = mesAr.sort((a, b) =>
        b.date!.valueOf() > a.date!.valueOf() ? 1 : -1,
      );
      dispatch(receiveMessages("", m));

      const u = new Array<string>();
      mesAr.forEach((val) => {
        if (val.name) u.push(val.name.trim());
      });
      const set = new Set(u);
      dispatch(
        receiveUser(
          Array.from(set).sort((a, b) => (a > b ? 1 : a < b ? -1 : 0)),
        ),
      );
      console.log("after");
    });
  };
}

export function asyncSend(mess: IMessage) {
  return (dispatch: Dispatch, getState: any) => {
    dispatch(typeMessage(mess));
    console.log("type messate");
    sendMessage(mess).then(() => {
      console.log("before send");
      dispatch(sendOneMessage(mess));
      console.log("after send");
    });
  };
}

function shouldBrowseMessages(getState: any, theme: string) {
  const state = getState();
  const timestampnow = Date.now() + state.message.delay;
  const selectedTheme = theme === (state.message.selectedTheme ?? "");
  const invalidate = state.message.messages.didInvalidate;
  const lastUpdTime = state.message.messages.lastUpdated ?? 0;

  if (timestampnow > lastUpdTime) {
    return true;
  }
  return invalidate;
}

export function browseAllMessagesIfNeeded() {
  console.log("browseAllMessagesIfNeeded");
  return (dispatch: any, state: any) => {
    if (shouldBrowseMessages(state, "")) {
      return dispatch(asyncGet());
    }
  };
}
async function loadData() {
  store.dispatch(asyncGet());
}

async function send() {
  const text = document.querySelector(".text_input") as HTMLInputElement;
  const name = document.querySelector(".text_name") as HTMLInputElement;

  const mess: IMessage = {
    message: text.value,
    name: name.value,
    now: Date.now(),
  };

  store.dispatch(asyncSend(mess));
}
type RenderMessages = {
  isLoading: boolean;
  data: any | undefined;
  error: string | undefined;
  theme: string | undefined;
  isSended: boolean;
};
const render = (props: RenderMessages) => {
  console.log("render", props);

  if (props.isSended) {
    const t = el.querySelector(".send");
    t?.classList.add("hide");
  } else {
    const t = el.querySelector(".send");
    t?.classList.remove("hide");
  }
  if (props.isLoading) {
    const t = el.querySelector(".attention");
    if (t) t.innerHTML = "Messages is loading";
  } else {
    const t = el.querySelector(".attention");
    if (t) t.innerHTML = "";
  }
  if (props.theme) {
    const t = el.querySelector(".theme");
    if (t) t.innerHTML = `Selected is ${props.theme} `;
  }
  if (props.error) {
    const t = el.querySelector(".error");
    if (t) t.innerHTML = `${props.error}`;
  }
  if (props.data.length > 0) {
    const t = el.querySelector(".messages");

    for (let i = 0; i < props.data.length; i++) {
      const m: IMessage = { ...props.data[i] };
      const messEl = document.createElement("li");
      messEl.innerHTML = `<p class="username">${m.name}</p>
                        <p class="text">${m.message}</p>
                        <p class="time">${m.date?.toDateString()}</p>`;
      if (t) t.appendChild(messEl);
    }
  }

  el.querySelector(".send")?.addEventListener("click", send);
};

type RenderUsers = {
  isLoading: boolean;
  data: any | undefined;
  error: string | undefined;
};
const selectUsersData = (state: any): RenderUsers => ({
  isLoading: state.users.users.isFetching,
  data: state.users.users.items,
  error: state.users.users.error,
});

const renderUsers = (props: RenderUsers) => {
  console.log("users", props);
  if (props.isLoading) {
    return (elUsers.innerHTML = "users is loading");
  }
  if (props.data) {
    elUsers.innerHTML = `<ul class="usersL"></ul>`;
    const t = elUsers.querySelector(".usersL");

    for (let i = 0; i < props.data.length; i++) {
      const messEl = document.createElement("li");
      messEl.innerHTML = `<p class="username">${props.data[i]}</p>`;
      if (t) t.appendChild(messEl);
    }
    return elUsers;
  }
  if (props.error) {
    return (elUsers.innerHTML = `<pre>${props.error}</pre>`);
  }
};

const selectData = (state: any): RenderMessages => ({
  isLoading: state.message.messages.isFetching,
  data: state.message.messages.items,
  error: state.message.messages.error,
  theme: state.message.selectedTheme,
  isSended: false,
});

function checkMessage() {
  let intervalId = null;
  // check if an interval has already been set up
  if (!intervalId) {
    intervalId = setInterval(
      () => store.dispatch(browseAllMessagesIfNeeded()),
      3000,
    );
  }
}
render(selectData(store.getState()));
renderUsers(selectUsersData(store.getState()));

store.subscribe(() => render(selectData(store.getState())));
store.subscribe(() => renderUsers(selectUsersData(store.getState())));
checkMessage();
