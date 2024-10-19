//получение списка сообщений
//получение одного сообщения
//отправка сообщения
//получение списка пользователей
//поиск по чату
export type Tmessage = {
  name: string;
  message: string;
  id: number;
  crDate: Date;
};
export type State = {
  allMess: Array<Tmessage>;
  messages?: Array<Tmessage>;
  users?: Array<string>;
  error?: string;
};

export type Action =
  | {
      type: "getList";
    }
  | {
      type: "getMessage";
      payload: { id: number };
    }
  | {
      type: "sendMessage";
      payload: { message: string; name: string };
    }
  | {
      type: "getUsers";
    }
  | {
      type: "findMessageFromUser";
      payload: { name: string };
    }
  | {
      type: "findMessageByWord";
      payload: { find: string };
    };

export type Store<State = any, Action = { type: string }> = {
  getState(): State;
  dispatch(action: Action): any;
  subscribe(cb: () => void): () => void;
};

export type Reducer<State, Action> = (state: State, action: Action) => State;

export type Middleware<State, Action> = (
  store: Store<State, Action>,
) => (next: (action: Action) => any) => (action: Action) => any;

export type ConfigureStore<State, Action> = (
  reducer: Reducer<State, Action>,
  initialState?: State | undefined,
  middlewares?: Middleware<State, Action>[],
) => Store<State, Action>;

function getId(mess: Array<Tmessage>) {
  if (mess.length == 0) return 1;
  return mess.reduce((ind, v) => (ind = v.id > ind ? v.id : ind), 1) + 1;
}
export const reducer: Reducer<State, Action> = (
  state = { allMess: new Array<Tmessage>() },
  action,
) => {
  switch (action.type) {
    case "getList": {
      const s: State = {
        allMess: state.allMess,
        messages: state.allMess,
        users: undefined,
        error: undefined,
      };
      return s;
    }
    case "getMessage": {
      const id = action.payload?.id;
      let err = undefined;
      let retmes: Array<Tmessage> | undefined;
      let retus: Array<string> | undefined;
      try {
        const m: Tmessage = state.allMess.find((val) => val["id"] === id)!;
        retmes = [m];
        retus = [m?.name];
      } catch (e) {
        if (typeof e === "string") {
          err = e.toUpperCase(); // works, `e` narrowed to string
        } else if (e instanceof Error) {
          err = e.message; // works, `e` narrowed to Error
        }
      }
      const s: State = {
        allMess: state.allMess,
        messages: retmes,
        users: retus,
        error: err,
      };
      return s;
    }
    case "sendMessage": {
      const m: Tmessage = {
        message: action.payload.message,
        name: action.payload.name,
        crDate: new Date(),
        id: getId(state.allMess),
      };
      state.allMess.push(m);
      const s: State = {
        allMess: state.allMess,
        messages: state.allMess,
        users: undefined,
        error: undefined,
      };
      return s;
    }
    case "getUsers": {
      const users = state.allMess.reduce(
        (acc, val) => acc.add(val.name),
        new Set<string>(),
      );

      const s: State = {
        allMess: state.allMess,
        messages: undefined,
        users: [...users],
        error: undefined,
      };
      return s;
    }
    case "findMessageFromUser": {
      const userName = action.payload.name;
      const messages = state.allMess.filter((val) => val.name === userName);

      const s: State = {
        allMess: state.allMess,
        messages: messages,
        users: [userName],
        error: undefined,
      };
      return s;
    }
    case "findMessageByWord": {
      const phrase = action.payload.find;
      const messages = state.allMess.filter((val) =>
        val.message.includes(phrase),
      );

      const s: State = {
        allMess: state.allMess,
        messages: messages,
        users: undefined,
        error: undefined,
      };
      return s;
    }
  }
  return state;
};

export function configureStore(reducer: Reducer<State, Action>, state: State) {
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

const store = configureStore(reducer, {
  allMess: new Array<Tmessage>(),
  messages: undefined,
  users: undefined,
  error: undefined,
});
