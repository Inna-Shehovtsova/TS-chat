export interface IMessage {
  name: string;
  message: string;
  now: number;
  date?: Date;
}
export const emptyMessage: IMessage = {
  message: "",
  now: Date.now(),
  name: "",
};

export interface IMessageCRUD {
  //create(task:ITask):void;
  writeOne(message: IMessage): Promise<void>;
  read(): Promise<IMessage[]>;
  update(newTask: IMessage): Promise<void>;
  delete(task: IMessage): Promise<void>;
}
//-фильтрация задач (по тексту, дате, статусу, тегам)
//получение списка пользователей
//поиск по чату
export interface IMessageFilter {
  getDesk(word: string): Promise<Array<IMessage>>;
  getByUser(user: string): Promise<Array<IMessage>>;
  getByFilter(filter: (el: IMessage) => boolean): Promise<Array<IMessage>>;
}
export interface IMessageFunctions extends IMessageCRUD, IMessageFilter {}
