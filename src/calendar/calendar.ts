import { ITaskCRUD, ITask, ITaskFilter, EStatus } from "./icalendar";
export class Calendar implements ITaskFilter {
  tasks: Array<ITask>;
  CRUD: ITaskCRUD;
  async getByFilter(filter: (el: ITask) => boolean): Promise<Array<ITask>> {
    this.tasks = await this.CRUD.read();
    return this.tasks.filter(filter);
  }
  async getDesk(desk: string): Promise<Array<ITask>> {
    return await this.getByFilter((el) => el.desc === desk);
  }

  async getDone(): Promise<Array<ITask>> {
    return await this.getByFilter((el) => el.status === EStatus.Done);
  }
  async getStarted(date: Date): Promise<Array<ITask>> {
    return await this.getByFilter((el) => {
      if (!el.crDate) return true;
      const d = new Date(el.crDate);

      return d.valueOf() < date.valueOf();
    });
  }
  async getUnfinished(date: Date): Promise<Array<ITask>> {
    return await this.getByFilter((el) => {
      if (!el.dueDate) return true;
      return new Date(el.dueDate) >= date;
    });
  }
  async getUndone(): Promise<Array<ITask>> {
    return await this.getByFilter((el) => el.status === EStatus.Undone);
  }
  async getByTag(tag: string): Promise<Array<ITask>> {
    return await this.getByFilter((el) => el.tag.indexOf(tag) > -1);
  }

  constructor(crud: ITaskCRUD) {
    this.CRUD = crud;
    this.tasks = new Array<ITask>();
  }
}
