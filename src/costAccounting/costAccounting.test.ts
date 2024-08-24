import {IConsumption, CostAccounting , IConsumptionStatistic, IConsuptionFunc} from "./costAccounting";


describe("Cost Accounting tests", () => {
    let c :IConsumption[] = [{
        cat:"Household expences",
    subcat:"Home",
    date:new Date(2024, 2, 1),
    quantity:200,
    comment:"milk and bread"
    },
    {
        cat:"Household expences",
    subcat:"Home",
    date:new Date(2024, 2, 2),
    quantity:220,
    comment:"milk and bread"
    },
    {
        cat:"Household expences",
    subcat:"Home",
    date:new Date(2024, 2, 4),
    quantity:225,
    comment:"milk and bread"
    }
    ,
    {
        cat:"Clothes",
    subcat:"Home wear",
    date:new Date(2024, 2, 4),
    quantity:2000,
    comment:"tshorts"
    }]
    const pusto = Array<IConsumption>();
    beforeEach(() => {
      
    });
    describe("public interface", () => {
        
    
        it("is a class", () => {
        expect(CostAccounting ).toBeInstanceOf(Function);
        expect(new CostAccounting (pusto)).toBeInstanceOf(CostAccounting );
      });
  
      it("create array of accounting", () => {       
        let cc = new CostAccounting ( pusto );
        expect(cc.accounting).not.toBeNull();
        expect(cc.accounting.length).toBe(0);
      });
      it("Check collecting categories", ()=>{
        let cc = new CostAccounting ( pusto );
        expect(cc.getCategories).toBeInstanceOf(Function);
        expect(cc.getCategories().size).toBe(0);

      });
      it("categorized sum check", () => {       
        let cc = new CostAccounting ( c  );
        expect(cc.accounting).not.toBeNull();
        expect(cc.accounting.length).toBe(4);
        expect(cc.categorizedExpenditure ).toBeInstanceOf(Function);
        const hExp = cc.categorizedExpenditure("Household expences");
        expect(hExp).toBe(645);
        const hExpS = cc.categorizedExpenditure("Household expences", 
            new Date(2024, 2, 2));
        expect(hExpS).toBe(445);
        const hExpSE = cc.categorizedExpenditure("Household expences", 
            new Date(2024, 2, 2), new Date(2024, 2, 3));
        expect(hExpSE).toBe(220);
        const cE = cc.categorizedExpenditure("Clothes");
        expect(cE).toBe(2000);
        let chE = cc.categorizedExpenditure("Children");
        expect(chE).toBe(0);
         chE = cc.categorizedExpenditure("Education");
        expect(chE).toBe(0);
      });
      it("uncategorized sum check", () => {       
        let cc = new CostAccounting ( c  );
        expect(cc.accounting).not.toBeNull();
        expect(cc.accounting.length).toBe(4);
        expect(cc.categorizedExpenditure ).toBeInstanceOf(Function);
        const hExp = cc.uncatExpenditure();
        expect(hExp).toBe(2645);
        const hExpS = cc.uncatExpenditure(new Date(2024, 2, 2));
        expect(hExpS).toBe(2445);
        const hExpSE = cc.uncatExpenditure(new Date(2024, 2, 2), new Date(2024, 2, 3));
        expect(hExpSE).toBe(220);
        const cE = cc.uncatExpenditure(new Date(2024, 4, 2));
        expect(cE).toBe(0);
        let chE = cc.uncatExpenditure(new Date(2024, 4, 2), new Date(2024, 8, 2));
        expect(chE).toBe(0);
        chE = cc.uncatExpenditure(new Date(2024, 1, 2), new Date(2024, 8, 2));
        expect(chE).toBe(2645);
      });
      it("filter sum check", () => {       
        let cc = new CostAccounting ( c  );
        expect(cc.accounting).not.toBeNull();
        expect(cc.accounting.length).toBe(4);
        expect(cc.filteredSum ).toBeInstanceOf(Function);
        const hExp = cc.filteredSum((el)=>el.quantity <=220);
        expect(hExp).toBe(420);
        
      });
      it("sorted sum check", () => {       
        let cc = new CostAccounting ( c  );
        expect(cc.accounting).not.toBeNull();
        expect(cc.accounting.length).toBe(4);
        expect(cc.sortedCatSum ).toBeInstanceOf(Function);
        const hExp = cc.sortedCatSum();        
        expect(hExp.length).toBe(2);
        const first = ["Clothes",2000];
        expect(hExp[0]).toStrictEqual(first);
        const someOfLast = ["Household expences", 645];           
        expect(hExp[1][1]).toBe(someOfLast[1]);
        expect(hExp[1][0]).toStrictEqual(someOfLast[0]);
      });
    });
});