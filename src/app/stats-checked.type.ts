export type StatsChecked = {
  cases: boolean;
  cumulativeCases: boolean;
  deaths: boolean;
  cumulativeDeaths: boolean;
  recovered: boolean;
  cumulativeRecovered: boolean;
  [key: string]: boolean;
};
