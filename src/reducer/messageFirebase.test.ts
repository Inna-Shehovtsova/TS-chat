import { mockFirebase } from "firestore-jest-mock";
const {
  mockCollection,
  mockInitializeApp,
} = require("firestore-jest-mock/mocks/firestore");
import {
  MessageFirebase,
  initFirestore,
  firebaseConfig,
} from "./messageFirebase";

//import { connectFirestoreEmulator } from "firebase/firestore";
import { emptyMessage } from "./iMessage";

describe.skip("Message FB tests", () => {
  describe("Message is class", () => {
    beforeAll(() => {
      mockFirebase(
        {
          database: {
            messages: [
              {
                id: "1",
                message: "test",
                name: "test1",
                crDate: new Date().toDateString(),
              },
              {
                id: "2",
                message: "some other test ",
                name: "test2",
                crDate: new Date().toDateString(),
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

      const d = await db.collection("messages").get();

      expect(mockCollection).toHaveBeenCalledWith("messages");
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
      const CF = new MessageFirebase(db);
      const one = await CF.read();
      expect(one.length).toBe(2);
      expect(one[0].message).toStrictEqual("test");
      const obj = Object.assign({}, emptyMessage);
      obj.message = "test2";
      obj.id = 3;
      obj.name = "test3";
      await CF.writeOne(obj);
      const two = await CF.read();
      //console.log(two);
      expect(two.length).toBe(3);
      expect(two[0].message).toStrictEqual("test");
      expect(two[2].message).toStrictEqual("test2");
    });

    it("test read one", async () => {
      const firebase = require("firebase/compat/app");
      // import { initializeApp } from 'firebase/app';
      // import "firebase/compat/firestore";
      // import "firebase/compat/auth";
      const firebaseapp = firebase.initializeApp(firebaseConfig);
      const db = firebase.firestore(firebaseapp);
      const CF = new MessageFirebase(db);
      const one = await CF.getByUser("test1");
      expect(one.length).toBe(1);
      expect(one[0].name).toStrictEqual("test1");
      const two = await CF.getDesk("some");
      expect(two.length).toBe(1);
      expect(two[0].message).toContain("some");
    });
  });
});
