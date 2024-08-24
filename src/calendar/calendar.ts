export enum EStatus {
  Done,
  Undone,
  Suspended,
  Refused,
  InProcess,
}
export interface ITask {
  id?: number | undefined;
  desc: string;
  dueDate: Date | undefined;
  crDate: Date | undefined;
  status: EStatus;
  tag: string;
}
const emptyTask: ITask = {
  desc: "",
  crDate: undefined,
  dueDate: undefined,
  status: EStatus.Undone,
  tag: "",
  id: 0,
};

export interface ITaskCRUD {
  //create(task:ITask):void;
  create(desc: string, startDate: Date, dueDate: Date, tag?: string): void;
  read(): Array<ITask>;
  update(newTask: ITask): void;
  delete(task: ITask): void;
}

export interface ITaskFilter {
  filtDesk(desk: string): Array<ITask>;
}

export class Calendar implements ITaskCRUD {
  tasks: Array<ITask>;
  maxId: number;

  // create(task:ITask){
  //     task.id = this.maxId++;
  //     this.tasks.push(task);
  // }
  create(desc: string, startDate: Date, dueDate: Date, tag?: string) {
    const task = Object.assign({}, emptyTask);
    task.desc = desc;
    task.crDate = startDate;
    task.dueDate = dueDate;
    task.id = this.maxId++;

    if (tag) task.tag = tag;

    this.tasks.push(task);
  }
  read(): Array<ITask> {
    return this.tasks;
  }
  update(newTask: ITask): void {}
  delete(task: ITask): void {
    this.tasks = this.tasks.filter((el) => el.id != task.id);
  }

  constructor(task?: Array<ITask>) {
    if (task) {
      this.tasks = task;
      this.maxId =
        task?.reduce((id, el) => (id = Math.max(id, el.id ?? 0)), 0) ?? 0;
      this.tasks.forEach((val, ind) => {
        if (!val.id) {
          val.id = this.maxId++;
        }
      });
    } else {
      this.tasks = new Array<ITask>();
      this.maxId = 1;
    }
  }
}

export class CalendarLocalStorage implements ITaskCRUD {
  tasks: Array<ITask>;
  maxId: number;
  getCalendKey(): string {
    return "CalendKey";
  }
  create(desc: string, startDate: Date, dueDate: Date, tag?: string) {
    const task = Object.assign({}, emptyTask);
    task.desc = desc;
    task.crDate = startDate;
    task.dueDate = dueDate;
    task.id = this.maxId++;

    if (tag) task.tag = tag;

    try {
      const items: Array<ITask> = this.read();
      items.push(task);
      this.write(items);
    } catch (error) {
      console.log("Error saving data ", error);
    }
  }
  write(items: Array<ITask>): void {
    const key = this.getCalendKey();
    try {
      if (localStorage) localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
      console.log("Error writing data ", error);
    }
  }
  read(): Array<ITask> {
    const key = this.getCalendKey();
    try {
      if (localStorage)
        this.tasks = JSON.parse(
          localStorage.getItem(key) ?? JSON.stringify(new Array<ITask>()),
        );
    } catch (error) {
      console.log("Error reading data ", error);
    }
    return this.tasks;
  }
  update(newTask: ITask): void {
    this.tasks = this.read();
    this.tasks.forEach((el) => {
      if (el.id == newTask.id) {
        el.crDate = newTask.crDate;
        el.desc = newTask.desc;
        el.status = newTask.status;
        el.tag = newTask.tag;
        el.dueDate = newTask.dueDate;
      }
    });
    this.write(this.tasks);
  }
  delete(task: ITask): void {
    this.tasks = this.read();
    this.tasks = this.tasks.filter((el) => el.id != task.id);
    this.write(this.tasks);
  }
  constructor() {
    this.tasks = this.read();
    this.maxId =
      this.tasks?.reduce((id, el) => (id = Math.max(id, el.id ?? 1)), 1) ?? 0;
  }
}
