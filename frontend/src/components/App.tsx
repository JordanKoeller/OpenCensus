import 'bootstrap/dist/css/bootstrap.min.css';
import '../resources/App.css';

import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
// Material components imports
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faGithub } from '@fortawesome/free-brands-svg-icons';

import { Container, Row } from 'react-bootstrap';
import CanMigrateModule from './modules/can-you-migrate/can-migrate-module';
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
  return <Router>
      <header>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/home">OpenJustice</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/CanYouMigrate">
                Could You Migrate to America?
              </Nav.Link>
              <Nav.Link href="/AboutOpenJustice">
                About Open Justice
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
      <div className="Site-content">
        <Switch>
          <Route path="/CanYouMigrate">
            <CanMigrateModule />
          </Route>
          <Route path="/AboutOpenJustice">
            <About />
          </Route>
          <Route path="">
            <Redirect to="/CanYouMigrate" />
          </Route>
        </Switch>
      </div>
      <footer>
        <Footer></Footer>
      </footer>
    </Router>;
}

export default App;