import { CalendarFirebase, initFirestore } from "./calendarFirebase";
import { connectFirestoreEmulator } from "firebase/firestore";
import { emptyTask } from "./icalendar";

describe.skip("Calendar tests", () => {
  const db = initFirestore();
  describe("Calendar is class", () => {
    it("is a class", () => {
      expect(CalendarFirebase).toBeInstanceOf(Function);
      expect(new CalendarFirebase(db)).toBeInstanceOf(CalendarFirebase);
    });
  });
  describe("Calendar is class", () => {
    beforeAll(() => {
      connectFirestoreEmulator(db, "127.0.0.1", 8080);
    });
    it("test read one", async () => {
      const CF = new CalendarFirebase(db);
      const empty = await CF.read();
      expect(empty.length).toBe(0);
    });
    it("test write one", async () => {
      const CF = new CalendarFirebase(db);
      const obj = Object.assign({}, emptyTask);
      obj.desc = "test";
      await CF.writeOne(obj);
      const one = await CF.read();
      expect(one.length).toBe(1);
      expect(one[0].desc).toStrictEqual("test");
    });
  });
});
