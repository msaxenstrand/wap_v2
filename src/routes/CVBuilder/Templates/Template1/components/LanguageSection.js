import React from 'react'

import {
  Row,
  Col,
  Progress,
} from 'reactstrap'

export default class LanguageSection extends React.Component {
  constructor (props) {
    super(props)
  }

  componentWillReceiveProps (newProps) {

  }

  render () {
    let { languages } = this.props
    return (
      <section id='languages' className='cvSection row'>
        <Col xs={12}>
          <h5 className='sectionTitle'>Språk</h5>
        </Col>
        {languages && languages.map((language) => {
          return <CVLanguageItem key={language.id} language={language} />
        })}
      </section>
    )
  }
}

class CVLanguageItem extends React.Component {
  render () {
    let { language } = this.props
    return (
      <Col key={language.id} xs={6} className='progressItem'>
        <h6 className='progressName'>{language.name}</h6>
        <Col xs={12} className='progressProgressWrapper pl-0'>
          <Progress
            min={1}
            max={5}
            value={language.spoken === 1 ? 1.25 : language.spoken}
            color='#ff0000' />
        </Col>
      </Col>
    )
  }
}
