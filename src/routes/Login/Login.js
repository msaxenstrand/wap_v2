import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { login, socialLogin } from '../../store/actions/auth'
import { getProfile } from '../../store/actions/profile'
import { getAllEmployments } from '../../store/actions/employments'
import { getAllEducations } from '../../store/actions/educations'
import { getAllOccupations, getMyOccupations } from '../../store/actions/occupations'
import { getAllSkills, getMySkills } from '../../store/actions/skills'
import { getAllLanguages, getMyLanguages } from '../../store/actions/languages'
import { getAllMotivations, getMyMotivations } from '../../store/actions/motivations'
import { getAllPersonalities, getMyPersonalities } from '../../store/actions/personalities'
import { getVideoInfo } from '../../store/actions/wapfilm'
import { getAllLicenses, getMyLicenses } from '../../store/actions/drivinglicenses'
import ThreeDButton from '../../components/buttons/ThreeDButton'
import './Login.scss'
import $ from 'jquery'
import graph from 'fb-react-sdk'
import URLSearchParams from 'url-search-params'

import {
  Card,
  CardBlock,
  CardTitle,
  CardSubtitle,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Alert
} from 'reactstrap'
import Loader from '../../components/Misc/Loader/Loader'

let auth2
let redirect = null
let provider = null

