// import './App.css';
import React, { useState } from 'react';
import { Row, Form, Col, Container, Button, FormControl, Alert, Jumbotron } from 'react-bootstrap';
import { CAN_MIGRATE_API } from '../../../utils';

// Material components imports

type CanMigrateFormProps = {
  options: Array<string>,
  onSubmit: (year: number, countryOfOrigin: string) => void
}

type WaitTimeResponse = {
  waitMin: number,
  waitMax: number,
  accepted: number,
  applied: number,
  waitlist: number
};




const CanMigrateForm: React.FC<CanMigrateFormProps> = ({ options, onSubmit }) => {
  const [state, setState] = useState({ country: "", year: 1970 })
  const handleSelectCountry = (event: React.FormEvent<FormControl & HTMLInputElement>) => {
    console.log(event.currentTarget.value);
    setState({ ...state, country: event.currentTarget.value })
  }
  const handleSelectYear = (event: React.FormEvent<FormControl & HTMLInputElement>) => {
    setState({ ...state, year: parseInt(event.currentTarget.value) });
  }
  const submissionFunction = () => {
    if (state.country !== "Select Country of Origin") {
      onSubmit(state.year, state.country);
    }
  }
  return <Form>
    <Form.Group as={Row} controlId="formYearInput">
      <Form.Label column sm="auto">
        Year
            </Form.Label>
      <Col sm="auto">
        <Form.Control as="input" type="number" defaultValue={state.year} onChange={handleSelectYear} />
      </Col>
      <Col sm="auto">
        <Form.Control as="select" onChange={handleSelectCountry}>
          <option>Select Country of Origin</option>
          {options.map((elem: string) => <option key={elem}>{elem}</option>)}
        </Form.Control>
      </Col>
      <Col>
        <Button variant="outline-primary" onClick={submissionFunction}>Submit</Button>
      </Col>
    </Form.Group>
  </Form>
}

type AlertType = 'success' | 'danger' | 'warning';

export type AppProps = {
  countryOptions: string[]
};

type BodyState = {
  year: number,
  countryOfOrigin: string,
  canMoveMsg?: string,
  yearMigrationDescription?: string,
  alertType?: AlertType,
  countryIndex?: number,
};

async function appPropsFetcher(): Promise<AppProps> {
  console.log("app fetcher starting");
  const url = CAN_MIGRATE_API + '/get-country-headers';
  const countryRequest = await fetch(url, {
    headers: { 'Content-Type': 'text/plain' },
    method: 'GET'
  });
  const resp = await countryRequest.json();
  console.log("app fetcher returning");
  return { countryOptions: resp.countries };
}

const CanMigrateAppPage: React.FC = () => {
  const [data, setData] = useState<AppProps | undefined>(undefined);
  if (data === undefined) {
    appPropsFetcher().then(e => setData(e));
  }
  const [state, setState] = useState<BodyState>({ year: 1970, countryOfOrigin: "" });
  const headerDiv = (<div>
    <p>
      Since the founding of America, our immigration laws have changed many times. This
      allows us to ask an interesting question: could your family have moved to America
      under today's current immigration law? What if today's immigration law had been
      on the book for all of American history? This app analyzes historical census data
      to answer this question. Put in where your family moved from and what
      year down below and you can find out. To give you a fighting chance, we will assume
      your family passed the Department of Homeland Security's background checks.
        </p>
  </div>);
  const footerDiv = (<div>
    <p>
      Did you manage to make it? It's interesting to think about how different America could look
      if today's immigration law had been set by the founders.
    </p>
  </div>);
  if (data === undefined) {
    return <Container>
      <Row>
        {headerDiv}
      </Row>
      <Row>
        <h3>Loading App...</h3>
      </Row>
      <Row>
        {state.canMoveMsg ? <Alert variant={state.alertType}>{state.canMoveMsg}</Alert> : ""}
      </Row>
      <Row>
        {footerDiv}
      </Row>
    </Container>
  } else {
    const computeCanCome = (year: number, countryOfOrigin: string) => {
      // Get data for responding a blerb about the person's potential to immigrate
      const url = CAN_MIGRATE_API + '/can-you-migrate';
      const req1 = fetch(url, {
        headers: { 'Content-Type': 'text/plain' },
        method: 'POST',
        body: JSON.stringify({ 'country': countryOfOrigin, 'year': year })
      }).then((e: Response) => e.json() as Promise<WaitTimeResponse>);
      // Get data for plotting historical migration

      // const countryHierarchyUrl = process.env.REACT_APP_CAN_MIGRATE_API + '/get-country-headers/hierarchy';
      // const req3 = fetch(countryHierarchyUrl, { headers: { 'Content-Type': 'text/plain' }, method: 'GET' }).then((e: Response) => e.json());
      req1.then((js1: WaitTimeResponse) => {
        console.log("In promise");
        let canMoveMsg = "Welcome to America!";
        let alertType = "success";
        const avgWait = Math.round((js1.waitMin + js1.waitMax) / 2);
        if (avgWait === 0) {
          canMoveMsg = `Welcome to America! You should be able to move some time this year.`;
          alertType = 'success';
        } else if (js1.waitMax < 2) {
          canMoveMsg = `Welcome to America! You should be able to move in
                        approximately ${avgWait} years.`;
          alertType = 'success';
        } else if (js1.waitMax < 10) {
          canMoveMsg = `You qualify for citizenship, but too many people from
                        ${countryOfOrigin} have been applying to move to America recently.
                        You should expect to wait approximately ${avgWait} years to
                        live in the US.`;
          alertType = 'warning';
        } else {
          canMoveMsg = `I'm sorry, America is full. You might be able to move in about ${avgWait}
                        years but we are not accepting any more citizens from ${countryOfOrigin} at this time.
                        Would you like to put your name on the waitlist?`
          alertType = 'danger';
        }
        let yearMigrationDescription = `In ${year}, approximately ${js1.applied.toLocaleString()} people applied to immigrate to America from ${countryOfOrigin}, including your family.`;
        if (js1.waitMin > 0) {
          yearMigrationDescription += ` Unfortunately, ${countryOfOrigin} already had a waitlist of ${(js1.waitlist + js1.accepted).toLocaleString()} people from previous years, so all the applicants
          in ${year} were automatically waitlisted. ${js1.accepted.toLocaleString()} people from the waitlist were let in.`;
        } else if (js1.waitMax === 0) {
          yearMigrationDescription += ` Fortunately ${countryOfOrigin} has not been sending over many immigrants recently so all ${js1.accepted.toLocaleString()} immigrants were let in.`;
        } else {
          yearMigrationDescription += ` Of those ${js1.applied.toLocaleString()}, there were enough slots for ${js1.accepted.toLocaleString()} to move to America, and ${js1.waitlist.toLocaleString()}
          were put on a waitlist.`;
        }
        setState({
          ...state,
          'year': year,
          'countryOfOrigin': countryOfOrigin,
          'canMoveMsg': canMoveMsg,
          'alertType': alertType as AlertType,
          'yearMigrationDescription': yearMigrationDescription
        });
      });
    }
    return <div>
      {headerDiv}
      <Jumbotron style={{ height: "100%", width: "100%", alignContent: "middle" }}>
        <CanMigrateForm options={data!.countryOptions} onSubmit={computeCanCome} />
        {state.canMoveMsg ? <Alert variant={state.alertType}>{state.canMoveMsg}</Alert> : ""}
        {state.canMoveMsg ? <Alert variant="info">{state.yearMigrationDescription}</Alert> : ""}
      </Jumbotron>
      {footerDiv}
    </div>
  }
}

export default CanMigrateAppPage;