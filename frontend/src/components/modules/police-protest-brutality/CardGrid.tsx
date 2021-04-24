import React, { useState } from 'react';
import { Card, CardColumns } from 'react-bootstrap';
import { VideoCard, VideoCardProps } from './VideoCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { json } from 'd3';

type CardGridProps = {
    cardProps: VideoCardProps[]
}

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
    const [{ vidList, hasMore, lastFetchedElem }, setState] = useState<CardGridState>({vidList: [], hasMore: true, lastFetchedElem: undefined});
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
            if (js.lastEvaluatedKey != undefined) {
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

    return <InfiniteScroll
        dataLength={vidList.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading Videos...</h4>}
        endMessage={
            <div></div>
        }
    >
        {vidList.map((p, i) => (
            <VideoCard {...p} timestamp={`${i + 1}`} />
        ))}
    </InfiniteScroll>
    // return <CardColumns>
    //     {
    //         vidList.map(p => <VideoCard {...p} />)
    //     }
    // </CardColumns>


}