import React, { useState, PureComponent } from 'react';
import { Tooltip, Legend, Line, CartesianGrid, ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Dot } from 'recharts';
import SelectZoomLineChart from '../../SelectZoomLineChart';
import { Container, Col, Row, ButtonToolbar, Button } from 'react-bootstrap';
import rgb, { CAN_MIGRATE_API } from '../../../utils';
import { ButtonProps } from 'react-bootstrap';

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
  focusCountries: number[]
};


type Variant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'dark'
  | 'light'
  | 'link'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-success'
  | 'outline-danger'
  | 'outline-warning'
  | 'outline-info'
  | 'outline-dark'
  | 'outline-light';


const VARIANT_CIRCLE: string[] = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'dark'
];

const COLOR_CIRCLE: [number, number, number][] = [
  [0, 123, 255],
  [108, 117, 125],
  [40, 167, 69],
  [255, 193, 7],
  [220, 53, 69],
  [23, 162, 184],
  [52, 58, 64],
];


const NUM_COLORS = COLOR_CIRCLE.length;

class CustomizedAxisTick extends PureComponent<any> {
  render() {
    const {
      x, y, stroke, payload,
    } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-90)">{payload.value}</text>
      </g>
    );
  }
}

const CustomDot = (props: any) => {
  const {
    cx, cy, stroke, payload, value,
  } = props;
  if (props.index % 10 === 3) {
    return <circle cx={cx} cy={cy} r={3} fill={stroke} stroke="#fff" strokeWidth={1} />;
  }
  return <circle cx={cx} cy={cy} r={0} />;
}

const CustomRect = (props: any) => {
  const {
    cx, cy, stroke, payload, value,
  } = props;
  if (props.index % 10 === 8) {
    const width = 6;
    const height = 6;
    return <rect x={cx - width / 2} y={cy - height / 2} width={width} height={height} fill={stroke} stroke="#fff" strokeWidth={1} />;
  }
  return <rect cx={cx} cy={cy} r={0} />;
}

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
      focusCountries: [0]
    });
    return <div></div>;

  }
  const onMouseMove = (event?: { activeLabel: number }) => {
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
      <br />
      <p>
        To show the difference, we use the actual historical numbers of immigrating individuals
        as the number of applicants for immigration. The accepted numbers display how many
        people would be admitted under today's law. The waitlisted values display the difference
        between applications and acceptances, in accordance with the waitlist system introduced
        by today's law.
      </p>
      <br />
    </Row>
    <Row>
      <h4>Select the countries you would like to see data for:</h4>
      <br />
    </Row>
    <Row>
      {columnHeaders.map((name: string, id: number) => {

        const onClick = (_e: any) => {
          const focuses = state.focusCountries;
          if (state.focusCountries.includes(id)) {
            setState({ ...state, focusCountries: focuses.filter((e) => e !== id) });
          } else {
            focuses.push(id);
            setState({ ...state, focusCountries: focuses });
          }
        }
        return <Button
          onClick={onClick}
          variant={`outline-${VARIANT_CIRCLE[id % VARIANT_CIRCLE.length]}` as Variant}
          active={state.focusCountries.includes(id)}
          key={name}
          style={{ borderRadius: 0, flexGrow: 1, minWidth: 80 }}
        >{name}</Button>;
      })}
    </Row>
    <br />
    <Row>Immigration Statistics Per Year:</Row>
    <Row>
      <ResponsiveContainer aspect={1.0} width="99%" maxHeight={400}>
        <SelectZoomLineChart
          data={state.data}
          // margin={{ top: 20, right: 30, left: 10, bottom: 100 }}
          xAxProps={{ dataKey: "year", type: "number", tickCount: 8, label: { value: 'Year', position: 'insideBottom', offset: 0 } }}
          onMouseMove={onMouseMove}>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend payload={[{ value: 'Applied', type: 'square', id: 'ID1' }, { value: 'Accepted', type: 'circle', id: 'ID2' }]} />
          {
            state.focusCountries.map((id, ind) =>
              <Line type="monotone"
                key={`Applied ${ind}`}
                unit=" People"
                dataKey={e => e.data[id].applied + 1}
                stroke={rgb(COLOR_CIRCLE[id % NUM_COLORS])}
                strokeDasharray="2 2"
                dot={<CustomRect />}
                activeDot={false}
                legendType="square"
                name={`${columnHeaders[id]} Applications`}
                isAnimationActive={false} />)
          }
          {
            state.focusCountries.map((id, ind) =>
              <Line type="monotone"
                key={`Accepted ${ind}`}
                unit=" People"
                dataKey={e => e.data[id].accepted + 1}
                stroke={rgb(COLOR_CIRCLE[id % NUM_COLORS])}
                legendType="circle"
                dot={<CustomDot />}
                activeDot={false}
                name={`${columnHeaders[id]} Accepted`}
                isAnimationActive={false} />)
          }
        </SelectZoomLineChart>
      </ResponsiveContainer>
    </Row>
    <Row>
      <Row>
        Immigration Per Country of Origin:
    </Row>
      <ResponsiveContainer width="99%" aspect={1.0} maxHeight={400}>

        <BarChart
          data={state.data[state.focusYear - state.baseYear].data.slice(0, state.data[state.focusYear - state.baseYear].data.length - 1)}
          margin={{ top: 20, right: 30, left: 20, bottom: 100, }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="country" tick={<CustomizedAxisTick />} type="category" />
          <YAxis/>
          <Tooltip />
          <Bar dataKey="accepted" unit=" People" fill="#82ca9d" isAnimationActive={false} />
          <Bar dataKey="applied" unit=" people" fill="#8884d8" isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </Row>
  </Container>
};

export type ExploreDataProps = {
  plotData: MigrationHistoryPlotDataType[],
  headers: string[]
};


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

const ExploreData: React.FC = () => {
  const [data, setData] = useState<ExploreDataProps | undefined>(undefined);
  if (data === undefined) {
    explorePropsFetcher().then(e => setData(e));
  }
  if (!data) {
    return <Container>
      <Row>
        <h4>
          The following data compares and contrasts what immigration did look like and what
          would have looked like under today's immigration laws.
        </h4>
        <br />
        <p>
          To show the difference, we use the actual historical numbers of immigrating individuals
          as the number of applicants for immigration. The accepted numbers display how many
          people would be admitted under today's law. The waitlisted values display the difference
          between applications and acceptances, in accordance with the waitlist system introduced
          by today's law.
        </p>
        <br />
      </Row>
      <Row>
        <h3>Loading...</h3>
      </Row>
    </Container>
  }
  return <Plots
    plotData={data!.plotData}
    columnHeaders={data!.headers}
  />
};

export default ExploreData;