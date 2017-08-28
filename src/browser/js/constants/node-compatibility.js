import NODE_TYPE from './node-type'

let { ENTITY, WEAK_ENTITY, ATTRIBUTE, RELATIONSHIP, ASSOCIATIVE_ENTITY, INHERITANCE } = NODE_TYPE

const NODE_COMPATIBILITY = {
    [ENTITY]: [ATTRIBUTE, RELATIONSHIP, ASSOCIATIVE_ENTITY, INHERITANCE],
    [WEAK_ENTITY]: [ATTRIBUTE, RELATIONSHIP, ASSOCIATIVE_ENTITY, INHERITANCE],
    [ATTRIBUTE]: [ENTITY, WEAK_ENTITY, RELATIONSHIP, ASSOCIATIVE_ENTITY],
    [RELATIONSHIP]: [ENTITY, WEAK_ENTITY, ATTRIBUTE, ASSOCIATIVE_ENTITY],
    [ASSOCIATIVE_ENTITY]: [ENTITY, WEAK_ENTITY, ATTRIBUTE, RELATIONSHIP, ASSOCIATIVE_ENTITY],
    [INHERITANCE]: [ENTITY, WEAK_ENTITY]
}

export default NODE_COMPATIBILITY