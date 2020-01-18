import React, { useState } from 'react';
import { LineChart, LineChartProps, RechartsFunction, ReferenceArea, XAxisProps, YAxis, YAxisProps, XAxis } from 'recharts';

type Coord = { x: number, y: number };

type DomainType = [string | number, string | number];

type SelectZoomLineChartState = {
    pressCoord?: Coord,
    mousePosition?: Coord,
    xDomain: DomainType,
    yDomain: DomainType
}

type SelectZoomLineChartProps = LineChartProps & {
    xAxProps?: XAxisProps,
    yAxProps?: YAxisProps
}

const SelectZoomLineChart: React.FC<SelectZoomLineChartProps> = (props: SelectZoomLineChartProps) => {

    const [state, setState] = useState<SelectZoomLineChartState>({ xDomain: ['dataMin', 'dataMax'], yDomain: ['dataMin', 'dataMax'] });

    // const getY = (value: number) => {
    //     const distFromBottom = props.height! - value;
    // }

    const onPressed: RechartsFunction = (event: any) => {
        const [x, y]: [number, number] = [event.activeLabel, event.chart];
        setState({ ...state, pressCoord: { 'x': x, 'y': y } });
        if (props.onMouseDown) {
            props.onMouseDown(event);
        }
    };

    const onMouseMove: RechartsFunction = (event: any) => {
        const [x, y]: [number, number] = [event.activeLabel, event.chart];
        if (state.pressCoord) {
            setState({ ...state, mousePosition: { 'x': x, 'y': y } });
        }
        if (props.onMouseMove) {
            props.onMouseMove(event);
        }
    }

    const onMouseReleased: RechartsFunction = (event: any) => {
        if (state.mousePosition && state.pressCoord) {
            const xMin = state.mousePosition.x < state.pressCoord.x ? state.mousePosition.x : state.pressCoord.x;
            const xMax = state.mousePosition.x > state.pressCoord.x ? state.mousePosition.x : state.pressCoord.x;
            // const yMin = state.mousePosition.y < state.pressCoord.y ? state.mousePosition.y : state.pressCoord.y;
            // const yMax = state.mousePosition.y > state.pressCoord.y ? state.mousePosition.y : state.pressCoord.y;
            setState({ 'xDomain': [xMin, xMax], 'yDomain': ['dataMin', 'dataMax'] });
        }
        if (props.onMouseUp) {
            props.onMouseUp(event);
        }
    }

    const getSelector = () => {
        if (state.mousePosition && state.pressCoord) {
            const xMin = state.mousePosition.x < state.pressCoord.x ? state.mousePosition.x : state.pressCoord.x;
            const xMax = state.mousePosition.x > state.pressCoord.x ? state.mousePosition.x : state.pressCoord.x;
            const yMin = state.mousePosition.y < state.pressCoord.y ? state.mousePosition.y : state.pressCoord.y;
            const yMax = state.mousePosition.y > state.pressCoord.y ? state.mousePosition.y : state.pressCoord.y;
            return <ReferenceArea stroke="#fff" x1={xMin} x2={xMax} y1={yMin} y2={yMax} />
        }
    }

    // const domain = d3.scaleLinear();
    // const tickFormat = domain.tickFormat();
    // const ticks = domain.ticks();

    const ret = <LineChart
        {...props}
        onMouseDown={onPressed}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseReleased}
        >
        {props.children}
        <XAxis {...props.xAxProps} allowDataOverflow domain={state.xDomain} />
        <YAxis {...props.yAxProps}
            domain={state.yDomain}
            allowDataOverflow
        />
        {getSelector()}
    </LineChart>;


    return ret;

}

export default SelectZoomLineChart;