import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import {withStyles} from 'material-ui/styles';
import withRoot from '../withRoot';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import CloseIcon from 'material-ui-icons/Close';
import DeleteIcon from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';
import Switch from '../components/Switch';
import Slide from 'material-ui/transitions/Slide';
import client from '../client';
import XSelect from '../components/XSelect';

const styles = theme => ({
    appBar: {
        position: 'sticky',
    },
    toolBar: {
        position: 'relative',
    },
    flex: {
        flex: 1
    },
    dialogContent: {
        padding: 20
    }
});

const Transition = (props) => <Slide direction="up" {...props} />;

class FieldEditModal extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            ...props.data(),
            status: props.status,
            handleClose: props.handleClose,
            handleUpdate: props.handleUpdate,
            fields_focused: true,
            is_input: false,
            is_output: false,
            is_overview: false,
        };
    }

    componentDidMount = async () => {

        client.get(this.state.status() === 'edit' ?
                ('/fields.fieldify/data/' + this.state.id)
                : '/field_consts.fieldify/data')
                
        .then(data => {
            this.setState({...data.data})
            setTimeout(() => this.setState({fields_focused: false}))
        })
    }

    handleChange = name => event => this.setState({[name]: event.target.value})

    handleDelete = () => {
        client.delete('/fields.fieldify/data/' + this.state.id)
        .then(() => this.state.handleClose())
        .catch((error) => { throw error })
    }

    handleSubmit = () => {
        const response = this.state.status() === 'edit' ?
            client.put('/fields.fieldify/data/' + this.state.id, this.state) :
            client.post('/fields.fieldify/data/', this.state);

        response.then(() => this.state.handleClose())
        .catch((error) => { throw error })
    }

    handleChangeSwitch = (name) => this.setState({[name]: !this.state[name]})
    handleChangeFilters = event => this.setState({filters: event.target.value})
    handleChangeX = (name, value) => this.setState({[name]: value});

    loadFromToOptions = (input, callback) => {

        if (!input) {
			return Promise.resolve({ options: [] });
		}

        return client.get('/search_fields.fieldify/data?query=' + input).then((json) => {
			return { options: json.data };
        })
    }

    render() {

        const {classes} = this.props;

        const self = this.state;

        return (
            <Dialog
                fullScreen
                open={!!this.props.status()}
                onClose={this.state.handleClose}
                transition={Transition}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar className={classes.toolBar}>
                        <IconButton color="inherit" onClick={self.handleClose} aria-label="Close">
                            <CloseIcon/>
                        </IconButton>
                        <Typography type="title" color="inherit" className={classes.flex}>
                            {this.props.status() === 'edit' ? 'Edit' : 'Create'} Field
                        </Typography>
                        <Button color="inherit" onClick={this.handleSubmit}>
                            {this.props.status() === 'edit' ? 'Save' : 'Create'}
                        </Button>
                        {this.props.status() === 'edit' && self.id ? <IconButton color="inherit" onClick={this.handleDelete}>
                            <DeleteIcon/>
                        </IconButton> : ''}
                    </Toolbar>
                </AppBar>
                {!this.state.fields_focused && <div className={classes.dialogContent}>

                    <XSelect id="name" label="Name" placeholder="Select field name" value={this.state.name} options={this.state.name_values} onChange={this.handleChangeX}/>

                    <TextField required label="Label" margin="normal" value={self.label} onChange={this.handleChange('label')} fullWidth/>

                    <XSelect id="type" label="Type" placeholder="Select field type" value={this.state.type} options={this.state.type_values} onChange={this.handleChangeX}/>

                    <XSelect id="from" name="from" label="From" multi={true} placeholder="Select from fields" async={true} value={this.state.from} onChange={this.handleChangeX} simpleValue={false} loadOptions={this.loadFromToOptions}/>
                    
                    <XSelect id="to" name="to" label="To" multi={true} placeholder="Select to fields" async={true} value={this.state.to} onChange={this.handleChangeX} simpleValue={false} loadOptions={this.loadFromToOptions}/>

                    <XSelect id="strategy" label="Strategy" placeholder="Select field strategy" value={this.state.strategy} options={this.state.strategy_values} onChange={this.handleChangeX}/>

                    <XSelect id="filters" label="Filters" multi={true} placeholder="Select field filters" value={this.state.filters} options={this.state.filter_values} onChange={this.handleChangeX}/>
                    
                    <TextField required label="Description" margin="normal" value={self.description} onChange={this.handleChange('description')} fullWidth/>
                    <TextField required label="Value" margin="normal" value={self.value} onChange={this.handleChange('value')} fullWidth/>
                    <TextField required label="Input Default" margin="normal" value={self.input_default} onChange={this.handleChange('input_default')} fullWidth/>

                    <TextField required label="Script" margin="normal" value={self.script} onChange={this.handleChange('script')} fullWidth/>
                    <TextField required label="Rules" margin="normal" value={self.rules} onChange={this.handleChange('rules')} fullWidth/>

                    <Switch id="is_input" label="Is Input" checked={self.is_input} handleChange={this.handleChangeSwitch} />
                    <Switch id="is_output" label="Is Output" checked={self.is_output} handleChange={this.handleChangeSwitch} />
                <Switch id="is_overview" label="Is Overview" checked={self.is_overview} handleChange={this.handleChangeSwitch} />

                </div>}

            </Dialog>
        );
    }
}

FieldEditModal.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles, {withTheme: true})(FieldEditModal));