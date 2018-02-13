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
import { loadResources } from '../state/resourceActions'
import { connect } from 'react-redux'


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

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class ResourceCreateModal extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            status: props.status,
            product_type: props.productType,
            handleClose: props.handleClose,
            handleUpdate: props.handleUpdate,
            fields_focused: true,
            act_as: null,
            behaviours: null,
            is_strict: false,
        }
    }

    async componentDidMount() {
        this.getData()
    }

    async getData() {

        const self = this

        let data = await (await client.get('/resource_consts.fieldify/data/')).data

        if(!data) throw new Error('Failed to load field.')

        self.setState({...data})

        this.updateFieldsFocus()
    }

    updateFieldsFocus = () => setTimeout(() => this.setState({fields_focused: false}))

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    }

    handleSubmit = () => {

        const self = this

        let data = client.post('/resources.fieldify/data/', this.state).then((data) => {
            self.state.handleClose()
        }).catch((error) => {
            //TODO: Add snack
            throw error
        });

    }

    handleChangeIsInput = () => this.setState({is_input: !this.state.is_input})
    handleChangeIsOutput = () => this.setState({is_output: !this.state.is_output})
    handleChangeIsOverview = () => this.setState({is_overview: !this.state.is_overview})
    handleChangeX = (name, value) => this.setState({[name]: value});
    handleChangeSwitch = (name) => this.setState({[name]: !this.state[name]})

    render() {

        const {classes} = this.props;

        const resource = this.state;

        return (
            <Dialog
                fullScreen
                open={!!resource.status()}
                onClose={this.state.handleClose}
                transition={Transition}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar className={classes.toolBar}>
                        <IconButton color="inherit" onClick={resource.handleClose} aria-label="Close">
                            <CloseIcon/>
                        </IconButton>
                        <Typography type="title" color="inherit" className={classes.flex}>
                            Create Resource
                        </Typography>
                        <Button color="inherit" onClick={this.handleSubmit}>
                            Create
                        </Button>
                    </Toolbar>
                </AppBar>

                {resource.act_as__values ? <div className={classes.dialogContent}>

                    <TextField required label="Name" margin="normal" value={resource.name} onChange={this.handleChange('name')} fullWidth/>
                    <TextField required label="Label" margin="normal" value={resource.label} onChange={this.handleChange('label')} fullWidth/>
                    <TextField required label="Description" margin="normal" value={resource.description} onChange={this.handleChange('description')} fullWidth/>

                    <XSelect id="act_as" label="Act as" placeholder="Select how resource should act" value={resource.act_as} options={resource.act_as__values} onChange={this.handleChangeX}/>
                    <XSelect id="behaviours" label="Behaviours" placeholder="Select resource behaviours" value={resource.behaviours} options={resource.behaviours__values} onChange={this.handleChangeX} multi={true}/>

                    <Switch id="is_strict" label="Is Strict" checked={resource.is_strict} handleChange={this.handleChangeSwitch} />

                </div>: ''}

            </Dialog>
        );
    }
}

ResourceCreateModal.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles, {withTheme: true})(connect(null, {loadResources})(ResourceCreateModal)))