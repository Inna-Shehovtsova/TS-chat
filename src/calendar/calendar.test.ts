import { CalendarLocalStorage, ITask, ITaskCRUD, EStatus } from "./calendar";

describe("Calendar tests", () => {
  describe("Calendar is class", () => {
    it("is a class", () => {
      expect(CalendarLocalStorage).toBeInstanceOf(Function);
      expect(new CalendarLocalStorage()).toBeInstanceOf(CalendarLocalStorage);
    });
  });
  describe("CRUD interface", () => {
    const D1 = new Date();
    const D2 = new Date();
    const el: ITask = {
      desc: "ToDo",
      crDate: D1,
      dueDate: D2,
      status: EStatus.Undone,
      tag: "",
      id: 1,
    };
    const el2: ITask = Object.assign({}, el);
    let arr: Array<ITask>;
    let c1: CalendarLocalStorage;
    const KEY = "CalendKey";
    beforeEach(() => {
      // to fully reset the state between tests, clear the storage
      localStorage.clear();
      // and reset all mocks
      jest.clearAllMocks();
      // clearAllMocks will impact your other mocks too, so you can optionally reset individual mocks instead:
      localStorage.setItem.mockClear();

      el2.desc = "ToDo2";
      el2.id = 2;
      el2.tag = "next";
      arr = new Array<ITask>();
      c1 = new CalendarLocalStorage();
    });
    it("has CRUD functions", () => {
      expect(c1.create).toBeInstanceOf(Function);
      expect(c1.read).toBeInstanceOf(Function);
      expect(c1.update).toBeInstanceOf(Function);
      expect(c1.delete).toBeInstanceOf(Function);
    });
    it("can create element", () => {
      expect(c1.tasks.length).toBe(0);
      arr.push(el);
      c1.create("ToDo", D1, D2);

      const VALUE = JSON.stringify(arr);
      // dispatch(action.update(KEY, VALUE));

      expect(localStorage.setItem).toHaveBeenLastCalledWith(KEY, VALUE);
      expect(localStorage.__STORE__[KEY]).toBe(VALUE);
      expect(Object.keys(localStorage.__STORE__).length).toBe(1);
      expect(c1.read().length).toBe(1);
      expect(localStorage.getItem).toHaveBeenLastCalledWith(KEY);
      expect(localStorage.__STORE__[KEY]).toBe(VALUE);
      expect(c1.read()[0].desc).toStrictEqual("ToDo");
    });
    it("can create 2 element", () => {
      c1.create("ToDo", D1, D2);

      arr.push(el);
      const VALUE = JSON.stringify(arr);
      expect(localStorage.setItem).toHaveBeenLastCalledWith(KEY, VALUE);
      arr.push(el2);
      const VALUE2 = JSON.stringify(arr);
      c1.create("ToDo2", D1, D2, "next");
      expect(localStorage.setItem).toHaveBeenLastCalledWith(KEY, VALUE2);
      expect(localStorage.__STORE__[KEY]).toBe(VALUE2);
      const readed = c1.read();
      const second = readed[1];

      expect(readed.length).toBe(2);
      expect(second.tag).toBe("next");
    });
    it("can delete element", () => {
      expect(c1.tasks.length).toBe(0);
      c1.create("ToDo", D1, D2);
      c1.create("ToDo2", D1, D2, "next");
      expect(c1.read().length).toBe(2);
      const toDelete = c1.read()[1];
      expect(toDelete.id).toBe(2);
      c1.delete(toDelete);
      expect(c1.read().length).toBe(1);
      expect(c1.read()[0].id).toBe(1);
    });
    it("can update element", () => {
      expect(c1.tasks.length).toBe(0);
      c1.create("ToDo", D1, D2);
      c1.create("ToDo2", D1, D2, "next");
      expect(c1.read().length).toBe(2);
      const toUpdate = c1.read()[1];
      toUpdate.status = EStatus.Done;
      el2.status = toUpdate.status;
      c1.update(toUpdate);
      arr.push(el);
      arr.push(el2);
      const VALUE2 = JSON.stringify(arr);
      expect(localStorage.setItem).toHaveBeenLastCalledWith(KEY, VALUE2);
      expect(localStorage.__STORE__[KEY]).toBe(VALUE2);
    });
  });
  describe("Filter interface", () => {});
});
