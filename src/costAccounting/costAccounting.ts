export interface IConsumption {
  cat: string;
  subcat: string;
  date: Date;
  quantity: number;
  comment: string;
}

export type tCategorizedSum = [string, number];

export interface IConsumptionStatistic {
  categorizedExpenditure(
    cat?: string,
    startDate?: Date,
    endDate?: Date,
  ): number;
  uncatExpenditure(startDate?: Date, endDate?: Date): number;
  filteredSum(filter: (el: IConsumption) => boolean): number;
  sortedCatSum(startDate?: Date, endDate?: Date): tCategorizedSum[];
}

export interface IConsuptionFunc {
  getCategories(): Set<string>;
  setItem(cat: string, subcat: string, sum: number, comment: string): void;
  removeItem(cat: string, subcat: string, sum: number, date: Date): void;
}

export class CostAccounting implements IConsumptionStatistic, IConsuptionFunc {
  accounting: Array<IConsumption>;

  getCategories(): Set<string> {
    return this.accounting.reduce(
      (acc, el) => acc.add(el.cat),
      new Set<string>(),
    );
  }

  setItem(cat: string, subcat: string, sum: number, comment: string): void {
    this.accounting.push({
      cat: cat,
      subcat: subcat,
      quantity: sum,
      comment: comment,
      date: new Date(),
    });
  }

  isEqualDay(day1: Date, day2: Date): boolean {
    const ret =
      day1.getFullYear() == day2.getFullYear() &&
      day1.getMonth() == day2.getMonth() &&
      day1.getDate() == day2.getDate();
    return ret;
  }

  removeItem(cat: string, subcat: string, sum: number, date: Date): void {
    this.accounting = this.accounting.filter(
      (el) =>
        el.cat !== cat ||
        el.subcat !== subcat ||
        el.quantity != sum ||
        !this.isEqualDay(el.date, date),
    );
  }

  categorizedExpenditure(cat?: string, startDate?: Date, endDate?: Date) {
    return this.accounting
      .filter((el) => {
        let ret: boolean = true;
        if (cat) {
          ret = ret && el.cat === cat;
        }
        if (startDate) {
          ret = ret && el.date >= startDate;
        }
        if (endDate) {
          ret = ret && el.date <= endDate;
        }
        return ret;
      })
      .reduce((prev, curr) => prev + curr.quantity, 0);
  }

  uncatExpenditure(startDate?: Date, endDate?: Date) {
    return this.categorizedExpenditure(undefined, startDate, endDate);
  }

  filteredSum(cbfilter: (el: IConsumption) => boolean): number {
    return this.accounting
      .filter(cbfilter)
      .reduce((prev, curr) => prev + curr.quantity, 0);
  }

  sortedCatSum(startDate?: Date, endDate?: Date): tCategorizedSum[] {
    const ret: tCategorizedSum[] = Array<tCategorizedSum>();
    this.getCategories().forEach((el, el2) => ret.push([el, 0]));
    const e = ret.forEach(
      (el) => (el[1] = this.categorizedExpenditure(el[0], startDate, endDate)),
    );
    return ret.sort((a, b) => b[1] - a[1]);
  }

  constructor(ccounting: Array<IConsumption>) {
    this.accounting = ccounting;
  }
}
