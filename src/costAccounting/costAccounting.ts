
export  interface IConsumption{
    cat:string;
    subcat:string;
    date:Date;
    quantity:number;
    comment:string;
}
export type tCategorizedSum = [string, number];
export  interface IConsumptionStatistic{
    categorizedExpenditure(cat?:string, startDate?:Date, endDate?:Date):number;
    uncatExpenditure(startDate?:Date, endDate?:Date):number;
    filteredSum(filter:(el:IConsumption)=>boolean):number;
    sortedCatSum(startDate?:Date, endDate?:Date):tCategorizedSum[];
}
export interface IConsuptionFunc{
    getCategories(): Set<string>;
    //setItem(cat:string, subcat:string,sum:number, comment:string):void;
    //removeItem(cat:string, subcat:string,sum:number,date:Date):void;
}
export class CostAccounting implements IConsumptionStatistic, IConsuptionFunc{
    accounting:Array<IConsumption>;
    getCategories(): Set<string> {
        return this.accounting.reduce((acc, el)=> acc.add(el.cat), new Set<string>());
    }
    categorizedExpenditure(cat?:string, startDate?:Date, endDate?:Date){
        //let sum =0;
        // let d = this.accounting.filter((el)=>{ let ret:boolean = true;
        //     if(cat){ret = ret && ( el.cat === cat);            }
        //     if(startDate){ret = ret && (el.date >= startDate); }
        //     if(endDate){ ret = ret && (el.date <= endDate);    }
        //     return ret;
        // });
        // sum = d.reduce((prev, curr)=>prev + curr.quantity, 0);
        return this.accounting.filter((el)=>{ let ret:boolean = true;
            if(cat){ret = ret && ( el.cat === cat);            }
            if(startDate){ret = ret && (el.date >= startDate); }
            if(endDate){ ret = ret && (el.date <= endDate);    }
            return ret;
        }).reduce((prev, curr)=>prev + curr.quantity, 0);
       //console.log(sum, d);
       //return sum;
    }
    uncatExpenditure(startDate?:Date, endDate?:Date){
        return this.categorizedExpenditure(undefined, startDate, endDate);
    }
    filteredSum(cbfilter:(el:IConsumption)=>boolean):number{
        return this.accounting.filter(cbfilter).reduce((prev, curr)=>prev + curr.quantity, 0);
    }
    sortedCatSum(startDate?:Date, endDate?:Date):tCategorizedSum[]{
        const ret:tCategorizedSum[] = Array<tCategorizedSum>();
        this.getCategories().forEach((el,el2)=>ret.push([el, 0]));
        let e = ret.forEach((el)=>el[1] = this.categorizedExpenditure(el[0]));
        console.log(e);
        console.log(ret);
        let j = ret.sort((a,b)=>b[1] - a[1] );
        console.log(j);
        return j;
    }
    constructor(ccounting:Array<IConsumption>){
        this.accounting = ccounting;
    }
}