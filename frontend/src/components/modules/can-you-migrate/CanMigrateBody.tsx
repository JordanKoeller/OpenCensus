// import './App.css';
import React, { useState } from 'react';
import { Row, Form, Col, Container, Button, FormControl, Alert, Jumbotron } from 'react-bootstrap';
// Material components imports

type CanMigrateFormProps = {
    options: Array<string>,
    onSubmit: (year: number, countryOfOrigin: string) => void
}

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
        countryOptions?: string[]
    };
    const [state, setState] = useState<StateType>({ year: 1970, countryOfOrigin: "" });
    const headerDiv = <div>
        <p>
            Since the founding of America, our immigration laws have changed many times. This
            allows us to ask an interesting question: could your family have moved to America
            under today's current immigration law? What if today's immigration law had been
            on the book for all of American history? This app analyzes historical census data
            to answer this question. Put in where your family moved from and what
            year down below and you can find out. To give you a fighting chance, we will assume
            your family passed the Department of Homeland Security's background checks.
        </p>
    </div>
    const footerDiv = <div>
        <p>
            Did you manage to make it? It's interesting to think about how different America could look
            if today's immigration law had been set by the founders.
    </p>
    </div>
    if (state.countryOptions === undefined) {
        const url = 'https://qqifi2u8bd.execute-api.us-east-1.amazonaws.com/dev' + '/get-country-headers';
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
            const url = 'https://qqifi2u8bd.execute-api.us-east-1.amazonaws.com/dev' + '/can-you-migrate';
            const waitRequest: Promise<Response> = fetch(url, {
                headers: { 'Content-Type': 'text/plain' },
                method: 'POST',
                body: JSON.stringify({ 'country': countryOfOrigin, 'year': year })
            });
            waitRequest.then((e: Response) => e.json()).then((js: { waitMin: number, waitMax: number }) => {
                let canMoveMsg = "Welcome to America!";
                let alertType = "success";
                const avgWait = Math.round((js.waitMin + js.waitMax) / 2);
                if (js.waitMax < 2) {
                    canMoveMsg = `Welcome to America! You should be able to move in
                        approximately ${avgWait} years.`;
                    alertType = 'success';
                } else if (js.waitMax < 10) {
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
            console.log("Somebody came from " + countryOfOrigin + " in the year " + year.toString());
        }
        return <Container>
            <Row>
                {headerDiv}
            </Row>
                <Jumbotron style={{ width: "100%", alignContent: "middle" }}>
            <Row>
                    <CanMigrateForm options={state.countryOptions!} onSubmit={computeCanCome} />
            </Row>
            <Row>
                {state.canMoveMsg ? <Alert variant={state.alertType}>{state.canMoveMsg}</Alert> : ""}
            </Row>
                </Jumbotron>
            <Row>
                {footerDiv}
            </Row>
        </Container>
    }
}

export default CanMigrateAppPage;