import React from 'react';

const OurAnalysis: React.FC = () => {
  return <div>
    <h2>Methodology</h2>
    <h6>
      It will be useful to understand how American Immigration policy works to get the most of this section.
      For a brief synopsis of American Immigration policy, please see
        <a href="/ImmigrationInAmerica"> American Immigration Policy </a> then come back to this article.
      </h6>
    <p>
      Reading the synopsis, we see immigration law is complex. To perform our analysis, we only consider two
      aspects of immigration law; the 675,000 immigrants limit and the 7% rule. We do not account for differences
      in education or employment. Note that we also assume that you are not eligible for family-based migration,
      since you inherently did not have any family in America already when your family came to America.
      </p>
    <p>
      Using historical Census data, we use the number of immigrants historically coming to America as the number of
      individuals who passed background checks and qualified to immigrate to America. We then use the 675,000 limit
      and 7% rule to set caps on how many of the qualifying individuals we let in per year. If an individual is not
      able to move to America in a given year they automatically get put in a waitlist of people trying to come to
      America in the next year. Individuals are let in in the order they apply to become residents in America.
      </p>

    <h4>
      References:
      </h4>
    <ul>
      <li>
        <p>
          Bicentennial Edition: Historical Statistics of the United States, Colonial Times to 1970. Chapter C: Migration.
        <br />
          United States Census Bureau. Published in 1975.
      </p>
      </li>
      <li>
        <p>
          Fact Sheet: How the United States Immigration System Works.
      <br />
          American Immigration Council. Published in Oct. 2019.
      </p>

      </li>
    </ul>
  </div>
}

export default OurAnalysis;