class Login extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loadsave: false,
      linkedIn: false
    }

    this._handleLogin = this._handleLogin.bind(this)
    this.finalize = this.finalize.bind(this)
    this.loginLinkedIn = this.loginLinkedIn.bind(this)
    this.getLinkedInData = this.getLinkedInData.bind(this)
    this.setUpProfileFromLinkedIn = this.setUpProfileFromLinkedIn.bind(this)
    this.loadFB = this.loadFB.bind(this)
    this.loginFB = this.loginFB.bind(this)
    this.loadGoogle = this.loadGoogle.bind(this)
    this.auth = this.auth.bind(this)
    this.signInCallback = this.signInCallback.bind(this)
  }

  componentDidMount () {
    $.getScript('https://apis.google.com/js/client:platform.js', this.loadGoogle)

    let liRoot = document.createElement('div')
    liRoot.id = 'linkedin-root'

    document.body.appendChild(liRoot);

    (function (d, s, id) {
      const element = d.getElementsByTagName(s)[0]
      const ljs = element
      let js = element
      if (d.getElementById(id)) {
        return
      }
      js = d.createElement(s)
      js.id = id
      js.src = '//platform.linkedin.com/in.js'
      js.type = 'text/javascript'
      js.text = 'api_key: 86fnbibk2t9g4m'
      ljs.parentNode.insertBefore(js, ljs)
    }(document, 'script', 'linkedin-sdk'))

    let { dispatch } = this.props

    provider = this.props.route.path === '/login/linkedin' ? 'linkedin-oauth2' : 'facebook'

    let mRedirectUri
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      // dev code
      mRedirectUri = 'http://localhost:3000' + this.props.route.path
    } else {
      // production code
      mRedirectUri = 'https://wapcard.se' + this.props.route.path
    }

    let urlParams = new URLSearchParams(window.location.search)
    let authCode = urlParams.getAll('code')[0]
    if (authCode) {
      if (authCode.length > 10) {
        let loginData = { 'provider': provider, 'code': authCode, 'redirect_uri': mRedirectUri }
        dispatch(socialLogin(loginData)).then(() => {
          if (provider === 'linkedin-oauth2') {
            dispatch(getProfile()).then((result) => {
              console.log(result)
              if (result.tos_accepted) {
                this.finalize()
              } else {
                this.setState({
                  linkedIn: true
                })
              }
            })
          } else {
            this.finalize()
          }
        })
      }
    }
  }

  getLinkedInData () {
    let _self = this
    IN.User.authorize(function () {
      IN.API.Profile('me').fields(
        [
          'firstName', 'lastName', 'formatted-name', 'specialties', 'headline', 'summary', 'positions:(company,title,summary,startDate,endDate,isCurrent)', 'industry',
          'location:(name,country:(code))', 'pictureUrl', 'publicProfileUrl', 'emailAddress',
          'educations', 'dateOfBirth'
        ]
      ).result(function (profiles) {
        _self.setUpProfileFromLinkedIn(profiles.values[0])
      })
    })
  }

  setUpProfileFromLinkedIn (p) {
    console.log(p)
    let mProfile = {
      first_name: p.firstName,
      last_name: p.lastName,
      title: p.headline,
    }
  }

  loginLinkedIn () {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      // dev code
      window.location.assign('https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86fnbibk2t9g4m&redirect_uri=http%3A%2F%2Flocalhost:3000%2Flogin%2Flinkedin&state=987654321&scope=r_emailaddress,r_basicprofile')
    } else {
      // production code
      window.location.assign('https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86fnbibk2t9g4m&redirect_uri=https%3A%2F%2Fwapcard.se%2Flogin%2Flinkedin&state=987654321&scope=r_emailaddress,r_basicprofile')
    }
  }

  _handleLogin (e) {
    e.preventDefault()

    this.setState({
      loadsave: true
    })

    let { dispatch } = this.props
    let email = ReactDOM.findDOMNode(this.email)
    let password = ReactDOM.findDOMNode(this.password)

    let creds = {
      username: email.value,
      password: password.value
    }

    dispatch(login(creds))
      .then((result) => {
        this.finalize()
      })
      .catch((error) => {
        this.setState({
          loadsave: false,
          loginError: true
        })
      })
  }

  loadFB () {
    window.fbAsyncInit = function () {
      FB.init({
        appId      : '1021816071285498',
        xfbml      : true,
        version    : 'v2.9'
      })
      FB.AppEvents.logPageView()
    };

    (function (d, s, id) {
      let js, fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) { return }
      js = d.createElement(s); js.id = id
      js.src = '//connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    }(document, 'script', 'facebook-jssdk'))
  }

  loginFB () {
    let mRedirectUri
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      // dev code
      mRedirectUri = 'http://localhost:3000/login/facebook'
    } else {
      // production code
      mRedirectUri = 'https://wapcard.se/login/facebook'
    }

    graph.setVersion('2.9')
    //
    let authUrl = graph.getOauthUrl({
      'client_id':     '1021816071285498',
      'redirect_uri':  mRedirectUri,
      'scope':         'email'
    })

    window.location.assign(authUrl)
  }

  loadGoogle () {
    console.log('loadGoogle')
    gapi.load('auth2', function () {
      gapi.auth2.init({
        client_id: '369307759639-bn22hfm88ttjg2letf87c21jkmvapldd.apps.googleusercontent.com',
        // Scopes to request in addition to 'profile' and 'email'
        // scope: 'openid'
      })
    })
    console.log(gapi)
  }

  signInCallback (authResult) {
    let { dispatch } = this.props

    console.log('signInCallback')

    if (authResult['code']) {
      let loginData = { 'provider': 'google-oauth2', 'code': authResult['code'], 'redirect_uri': 'postmessage' }
      dispatch(socialLogin(loginData)).then(() => {
        this.finalize()
      })
    }
  }

  auth () {
    console.log('auth')
    gapi.auth2.getAuthInstance().grantOfflineAccess().then(this.signInCallback)
  }

  finalize () {
    let { dispatch } = this.props
    this.props.auth.token && dispatch(getProfile(this.props.auth.token)).then((result) => {
      if (result.tos_accepted) {
        let redirect = this.props.routing.locationBeforeTransitions ? this.props.routing.locationBeforeTransitions.query.redirect : null
        Promise.all([
          dispatch(getAllEmployments()),
          dispatch(getAllEducations()),
          dispatch(getAllOccupations()),
          dispatch(getMyOccupations()),
          dispatch(getAllSkills()),
          dispatch(getMySkills()),
          dispatch(getAllLanguages()),
          dispatch(getMyLanguages()),
          dispatch(getAllMotivations()),
          dispatch(getMyMotivations()),
          dispatch(getAllPersonalities()),
          dispatch(getMyPersonalities()),
          dispatch(getVideoInfo()),
          dispatch(getAllLicenses()),
          dispatch(getMyLicenses()),
        ]).then(() => {
          console.log('redirect')
          this.props.router.push(redirect || '/')
        }).catch((error) => {
          console.log(error)
          this.setState({
            loadsave: false
          })
        })
      } else {
        this.props.router.push('/signup')
      }
    })
  }

  render () {
    return (
      <Col xs={12} className='h-100'>
        <Row className='justify-content-center align-items-center h-100'>
          <Container>
            <Row className='justify-content-center align-items-center'>
              <Col xs={12} sm={8} md={6}>
                <img src='/img/wap_logga.png' className='img-fluid mx-auto d-block' />
              </Col>
              {!this.state.linkedIn &&
              <Col xs={10}>
                <Row className='social justify-content-center align-items-center my-5'>
                  <i className='fa fa-facebook' id='facebook-btn' onClick={() => this.loginFB()} />
                  <i className='fa fa-linkedin mx-4' id='linkedin-btn' onClick={() => this.loginLinkedIn()} />
                  <i className='fa fa-google' id='google-btn' onClick={() => this.auth()} />
                </Row>
              </Col>
              }
              {!this.state.linkedIn &&
              <Col xs={8}>
                {this.state.loginError &&
                <Alert color='danger'>
                  <strong>Ajdå!</strong> Det gick inte att logga in med den här användarnamnet och lösenordet.
                  Kontrollera dina uppgifter och försök igen!
                </Alert>
                }
                <Form className='w-100 loginForm' onSubmit={(e) => this._handleLogin(e)}>
                  <FormGroup>
                    <Label for='email'>Email</Label>
                    <Input type='email' name='email' id='email' placeholder='E-post'
                      ref={(input) => { this.email = input }} required />
                  </FormGroup>
                  <FormGroup>
                    <Label for='password'>Password</Label>
                    <Input type='password' name='password' id='password' placeholder='Lösenord'
                      ref={(input) => { this.password = input }} required minLength='8' />
                  </FormGroup>
                  <ThreeDButton type='submit' className='w-100' loading={this.state.loadsave}>Logga in</ThreeDButton>
                </Form>
              </Col>
              }
              {this.state.linkedIn &&
              <Col xs={12} className='mt-5'>
                <Card>
                  <CardBlock>
                    <CardTitle>Du loggade in med LinkedIn</CardTitle>
                    <CardSubtitle>Vill du hämta data (jobb, profil mm) från din profil?</CardSubtitle>
                    <ThreeDButton onClick={() => this.getLinkedInData()}>Hämta data</ThreeDButton>
                    <a href='#' style={{ marginLeft: 10 }} onClick={() => this.finalize()}> Nej tack, jag vill fylla i mina uppgifter själv</a>
                  </CardBlock>

                </Card>
              </Col>
              }
            </Row>
          </Container>
        </Row>
      </Col>
    )
  }
}

export default withRouter(connect((state) => state)(Login))
