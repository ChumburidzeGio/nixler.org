import React from 'react'
import withRoot from '../withRoot'
import List, { ListItem, ListItemText } from 'material-ui/List'
import KeyboardArrowRightIcon from 'material-ui-icons/KeyboardArrowRight'
import { Link } from 'react-router'
import App from '../layouts/App'
import { connect } from 'react-redux'
import { loadResources, selectProductType } from '../state/resourceActions'
import Button from 'material-ui/Button'
import Zoom from 'material-ui/transitions/Zoom'
import { withStyles } from 'material-ui/styles'
import ResourceCreateModal from './ResourceCreateModal'
import AddIcon from 'material-ui-icons/Add'

const styles = theme => ({
    fab: {
        position: 'fixed',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
})

class HomePage extends React.Component {

    constructor(props) {
        super(props)

        this.setActiveItem = this.setActiveItem.bind(this);

        this.state = {
            modalStatus: null
        }
    }

    componentDidMount = () => this.props.loadResources()

    setActiveItem = (item) => this.props.selectProductType(item)

    unsetActiveItem = () => this.props.selectProductType(null)

    getHeaderText = () => this.props.resources.selected ? this.props.resources.selected.title : null

    openModal = (status) => this.setState({ modalStatus: 'create' })

    closeModal = () => {
        this.setState({ modalStatus: false })
        this.props.loadResources()
    }

    getModalStatus = () => this.state.modalStatus

    render() {

        const { resources, theme, classes } = this.props

        const transitionDuration = {
            enter: theme.transitions.duration.enteringScreen,
            exit: theme.transitions.duration.leavingScreen,
        }

        return (

        <App headerText={this.getHeaderText} backButton={this.unsetActiveItem}>

                {resources.selected ?
                        <div>
                            <List>
                                {resources.selected.resources.map((item) =>
                                    <ListItem button key={item.id} component={Link} to={'/resource/' + item.id}>
                                        <ListItemText primary={item.title} />
                                        <KeyboardArrowRightIcon />
                                    </ListItem>
                                )}
                            </List>

                            <Zoom
                                appear={false}
                                key={'primary'}
                                in={true}
                                timeout={transitionDuration}
                                enterDelay={transitionDuration.exit}
                                unmountOnExit
                            >
                                <Button fab className={classes.fab} color={'primary'}  onClick={() => this.openModal('create')}>
                                    <AddIcon />
                                </Button>
                            </Zoom>

                            {this.getModalStatus() ? <ResourceCreateModal status={this.getModalStatus} handleClose={this.closeModal} productType={this.props.resources.selected.id}/> : ''}

                        </div>

                    :

                    <List>
                        {resources.items.map((item) =>
                            <ListItem button key={item.id} onClick={() => this.setActiveItem(item)}>
                                <ListItemText primary={item.title}  secondary={item.resources_count + (item.resources_count > 1 ? ' Resources' : ' Resource')}/>
                                <KeyboardArrowRightIcon />
                            </ListItem>
                        )}
                    </List>
                }

            </App>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    resources: state.resourceReducer
})

export default withStyles(styles, { withTheme: true })(withRoot(connect(mapStateToProps, {loadResources, selectProductType})(HomePage)))
