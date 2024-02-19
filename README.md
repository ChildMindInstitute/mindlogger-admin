# ChildMindInstitute - MindLogger Admin

This repository is used for the Admin Panel of the MindLogger application stack

## Getting Started

* MindLogger Admin - **This Repo**
* MindLogger Backend - [GitHub Repo](https://github.com/ChildMindInstitute/mindlogger-backend-refactor)
* MindLogger Mobile App - [GitHub Repo](https://github.com/ChildMindInstitute/mindlogger-app-refactor)
* MindLogger Web App - [GitHub Repo](https://github.com/ChildMindInstitute/mindlogger-web-refactor)

## Getting Started

Running the app

### 1. Prerequisites

- NodeJS `18` or higher, recommend using `asdf` or `nvm` to manage local node version
- [Backend](https://github.com/ChildMindInstitute/mindlogger-backend-refactor) project running locally or accessible in a test environment
- Configured [environment variables](#environment-variables)\
  `cp .env.example .env`

### 2. Run the app

- Install dependencies using `npm install`
- Run the project `npm run start`. See [scripts](#available-scripts)
- Launch browser [http://localhost:3000](http://localhost:3000) to view the admin panel

## Features

What are MindLogger's current capabilities? [Knowledge Base Article](https://mindlogger.atlassian.net/servicedesk/customer/portal/3/topic/4d9a9ad4-c663-443b-b7fc-be9faf5d9383/article/337444910)

## Technologies

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

- [Typescript](https://www.typescriptlang.org/) - TypeScript is JavaScript with syntax for types
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Redux Toolkit](https://redux-toolkit.js.org/) - Global state manager for JavaScript applications
- [Material UI](https://mui.com/) - Library of React UI components
- [Axios](https://axios-http.com/) - Promise-based HTTP Client for node.js and the browser
- [React-app-rewired](https://github.com/timarney/react-app-rewired/) - Set up create-react-app webpack config without using "eject"

## Available Scripts

In the project directory, you can run:

### Running the app

- `npm start`

    Runs the app in the development mode.\
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

    The page will reload if you make edits.\
    You will also see any lint errors in the console.

- `npm run build`

    Builds the app for production to the `build` folder.\
    It correctly bundles React in production mode and optimizes the build for the best performance.

    The build is minified and the filenames include the hashes.\
    Your app is ready to be deployed!

    See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

- `npm run eject`

    **Note: this is a one-way operation. Once you `eject`, you can’t go back!**

    If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

    Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

    You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Testing

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

- `npm run test` - Launches the test runner in the interactive watch mode.\
- `npm run test:coverage` - Generate test coverage report
- `npm run test:junit` - Generate a junit xml report
- `npm run test:related` - Runs tests only for modified files
- `npm run test:nowatch` - Runs test suite once with the `watchAll=false` flag

## Environment Variables

| Key                                | Required      | Default value      | Description |
| ------------- | ------------- | ------------- | ------------- |
| REACT_APP_API_DOMAIN               | yes | null | MindLogger Backend API endpoint |
| REACT_APP_ENV                      | no | null | Check if the app is in `prod` or `staging`  |
| REACT_APP_DEVELOP_BUILD_VERSION    | no | null | Footer app build number |
| REACT_APP_MIXPANEL_TOKEN           | no | null | Mixpanel token |

## License

Delayed Open Source Attribution License 1.0 (DOSA-1.0)

Refer to [LICENSE.md](./LICENSE.md)
