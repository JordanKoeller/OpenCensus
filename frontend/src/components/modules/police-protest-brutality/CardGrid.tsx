import React, { useState } from 'react';
import { VideoCard, VideoCardProps } from './VideoCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  useRouteMatch,
} from 'react-router-dom';


type CardGridState = {
  vidList: VideoCardProps[],
  lastFetchedElem: string | undefined,
  hasMore: boolean
};


export const CardGrid = () => {
  console.log("REFRESH")
  // const [vidList, setState] = useState<VideoCardProps[]>([]);
  // const [hasMore, setHasMore] = useState(true);
  // const [lastFetchedElem, setLastFetchedElem] = useState<number | undefined>();
  const [{ vidList, hasMore, lastFetchedElem }, setState] = useState<CardGridState>({ vidList: [], hasMore: true, lastFetchedElem: undefined });
  const fetchMoreData = () => {
    let downloadUrl = `https://x9lh5641m0.execute-api.us-east-1.amazonaws.com/Prod/videos`;
    if (lastFetchedElem) {
      downloadUrl += `?pageId=${lastFetchedElem}`;
    }
    const s3LinkPrefix = 'https://twitter-vids.s3.amazonaws.com/';
    fetch(downloadUrl, { method: 'GET' }).then(resp => resp.json()).then(js => {
      const newVidList = js.items.map((e: any, i: number) => {
        const ret: VideoCardProps = {
          vidLink: `${s3LinkPrefix}${e.TweetID}.mp4`,
          tweetLink: `https://${e.TweetLink}`,
          tweetBody: e.TweetBody,
          timestamp: `${i + 1}`
        }
        return ret
      });
      if (js.lastEvaluatedKey !== undefined) {
        setState({
          vidList: [...vidList, ...newVidList],
          lastFetchedElem: js.lastEvaluatedKey.id.S,
          hasMore: true
        });
      } else {
        setState({
          vidList: [...vidList, ...newVidList],
          lastFetchedElem: undefined,
          hasMore: false
        });
      }

    });
  };
  if (vidList.length === 0) {
    fetchMoreData();
  }
  const { url } = useRouteMatch();

  return <React.Fragment>
    <p>
      The murder of George Floyd on May 25, 2020 sparked a massive wave of protests against racism
      and police brutality across the United States and the world. Very quickly, it became clear that the police
      were utilizing extremely violent and aggressive tactics to crack down on protestors.
        <br />
      <br />
        In response to the protests and police departments' responses, a Twitter bot
        <a href="https://twitter.com/ArchiveThisBLM" target="_blank" rel="noopener noreferrer">
        @ArchiveThisBLM
      </a> was set up to capture videos of police performing acts of brutality against protesters.
      <br /> <br />
        To find out more about how this app works, see the <a href={`${url}/Methods`}>Methods</a> section.
    </p>
    <InfiniteScroll
      dataLength={vidList.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<h4>Loading Videos...</h4>}
      endMessage={
        <h4>Total Count: {vidList.length} videos</h4>
      }
    >
      {vidList.map((p, i) => (
        <VideoCard {...p} timestamp={`${i + 1}`} />
      ))}
    </InfiniteScroll>
  </React.Fragment>


}