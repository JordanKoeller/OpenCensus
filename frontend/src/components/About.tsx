import React from 'react';
import { Container, Row } from 'react-bootstrap';

const About: React.FC = () => {
  return <Container>
    <Row>
      <div className="title-block">
        <h1 className="page-title">
          About Open Justice
        </h1>
      </div>
    </Row>
    <Row>
      <div className="content-block">
      <h3>
        OpenJustice is an open-source project aimed at presenting information about
        modern American society in a data-driven, interractive way.
      </h3>
      <p>
        While information about any topic you may be interested in is readily available
        on the internet, most of it is hard to understand because we have no context in which
        to understand it. OpenJustice attempts to fix this problem by presenting data about
        our society in an novel, interractive way. Through interractivity we provide a
        meaningful framework to understand cumbersome statistical data. It allows individuals
        to more easily connect their own story, their family's story, or their community's story
        to statistical data about the story of America's historical and modern-day society.
      </p>
      <h3>
        OpenJustice is transparent.
      </h3>
      <p>
        Any claims made on OpenJustice are fact-checked and must include a reference to where the data
        was found and how it was collected. We rely heavily on data from the U.S. Census
        Bureau to power our analyses, though data from other credible sources is present. See the bottom
        of any page for information on where the data was found and how the analysis was made.
      </p>
      <h3>
        OpenJustice is an open-source, community-driven project.
      </h3>
      <p>
        OpenJustice is an open-source project made from the contributions of many individuals. Anybody with an idea
        and the technical know-how to create a page may submit a project. However, in order for the project to be included
        on OpenJustice.info it has been rigorously vetted for factual accuracy, validity, and relevance. It also must meet
        our citations and references guidelines to be approved.
      </p>
      <h4>
        Interested in contributing to OpenJustice? Visit our <a href="https://github.com/JordanKoeller/OpenCensus">github repository </a>
         for more info on how to add to the project.
      </h4>
      </div>
    </Row>
    <Row />
  </Container>

  }

  export default About;