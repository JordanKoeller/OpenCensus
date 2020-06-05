import React, { useState } from 'react';
import Module from '../module-skeleton';
import VideoMapComponent, { MarkerData } from './Map';

import { CITIES } from './cities';
import { VideoCard, VideoCardProps } from './VideoCard';
import { CardGrid } from './CardGrid';


const PoliceProtestModule: React.FC = () => {
  // const vidData = [{
  //   lat: 39.9526, lng: -75.1652,
  //   url: 'https://video.twimg.com/ext_tw_video/1267858469555777536/pu/vid/826x664/ABVtGE5lXsIfTJcq.mp4?tag=10'
  // }];
  // let vids: MarkerData[] = []
  // Object.keys(CITIES).slice(0, 100).forEach(k => {
  //   vids = [...vids, { ...CITIES[k], url: vidData[0].url }]
  // });
  // const link = 'https://twitter-vids.s3.amazonaws.com/1268732695955345408.mp4';
  // const lst = [
  //   {timestamp:"999", tweetBody:"Look at this graph", tweetLink:"https://google.com", vidLink:link},
  //   {timestamp:"999", tweetBody:"Look at this graph", tweetLink:"https://google.com", vidLink:link},
  //   {timestamp:"999", tweetBody:"Look at this graph", tweetLink:"https://google.com", vidLink:link},
  //   {timestamp:"999", tweetBody:"Look at this graph", tweetLink:"https://google.com", vidLink:link},
  //   {timestamp:"999", tweetBody:"Look at this graph", tweetLink:"https://google.com", vidLink:link},
  //   {timestamp:"999", tweetBody:"Look at this graph", tweetLink:"https://google.com", vidLink:link},
  //   {timestamp:"999", tweetBody:"Look at this graph", tweetLink:"https://google.com", vidLink:link},
  // ];
  const downloadUrl = 'https://x9lh5641m0.execute-api.us-east-1.amazonaws.com/Prod/videos';
  const s3LinkPrefix = 'https://twitter-vids.s3.amazonaws.com/';
  const [state, setState] = useState<VideoCardProps[]>([]);
  if (state.length) {
    console.log(state)
    return <Module title="Police Responses to Protests"
      AppComponent={<CardGrid cardProps={state} />}
      MethodsComponent={<div />}
      BackgroundInfoComponent={<div />}
      ExploreDataComponent={<div />}
      references={[]} />
  } else {
    fetch(downloadUrl, { method: 'GET' }).then(resp => resp.json()).then(js => {
      return js.map((e: any) => {
        const ret: VideoCardProps = {
          vidLink: `${s3LinkPrefix}${e.TweetID}.mp4`,
          tweetLink: e.TweetLink,
          tweetBody: e.TweetBody,
          timestamp: e.Timestamp
        }
        return ret
      })
    }).then((e: VideoCardProps[]) => setState(e));
    return <h2> Loading...</h2>
  }

};

export default PoliceProtestModule;