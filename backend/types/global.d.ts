// backend/types/global.d.ts
declare module "yahoo-finance2" {
  export function quote(symbol: string): Promise<any>;
  export function quoteSummary(
    symbol: string,
    opts: { 
      modules: (
        | "price"
        | "summaryDetail"
        | "defaultKeyStatistics"
        | "financialData"
        | "recommendationTrend"
      )[];
      formatted?: boolean;
    }
  ): Promise<any>;

  const yf: {
    quote: (symbol: string) => Promise<any>;
    quoteSummary: (
      symbol: string,
      opts: { 
        modules: (
          | "price"
          | "summaryDetail"
          | "defaultKeyStatistics"
          | "financialData"
          | "recommendationTrend"
        )[];
        formatted?: boolean;
      }
    ) => Promise<any>;
  };
  export default yf;
}
