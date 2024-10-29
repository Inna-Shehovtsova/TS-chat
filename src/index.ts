// import "./style/style.css";
import {
  ISendMessage,
  StateMessages,
  combineState,
  rootReducer,
} from "./reducer/reducer";
import { combineReducers, configureStore, Dispatch } from "@reduxjs/toolkit";
import { getMessagesList, sendMessage } from "./reducer/messagesApi";
import {
  applySmile,
  beginTypeMessage,
  endTypeMessage,
  receiveMessages,
  receiveUser,
  requestMessages,
  sendOneMessage,
} from "./reducer/Action";
import { smileCollection } from "./reducer/smileCollection";
import { IMessage } from "./reducer/iMessage";

function renderSmileTable() {
  const sm = document.querySelector(".left") as HTMLElement;
  let innerTable = "<tr><th>Вид</th></tr>";
  for (const v of smileCollection) {
    innerTable += `<tr><td class="tsmile" my_data_smile=${v.html}>${v.html}</td></tr>`;
  }
  sm.innerHTML = `<table class="tsmile">${innerTable}</table>`;
}
renderSmileTable();
//const el = document.getElementById("app") as HTMLElement;
function renderCentralElement() {
  const el = document.querySelector("#app") as HTMLElement;
  el.innerHTML = `
        <div class="message"><input class="text_name" value="name"></input></p>
        <p><input class="text_input" value="message text"></input></p>
        
        <p><button class="send">Send message</button></p>
        
        <p class="attention"></p>
        <p class="theme"></p>
        <h1 style="color: red" class="error"></h1>
        <ul class="messages"></ul>`;
  const elUsers = document.querySelector("#users") as HTMLElement;
}
renderCentralElement();
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
      m.forEach((val) => {
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
    dispatch(endTypeMessage(mess));
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
      console.log("need update");
      return dispatch(asyncGet());
    }
  };
}
async function loadData() {
  store.dispatch(asyncGet());
}
function applySmileInput(e: Event) {
  console.log("in applySmileInput ");

  const smile = e.target as HTMLElement;
  let st = "";
  if (smile.hasAttribute("my_data_smile")) {
    st = smile.getAttribute("my_data_smile") ?? "";
  }
  const state = store.getState();
  if (state.message.messageSend) {
    const mess: IMessage = { ...state.message.messageSend.message };
    mess.message += st;
    store.dispatch(beginTypeMessage(mess));
  }
}
function typing() {
  const text = document.querySelector(".text_input") as HTMLInputElement;
  const name = document.querySelector(".text_name") as HTMLInputElement;
  const mess: IMessage = {
    message: text.value,
    name: name.value,
    now: Date.now(),
  };
  console.log("typing");
  store.dispatch(beginTypeMessage(mess));
}

async function send() {
  console.log("send");
  const state = store.getState();
  if (state.message.messageSend) {
    const mess: IMessage = { ...state.message.messageSend.message };
    mess.now = Date.now();
    store.dispatch(asyncSend(mess));
  }
}
type RenderMessages = {
  isLoading: boolean;
  data: any | undefined;
  error: string | undefined;
  theme: string | undefined;
  isSended: boolean;
  text: ISendMessage | undefined;
};
const render = (props: RenderMessages) => {
  const el = document.querySelector("#app") as HTMLElement;
  console.log("render", props);

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
    if (t) t.innerHTML = "";

    for (let i = 0; i < props.data.length; i++) {
      const m: IMessage = { ...props.data[i] };
      const messEl = document.createElement("li");
      messEl.innerHTML = `<p class="username">${m.name}</p>
                        <p class="text">${m.message}</p>
                        <p class="time">${m.date?.toDateString()}</p>`;
      if (t) t.insertAdjacentElement("beforeend", messEl);
    }
  }
  if (props.text) {
    if (props.text.isTyping) {
      console.log("is typing");
      const text = document.querySelector(".text_input") as HTMLInputElement;
      text.value = props.text.message.message;
      const t1 = el.querySelector(".send") as HTMLButtonElement;
      t1.disabled = false;
    } else {
      if (!props.text.isTyping && !props.text.isSend) {
        console.log("end typing");
        const t = el.querySelector(".send") as HTMLButtonElement;
        t.disabled = true;
      } else {
        console.log("end send");
        let t = document.querySelector(".text_input") as HTMLInputElement;
        t.value = "";
        t = document.querySelector(".text_name") as HTMLInputElement;
        t.value = "";
        const t1 = el.querySelector(".send") as HTMLButtonElement;
        t1.disabled = false;
      }
    }
  } else {
    const t1 = el.querySelector(".send") as HTMLButtonElement;
    t1.disabled = false;
  }
  el.querySelector(".text_input")?.addEventListener("input", typing);

  el.querySelector(".send")?.addEventListener("click", send);
  document.querySelector(".tsmile")?.addEventListener("click", applySmileInput);
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
  const elUsers = document.querySelector("#users") as HTMLElement;
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
  data: state.message.messages.items.slice(0, 20),
  error: state.message.messages.error,
  theme: state.message.selectedTheme,
  isSended: state.message.isSend,
  text: state.message.messageSend,
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
