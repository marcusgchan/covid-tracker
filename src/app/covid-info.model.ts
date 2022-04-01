export default interface CovidInfo {
  active_cases: number;
  cases: number;
  cumulative_cases: number;
  deaths: number;
  cumulative_deaths: number;
  recovered: number;
  cumulative_recovered: number;
  date: string;
  province: string;
}
