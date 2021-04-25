
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import VideoPlayer from './VideoPlayer';

export type VideoCardProps = {
    vidLink: string,
    tweetLink: string,
    tweetBody: string,
    timestamp: string
};

const cleanTime: (timeString: string) => string = (timeString) => {
    return "";
}

export const VideoCard: React.FC<VideoCardProps> = ({ timestamp, tweetBody, tweetLink, vidLink }) => {

    const videoOptions = {
            autoplay: false,
            controls: true,
            muted: true,
            sources: [{ src: vidLink, type: 'video/mp4' }]
    };
    console.log(timestamp, tweetBody, vidLink);

    return <Card style={{ width: 800 }}>
        <VideoPlayer {...videoOptions} />
        <Card.Body>
            <Card.Title>{cleanTime(timestamp)}</Card.Title>
            <Card.Text>
                {tweetBody}
            </Card.Text>
            <Button variant="primary" onClick={() => window.open(tweetLink)}>See Tweet</Button>
        </Card.Body>
    </Card>;
}
