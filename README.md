# Binquiz Web App

A react based client application to play Binquiz. It's a single page application at the moment in which containers change using a local string flag. The game itself is multiplayer and will be moderated by a quizmaster and some players in the teams. Stay tuned in  for the first event.

---
### External Comms
- Google OAuth client for authenticating and retrieving user. Used by pretty much everyone made it like the top choice when choosing identity provider.
- Web sockets networking for seamless quizzing experience with every player getting an update at the same time.
- Jwt Token is used for authenticating any REST api requests. A new token is sent out to a user when they login.
---

### Package structure
```
src
├── Binge
│   ├── Scene
│   └── v1
│       ├── Switcher
│       ├── comms
│       ├── components
│       │   ├── Box
│       │   ├── Divider
│       │   ├── Form
│       │   ├── Header
│       │   ├── Popover
│       │   ├── Query
│       │   ├── Scoreboard
│       │   ├── State
│       │   ├── TextField
│       │   └── TextInput
│       ├── controller
│       ├── data
│       ├── dataStore
│       ├── features
│       ├── pages
│       │   ├── Board
│       │   ├── Landing
│       │   ├── Lobby
│       │   └── Reception
│       ├── state
│       └── utils
├── images
└── utils
```

### File extensions
- `tsx` - Typescript components and methods.
- `spec.tsx` -  Typescript component tests.
- `scss` - Sass styles.
- `spec.scss` - Sass styles tests.
- `svg` - Images.
---
## Installation

- First of all, install `npm` which comes bundled with [Node](https://nodejs.org/en/download/).
-  Install `yarn` package manager by running. 
```
npm install --global yarn
```
We prefer `yarn` and would like to keep it that away unless something alarming happens.
- Install all project dependencies using `yarn` by running
```
yarn install
```

#### Use Nginx to launch

Add reverse proxy listener in the file `/etc/nginx/sites-available/default` and start nginx.

#### Use yarn to launch
Start the application by running 
```
yarn start
```
---
### Environment Variables
- `REACT_APP_GOOGLE_CLIENT_ID` = <GOOGLE_OAUTH_CLIENT_ID>
  - Get your OAuth credentials from Google Cloud Console.
- `REACT_APP_SERVER_ENDPOINT_PREFIX` = :<SERVER_PORT>
  - Start the [server](https://github.com/atulanand206/find) at the specific port.

For running on a secure production server: Use `nginx` to launch
- `REACT_APP_WEBSOCKETS_SCHEME` = wss
- `REACT_APP_REST_SCHEME` = https
- `PORT` = 8080

For running locally without a secure certificate: Use `yarn` to start.
- `REACT_APP_WEBSOCKETS_SCHEME` = wss
- `REACT_APP_REST_SCHEME` = https
- `PORT` = 3000
---
### Building Image
The images reside in [DockerHub](https://hub.docker.com/repository/docker/atulanand206/binquiz-webapp). To build a docker image, run the following command in the repository's root directory.
```
docker build . -t atulanand206/binquiz-webapp:vx.x
```

Once the image is built, push it out to DockerHub so that it can be consumed by the production server.
```
docker push atulanand206/binquiz-webapp:vx.x
```

---
### Dependencies   

- ##### Core
  - [react](https://yarnpkg.com/package/react)
  - [react-dom](https://yarnpkg.com/package/react-dom)
  - [react-router-dom](https://yarnpkg.com/package/react-router-dom)
  - [@types/react-router-dom](https://yarnpkg.com/package/@types/react-router-dom)
  - [react-scripts](https://yarnpkg.com/package/react-scripts)
  - [ts-node](https://yarnpkg.com/package/ts-node)
  - [typescript](https://yarnpkg.com/package/typescript)

- ##### Comms
  - [react-google-login](https://classic.yarnpkg.com/en/package/react-google-login)
  - [websocket](https://yarnpkg.com/package/websocket)
  - [@types/websocket](https://classic.yarnpkg.com/en/package/@types/websocket)

- ##### State mgmt
  - [valtio](https://www.npmjs.com/package/valtio)

- #### Styling
  - [classnames](https://classic.yarnpkg.com/en/package/classnames)
  - [font-awesome](https://classic.yarnpkg.com/en/package/font-awesome)

- ##### Testing 
  - [chai](https://yarnpkg.com/package/chai)
  - [@types/chai](https://yarnpkg.com/package/@types/chai)
  - [enzyme](https://yarnpkg.com/package/enzyme)
  - [@types/enzyme](https://yarnpkg.com/package/@types/enzyme)
  - [enzyme adapter](https://yarnpkg.com/package/@wojtekmaj/enzyme-adapter-react-17)
  - [sinon](https://yarnpkg.com/package/sinon)
  - [@types/sinon](https://yarnpkg.com/package/@types/sinon)
  - [sass-true](https://yarnpkg.com/package/sass-true)

---

## Author
- [Atul Anand](https://github.com/atulanand206)