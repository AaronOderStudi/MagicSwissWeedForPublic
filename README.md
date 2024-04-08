# MagicSwissWeed

An overview of current surfing conditions in Switzerland. [Check it out](https://nkueng.github.io/MagicSwissWeed/).

## Description

I started this project because I am a passionate surfer in a landlocked country (without any neat forecasting app yet) and because I occasionally like to work with code.

The idea is simple enough: Surfing in Switzerland means surfing in rivers, but this only works if there's enough water in them. Luckily, the Swiss government runs frequent measurements of the water flow and [a really cool dude](https://github.com/cstuder/) created [an API](https://api.existenz.ch/#hydro) to fetch them. So, all I have to do is get a few values of interest from this API. Simple, right?

Well, not if you've never worked with APIs and have very limited knowledge of websites. Nevertheless, this makes for a perfect learning project: a modest target and a long-held desire to finally work with JavaScript. Now, let's hope the tool will be of value to Swiss surfers too.

## Development

### Installation

This project is based on [Create React App](https://create-react-app.dev), so you'll need Node.js. First, [download](https://github.com/nvm-sh/nvm#installing-and-updating) the node version manager nvm:

```bash
`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash`
```

Restart your terminal or start a new session to load the changes. Then, install the latest node version:

```bash
nvm install node # "node" is an alias for the latest version
```

### Running the code

In the project directory, you can run:

```bash
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### Debugging

For Visual Studio Code, install [JavaScript Debugger](https://marketplace.visualstudio.com/items?itemName=ms-vscode.js-debug-nightly) and use the `Chrome: launch` template to debug with breakpoints.

```bash
npm test
```

Launches the test runner in the interactive watch mode.\
Test scripts have to be tailored to your project.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

```bash
npm run build
```

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

```bash
npm run deploy
```

Builds the project, pushes the `build` folder to an existing branch called `gh-pages`, and publishes the website.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### deployment on gcloud
https://medium.com/@danielbentley/deploying-your-react-app-with-google-app-engine-4cb68cb00e2f
1. create app.yaml
```
npm i
npm run build
gcloud auth login
gcloud config set project <your gcloud project name>
gcloud app deploy (--no-cache if it doesnt work without)
```

## Help

For issues with React: <https://react.dev/community>.

## Roadmap

### V1

- [x] Simple text-only display of current flow values in selected Swiss surfing spots
- [x] Color-coded numbers to indicate water temperatures

### V2

- [ ] Map view of spots in Switzerland
- [ ] Conditions visible when hovering over marked locations

## License

This project is licensed under the GNU GPLv3 License - see the LICENSE.md file for details

## Acknowledgments

- inspired by [flusssurfen.ch](https://www.flusssurfen.ch) and [aare.guru](https://www.aare.guru)
- informed by [BAFU Hydrology API](https://api.existenz.ch/#hydro)
- based on [Create React App](https://create-react-app.dev)
