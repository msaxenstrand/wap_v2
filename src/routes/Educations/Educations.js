import React from 'react'
import { connect } from 'react-redux'
import EducationItem from './EducationItem/EducationItem'
import EducationForm from './EducationForm/EducationForm'
import { getAllEducations, createEducation, updateEducation, removeEducation } from '../../store/actions/educations'
import Masonry from 'react-masonry-component'
import SpeechBubble from '../../components/Helpers/SpeechBubble/SpeechBubble'

import {
  Container,
  Row,
  Col
} from 'reactstrap'

class Educations extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      educations: Object.assign([], this.props.educations.educations)
    }

    let { dispatch } = this.props
    dispatch(getAllEducations())

    this.layout = this.layout.bind(this)
    this.updateEducation = this.updateEducation.bind(this)
    this.removeEducation = this.removeEducation.bind(this)
  }

  addEducation (education) {
    let { dispatch } = this.props
    dispatch(createEducation(education)).then(() => {
      dispatch(getAllEducations())
      document.getElementById('educationForm').reset()
    }).catch((error) => {
      alert(error)
    })
  }

  updateEducation (education) {
    let { dispatch } = this.props
    dispatch(updateEducation(education))
      .then(() => {
        dispatch(getAllEducations())
        // document.getElementById('educationForm').reset()
      }).catch((error) => {
        alert(error)
      })
  }

  removeEducation (e, education) {
    console.log(e.target)
    let { dispatch } = this.props
    // this.masonry.remove($(e.target).closest('.timeline-item')).masonry('layout')
    dispatch(removeEducation(education))
  }

  layout () {
    this.masonry.layout()
  }

  render () {
    let { educations } = this.props.educations
    let mEducations = Object.assign([], educations).reverse()
    let publicCount = _.filter(mEducations, { 'public': true }).length

    return (
      <Container fluid>
        <Row className='flex-lg-row-reverse'>
          <Col>
            <SpeechBubble hideable pos='side'>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer egestas arcu eu ipsum dictum interdum.
                Ut rhoncus enim ante, vitae dictum lacus dignissim id. Curabitur malesuada urna quis dui placerat volutpat.
                Nulla non accumsan ante. Morbi ut mauris congue, aliquet libero eget, tincidunt purus. </p>
              <p>Aliquam volutpat dignissim volutpat. Fusce id nulla justo. Sed cursus mollis magna sed egestas.
                Aenean ac felis ipsum. Praesent sodales pulvinar velit, eu luctus libero posuere nec.</p>
            </SpeechBubble>
          </Col>
          <Col xs='12' sm='12' md='12' xl={9}>
            <div className='timeline'>
              <Masonry
                onClick={this.handleClick}
                className='row'
                ref={function (c) {
                  this.masonry = this.masonry || c.masonry
                }.bind(this)}
              >
                <EducationForm layout={this.layout} collapse={educations && educations.length === 0} translate={this.props.translate} />
                {mEducations && mEducations.map((education) => {
                  return <EducationItem key={education.id} education={education} layout={this.layout} publicCount={publicCount}
                    onChange={this.updateEducation} onRemove={this.removeEducation} />
                })}
              </Masonry>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default connect((state) => state)(Educations)
