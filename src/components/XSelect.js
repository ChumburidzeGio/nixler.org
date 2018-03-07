/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import ArrowDropDownIcon from 'material-ui-icons/ArrowDropDown';
import ArrowDropUpIcon from 'material-ui-icons/ArrowDropUp';
import ClearIcon from 'material-ui-icons/Clear';
import Chip from 'material-ui/Chip';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { FormControl } from 'material-ui/Form';

const ITEM_HEIGHT = 48;

const styles = theme => ({
    chip: {
        margin: theme.spacing.unit / 4,
    },
    root: {
        flexGrow: 1,
        marginTop: '15px',
    },
    // We had to use a lot of global selectors in order to style react-select.
    // We are waiting on https://github.com/JedWatson/react-select/issues/1679
    // to provide a better implementation.
    // Also, we had to reset the default style injected by the library.
    '@global': {
        '.Select-control': {
            display: 'flex',
            alignItems: 'center',
            border: 0,
            height: 'auto',
            background: 'transparent',
            '&:hover': {
                boxShadow: 'none',
            },
        },
        '.Select-multi-value-wrapper': {
            flexGrow: 1,
            display: 'flex',
            flexWrap: 'wrap',
        },
        '.Select--multi .Select-input': {
            margin: 0,
        },
        '.Select.has-value.is-clearable.Select--single > .Select-control .Select-value': {
            padding: 0,
        },
        '.Select-noresults': {
            padding: theme.spacing.unit * 2,
        },
        '.Select-input': {
            display: 'inline-flex !important',
            padding: 0,
            height: 'auto',
        },
        '.Select-input input': {
            background: 'transparent',
            border: 0,
            padding: 0,
            cursor: 'default',
            display: 'inline-block',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            margin: 0,
            outline: 0,
        },
        '.Select-placeholder, .Select--single .Select-value': {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.pxToRem(16),
            padding: 0,
            color: 'black!important',
        },
        '.Select-placeholder': {
            opacity: 0.42,
            color: theme.palette.common.black,
        },
        '.Select-menu-outer': {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[2],
            position: 'absolute',
            left: 0,
            top: `calc(100% + ${theme.spacing.unit}px)`,
            width: '100%',
            zIndex: 2,
            maxHeight: ITEM_HEIGHT * 4.5,
        },
        '.Select.is-focused:not(.is-open) > .Select-control': {
            boxShadow: 'none',
        },
        '.Select-menu': {
            maxHeight: ITEM_HEIGHT * 4.5,
            overflowY: 'auto',
        },
        '.Select-menu div': {
            boxSizing: 'content-box',
        },
        '.Select-arrow-zone, .Select-clear-zone': {
            color: theme.palette.action.active,
            cursor: 'pointer',
            height: 21,
            width: 21,
            zIndex: 1,
        },
        // Only for screen readers. We can't use display none.
        '.Select-aria-only': {
            position: 'absolute',
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
            height: 1,
            width: 1,
            margin: -1,
        },
        '.Select.Select--multi.has-value': {
            height: '2.2rem'
        },
    },
});


class Option extends React.Component {
    render() {
        const { children, isFocused, isSelected, onFocus, option, onSelect } = this.props
        return (
            <MenuItem
                onFocus={onFocus}
                selected={isFocused}
                onClick={(event) => onSelect(option, event)}
                component="div"
                style={{
                    fontWeight: isSelected ? 500 : 400,
                }}
            >
                <div style={{width: option.description ? '100%' : 'auto'}}>
                    {children}
                </div>

                {option.description && <small style={{float: 'right'}}>
                    {option.description}
                </small>}
            </MenuItem>
        );
    }
}

class SelectWrapped extends React.Component {
    render() {
        const { classes, options, async = false, ...other } = this.props
        const SelectElement = async ? Select.Async : Select
        return (
                <SelectElement
                    removeSelected={true}
                    optionComponent={Option}
                    noResultsText={<Typography>{'No results found'}</Typography>}
                    arrowRenderer={arrowProps => {
                        return arrowProps.isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />;
                    }}
                    clearRenderer={() => <ClearIcon />}
                    filterOptions={(options, filter, currentValues) => {
                        let count = 0;

                        if(async) {
                            return options.slice(0, 150);
                        }

                        return options.filter(suggestion => {
                            const keep =
                                (!filter || suggestion.label.toLowerCase().includes(filter.toLowerCase())) &&
                                count < 150;

                            if (keep) {
                                count += 1;
                            }

                            return keep;
                        });
                    }}
                    valueComponent={valueProps => {
                        const { value, children, onRemove } = valueProps;

                        if (onRemove) {
                            return (
                                <Chip
                                    tabIndex={-1}
                                    label={children}
                                    className={classes.chip}
                                    onDelete={event => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        onRemove(value);
                                    }}
                                />
                            );
                        }

                        return <div className="Select-value">{children}</div>;
                    }}
                    options={((typeof options === "function") ? options() : options)}
                    {...other}
                />
        );
    }
}

class XSelect extends React.Component {

    state = {
        value: this.props.value,
    }

    static propTypes = {
        classes: PropTypes.object.isRequired,
    }

    onChange = value => {
        this.setState({value: value})
        this.props.onChange(this.props.name || this.props.id, value)
    }

    render() {
        const { classes, label, name, id, onChange, simpleValue = true, multi = false, ...others } = this.props;

        return (
            <FormControl fullWidth className={classes.root}>
                <InputLabel htmlFor={'react-select-single'} shrink={true}>
                    {label}
                </InputLabel>

                <Input
                    fullWidth
                    onChange={this.onChange}
                    margin="dense"
                    inputComponent={SelectWrapped}
                    inputProps={{
                        classes,
                        value: this.state.value,
                        multi: multi,
                        closeOnSelect: !multi,
                        simpleValue: simpleValue,
                        name: name || id,
                        id: id,
                        ...others
                    }}
                />
            </FormControl>
        );
    }
}

export default withStyles(styles)(XSelect);