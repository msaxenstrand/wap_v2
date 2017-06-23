import React from 'react'
import { connect } from 'react-redux'
import { getAllMotivations, getMyMotivations, saveMotivationsToServer } from '../../store/actions/motivations'
import MotivationForm from './MotivationForm/MotivationForm'
import { SortableContainer, SortableElement, arrayMove, SortableHandle } from 'react-sortable-hoc'
import './Motivations.scss'
import Masonry from 'react-masonry-component'

import {
  Container,
  Row,
  Col,
  Card,
  CardBlock
} from 'reactstrap'
import ThreeDButton from '../../components/buttons/ThreeDButton'

const DragHandle = SortableHandle(() => <i className='fa fa-bars dragHandle' />)

const SortableList = SortableContainer(({ items, onRemove }) => {
  return (
    <Masonry
      onClick={this.handleClick}
      className='row sortableList'
      ref={function (c) {
        this.masonry = this.masonry || c.masonry
      }.bind(this)}
    >
      {items.map((item, index) => {
          return <SortableItem key={`item-${index}`} mIndex={index} index={index} id={item.id} value={index + 1 + '. ' + item.name} onRemove={onRemove} />
        }
      )}
    </Masonry>
  )
})

const SortableItem = SortableElement(({ value, index, onRemove, id, mIndex }) => {
  return (
    <Col xs={12} sm={6} md={4} xl={3}>
      <Card>
        <CardBlock>
          <DragHandle />
          {value}
          <i className='fa fa-trash trashcan' onClick={() => onRemove(mIndex)} />
        </CardBlock>
      </Card>
    </Col>
  )
})

class Motivations extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      items: this.props.motivations.userMotivations ? this.props.motivations.userMotivations : [],
      changes: false
    }

    let { dispatch } = this.props
    Promise.all([
      dispatch(getAllMotivations()),
      dispatch(getMyMotivations()),
    ]).then(() => {
      console.log('got it all')
    }).catch((error) => {
      console.log(error)
    })

    this.onSortEnd = this.onSortEnd.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this.onAdd = this.onAdd.bind(this)
    this._saveToServer = this._saveToServer.bind(this)
    this._revertChanges = this._revertChanges.bind(this)
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    })
  }

  onRemove = (index) => {
    const items = Object.assign([], this.state.items)
    items.splice(index, 1)

    this.setState({ items : items })
  }

  onAdd (item) {
    this.setState({ items: this.state.items.concat([item]) })
  }

  _saveToServer () {
    let { dispatch } = this.props
    dispatch(saveMotivationsToServer(this.state.items)).then(() => {
      this.setState({ changes: false })
    })
  }

  _revertChanges () {
    this.setState({
      items: this.props.motivations.userMotivations ? this.props.motivations.userMotivations : [],
      changes: false
    })
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.state.items !== nextState.items) {
      this.setState({ changes: true })
    }
  }

  render () {
    let { userMotivations } = this.props.motivations
    let notEmpty = userMotivations && userMotivations.length > 0

    return (
      <Container fluid>
        <Row>
          <Col xs={12} sm={12} md={6} xl={5}>
            <MotivationForm onAdd={this.onAdd} notEmpty={notEmpty} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <div className='sortableWrapper'>
              {userMotivations &&
              <SortableList
                helperClass='moving'
                axis='xy'
                pressDelay={200}
                items={this.state.items}
                onSortStart={this.onSortStart}
                onSortEnd={this.onSortEnd}
                onRemove={this.onRemove}
              />}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            {this.state.changes && <ThreeDButton small onClick={() => this._saveToServer()}>Spara</ThreeDButton>}
            {this.state.changes && <ThreeDButton small className='cancel-btn' onClick={() => this._revertChanges()}>Ångra</ThreeDButton>}
          </Col>
        </Row>
      </Container>
    )
  }
}

export default connect((state) => state)(Motivations)