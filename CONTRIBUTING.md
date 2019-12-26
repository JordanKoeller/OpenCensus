# Contributing to OpenJustice

## Infrastructure

OpenJustice is based on a React single-page static frontend writen in Typescript and serverless resources for communicating with data. We use Amazon Web Services for our infrastructure. The frontend is hosted in a public S3 bucket. Backend compute resources are hosted through Amazon Lambda. Data for analyses are currently hosted as files in another public S3 bucket, though if your contribution needs other resources such as DynamoDB that could be provisioned. Backend resources are provisioned through YAML files using the package `serverless`.

### Povisioning new infrastructure

If your addition requires any new infrastructure it must be defined using `serverless`. This will allow for it to be auto-provisioned on pushes to master. Additionally, since AWS infrastructure costs money the resources will need to be reviewed and approved for addition. It is recommended you contact Jordan Koeller (jkoeller12@gmail.com) before submitting a pull request so any new infrastructure can be reviewed.

### Continuous Integration

On merges into master, two Github Actions are executed. The first action automatically calls `npm run build` and deploys the static react project to S3. The second uses `serverless` to auto-deploy backend infrastructure. This is done by building and calling `serverless deploy` on each subdirectory within `lambdas`. The continuous integration pipeline supports any runtime supported
by AWS, including extension modules for python written in C such as `numpy`.

## Coding standards

### Code style

Your code must bass the eslint standards defined in the `.eslint` file. A few exceptions are allowed but generally speaking if your code is not properly linted
your pull request will be bounced.

### Git usage

The main development of OpenJustice uses GitFlow. Of course you can do whatever you want when developing new features but GitFlow is recommended.

### Code Organization

Most additions to OpenJustice come in the form of adding modules. A module is the encapsulation of a description of some aspect of the law, an interractive app used to explore the law and any relevant data, any backend infrastructure needed, and a description of how the app works and what assumptions were made. The frontend code for a module should be added to the `frontend/src/components/modules` directory. See the `can-you-migrate` module for an example. Backend resources should be added to a directory created in `lambdas`. Again, see `CanYouMigrate` for a template of what provisioned backend resources may look like.

If your module creates new components that may be helpful to other developers, consider adding them to the `frontend/src/components` directory directly. Note that these components must have tester code accompanying them as well as an entry in the wiki.

### Documentation

All code should be documented on at least the level of short descriptions of what functions accomplish. There is also a wiki section to the Github page. If you were able to create any reusable components, please write an accompanying wiki page explaining its usage with a screenshot of the component in action.

## References Standards

Any conversations or apps that deal with new data or new legal information must come from a credible source and have citations provided at the bottom of the page(s) that use the information. For a source to be credible it must be:

  + from a well-respected, recognizable organization
  + objectively describing a situation in a non-opinionated way
  + non-anecdotal
  + data must be statistical in nature
  + data from public sources is preferred but not required.

If your addition does not meet _all_ of the above requirements the pull request will be bounced. This does not mean your addition is a "lost cause" - it just needs to be updated to use new resources that are more objective and accurate.

# Bug fixes

If you have any bug fixes you want to make just make your edits and make a pull request! Make sure to also provide a description of what you are trying to fix in the pull request. Be sure to reference any issues associated with the bug fix.