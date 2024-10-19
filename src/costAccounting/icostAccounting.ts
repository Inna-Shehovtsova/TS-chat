export interface IConsumption {
  cat: string;
  subcat: string;
  date: Date;
  quantity: number;
  comment: string;
}

export type tCategorizedSum = [string, number];
export type tFilterFunction = (el: IConsumption) => boolean;

export interface IConsumptionStatistic {
  categorizedExpenditure(
    cat?: string,
    startDate?: Date,
    endDate?: Date,
  ): number;
  uncatExpenditure(startDate?: Date, endDate?: Date): number;
  filteredSum(filter: tFilterFunction): number;
  sortedCatSum(startDate?: Date, endDate?: Date): tCategorizedSum[];
}

export interface IConsuptionFunc {
  getCategories(): Set<string>;
  setItem(cat: string, subcat: string, sum: number, comment: string): void;
  removeItem(cat: string, subcat: string, sum: number, date: Date): void;
}
