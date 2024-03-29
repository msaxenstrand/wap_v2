import React from 'react'
import '../Templates.scss'
import './Template1.scss'
import $ from 'jquery'
import {
  Container,
} from 'reactstrap'

import EmploymentSection from './components/EmploymentSection'
import EducationSection from './components/EducationSection'
import SkillSection from './components/SkillSection'
import LanguageSection from './components/LanguageSection'
import HeaderSection from './components/HeaderSection'
import DrivingLicenseSection from './components/DrivingLicenseSection'
import ResumeSection from './components/ResumeSection'
import ReferenceSection from './components/ReferenceSection'

class Template1 extends React.Component {
  constructor (props) {
    super(props)

    this.alignSections = this.alignSections.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {
    let _self = this

    this.alignSections($('.A4'))
  }

  componentDidMount () {
    this.alignSections($('.A4'))
  }

  alignSections (elem) {
    console.log(elem.innerHeight())
    let long = elem[0].scrollHeight - Math.ceil(elem.innerHeight())
    let children = elem.find('.main section').toArray()
    let removed = []
    while (long > 0 && children.length > 0) {
      let child = children.pop() // Remove last child
      $(child).detach() // ???
      removed.unshift(child)
      long = elem[0].scrollHeight - Math.ceil(elem.innerHeight())
    }

    elem.append(removed[0])
    let removedOverflow = []
    let overflowChildren = $(removed[0]).children().toArray()
    long = elem[0].scrollHeight - Math.ceil(elem.innerHeight())

    while (long > 0 && overflowChildren.length > 0) {
      let child = overflowChildren.pop() // Remove last child
      console.log(child)
      $(child).detach() // ???
      removedOverflow.unshift(child)
      if (overflowChildren.length === 1) {
        let child = overflowChildren.pop() // Remove last child
        $(child).detach() // ???
        removedOverflow.unshift(child)
      }
      long = elem[0].scrollHeight - Math.ceil(elem.innerHeight())
    }

    if (removedOverflow.length > 0) {
      let tobeCloned = removed.shift()
      let clone = $(tobeCloned).clone()
      let contTitle = '...fortsättning ' + $(clone[0]).find('.sectionTitle').text()
      let shouldBeContinue = $(clone[0]).find('.sectionTitle').text()
      console.log(shouldBeContinue)
      clone.empty()
      shouldBeContinue && clone.append('<div class="col-12"><small class="fg-gray text-left"><em>' + contTitle + '</em></small></dla>')
      clone.append(removedOverflow)
      removed.unshift(clone[0])
    }
    if (removed.length > 0) {
      let a4 = $('<div class="A4 templateWrapper container-fluid template1"><div class="h-100 main py-5 px-5"></div></div>')

      a4.find('.main').append(removed)
      elem.after(a4)
      this.alignSections(a4)
    }
  }

  render () {
    return (
      <div id='cvWrapper'>
        <div id='hiddenCV'>
          <Container fluid className='templateWrapper A4 template1'>
            <div className='h-100 main py-5 px-5'>
              <HeaderSection profile={this.props.profile} />
              {this.props.resume && <ResumeSection profile={this.props.profile} />}
              {this.props.employments.length > 0 && <EmploymentSection employments={this.props.employments} />}
              {this.props.skills.length > 0 && <SkillSection skills={this.props.skills} />}
              {this.props.educations.length > 0 && <EducationSection educations={this.props.educations} />}
              {this.props.languages.length > 0 && <LanguageSection languages={this.props.languages} />}
              {this.props.drivinglicenses.length > 0 && <DrivingLicenseSection drivinglicenses={this.props.drivinglicenses} />}
              {this.props.references.length > 0 && <ReferenceSection references={this.props.references} />}
            </div>
          </Container>
        </div>
      </div>
    )
  }
}

export default Template1
