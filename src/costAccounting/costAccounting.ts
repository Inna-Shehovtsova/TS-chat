import {
  IConsumption,
  IConsumptionStatistic,
  IConsuptionFunc,
  tCategorizedSum,
  tFilterFunction,
} from "./icostAccounting";
export class CostAccounting implements IConsumptionStatistic, IConsuptionFunc {
  accounting: Array<IConsumption>;
  constructor(ccounting: Array<IConsumption>) {
    this.accounting = ccounting;
  }
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
    const filter: tFilterFunction = (el: IConsumption) => {
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
    };
    return this.filteredSum(filter);
  }

  uncatExpenditure(startDate?: Date, endDate?: Date) {
    return this.categorizedExpenditure(undefined, startDate, endDate);
  }

  filteredSum(cbfilter: tFilterFunction): number {
    return this.accounting
      .filter(cbfilter)
      .reduce(
        (prev, curr) => (cbfilter(curr) ? prev + curr.quantity : prev),
        0,
      );
  }

  sortedCatSum(startDate?: Date, endDate?: Date): tCategorizedSum[] {
    const ret: tCategorizedSum[] = Array<tCategorizedSum>();
    this.getCategories().forEach((el, el2) => ret.push([el, 0]));
    const e = ret.forEach(
      (el) => (el[1] = this.categorizedExpenditure(el[0], startDate, endDate)),
    );
    return ret.sort((a, b) => b[1] - a[1]);
  }
}
