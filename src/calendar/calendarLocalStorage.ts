import { ITask, ITaskCRUD, EStatus, emptyTask } from "./icalendar";
// export class Calendar implements ITaskCRUD {
//   tasks: Array<ITask>;
//   maxId: number;

//   // create(task:ITask){
//   //     task.id = this.maxId++;
//   //     this.tasks.push(task);
//   // }
//   create(desc: string, startDate: Date, dueDate: Date, tag?: string) {
//     const task = Object.assign({}, emptyTask);
//     task.desc = desc;
//     task.crDate = startDate;
//     task.dueDate = dueDate;
//     task.id = this.maxId++;

//     if (tag) task.tag = tag;

//     this.tasks.push(task);
//   }
//   read(): Array<ITask> {
//     return this.tasks;
//   }
//   update(newTask: ITask): void {}
//   delete(task: ITask): void {
//     this.tasks = this.tasks.filter((el) => el.id != task.id);
//   }

//   constructor(task?: Array<ITask>) {
//     if (task) {
//       this.tasks = task;
//       this.maxId =
//         task?.reduce((id, el) => (id = Math.max(id, el.id ?? 0)), 0) ?? 0;
//       this.tasks.forEach((val, ind) => {
//         if (!val.id) {
//           val.id = this.maxId++;
//         }
//       });
//     } else {
//       this.tasks = new Array<ITask>();
//       this.maxId = 1;
//     }
//   }
// }

export class CalendarLocalStorage implements ITaskCRUD {
  tasks: Array<ITask>;
  maxId: number;
  getCalendKey(): string {
    return "CalendKey";
  }
  async create(
    desc: string,
    startDate: Date,
    dueDate: Date,
    tag?: string,
  ): Promise<void> {
    const task = Object.assign({}, emptyTask);
    task.desc = desc;
    task.crDate = startDate.toJSON();
    task.dueDate = dueDate.toJSON();

    if (tag) task.tag = tag;

    try {
      const items: Array<ITask> = await this.read();
      task.id = ++this.maxId;
      items.push(task);

      await this.write(items);
    } catch (error) {
      console.log("Error saving data ", error);
    }
  }
  async write(items: Array<ITask>): Promise<void> {
    const key = this.getCalendKey();
    try {
      //console.log("json stringify", JSON.stringify(items));
      if (localStorage) localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
      console.log("Error writing data ", error);
    }
  }
  async read(): Promise<ITask[]> {
    const key = this.getCalendKey();
    try {
      if (localStorage) {
        this.tasks = JSON.parse(
          localStorage.getItem(key) ?? JSON.stringify(new Array<ITask>()),
        );

        //console.log("unstr ", this.tasks);
        this.maxId =
          this.tasks?.reduce((id, el) => (id = Math.max(id, el.id ?? 0)), 0) ??
          0;
      }
    } catch (error) {
      console.log("Error reading data ", error);
    }
    return this.tasks;
  }
  async update(newTask: ITask): Promise<void> {
    this.tasks = await this.read();
    this.tasks.forEach((el) => {
      if (el.id == newTask.id) {
        el.crDate = newTask.crDate;
        el.desc = newTask.desc;
        el.status = newTask.status;
        el.tag = newTask.tag;
        el.dueDate = newTask.dueDate;
      }
    });
    await this.write(this.tasks);
  }
  async delete(task: ITask): Promise<void> {
    this.tasks = await this.read();
    this.tasks = this.tasks.filter((el) => el.id != task.id);
    await this.write(this.tasks);
  }
  constructor() {
    this.tasks = [];
    this.maxId = 0;
  }
}
