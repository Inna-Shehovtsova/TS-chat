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
import { ITask, emptyTask } from "./icalendar";
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
const calendarConverter = {
  toFirestore: (el: ITask) => {
    return {
      id: el.id,
      desc: el.desc,
      dueDate: el.dueDate,
      crDate: el.crDate,
      status: el.status,
      tag: el.tag,
    };
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    const ret = Object.assign({}, emptyTask);
    ret.crDate = data.crDate;
    ret.desc = data.desc;
    ret.dueDate = data.dueDate;
    ret.id = data.id;
    ret.status = data.status;
    ret.tag = data.tag;
    return ret;
  },
};

export class CalendarFirebase {
  db: firebase.firestore.Firestore;
  tablename: string;
  constructor(db: firebase.firestore.Firestore) {
    this.db = db;
    this.tablename = "calendar";
  }
  async read(): Promise<ITask[]> {
    const ret: ITask[] = new Array<ITask>();
    //console.log(this.db);
    const querySnapshot = await this.db
      .collection(this.tablename)
      .withConverter(calendarConverter)
      .get();
    //const querySnapshot = await getDocs(collRef);
    querySnapshot.forEach((doc) => {
      ret.push(doc.data());
    });
    return ret;
  }

  async writeOne(el: ITask): Promise<void> {
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
  //   async readOne(id: number): Promise<ITask | null> {
  //     let ret: ITask | null = null;
  //     const docRef = doc(this.db, this.tablename, String(id)).withConverter(
  //       calendarConverter,
  //     );
  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.exists()) {
  //       // Convert to City object
  //       ret = docSnap.data();
  //       // Use a City instance method
  //     } else {
  //       console.log("No such document!");
  //     }

  //     return ret;
  //   }
  //   async read(): Promise<ITask[]> {
  //     const ret: ITask[] = new Array<ITask>();
  //     console.log(this.db);
  //     const collRef = collection(this.db, this.tablename).withConverter(
  //       calendarConverter,
  //     );
  //     const querySnapshot = await getDocs(collRef);
  //     querySnapshot.forEach((doc) => {
  //       ret.push(doc.data());
  //     });
  //     return ret;
  //   }
  //   async writeOne(el: ITask): Promise<void> {
  //     try {
  //       const docRef = doc(
  //         this.db,
  //         this.tablename,
  //         el.id.toString(),
  //       ).withConverter(calendarConverter);
  //       await setDoc(docRef, el);
  //       console.log("Document written with ID: ", docRef.id);
  //     } catch (e) {
  //       console.error("Error adding document: ", e);
  //     }
  //   }
  async write(arr: ITask[]): Promise<void> {
    for (let i = 0; i < arr.length; i++) {
      await this.writeOne(arr[i]);
    }
  }
  // async update(newTask: ITask): Promise<void> {
  //   const elRef = doc(
  //     this.db,
  //     this.tablename,
  //     newTask.id.toString(),
  //   ).withConverter(calendarConverter);

  //   await updateDoc(elRef, newTask);
  // }
  //async delete(task: ITask): Promise<void> {
  //   await deleteDoc(doc(this.db, this.tablename, task.id.toString()));
  // }
  async update(newTask: ITask): Promise<void> {
    const elRef = this.db
      .collection(this.tablename)
      .doc(newTask.id.toString())
      .withConverter(calendarConverter);

    await elRef.update(newTask);
  }
  async delete(task: ITask): Promise<void> {
    const elRef = this.db.collection(this.tablename).doc(task.id.toString());
    await elRef.delete();
  }
}
