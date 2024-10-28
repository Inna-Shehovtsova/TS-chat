export interface IMessage {
  id: number;
  message: string;
  name: string;
  crDate: string;
}
export const emptyMessage: IMessage = {
  message: "",
  crDate: JSON.stringify(Date()),
  name: "",
  id: 0,
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
