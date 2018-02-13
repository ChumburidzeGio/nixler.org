export const actionTypes = {
    SHOW_SNACK: 'RRS_SHOW_SNACK',
    HIDE_SNACK: 'RRS_HIDE_SNACK',
}

const initialState = {
    queue: [],
    lastItemId: 0
}

export default (state = initialState, { type, payload } = {}) => {
    let queue;
    switch (type) {
        case actionTypes.SHOW_SNACK:
            queue = state.queue.slice()
            queue.push({ label: payload.label, duration: payload.duration, id: payload.id || initialState.lastItemId++ })
            return { queue }
        case actionTypes.HIDE_SNACK:
            queue = state.queue.filter(obj => obj.id !== payload.id)
            return { queue }
        default:
            return state;
    }
}