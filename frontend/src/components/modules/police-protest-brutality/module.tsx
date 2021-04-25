import React, { useState } from 'react';
import Module from '../module-skeleton';
import VideoMapComponent, { MarkerData } from './Map';

import { VideoCard, VideoCardProps } from './VideoCard';
import Methods from './Methods';
import Background from './Background';
import { CardGrid } from './CardGrid';


const PoliceProtestModule: React.FC = () => {
  return <Module title="Police Responses to Protests"
    AppComponent={<CardGrid />}
    MethodsComponent={<Methods />}
    BackgroundInfoComponent={<Background />}
    ExploreDataComponent={<div />}
    references={references} />
};

  // }
  const references = [
    {
      title: "Derek Chauving guilty in death of George Floyd: Live updates",
      publisher: "CNN",
      year: "April 20 2021",
      link: "https://www.cnn.com/us/live-news/derek-chauvin-trial-04-20-21/index.html"
    },
    {
      title: "George Floyd died of low level of oxygen, medical expert testifies; Derek Chauvin kept knee on his neck 'majority of the time'",
      publisher: "Washington Post",
      link: "https://www.washingtonpost.com/nation/2021/04/08/derek-chauvin-trial-2/",
      year: "April 8 2021"
    },
    {
      title: "Charges against former Minneapolis police officers involved in George Floyd's death",
      publisher: "ABC News",
      link: "https://abcnews.go.com/US/charges-minneapolis-police-officers-involved-george-floyds-death/story?id=71045487",
      year: "June 3 2020"
    },
    {
      title: "Black Lives Matter May Be the Largest Movement in U.S. History",
      publisher:"The New York Times",
      link: "https://www.nytimes.com/interactive/2020/07/03/us/george-floyd-protests-crowd-size.html",
      year: "July 3 2020"
    },
    {
      title: "Facing Protests Over Use of Force, Police Respond With More Force",
      publisher: "The New York Times",
      link: "https://www.nytimes.com/2020/05/31/us/police-tactics-floyd-protests.html",
      year: "June 1 2020"
    },
  ];

export default PoliceProtestModule;