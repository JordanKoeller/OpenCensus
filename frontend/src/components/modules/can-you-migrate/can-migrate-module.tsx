import React, { useState, useContext, useRef, useReducer } from 'react';
import Module from '../module-skeleton';
import CanMigrateAppPage, { AppProps } from './CanMigrateBody';
import OurAnalysis from './Methods';
import ImmInAmerica from './ImmInAmerca';
import ExploreData, { ExploreDataProps, MigrationHistoryPlotDataType } from './ExploreData';
import { CAN_MIGRATE_API } from '../../../utils';



async function explorePropsFetcher(): Promise<ExploreDataProps> {
  console.log("Explore fetcher starting");
  const headersUrl = CAN_MIGRATE_API + '/get-country-headers';
  const headersRequest = await fetch(headersUrl, { headers: { 'Content-Type': 'text/plain', 'Origin': '*' }, method: 'GET' });
  const plotRequestUrl = CAN_MIGRATE_API + '/migration-history';
  const dataFetch = await fetch(plotRequestUrl, {
    headers: { 'Content-Type': 'text/plain', 'Origin': '*' },
    method: 'GET',
  })
  const table = await dataFetch.json()
  const summation = (accumulator: number, currentValue: number) => accumulator + currentValue;
  const tableData = Array(table.applications.length).fill(0).map((x, y) => x + y).map((row: number) => {
    const ret: MigrationHistoryPlotDataType = {
      accepted: table.accepted[row],
      applications: table.applications[row],
      waitlist: table.waitlist[row],
      year: table.years[row],
      totalApps: table.applications[row].reduce(summation),
      totalAcc: table.accepted[row].reduce(summation)
    };
    return ret;
  });
  const headersData = await headersRequest.json() as {countries: string[]}
  console.log("explore fetcher returning");
  return { headers: headersData.countries, plotData: tableData }
};

const CanMigrateModule: React.FC = () => {
  // const state = useRef<{ appData?: AppProps, exploreData?: ExploreDataProps }>({});
  // const [_ignored, forceUpdate] = useReducer(x => x + 1, 0);
  // if (!Object.keys(state.current).includes('appData')) {
  //   appPropsFetcher().then(appData => {
  //     state.current.appData = appData;
  //     forceUpdate(1);
  //   });
  // } else if (!Object.keys(state.current).includes('exploreData')) {
  //   explorePropsFetcher().then(exploreData => {
  //     state.current.exploreData = exploreData;
  //     forceUpdate(1);
  //   });
  // }
const references = [
  {
    title: "Bicentennial Edition: Historical Statistics of the United States, Colonial Times to 1970",
    chapter: "Chapter C: Migration",
    publisher: "United States Census Bureau",
    year: "1975",
    link: "https://www.census.gov/library/publications/1975/compendia/hist_stats_colonial-1970.html"
  },
  {
    title: "Fact Sheet: How the United States Immigration System Works",
    publisher: "American Immigration Council",
    link: "https://www.americanimmigrationcouncil.org/research/how-united-states-immigration-system-works",
    year: "Oct. 2019"
  }
];

return <Module title="Can You Migrate to America?"
  AppComponent={<CanMigrateAppPage />}
  MethodsComponent={<OurAnalysis />}
  BackgroundInfoComponent={<ImmInAmerica />}
  ExploreDataComponent={<ExploreData />}
  references={references} />
}

export default CanMigrateModule;