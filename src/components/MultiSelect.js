import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import withRoot from '../withRoot';
import MenuItem from 'material-ui/Menu/MenuItem';
import Input, {InputLabel} from 'material-ui/Input';
import Select from 'material-ui/Select';
import {FormControl} from 'material-ui/Form';

const styles = theme => ({
    select: {
        marginBottom: 20,
    }
});

class MultiSelect extends React.Component {

    constructor(props)
    {
        super(props);

        this.state = {
            id: props.id,
            label: props.label,
            value: props.value,
            options: props.options,
            handleChange: props.handleChange,
        };
    }

    render() {

        const {classes, theme} = this.props;

        return (
           <FormControl fullWidth>

                <InputLabel htmlFor={this.state.id}>{this.state.label}</InputLabel>

               {this.state.value() &&  <Select
                    multiple
                    fullWidth
                    value={this.state.value()}
                    onChange={this.props.handleChange}
                    className={classes.select}
                    input={<Input id={this.state.id}/>}
                    margin="normal"
                    MenuProps={{
                        PaperProps: {
                            style: {
                                width: 200,
                            },
                        },
                    }}
                >
                    {this.state.options.map((item) => (
                        <MenuItem
                            key={item.id}
                            value={item.id}
                            style={{
                                fontWeight:
                                    this.state.options.indexOf(item.id) === -1
                                        ? theme.typography.fontWeightRegular
                                        : theme.typography.fontWeightMedium,
                            }}
                        >
                            {item.label}
                        </MenuItem>
                    ))}
                </Select>}

            </FormControl>
        );
    }
}

MultiSelect.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles, {withTheme: true})(MultiSelect));