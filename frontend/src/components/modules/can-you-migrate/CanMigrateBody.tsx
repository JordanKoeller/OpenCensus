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
    waitMax: number
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
                    {options.map((elem: string) => <option>{elem}</option>)}
                </Form.Control>
            </Col>
            <Col>
                <Button variant="outline-primary" onClick={submissionFunction}>Submit</Button>
            </Col>
        </Form.Group>
    </Form>
}

const CanMigrateAppPage: React.FC = () => {
    type AlertType = 'success' | 'danger' | 'warning';
    type StateType = {
        year: number,
        countryOfOrigin: string,
        canMoveMsg?: string
        alertType?: AlertType,
        countryOptions?: string[],
        countryIndex?: number,
    };
    const [state, setState] = useState<StateType>({ year: 1970, countryOfOrigin: "" });
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
    if (state.countryOptions === undefined) {
        const url = CAN_MIGRATE_API + '/get-country-headers';
        console.log(url);
        const countryRequest: Promise<Response> = fetch(url, {
            headers: { 'Content-Type': 'text/plain' },
            method: 'GET'
        });
        countryRequest.then((e: Response) => e.json()).then((e: { countries: string[] }) => {
            setState({ ...state, countryOptions: e.countries });
        });

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
                let canMoveMsg = "Welcome to America!";
                let alertType = "success";
                const avgWait = Math.round((js1.waitMin + js1.waitMax) / 2);
                if (js1.waitMax < 2) {
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

                setState({
                    ...state,
                    'year': year,
                    'countryOfOrigin': countryOfOrigin,
                    'canMoveMsg': canMoveMsg,
                    'alertType': alertType as AlertType
                });
            });
        }
        return <div>
            {headerDiv}
            <Jumbotron style={{ height: "100%", width: "100%", alignContent: "middle" }}>
                <CanMigrateForm options={state.countryOptions!} onSubmit={computeCanCome} />
            </Jumbotron>
            {footerDiv}
        </div>
    }
}

export default CanMigrateAppPage;