export const actionTypes = {
    LOAD_RESOURCES_SUCCESS: 'RRS_LOAD_RESOURCES_SUCCESS',
    SELECT_PRODUCT_TYPE: 'RRS_SELECT_PRODUCT_TYPE'
}

const initialState = {
    items: [],
    selected: null
}

export default (state = initialState, { type, payload } = {}) => {
    let items, selected;
    switch (type) {
        case actionTypes.LOAD_RESOURCES_SUCCESS:
            items = payload.resources.data
            if(state.selected) {
                selected = items.filter(obj => obj.id === state.selected.id)[0]
            }
            return { selected, items }
        case actionTypes.SELECT_PRODUCT_TYPE:
            selected = payload.item
            return { ...state, selected }
        default:
            return state;
    }
}