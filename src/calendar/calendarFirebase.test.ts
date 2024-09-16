import { mockFirebase } from "firestore-jest-mock";
const {
  mockCollection,
  mockInitializeApp,
} = require("firestore-jest-mock/mocks/firestore");
import {
  CalendarFirebase,
  initFirestore,
  firebaseConfig,
} from "./calendarFirebase";

//import { connectFirestoreEmulator } from "firebase/firestore";
import { emptyTask } from "./icalendar";

describe("Calendar tests", () => {
  //const db = initFirestore();
  describe("Calendar is class", () => {
    it("is a class", () => {
      //  expect(CalendarFirebase).toBeInstanceOf(Function);
      //  expect(new CalendarFirebase(db)).toBeInstanceOf(CalendarFirebase);
    });
  });
  describe("Calendar is class", () => {
    beforeAll(() => {
      mockFirebase(
        {
          database: {
            calendar: [
              {
                id: "1",
                desc: "test",
                dueDate: new Date().toDateString(),
                crDate: new Date().toDateString(),
                status: 0,
                tag: "test",
              },
            ],
            posts: [{ id: "123abc", title: "Really cool title" }],
          },
        },
        {
          includeIdsInData: true,
          mutable: true,
          simulateQueryFilters: true,
        },
      );
    });
    afterAll(() => {
      jest.clearAllMocks();
      mockCollection.mockClear();
    });
    it("testing stuff", async () => {
      //const firebase = require('firebase'); // or import firebase from 'firebase';
      //const firebaseapp = firebase.initializeApp(firebaseConfig);
      //const auth = firebase.auth(firebaseapp);
      //const db = firebase.firestore(firebaseapp);
      // import firebase from "firebase/compat/app"
      const firebase = require("firebase/compat/app");
      // import { initializeApp } from 'firebase/app';
      // import "firebase/compat/firestore";
      // import "firebase/compat/auth";
      const firebaseapp = firebase.initializeApp(firebaseConfig);
      const db = firebase.firestore(firebaseapp);
      //const db:firebase.firestore.Firestore = firebase.firestore();

      const d = await db.collection("calendar").get();

      expect(mockCollection).toHaveBeenCalledWith("calendar");
      expect(d.docs[0].data().id).toStrictEqual("1");
      // Write other assertions here
    });

    it("test read one", async () => {
      const firebase = require("firebase/compat/app");
      // import { initializeApp } from 'firebase/app';
      // import "firebase/compat/firestore";
      // import "firebase/compat/auth";
      const firebaseapp = firebase.initializeApp(firebaseConfig);
      const db = firebase.firestore(firebaseapp);
      const CF = new CalendarFirebase(db);
      const one = await CF.read();
      expect(one.length).toBe(1);
      expect(one[0].desc).toStrictEqual("test");
      const obj = Object.assign({}, emptyTask);
      obj.desc = "test2";
      obj.id = 2;
      await CF.writeOne(obj);
      const two = await CF.read();
      //console.log(two);
      expect(two.length).toBe(2);
      expect(two[0].desc).toStrictEqual("test");
      expect(two[1].desc).toStrictEqual("test2");
    });
    it.skip("test delete't work because lib not work ", async () => {
      const firebase = require("firebase/compat/app");
      const firebaseapp = firebase.initializeApp(firebaseConfig);
      const db = firebase.firestore(firebaseapp);
      const CF = new CalendarFirebase(db);
      const two = await CF.read();
      await CF.delete(two[1]);
      expect(mockCollection).toHaveBeenCalledWith(CF.tablename);

      const one2 = await CF.read();
      expect(one2.length).toBe(1);
      expect(one2[0].desc).toStrictEqual("test");
      console.log(one2);
      one2[0].desc = "update test";
      await CF.update(one2[0]);
      const one3 = await CF.read();
      console.log(one3);
      expect(one3.length).toBe(1);
      expect(one3[0].desc).toStrictEqual("update test");
    });
  });
});
