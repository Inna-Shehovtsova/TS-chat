import { ITask, ITaskCRUD, EStatus, emptyTask } from "./icalendar";
// // Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVRyc1hbMmUzK69pSvVZRQ26RKokhx--M",
  authDomain: "studentcalendar-1076c.firebaseapp.com",
  projectId: "studentcalendar-1076c",
  storageBucket: "studentcalendar-1076c.appspot.com",
  messagingSenderId: "860419721981",
  appId: "1:860419721981:web:e72fbba70ca98ece0c8c94",
  measurementId: "G-HE7GD4Z88L",
};

// Firestore data converter
const calendarConverter = {
  toFirestore: (data: ITask) => {
    return {
      id: data.id ?? 0,
      desc: data.desc,
      dueDate: JSON.stringify(data.dueDate),
      crDate: JSON.stringify(data.crDate),
      status: data.status,
      tag: data.tag,
    };
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    const ret: ITask = {
      id: data.id,
      desc: data.desc,
      dueDate: JSON.parse(data.dueDate),
      crDate: JSON.parse(data.crDate),
      status: data.status,
      tag: data.tag,
    };
    return ret;
  },
};

export class CalendarFirebase {
  db: Firestore;
  app: FirebaseApp;
  table: string;
  maxId: number;
  tasks: Array<ITask>;
  auth: any;
  async create(
    desc: string,
    startDate: Date,
    dueDate: Date,
    tag?: string,
  ): Promise<void> {
    const task = {
      desc: desc,
      status: 0,
      dueDate: JSON.stringify(dueDate),
      crDate: JSON.stringify(startDate),
      id: ++this.maxId,
    };
    // task.status = 0;
    // task.desc = desc;
    // //task.crDate = startDate;
    // //task.dueDate = dueDate;
    // task.dueDate = JSON.stringify(dueDate),
    // task.crDate  = JSON.stringify(startDate),
    // task.id = ++this.maxId;
    //const ref = doc(this.db, this.table).withConverter(calendarConverter);
    console.log("create firebase");
    const ref = doc(this.db, this.table, task.id.toString());
    //console.log('in create ', ref.id, " ", ref.path, ref.parent);
    await setDoc(ref, task);
    //console.log('in create 2',ref.id, " ", ref.path, ref.parent);
  }
  async read(): Promise<ITask[]> {
    console.log("read firebase");
    this.tasks = new Array<ITask>();
    try {
      const querySnapshot = await getDocs(
        collection(this.db, this.table).withConverter(calendarConverter),
      );
      querySnapshot.forEach((doc) => {
        //let el:ITask = Object.assign(doc.data(), emptyTask);
        // this.tasks.push(el);
        console.log(`${doc.id} => ${doc.data()}`);
      });
    } catch (exeption) {
      console.log(exeption);
    }
    return this.tasks;
  }
  //update(newTask: ITask):  Promise<void>;
  // delete(task: ITask):  Promise<void>;
  constructor() {
    try {
      this.app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      //console.log(this.app);
      this.db = getFirestore(this.app);
      this.auth = getAuth(this.app);
    } catch (err) {
      console.log("error in constructor ", err);
    }
    //console.log(this.db);
    this.table = "my_student_calendar";
    this.maxId = 0;
    this.tasks = [];
    console.log("end constructor");
  }
}
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// // Initialize Cloud Firestore and get a reference to the service
// const db = getFirestore(app);

// import { collection, addDoc } from "firebase/firestore";

// try {
//   const docRef = await addDoc(collection(db, "users"), {
//     first: "Ada",
//     last: "Lovelace",
//     born: 1815
//   });
//   console.log("Document written with ID: ", docRef.id);
// } catch (e) {
//   console.error("Error adding document: ", e);
// }

// import { collection, getDocs } from "firebase/firestore";

// const querySnapshot = await getDocs(collection(db, "users"));
// querySnapshot.forEach((doc) => {
//   console.log(`${doc.id} => ${doc.data()}`);
// });
// // Allow read/write access to a document keyed by the user's UID
// service cloud.firestore {
//     match /databases/{database}/documents {
//       match /users/{uid} {
//         allow read, write: if request.auth != null && request.auth.uid == uid;
//       }
//     }
//   }
