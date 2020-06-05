import React from 'react';
import { Card, CardColumns } from 'react-bootstrap';
import { VideoCard, VideoCardProps } from './VideoCard';

type CardGridProps = {
    cardProps: VideoCardProps[]
}

export const CardGrid: React.FC<CardGridProps> = ({cardProps}) => {
    return <CardColumns>
        {
            cardProps.map(p => <VideoCard {...p} />)
        }
    </CardColumns>

}