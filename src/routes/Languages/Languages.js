import React from 'react'
import { connect } from 'react-redux'
import LanguageForm from './LanguageForm/LanguageForm'
import LanguageItem from './LanguageItem/LanguageItem'
import { getAllLanguages, getMyLanguages, saveLanguagesToServer } from '../../store/actions/languages'
import update from 'react-addons-update'
import Masonry from 'react-masonry-component'
import './Languages.scss'
import SpeechBubble from '../../components/Helpers/SpeechBubble/SpeechBubble'

import {
  Container,
  Col,
} from 'reactstrap'

class Languages extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      userLanguages: this.props.languages.userLanguages ? this.props.languages.userLanguages : [],
      changes: false
    }

    let { dispatch } = this.props
    Promise.all([
      dispatch(getAllLanguages()),
      dispatch(getMyLanguages()),
    ]).then(() => {
      console.log('got it all')
    }).catch((error) => {
      console.log(error)
    })

    this.onLanguageChange = this.onLanguageChange.bind(this)
    this.onAdd = this.onAdd.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this._saveToServer = this._saveToServer.bind(this)
    this.layout = this.layout.bind(this)
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.state.userLanguages !== nextState.userLanguages) {
      this.setState({ changes: true })
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.userLanguages !== prevState.userLanguages) {
      this._saveToServer()
    }
  }

  onLanguageChange (language) {
    let _self = this
    let index = this.state.userLanguages.findIndex(languages => languages.id === language.id)
    if (index === -1) return false

    this.setState({
      userLanguages: update(this.state.userLanguages, { [index]: { spoken: { $set: language.spoken }, written: { $set: language.written } } })
    })
  }

  onAdd (item) {
    let mLanguage = Object.assign({}, item, { spoken: item.spoken ? item.spoken : 1, written: item.written ? item.written : 1, new: true })
    this.setState({
      userLanguages: update(this.state.userLanguages, { $push: [mLanguage] })
    })
  }

  onRemove (id) {
    let index = this.state.userLanguages.findIndex(languages => languages.id === id)
    if (index === -1) return false
    const items = Object.assign([], this.state.userLanguages)
    items.splice(index, 1)

    this.setState({ userLanguages : items })
  }

  _saveToServer () {
    let { dispatch } = this.props
    dispatch(saveLanguagesToServer(this.state.userLanguages)).then(() => {
      this.setState({ changes: false })
    })
  }

  layout () {
    this.masonry.layout()
  }

  render () {
    let { translate } = this.props
    let { userLanguages } = this.props.languages
    let notEmpty = userLanguages && userLanguages.length > 0

    return (
      <Container fluid>
        <SpeechBubble hideable>
          {translate('languages.help_text')}
        </SpeechBubble>
        <Masonry
          onClick={this.handleClick}
          className='row'
          ref={function (c) {
            this.masonry = this.masonry || c.masonry
          }.bind(this)}
        >
          {this.state.userLanguages && this.state.userLanguages.map((language) => {
            return <LanguageItem key={language.id} language={language} onChange={this.onLanguageChange} onRemove={this.onRemove} layout={this.layout} />
          })}
          <Col xs={12} sm={6} md={4} xl={3}>
            <LanguageForm notEmpty={notEmpty} onAdd={this.onAdd} userLanguages={this.state.userLanguages} layout={this.layout} />
          </Col>
        </Masonry>
      </Container>
    )
  }
}

export default connect((state) => state)(Languages)
