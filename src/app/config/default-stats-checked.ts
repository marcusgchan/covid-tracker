import { StatsChecked } from '../stats-checked.type';

const DEFAULT_STATS_CHECKED: StatsChecked = {
  cases: true,
  cumulativeCases: false,
  deaths: true,
  cumulativeDeaths: false,
  recovered: true,
  cumulativeRecovered: false,
};

export default DEFAULT_STATS_CHECKED;
