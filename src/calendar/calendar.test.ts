import { ITask, ITaskCRUD, EStatus } from "./icalendar";
import { CalendarLocalStorage } from "./calendarLocalStorage";
import { CalendarFirebase, initFirestore } from "./calendarFirebase";
import { Calendar } from "./calendar";
import { FirebaseApp, initializeApp, getApps, getApp } from "firebase/app";
import { collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";
import { getFirestore, Firestore } from "firebase/firestore";
import { getDatabase, Database } from "firebase/database";
import { mockFirebase } from "firestore-jest-mock";
import { mockCollection } from "firestore-jest-mock/mocks/firestore";
describe.skip("Calendar tests", () => {
  describe("Calendar is class", () => {
    it("is a class", () => {
      expect(CalendarLocalStorage).toBeInstanceOf(Function);
      expect(new CalendarLocalStorage()).toBeInstanceOf(CalendarLocalStorage);
    });
  });
  describe("CRUD interface LocalStorag", () => {
    const D1 = new Date();
    const D2 = new Date();
    const el: ITask = {
      desc: "ToDo",
      crDate: D1.toJSON(),
      dueDate: D2.toJSON(),
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
    it("can create element", async () => {
      expect(c1.tasks.length).toBe(0);
      arr.push(el);
      await c1.create("ToDo", D1, D2);

      const VALUE = JSON.stringify(arr);
      // dispatch(action.update(KEY, VALUE));

      expect(localStorage.setItem).toHaveBeenLastCalledWith(KEY, VALUE);
      expect(localStorage.__STORE__[KEY]).toBe(VALUE);
      expect(Object.keys(localStorage.__STORE__).length).toBe(1);
      const data = await c1.read();
      expect(data.length).toBe(1);
      expect(localStorage.getItem).toHaveBeenLastCalledWith(KEY);
      expect(localStorage.__STORE__[KEY]).toBe(VALUE);
      expect(data[0].desc).toStrictEqual("ToDo");
    });
    it("can create 2 element", async () => {
      await c1.create("ToDo", D1, D2);

      arr.push(el);
      const VALUE = JSON.stringify(arr);
      expect(localStorage.setItem).toHaveBeenLastCalledWith(KEY, VALUE);
      arr.push(el2);
      const VALUE2 = JSON.stringify(arr);
      await c1.create("ToDo2", D1, D2, "next");
      expect(localStorage.setItem).toHaveBeenLastCalledWith(KEY, VALUE2);
      expect(localStorage.__STORE__[KEY]).toBe(VALUE2);
      const readed = await c1.read();
      const second = readed[1];

      expect(readed.length).toBe(2);
      expect(second.tag).toBe("next");
    });
    it("can delete element", async () => {
      expect(c1.tasks.length).toBe(0);
      await c1.create("ToDo", D1, D2);
      await c1.create("ToDo2", D1, D2, "next");
      const data = await c1.read();
      expect(data.length).toBe(2);
      const toDelete = data[1];
      expect(toDelete.id).toBe(2);
      await c1.delete(toDelete);
      const dataDel = await c1.read();
      expect(dataDel.length).toBe(1);
      expect(dataDel[0].id).toBe(1);
    });
    it("can update element", async () => {
      expect(c1.tasks.length).toBe(0);
      await c1.create("ToDo", D1, D2);
      await c1.create("ToDo2", D1, D2, "next");
      const data = await c1.read();
      expect(data.length).toBe(2);
      const toUpdate = data[1];
      toUpdate.status = EStatus.Done;
      el2.status = toUpdate.status;
      await c1.update(toUpdate);
      arr.push(el);
      arr.push(el2);
      const VALUE2 = JSON.stringify(arr);
      expect(localStorage.setItem).toHaveBeenLastCalledWith(KEY, VALUE2);
      expect(localStorage.__STORE__[KEY]).toBe(VALUE2);
    });
  });

  describe("Filter interface", () => {
    const D1: Date = new Date("December 17, 1995 03:24:00");
    const D2: Date = new Date("December 18, 1995 03:24:00");
    const el: ITask = {
      desc: "ToDo",
      crDate: D1.toJSON(),
      dueDate: D2.toJSON(),
      status: EStatus.Undone,
      tag: "",
      id: 1,
    };
    const el2: ITask = Object.assign({}, el);
    let c1: CalendarLocalStorage;
    let arr: Array<ITask>;
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
    it("filter", async () => {
      await c1.create(el.desc, D1!, D2!, el.tag);
      await c1.create(el2.desc, D1!, D2!, el2.tag);
      const prev = await c1.read();
      expect(prev.length).toBe(2);
      const calend = new Calendar(c1);
      let res = await calend.getUndone();
      //console.log("getUndone", res);
      expect(res.length).toBe(2);
      res = await calend.getDone();
      //console.log("getDone", res);
      expect(res.length).toBe(0);
      res = await calend.getDesk("ToDo2");
      expect(res.length).toBe(1);
      expect(res[0].desc).toStrictEqual("ToDo2");
      res = await calend.getStarted(new Date("December 17, 1995 05:24:00"));
      expect(res.length).toBe(2);
      res = await calend.getUnfinished(D1);
      expect(res.length).toBe(2);
      res = await calend.getByTag("next");
      expect(res.length).toBe(1);
      expect(res[0].desc).toStrictEqual("ToDo2");
      expect(res[0].tag.indexOf("next")).toBeGreaterThan(-1);
    });
    it("filter by my filter", async () => {
      const calend = new Calendar(c1);
      await calend.CRUD.create(el.desc, D1!, D2!, el.tag);
      await calend.CRUD.create(el2.desc, D1!, D2!, el2.tag);
      const res1 = await calend.CRUD.read();
      expect(res1.length).toBe(2);
      let callIndex = 0;
      const onMockFilter = jest.fn((el) => {
        callIndex++;
        return false;
      });

      const res = await calend.getByFilter(onMockFilter);
      expect(res.length).toBe(0);
      expect(callIndex).toBe(2);
    });
  });
});
