// import './App.css';
import React, { useState } from 'react';
import { Row, Form, Col, Container, Button, FormControl, Alert } from 'react-bootstrap';
// Material components imports

import SearchableListPicker from './SearchableListPicker';
import { SelectCallback } from 'react-bootstrap/helpers';


type CanMigrateFormProps = {
    options: Array<string>,
    onSubmit: (year: number, countryOfOrigin: string) => void
    defaultCoo?: number,
    defaultYear?: number,
}

const CanMigrateForm: React.FC<CanMigrateFormProps> = (props) => {
    const availOpts = props.options;
    var coo: string = props.defaultCoo ? props.options[props.defaultCoo] : "";
    var yr: number = props.defaultYear ? props.defaultYear : 1970;
    const handleSelectCountry: SelectCallback = (eventKey: string, e: React.SyntheticEvent<unknown, Event>) => {
        coo = eventKey;
    };
    const handleSelectYear = (event: React.FormEvent<FormControl & HTMLInputElement>) => {
        yr = parseInt(event.currentTarget.value);
    }
    return <Form>
        <Form.Group as={Row} controlId="formYearInput">
            <Form.Label column sm="auto">
                Year
    </Form.Label>
            <Col sm="auto">
                <Form.Control as="input" type="number" defaultValue={yr} onChange={handleSelectYear} />
            </Col>
            <Col sm="auto">
                <SearchableListPicker title="Select Country of Origin" options={availOpts} onSelected={handleSelectCountry} default={coo} />
            </Col>
            <Col>
                <Button variant="outline-primary" onClick={() => props.onSubmit(yr, coo)}>Submit</Button>
            </Col>
        </Form.Group>
    </Form>
}

const CanMigrateAppPage: React.FC = () => {
    type StateType = {
        year: number,
        countryOfOrigin: string,
        canMoveMsg?: string
        alertType?: 'success' | 'danger' | 'warning'
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
    const cooOpts = ["England", "Ireland", "Russia", "India", "China", "Japan", "Morocco"];
    const computeCanCome = (year: number, countryOfOrigin: string) => {
        const canMoveMsg = "Welcome to America!";
        const alertType = "success";
        setState({
            'year': year,
            'countryOfOrigin': countryOfOrigin,
            'canMoveMsg': canMoveMsg,
            'alertType': alertType
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
            <CanMigrateForm options={cooOpts} onSubmit={computeCanCome} />
        </Row>
        <Row>
            {state.canMoveMsg ? <Alert variant={state.alertType}>{state.canMoveMsg}</Alert> : ""}
        </Row>
    </Container>
}

export default CanMigrateAppPage;