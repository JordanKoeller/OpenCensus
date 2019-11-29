// import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
} from 'react-router-dom';
// Material components imports
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import { Container, Col, Row } from 'react-bootstrap';
import CanMigrateAppPage from './CanMigrate';
import ImmInAmerica from './ImmInAmerca';
import OurAnalysis from './Methods';
import About from './About';


const App: React.FC = () => {
  return <NavigationBar>
  </NavigationBar>
}

const NavigationBar: React.FC = () => {
  return (
      <Router>
        <div>

        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/home">OpenJustice</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link>
                <Link to="/ImmigrationInAmerica">
                  American Immigration Policy
      </Link>
              </Nav.Link>
              <Nav.Link>
                <Link to="/Methods">
                  Our Analysis
      </Link>
              </Nav.Link>
              <Nav.Link>
                <Link to="/About">
                  About Us
      </Link>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      <Container>
        <Col lg="3"></Col>
        <Col>
        <Row></Row>
          <Row>
            <Switch>
            <Route path="/Home">
              <CanMigrateAppPage/>
            </Route>
            <Route path="/ImmigrationInAmerica">
              <ImmInAmerica/>
            </Route>
            <Route path="/Methods">
              <OurAnalysis/>
            </Route>
            <Route path="/About">
              <About/>
            </Route>
            </Switch>
          </Row>
          <Row></Row>
        </Col>
        <Col lg="3"></Col>
      </Container>
        </div>
      </Router>
  );
}

export default App;