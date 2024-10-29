// put your code here
type config = Record<string, (state: any, action: any) => any>;
type states = Record<string, any>;
export function combineReducers(ObjStates: config | undefined) {
  const stateStorage: states = {};

  return (state: any, action: any) => {
    for (const key of Object.keys(ObjStates!)) {
      stateStorage[key] = ObjStates?.[key](state?.[key], action);
    }
    return stateStorage;
  };
}
