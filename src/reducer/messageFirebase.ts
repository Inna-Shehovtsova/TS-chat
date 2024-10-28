// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
// import {
//   doc,
//   getDoc,
//   addDoc,
//   setDoc,
//   updateDoc,
//   deleteDoc,
// } from "firebase/firestore";
import {
  IMessage,
  emptyMessage,
  IMessageCRUD,
  IMessageFilter,
  IMessageFunctions,
} from "./iMessage";
import { collection, getDocs } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyAVRyc1hbMmUzK69pSvVZRQ26RKokhx--M",
  authDomain: "studentcalendar-1076c.firebaseapp.com",
  databaseURL:
    "https://studentcalendar-1076c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "studentcalendar-1076c",
  storageBucket: "studentcalendar-1076c.appspot.com",
  messagingSenderId: "860419721981",
  appId: "1:860419721981:web:e72fbba70ca98ece0c8c94",
  measurementId: "G-HE7GD4Z88L",
};

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// import {
//   getFirestore,
//   connectFirestoreEmulator,
//   Firestore,
// } from "firebase/firestore";

// firebaseApps previously initialized using initializeApp()
//const db = getFirestore();
//connectFirestoreEmulator(db, "127.0.0.1", 8080);

export function initFirestore(): firebase.firestore.Firestore {
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore(app);
  return db;
}

// Firestore data converter
const messageConverter = {
  toFirestore: (el: IMessage) => {
    return {
      id: el.id,
      message: el.message,
      crDate: el.crDate,
      name: el.name,
    };
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    const ret = Object.assign({}, emptyMessage);
    ret.crDate = data.crDate;
    ret.message = data.message;
    ret.id = data.id;
    ret.name = data.name;
    return ret;
  },
};

export class MessageFirebase implements IMessageFunctions {
  db: firebase.firestore.Firestore;
  tablename: string;
  constructor(db: firebase.firestore.Firestore) {
    this.db = db;
    this.tablename = "messages";
  }
  async read(): Promise<IMessage[]> {
    const ret: IMessage[] = new Array<IMessage>();
    //console.log(this.db);
    const querySnapshot = await this.db
      .collection(this.tablename)
      .withConverter(messageConverter)
      .get();
    //const querySnapshot = await getDocs(collRef);
    querySnapshot.forEach((doc) => {
      ret.push(doc.data());
    });
    return ret;
  }

  async writeOne(el: IMessage): Promise<void> {
    console.log("in write");
    try {
      const docRef = this.db.collection(this.tablename).doc(el.id.toString());
      console.log(docRef);
      await docRef.set(el);

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async write(arr: IMessage[]): Promise<void> {
    for (let i = 0; i < arr.length; i++) {
      await this.writeOne(arr[i]);
    }
  }

  async update(newTask: IMessage): Promise<void> {
    const elRef = this.db
      .collection(this.tablename)
      .doc(newTask.id.toString())
      .withConverter(messageConverter);

    await elRef.update(newTask);
  }
  async delete(task: IMessage): Promise<void> {
    const elRef = this.db.collection(this.tablename).doc(task.id.toString());
    await elRef.delete();
  }

  async getDesk(word: string): Promise<Array<IMessage>> {
    return await this.getByFilter((el) => el.message.includes(word));
  }
  async getByUser(user: string): Promise<Array<IMessage>> {
    return await this.getByFilter((el) => el.name == user);
  }
  async getByFilter(
    filter: (el: IMessage) => boolean,
  ): Promise<Array<IMessage>> {
    const messages = await this.read();
    return messages.filter(filter);
  }
}
