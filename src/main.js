import React from 'react'
import ReactDOM from 'react-dom'
import createStore from './store/createStore'
import './styles/main.scss'
import $ from 'jquery'
import { addTranslation, setLanguages } from 'react-localize-redux'

async function init () {
  // Store Initialization
// ------------------------------------
  const store = await createStore(window.__INITIAL_STATE__)

  if (store.getState().localeReducer.languages.length === 0) {
    store.dispatch(setLanguages(['sv', 'en']))
  }
  const globalJson = require('./assets/global.locale.json')
  const profileJson = require('./assets/profile.locale.json')
  const dashboardJson = require('./assets/dashboard.locale.json')
  const referencesJson = require('./assets/references.locale.json')
  const dreamjobJson = require('./assets/dreamjob.locale.json')
  const employmentsJson = require('./assets/employments.locale.json')
  const educationsJson = require('./assets/educations.locale.json')
  const registerJson = require('./assets/register.locale.json')
  const validationJson = require('./assets/validation.locale.json')
  const personalrecruiterJson = require('./assets/personalrecruiter.locale.json')
  const publicprofileJson = require('./assets/publicprofile.locale.json')
  const jobsJson = require('./assets/jobs.locale.json')
  const skillsJson = require('./assets/skills.locale.json')
  const languageJson = require('./assets/languages.locale.json')
  const licenseJson = require('./assets/drivinglicense.locale.json')
  const occupationsJson = require('./assets/occupations.locale.json')
  const motivationsJson = require('./assets/motivations.locale.json')
  const personalityJson = require('./assets/personality.locale.json')
  const locationsJson = require('./assets/locations.locale.json')

  const json = $.extend(
    globalJson,
    profileJson,
    dashboardJson,
    referencesJson,
    dreamjobJson,
    employmentsJson,
    educationsJson,
    registerJson,
    validationJson,
    personalrecruiterJson,
    publicprofileJson,
    jobsJson,
    skillsJson,
    languageJson,
    licenseJson,
    occupationsJson,
    motivationsJson,
    personalityJson,
    locationsJson
  )
  store.dispatch(addTranslation(json))

// Render Setup
// ------------------------------------
  const MOUNT_NODE = document.getElementById('root')

  let render = () => {
    const App = require('./components/App').default
    const routes = require('./routes/index').default(store)

    ReactDOM.render(
      <App store={store} routes={routes} />,
      MOUNT_NODE
    )
  }

// Development Tools
// ------------------------------------
  if (__DEV__) {
    if (module.hot) {
      const renderApp = render
      const renderError = (error) => {
        const RedBox = require('redbox-react').default

        ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
      }

      render = () => {
        try {
          renderApp()
        } catch (e) {
          console.error(e)
          renderError(e)
        }
      }

      // Setup hot module replacement
      module.hot.accept([
        './components/App',
        './routes/index',
      ], () =>
          setImmediate(() => {
            ReactDOM.unmountComponentAtNode(MOUNT_NODE)
            render()
          })
      )
    }
  }

// Let's Go!
// ------------------------------------
  if (!__TEST__) render()
}

init()
