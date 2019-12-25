// import './App.css';
import React, { useState } from 'react';
import { Row, Form, Col, Container, Button, FormControl, Alert } from 'react-bootstrap';
// Material components imports

import SearchableListPicker from './SearchableListPicker';
import { SelectCallback } from 'react-bootstrap/helpers';


type CanMigrateFormProps = {
    options: Array<string>,
    onSubmit: (year: number, countryOfOrigin: string) => void
}

const CanMigrateForm: React.FC<CanMigrateFormProps> = ({ options, onSubmit }) => {
    const [state, setState] = useState({ countryIndex: -1, year: 1970 })
    const handleSelectCountry: SelectCallback = (eventKey: string, e: React.SyntheticEvent<unknown, Event>) => {
        setState({ ...state, countryIndex: options.indexOf(eventKey) });
    };
    const handleSelectYear = (event: React.FormEvent<FormControl & HTMLInputElement>) => {
        setState({ ...state, year: parseInt(event.currentTarget.value) });
    }
    const defaultCountryPick = state.countryIndex === -1 ? "" : options[state.countryIndex];
    return <Form>
        <Form.Group as={Row} controlId="formYearInput">
            <Form.Label column sm="auto">
                Year
            </Form.Label>
            <Col sm="auto">
                <Form.Control as="input" type="number" defaultValue={state.year} onChange={handleSelectYear} />
            </Col>
            <Col sm="auto">
                <SearchableListPicker title="Select Country of Origin" options={options} onSelected={handleSelectCountry} default={defaultCountryPick} />
            </Col>
            <Col>
                <Button variant="outline-primary" onClick={() => onSubmit(state.year, options[state.countryIndex])}>Submit</Button>
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
            U.S. immigration law is complex, and there is much confusion as to how it works.
            Immigration law in the United States has been built upon the following principles:
            the reunification of families, admitting immigrants with skills that are valuable
            to the U.S. economy, protecting refugees, and promoting diversity. This fact sheet
            provides basic information about how the U.S. legal immigration system is designed
            and functions.
        </p>
        <p>
            The body of law governing current immigration policy is called The Immigration and
            Nationality Act (INA). The INA allows the United States to grant up to 675,000
            permanent immigrant visas each year across various visa categories. On top of those
            675,000 visas, the INA sets no limit on the annual admission of U.S. citizens’ spouses,
            parents, and children under the age of 21. In addition, each year the president is
            required to consult with Congress and set an annual number of refugees to be admitted
            to the United States through the U.S. Refugee Resettlement Process.
        </p>
        <p>
            Once a person obtains an immigrant visa and comes to the United States, they become a
            lawful permanent resident (LPR). In some circumstances, noncitizens already inside the
            United States can obtain LPR status through a process known as “adjustment of status.”
            Lawful permanent residents are foreign nationals who are permitted to work and live lawfully
            and permanently in the United States. LPRs are eligible to apply for nearly all jobs
            (i.e., jobs not legitimately restricted to U.S. citizens) and can remain in the country
            permanently, even if they are unemployed. After residing in the United States for five years
            (or three years in some circumstances), LPRs are eligible to apply for U.S. citizenship. It
            is impossible to apply for citizenship through the normal process without first becoming an
            LPR. Each year the United States also admits a variety of noncitizens on a temporary basis.
            Such “non-immigrant” visas are granted to everyone from tourists to foreign students to
            temporary workers permitted to remain in the U.S. for years. While certain employment-based
            visas are subject to annual caps, other non-immigrant visas (including tourist and student
            visas) have no numerical limits and can be granted to anyone who satisfies the criteria for
            obtaining the visa.
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
                <h2>
                    Could your family have moved to America?
            </h2>
            </Row>
            <Row>
                <h3>Loading App...</h3>
            </Row>
            <Row>
                {state.canMoveMsg ? <Alert variant={state.alertType}>{state.canMoveMsg}</Alert> : ""}
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
            <Row>
                <h2>
                    Could your family have moved to America?
            </h2>
            </Row>
            <Row>
                <CanMigrateForm options={state.countryOptions!} onSubmit={computeCanCome} />
            </Row>
            <Row>
                {state.canMoveMsg ? <Alert variant={state.alertType}>{state.canMoveMsg}</Alert> : ""}
            </Row>
        </Container>
    }
}

export default CanMigrateAppPage;