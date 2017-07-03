import { h, Component } from 'preact'
import { bind } from 'decko'
import { connect } from 'preact-redux'

import NodePicker from './node-picker'
import Node from './svg/node'
import Connection from './svg/connection'

import { ACTION } from '../redux/actions'
import { IconTrash } from './svg/icon-trash'

import NODE_COLORS from './../constants/node-colors'

@connect(
    state => ({ nodes: state.nodes, connections: state.connections })
)
class AppCanvas extends Component {
    componentWillMount() {
        this.updateCanvasDimensions()
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateCanvasDimensions)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateCanvasDimensions)
    }

    @bind
    updateCanvasDimensions() {
        this.setState({
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerHeight
        })
    }

    @bind
    drawConnectionStart(sourceNode) {
        let nodeId = sourceNode.nodeId
        let x = sourceNode.x + sourceNode.width / 2
        let y = sourceNode.y + sourceNode.height / 2

        this.setState({ temporaryConnection: {source: {nodeId, x, y}} })

        this.props.dispatch({type: ACTION.NODE_ADD_COLOR, value: {nodeId: sourceNode.nodeId, color: NODE_COLORS.GREEN}})
    }

    @bind
    drawConnection(mouseDestination) {
        let line = {}
        line.x1 = this.state.temporaryConnection.source.x
        line.y1 = this.state.temporaryConnection.source.y

        if (this.state.temporaryConnection.destination) {
            line.x2 = this.state.temporaryConnection.destination.x
            line.y2 = this.state.temporaryConnection.destination.y
        } else {
            line.x2 = mouseDestination.clientX
            line.y2 = mouseDestination.clientY
        }

        this.setState({temporaryConnectionLine: line})
    }

    @bind
    addConnectionDestination(destinationNode) {
        if (this.state.temporaryConnection.source && this.state.temporaryConnection.source.nodeId !== destinationNode.nodeId) {
            let nodeId = destinationNode.nodeId
            let x = destinationNode.x + destinationNode.width / 2
            let y = destinationNode.y + destinationNode.height / 2

            this.setState({ temporaryConnection: {
                source: this.state.temporaryConnection.source,
                destination: {nodeId, x, y}
            }})

            // set color to destination
            this.props.dispatch({type: ACTION.NODE_ADD_COLOR, value: {nodeId: destinationNode.nodeId, color: NODE_COLORS.GREEN}})
        }
    }

    @bind
    removeConnectionDestination(destinationNode) {
        if (!!this.state.temporaryConnection.destination && this.state.temporaryConnection.destination.nodeId === destinationNode.nodeId) {
            this.setState({ temporaryConnection: {
                source: this.state.temporaryConnection.source,
                destination: null
            }})

            // remove color from node
            this.props.dispatch({type: ACTION.NODE_ADD_COLOR, value: {nodeId: destinationNode.nodeId, color: null}})
        }
    }

    @bind
    drawConnectionEnd() {
        // reset colors
        this.props.dispatch({type: ACTION.NODE_REMOVE_COLOR})

        if (!this.state.temporaryConnection.source || !this.state.temporaryConnection.destination) {
            this.setState({temporaryConnection: null, temporaryConnectionLine: null})
            return
        }

        let connection = {
            sourceNodeId: this.state.temporaryConnection.source.nodeId,
            destinationNodeId: this.state.temporaryConnection.destination.nodeId,
            x1: this.state.temporaryConnection.source.x,
            y1: this.state.temporaryConnection.source.y,
            x2: this.state.temporaryConnection.destination.x,
            y2: this.state.temporaryConnection.destination.y
        }

        this.props.dispatch({
            type: ACTION.ADD_CONNECTION,
            value: {...connection}
        })

        this.setState({temporaryConnection: null, temporaryConnectionLine: null})
    }

    render(props) {
        return (
            <div>
                <svg id='svg' width={this.state.canvasWidth} height={this.state.canvasHeight} onDragOver={event => event.preventDefault()} xmlns='http://www.w3.org/2000/svg'
                    style='position: absolute'>
                    <defs id='svg-defs' />

                    <g>{ props.connections.map(connection => <Connection {...connection} />) }</g>

                    <g>
                        {
                            this.state.temporaryConnectionLine && <Connection {...this.state.temporaryConnectionLine} />
                        }
                    </g>
                </svg>

                <div style='position: absolute; width:100vw; height: 100vh'>
                    {
                        props.nodes.map(value => (
                            <Node key={value.nodeId} {...value}
                                onDrawConnectionStart={this.drawConnectionStart}
                                onDrawConnectionMove={this.drawConnection}
                                onDrawConnectionEnd={this.drawConnectionEnd}
                                onNodeEnter={this.addConnectionDestination}
                                onNodeLeave={this.removeConnectionDestination}
                            />
                        ))
                    }
                </div>

                <NodePicker />

                <div class='controls'>
                    <IconTrash onClick={() => props.dispatch({type: ACTION.REMOVE_ALL_NODE})} />
                </div>
            </div>
        )
    }
}

export default AppCanvas
