import React from 'react';

const OurAnalysis: React.FC = () => {
  return <div>
    <h2>Methodology</h2>
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
  </div>
}

export default OurAnalysis;