# MAKINI assessment

## Environment

- Node: v16
- Yarn: v1.22

## Technical stack

- API framework: Expressjs
- Views: EJS
- Unit test: Mocha, Chai, Sinon
- Language: Typescript
- Cache: Node Cache
- Database: Airtable
- Logger: Winston

## Folder structure
<pre>
|-- env
    |-- index.ts: load env config
|-- src
    |-- airtable: airtable instance to call to airtable
    |-- common: common constant, interface, enum, logger use in project
    |-- controller: define routes in project
    |-- model: modeling model use in project
    |-- repository: define repository to get data from airtable
    |-- service: implement the main logic 
    |-- validator: validator query of request
    |-- view: define all views in project
|-- .env.dev: the env file, use dotenv library to read
|-- .gitignore
|-- mocha-setup.ts
|-- package.json
|-- README.md
|-- tsconfig.json
|-- yarn.lock
</pre>

## How to run

  1. Run `yarn` to install all packages
  2. Run `yarn run start:dev` to run code
  3. Run `yarn run test:dev` to run unit test

## APIs

  1. To get hierarchy: http://localhost:3000/hierarchies
  2. To get drawings: http://localhost:3000/drawings
  3. To get service planner: http://localhost:3000/service-planners (Query: ?startDate=yyyy-MM-DDTHH:mm:ss.SSSZ)

