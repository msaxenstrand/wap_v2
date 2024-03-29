import React from 'react'

import {
  Row,
  Col,
} from 'reactstrap'

export default class DrivingLicenseSection extends React.Component {

  render () {
    let { drivinglicenses } = this.props
    return (
      <section className='cvSection' id='drivinglicenses'>
        <Row>
          <Col className='titleWrapper'>
            <h4 className='sectionTitle'>Körkort</h4>
          </Col>
          <Col className='line' />
        </Row>
        <Row className='mb-5'>
          {drivinglicenses && drivinglicenses.map((drivinglicense) => {
            return <CVDrivinglicenseItem key={drivinglicense.id} drivinglicense={drivinglicense} />
          })}
        </Row>
      </section>
    )
  }
}

class CVDrivinglicenseItem extends React.Component {
  render () {
    let { drivinglicense } = this.props

    return (
      <Col key={drivinglicense.id} xs={2} className='licenseItem mb-2'>
        <div
          className={'licenseicon-korkort-' + drivinglicense.name.replace(' ', '-').replace(' ', '-').replace('å', 'a').toLowerCase() + ' licenseIcon'} />
        <h6 className='licenseName text-center' style={{ display: 'block' }}>{drivinglicense.name}</h6>
      </Col>
    )
  }
}
