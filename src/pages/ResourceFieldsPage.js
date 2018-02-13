import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import withRoot from '../withRoot'
import TextField from 'material-ui/TextField'
import MenuItem from 'material-ui/Menu/MenuItem'
import Grid from 'material-ui/Grid'
import Button from 'material-ui/Button'
import Send from 'material-ui-icons/Send'
import Zoom from 'material-ui/transitions/Zoom'
import AddIcon from 'material-ui-icons/Add'
import MultiSelect from "../components/MultiSelect"
import FieldEditModal from './FieldEditModal'
import Switch from '../components/Switch'
import client from '../client'
import App from '../layouts/App'
import SortableList from '../components/SortableList'
import { arrayMove } from 'react-sortable-hoc'
import { showSnack, hideSnack } from '../state/snackbarActions'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        width: '100%',
    },
    container: {
      padding: 20,
      marginTop: 5,
    },
    textField: {
        marginBottom: 20,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
    deleteButton: {
        float: 'right',
        margin: 8,
    }
})



class ResourceFieldsPage extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            fields_focused: true,
            modalStatus: false,
            snackbar: {
                open: false,
                message: null,
            }
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.openModal = this.openModal.bind(this)
    }

    componentDidMount = () => this.getData()

    getData() {

        client.get('/resources.fieldify/data/' + this.props.params.id).then(({data}) => {

            this.setState(data)

            setTimeout(() => this.setState({fields_focused: false}))

        }).catch((error) => this.snackAndRedirect('Resource not found, redirecting to dashboard'))
    }

    openModal = (status, data) => this.setState({ modalStatus: status, modalContent: data })

    closeModal = () => {
        this.setState({ modalStatus: false, modalContent: null })
        setTimeout(() => this.getData(), 100)
    }

    handleChange = name => event => this.setState({[name]: event.target.value})

    handleChangeBehaviours = event => this.setState({behaviours: event.target.value})

    handleChangeSwitch = (name) => this.setState({[name]: !this.state[name]})

    getBehaviours = () => this.state.behaviours

    getModalStatus = () => this.state.modalStatus

    getModalData = () => this.state.modalContent

    getSnackbarOpen = () => this.state.snackbar.open

    handleSubmit() {

        const resource = this.state

        const params = {
            name: resource.name,
            label: resource.label,
            description: resource.description,
            act_as: resource.act_as,
            behaviours: resource.behaviours,
            is_strict: resource.is_strict,
        }

        client.put('/resources.fieldify/data/' + resource.id, params)
            .then(({data}) => this.props.showSnack('Resource succesfully updated'))
            .catch(({data}) => this.props.showSnack('Something went wrong, pls try later :)'))
    }

    handleDelete() {
        client.delete('/resources.fieldify/data/' + this.state.id).then((data) => {
            this.snackAndRedirect('Resource succesfully deleted, redirecting to dashboard')
        }).catch((error) => this.props.showSnack('Something went wrong, pls try later :)'))
    }

    snackAndRedirect(snack, path = '/') {
        setTimeout(() => browserHistory.push(path), 500)
        this.props.showSnack(snack)
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        const {fields} = this.state;

        const oldList = fields

        const newList = arrayMove(fields, oldIndex, newIndex)

        this.setState({fields: newList})

        const mapped = newList.map((item, index) => ({id: item.id, order: index}))

        client.post('/reorder_fields.fieldify/data', {fields: mapped, id: this.state.id})
            .then(({data}) => this.props.showSnack('Field order succesfully updated'))
            .catch(({data}) => {
                this.props.showSnack('Something went wrong, pls try later :)')
                this.setState({fields: oldList})
            })
    }

    onResourceClick = (item) => this.openModal('edit', item)

    render() {

        const { classes, theme } = this.props;

        const resource = this.state;

        const transitionDuration = {
            enter: theme.transitions.duration.enteringScreen,
            exit: theme.transitions.duration.leavingScreen,
        };

        return (
            <App>

                {resource.id ?  <Grid container spacing={24} className={classes.container}>
                    <Grid item xs={12} md={6}>

                        <Typography type="title">
                            Resource Information (#{resource.id})
                        </Typography>

                        <TextField
                            required
                            id="name"
                            label="Name"
                            InputLabelProps={{focused: resource.fields_focused}}
                            placeholder="Name"
                            margin="normal"
                            value={resource.name}
                            onChange={this.handleChange('name')}
                            fullWidth
                        />

                        <TextField
                            required
                            id="label"
                            label="Label"
                            InputLabelProps={{focused: resource.fields_focused}}
                            placeholder="Label"
                            margin="normal"
                            value={resource.label}
                            onChange={this.handleChange('label')}
                            fullWidth
                        />

                        <TextField
                            required
                            id="description"
                            label="Description"
                            InputLabelProps={{focused: resource.fields_focused}}
                            placeholder="Description"
                            margin="normal"
                            value={resource.description}
                            onChange={this.handleChange('description')}
                            fullWidth
                        />

                        <TextField
                            id="act_as"
                            label="Act as"
                            InputLabelProps={{focused: resource.fields_focused}}
                            select
                            className={classes.textField}
                            value={resource.act_as}
                            onChange={this.handleChange('act_as')}
                            SelectProps={{
                                MenuProps: {
                                    className: classes.menu,
                                },
                            }}
                            margin="normal"
                            fullWidth
                        >
                            {resource.act_as__values.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <MultiSelect id="behaviours" label="Behaviours" value={this.getBehaviours} options={resource.behaviours__values} handleChange={this.handleChangeBehaviours} />

                        <Switch id="is_strict" label="Is Strict" checked={resource.is_strict} handleChange={this.handleChangeSwitch} />

                        <Button raised color="primary" onClick={this.handleSubmit}>
                            Save
                            <Send className={classes.rightIcon}/>
                        </Button>

                        <Button className={classes.deleteButton} onClick={this.handleDelete}>
                            Delete
                        </Button>


                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography type="title">
                            Resource Fields
                        </Typography>

                        <SortableList items={resource.fields} onSortEnd={this.onSortEnd} useDragHandle={true} onItemClick={this.onResourceClick} />

                        <Zoom
                            appear={false}
                            key={'primary'}
                            in={true}
                            timeout={transitionDuration}
                            enterDelay={transitionDuration.exit}
                            unmountOnExit
                        >
                            <Button fab className={classes.fab} color={'primary'}  onClick={() => this.openModal('create', {resource_id: resource.id})}>
                                <AddIcon />
                            </Button>
                        </Zoom>

                        {this.getModalStatus() ? <FieldEditModal status={this.getModalStatus} handleClose={this.closeModal} data={this.getModalData} /> : ''}

                    </Grid>

                </Grid>
                    : '' }

            </App>
        );
    }
}

ResourceFieldsPage.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
}

export default withRoot(withStyles(styles, { withTheme: true })(connect(null, {showSnack, hideSnack})(ResourceFieldsPage)))