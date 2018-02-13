import { actionTypes } from './resourceReducer';
import client from '../client';

/**
 * To load resources:
 *
 * dispatch(loadResources());
 *
 * @returns {Object}
 */
export function loadResources() {
    return function(dispatch) {
        return client.get('/resources.fieldify/data').then(resources => {
            dispatch(loadResourcesSuccess(resources))
        }).catch(error => {
            throw(error)
        })
    }
}

/**
 * To save loaded resources:
 *
 * dispatch(loadResourcesSuccess(resources));
 *
 * @param {Object} resources
 * @returns {Object}
 */
export const loadResourcesSuccess = (resources) => {
    return {
        type: actionTypes.LOAD_RESOURCES_SUCCESS,
        payload: {resources},
    }
}

/**
 * To remove a snack:
 *
 * dispatch(selectProductType(12));
 *
 * @param {Object} item
 * @returns {Object}
 */
export const selectProductType = (item) => {
    return {
        type: actionTypes.SELECT_PRODUCT_TYPE,
        payload: {item},
    };
}