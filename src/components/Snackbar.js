import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import SnackbarContent from 'material-ui/Snackbar'
import Button from 'material-ui/Button'
import { hideSnack } from '../state/snackbarActions'
import { connect } from 'react-redux'
import { CircularProgress } from 'material-ui/Progress'

const styles = theme => ({
    progress: {
        marginRight: `${theme.spacing.unit * 2}px`,
        verticalAlign: '-3px',
        color: '#f3f3f3'
    }
})

class SnackbarComponent extends React.Component {

    constructor(props)
    {
        super(props);

        this.state = {
            message: props.message,
            duration: props.duration || 3000,
            id: props.id,
        }
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.props.hideSnack(this.state.id)
    }

    render() {
        const { classes } = this.props;
        return (
                <SnackbarContent
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    autoHideDuration={this.state.duration}
                    onClose={this.handleClose}
                    open={true}
                    SnackbarContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={
                        <span id="message-id">
                            {this.state.id === 'progress' ? <CircularProgress className={classes.progress} size={17}/> : ''}
                            {this.state.message}
                        </span>}
                    action={[
                        <Button
                            key="hide"
                            aria-label="Hide"
                            color="inherit"
                            onClick={this.handleClose}
                            dense
                        >
                            Hide
                        </Button>,
                    ]}
                />
        );
    }
}

SnackbarComponent.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(connect(null, {hideSnack})(SnackbarComponent))
