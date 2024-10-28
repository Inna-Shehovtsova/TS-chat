import { IMessage, IMessageFunctions } from "./iMessage";

export class MockStorage implements IMessageFunctions {
  data: Array<IMessage>;
  tablename: string;
  constructor() {
    this.data = new Array<IMessage>();
    this.tablename = "messages";
  }
  async read(): Promise<IMessage[]> {
    const promise1 = new Promise<IMessage[]>((resolve, reject) => {
      resolve(this.data);
    });
    return promise1;
  }

  async writeOne(el: IMessage): Promise<void> {
    this.data.push(el);

    const promise1 = new Promise<void>((resolve, reject) => {});
    return promise1;
  }

  async write(arr: IMessage[]): Promise<void> {
    for (let i = 0; i < arr.length; i++) {
      await this.writeOne(arr[i]);
    }
  }

  async update(newTask: IMessage): Promise<void> {
    const promise1 = new Promise<void>((resolve, reject) => {});
  }
  async delete(task: IMessage): Promise<void> {
    //this.data.push(el);

    const promise1 = new Promise<void>((resolve, reject) => {});
  }

  async getDesk(word: string): Promise<Array<IMessage>> {
    const promise1 = new Promise<IMessage[]>((resolve, reject) => {
      resolve(this.data.filter((el) => el.message.includes(word)));
    });
    return promise1;
  }
  async getByUser(user: string): Promise<Array<IMessage>> {
    const promise1 = new Promise<IMessage[]>((resolve, reject) => {
      resolve(this.data.filter((val) => val.name === user));
    });
    return promise1;
  }
  async getByFilter(
    filter: (el: IMessage) => boolean,
  ): Promise<Array<IMessage>> {
    const promise1 = new Promise<IMessage[]>((resolve, reject) => {
      resolve(this.data.filter(filter));
    });
    return promise1;
  }
}
