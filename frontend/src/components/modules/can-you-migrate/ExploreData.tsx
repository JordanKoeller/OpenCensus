import React, { useState } from 'react';
import { Tooltip, Legend, Line, CartesianGrid, ResponsiveContainer, RechartsFunction, BarChart, XAxis, YAxis, Bar } from 'recharts';
import SelectZoomLineChart from '../../SelectZoomLineChart';
import { Container, Row, Jumbotron, ButtonToolbar, Button } from 'react-bootstrap';
import rgb from '../../../utils';

export type MigrationHistoryPlotDataType = {
    accepted: number[],
    applications: number[],
    waitlist: number[],
    year: number,
    totalApps: number,
    totalAcc: number,
}

export type ImmigrationPlotProps = {
    plotData: MigrationHistoryPlotDataType[],
    columnHeaders: string[],
};

type CensusTableResponse = {
    headers: string[],
    years: number[],
    applications: number[][],
    accepted: number[][],
    waitlist: number[][]
};
type PlotCompatibleData = { year: number, data: { country: string, applied: number, accepted: number, waitlisted: number }[] }[];

type ImmigrationPlotState = {
    baseYear: number,
    focusYear: number,
    data: PlotCompatibleData,
    focusCountry: number[]
};

const COLOR_CIRCLE: [number, number, number][] = [
    [31, 119, 180],
    [255, 127, 14],
    [44, 160, 44],
    [214, 39, 40],
    [148, 103, 189],
    [140, 86, 75],
    [227, 119, 194]
];

const NUM_COLORS = COLOR_CIRCLE.length;


const Plots: React.FC<ImmigrationPlotProps> = ({ plotData, columnHeaders }: ImmigrationPlotProps) => {
    const [state, setState] = useState<ImmigrationPlotState | undefined>();
    if (state === undefined) {
        const cleanedData: PlotCompatibleData = plotData.map((v: MigrationHistoryPlotDataType) => {
            const rowData = columnHeaders.map((label: string, index: number) => {
                return { country: label, applied: v.applications[index], accepted: v.accepted[index], waitlisted: v.waitlist[index] };
            });
            return { year: v.year, data: rowData };
        });
        setState({
            baseYear: plotData[0].year,
            data: cleanedData,
            focusYear: 1900,
            focusCountry: [0]
        });
        return <div></div>
    }
    const onMouseMove: RechartsFunction = (event?: { activeLabel: number }) => {
        if (event && event.activeLabel) {
            setState({ ...state, focusYear: event.activeLabel });
        }
    };
    return <Container>
        <Row>
            <h4>
                The following data compares and contrasts what immigration did look like and what
                would have looked like under today's immigration laws.
            </h4>
            <br/>
            <p>
                To show the difference, we use the actual historical numbers of immigrating individuals
                as the number of applicants for immigration. The accepted numbers display how many
                people would be admitted under today's law. The waitlisted values display the difference
                between applications and acceptances, in accordance with the waitlist system introduced
                by today's law.
            </p>
            <br/>
        </Row>
        <Row>
            <h4>Select the countries you would like to see data for:</h4>
            <br/>
            <ButtonToolbar>
                {columnHeaders.map((name: string, id: number) => {
                    const onClick = (_e: any) => {
                        const focuses = state.focusCountry;
                        if (state.focusCountry.includes(id)) {
                            setState({ ...state, focusCountry: focuses.filter((e) => e !== id) });
                        } else {
                            focuses.push(id);
                            setState({ ...state, focusCountry: focuses });
                        }
                    }
                    return <Button
                        onClick={onClick}
                        variant="outline-info"
                        active={state.focusCountry.includes(id)}
                        key={name}
                    >{name}</Button>;
                })}
            </ButtonToolbar>
        </Row>
        <br/>
        <Row>
            <h1> Immigration Per Country Per Year</h1>
        </Row>
        <Row>
            <ResponsiveContainer aspect={1.5} height={600}>
                <SelectZoomLineChart
                    data={state.data}
                    margin={{ top: 20, right: 30, left: 10, bottom: 80 }}
                    xAxProps={{ dataKey: "year", type: "number", tickCount: 8 }}
                    onMouseMove={onMouseMove}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    {
                        state.focusCountry.map((id, ind) =>
                            <Line type="monotone"
                                dataKey={e => e.data[id].applications}
                                stroke={rgb(COLOR_CIRCLE[ind % NUM_COLORS])}
                                dot={false}
                                name={`${columnHeaders[id]} Applications`}
                                isAnimationActive={false} />)
                    }
                    {
                        state.focusCountry.map((id, ind) =>
                            <Line type="monotone"
                                dataKey={e => e.data[id].accepted}
                                stroke={rgb(COLOR_CIRCLE[ind % NUM_COLORS])}
                                dot={false}
                                name={`${columnHeaders[id]} Accepted`}
                                isAnimationActive={false} />)
                    }
                    {/* {
                        state.focusCountry.map((id, ind) =>
                            <Line type="monotone"
                                dataKey={e => e.data[id].waitlisted}
                                stroke={rgb(COLOR_CIRCLE[ind % NUM_COLORS])}
                                dot={false}
                                name={`${columnHeaders[id]} Waitlisted`}
                                isAnimationActive={false} />)
                    } */}
                </SelectZoomLineChart>
            </ResponsiveContainer>
        </Row>
        <Row>
            <h1> Immigration in {state.focusYear}</h1>
        </Row>
        <br/>
        <Row>
            <BarChart
                width={900}
                height={450}
                data={state.data[state.focusYear - state.baseYear].data.slice(0, state.data[state.focusYear - state.baseYear].data.length - 1)}
                margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="accepted" fill="#82ca9d" isAnimationActive={false} />
                <Bar dataKey="applied" fill="#8884d8" isAnimationActive={false} />
            </BarChart>
        </Row>
    </Container>
}

type ExploreDataState = {
    plotData?: MigrationHistoryPlotDataType[],
    headers?: string[]
};


const ExploreData: React.FC<{ defaultCountry?: number }> = ({ defaultCountry }) => {
    const [state, setState] = useState<ExploreDataState>({});
    defaultCountry = defaultCountry === undefined ? 10 : defaultCountry;
    if (!state.plotData || !state.headers) {
        const headersUrl = process.env.REACT_APP_CAN_MIGRATE_API + '/get-country-headers';
        const headersRequest = fetch(headersUrl, { headers: { 'Content-Type': 'text/plain', 'Origin': '*' }, method: 'GET' })
            .then((e: Response) => e.json()).then((e: any) => e.countries as string[]);
        const plotRequestUrl = process.env.REACT_APP_CAN_MIGRATE_API + '/migration-history';
        const dataFetch = fetch(plotRequestUrl, {
            headers: { 'Content-Type': 'text/plain', 'Origin': '*' },
            method: 'GET',
        }).then((e: Response) => e.json() as Promise<CensusTableResponse>)
            .then((table: CensusTableResponse) => {
                const summation = (accumulator: number, currentValue: number) => accumulator + currentValue;
                const data = Array(table.applications.length).fill(0).map((x, y) => x + y).map((row: number) => {
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
                return data;
            });
        Promise.all([headersRequest, dataFetch]).then(([headers, data]: [string[], MigrationHistoryPlotDataType[]]) => {
            setState({
                headers: headers,
                plotData: data
            })
        });
    }
    if (!state.plotData) {
        return <div />
    }
    return <Jumbotron style={{ height: "100%", width: "100%", alignContent: "middle" }}>
        <Plots
            plotData={state.plotData!}
            columnHeaders={state.headers!}
        />
    </Jumbotron>
};

export default ExploreData;