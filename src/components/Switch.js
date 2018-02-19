import React from 'react';
import {Switch as MuiSwitch} from 'material-ui';
import withRoot from '../withRoot';
import { FormControlLabel, FormGroup  } from 'material-ui/Form';

class Switch extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            checked: props.checked
        }
    }

    handleChange = () => {
        this.setState({checked: !this.state.checked})
        this.props.handleChange(this.props.id)
    }

    render() {
        return (
            <FormGroup>
                {this.state.checked !== undefined && <FormControlLabel
                    control={
                        <MuiSwitch
                            onChange={this.handleChange}
                            checked={this.state.checked}
                        />
                    }
                    label={this.props.label}
                />}
            </FormGroup>
        );
    }
}

export default withRoot(Switch);