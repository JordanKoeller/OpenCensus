import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useRouteMatch,
} from 'react-router-dom';
// Material components imports
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Container, Row, Card } from 'react-bootstrap';

import '../../resources/module-skeleton.css';

export type ReferenceElement = {
    title: string,
    publisher: string,
    link: string,
    year: string,
    chapter?: string,
    author?: string,
}


export type ModuleProps = {
    title: string,
    AppComponent: React.FC,
    MethodsComponent: React.FC,
    BackgroundInfoComponent: React.FC,
    references: Array<ReferenceElement>
}

const Module: React.FC<ModuleProps> = ({ title,
    AppComponent,
    MethodsComponent,
    BackgroundInfoComponent,
    references }) => {
    const { path, url } = useRouteMatch();
    return <Router>
        <div>
            <Navbar className="thin-navbar" collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link bsPrefix="thin-navlink nav-link" href={`${url}`}>
                            {title}
                        </Nav.Link>
                        <Nav.Link bsPrefix="thin-navlink nav-link" href={`${url}/Methods`}>
                            Our Analysis
              </Nav.Link>
                        <Nav.Link bsPrefix="thin-navlink nav-link" href={`${url}/Background`}>
                            Background Information
              </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Container>
                <Card bg="light" style={{ marginTop: "2.5em", marginBottom: "2.5em" }}>
                    <Card.Header><h1>{title}</h1></Card.Header>
                    <Card.Body>
                        <Card.Text>
                            <Switch>
                                <Route exact path={path}>
                                    <div>
                                        <AppComponent />
                                        <p>
                                            To find out more about how this app works, see the <a href={`${url}/Methods`}>Methods</a> section.
                                    </p>
                                    </div>
                                </Route>
                            </Switch>
                            <Switch>
                                <Route path={`${path}/Methods`}>
                                    <div>
                                        <h6>
                                            Before reading the methods section, you probably want to read the 
                                            <a href={`${url}/Background`}> background section. </a>
                                            Understanding the methods depends heavily on understanding the background section.
                                        </h6>
                                        <MethodsComponent />
                                    </div>
                                </Route>
                            </Switch>
                            <Switch>
                                <Route path={`${path}/Background`}>
                                    <BackgroundInfoComponent />
                                </Route>
                            </Switch>
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <Card.Title>References</Card.Title>
                        <Card.Text>
                            <ul>
                                {
                                    references.map((elem: ReferenceElement) => {
                                        return <li>
                                            <a href={elem.link}>
                                                <p>
                                                    {elem.title}. {elem.chapter ? elem.chapter : ""}
                                                    <br />
                                                    {elem.publisher}. {elem.year}
                                                </p>
                                            </a>
                                        </li>
                                    })
                                }
                            </ul>

                        </Card.Text>
                    </Card.Footer>
                </Card>
            </Container>
        </div>
    </Router>
}

export default Module;