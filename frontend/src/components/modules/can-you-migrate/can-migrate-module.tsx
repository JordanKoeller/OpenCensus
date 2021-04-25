import React from 'react';
import Module from '../module-skeleton';
import CanMigrateAppPage from './CanMigrateBody';
import OurAnalysis from './Methods';
import ImmInAmerica from './ImmInAmerca';
import ExploreData from './ExploreData';



const CanMigrateModule: React.FC = () => {

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