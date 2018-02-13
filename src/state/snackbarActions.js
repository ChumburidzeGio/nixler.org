import { actionTypes } from './snackbarReducer';

/**
 * To display a snack:
 *
 * dispatch(showSnack('Yay, there is a new version. Please reload the page to update', 1200));
 *
 * @param {String} label
 * @param {Int} duration
 * @returns {Object}
 */
export const showSnack = (label, duration, id) => {
    return {
        type: actionTypes.SHOW_SNACK,
        payload: {label, duration, id},
    };
}

/**
 * To remove a snack:
 *
 * dispatch(hideSnack(12));
 *
 * @param {String} label
 * @returns {Object}
 */
export const hideSnack = (id) => {
    return {
        type: actionTypes.HIDE_SNACK,
        payload: {id},
    };
}