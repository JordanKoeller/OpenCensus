import 'bootstrap/dist/css/bootstrap.min.css';
import '../resources/App.css';

import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
// Material components imports
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faGithub } from '@fortawesome/free-brands-svg-icons';

import { Container, Col, Row } from 'react-bootstrap';
import CanMigrateAppPage from './CanMigrate';
import ImmInAmerica from './ImmInAmerca';
import OurAnalysis from './Methods';
import About from './About';

const Footer: React.FC = () => {
  return <Container>
    <Row></Row>
    <Row>
      <div className="footer-social">
        <h4>Want to contribute? Check out our github!<br /> <a href="https://github.com/JordanKoeller/OpenCensus" className="transparent"><FontAwesomeIcon icon={faGithub} /></a></h4>
      </div>

    </Row>
    <Row>
      <div className="footer-credits">
        Created by Jordan Koeller.
        <br />
        Source code released under MIT License.
      </div>
    </Row>
    <Row></Row>
  </Container>
}


const App: React.FC = () => {
  return (
    <Router>
      <body className="Site">
        <header>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="/home">OpenJustice</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/ImmigrationInAmerica">
                  American Immigration Policy
              </Nav.Link>
                <Nav.Link href="/Methods">
                  Our Analysis
              </Nav.Link>
                <Nav.Link href="/About">
                  About Us
              </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </header>
        <div className="Site-content">
          <Container>
            <Col xs={0} sm={0} md={0} lg="3"></Col>
            <Col>
              <Row>
                <div className="page-content">
                  <Switch>
                    <Route path="/ImmigrationInAmerica">
                      <ImmInAmerica />
                    </Route>
                    <Route path="/Methods">
                      <OurAnalysis />
                    </Route>
                    <Route path="/About">
                      <About />
                    </Route>
                    <Route path="/Home">
                      <CanMigrateAppPage />
                    </Route>
                    <Route path="">
                      <CanMigrateAppPage />
                    </Route>
                  </Switch>
                </div>
              </Row>
              <Row></Row>
            </Col>
            <Col xs={0} sm={0} md={0} lg="3"></Col>
          </Container>
        </div>
        <footer>
          <Footer></Footer>
        </footer>
      </body>
    </Router>
  );
}

export default App;