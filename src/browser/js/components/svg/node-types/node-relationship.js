import { h } from 'preact'

export default function NodeRelationship({color}) {
    return (
        <svg width='100' height='50'>
            <polygon points='50,1 99,25 50,49 1,25' style={{fill: color || 'white', stroke: 'black', strokeWidth: '1px'}} />
        </svg>
    )
}