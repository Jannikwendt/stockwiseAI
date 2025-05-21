declare module "openai";
declare module "yahoo-finance2" {
  export function quote(symbol: string): Promise<any>;
  const yf: { quote: (symbol: string) => Promise<any> };
  export default yf;
}
