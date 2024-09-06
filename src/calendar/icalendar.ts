export enum EStatus {
  Done,
  Undone,
  Suspended,
  Refused,
  InProcess,
}
export interface ITask {
  id: number;
  desc: string;
  dueDate: string;
  crDate: string;
  status: EStatus;
  tag: string;
}
export const emptyTask: ITask = {
  desc: "",
  crDate: JSON.stringify(Date()),
  dueDate: JSON.stringify(Date()),
  status: EStatus.Undone,
  tag: "",
  id: 0,
};

export interface ITaskCRUD {
  //create(task:ITask):void;
  create(
    desc: string,
    startDate: Date,
    dueDate: Date,
    tag?: string,
  ): Promise<void>;
  read(): Promise<ITask[]>;
  update(newTask: ITask): Promise<void>;
  delete(task: ITask): Promise<void>;
}
//-фильтрация задач (по тексту, дате, статусу, тегам)
export interface ITaskFilter {
  getDesk(desk: string): Promise<Array<ITask>>;
  getDone(): Promise<Array<ITask>>;
  getStarted(date: Date): Promise<Array<ITask>>;
  getUnfinished(desk: Date): Promise<Array<ITask>>;
  getUndone(): Promise<Array<ITask>>;
  getByTag(tag: string): Promise<Array<ITask>>;
  getByFilter(filter: (el: ITask) => boolean): Promise<Array<ITask>>;
}
