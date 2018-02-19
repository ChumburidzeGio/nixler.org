import React from 'react';
import withRoot from '../withRoot';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Snackbar from '../components/Snackbar';
import { connect } from 'react-redux'
import ImportExportSection from '../pages/ImportExportSection'

const styles = theme => ({
    toolbar: {
        position: 'relative'
    },
    logo: {
        flex: 1,
        textDecoration: 'none'
    }
})

class App extends React.Component {

    constructor(props)
    {
        super(props);

        this.state = {
            headerText: props.headerText ? props.headerText : () => {},
            backButton: props.backButton,
        }
    }

    handleBackButton = () => {
        return this.state.headerText ? this.state.backButton() : null
    }

    render() {

        const { classes, snackQueue } = this.props;

        return (
            <div>

                <AppBar position="static">
                    <Toolbar className={classes.toolbar}>
                        {this.state.headerText() &&
                            <IconButton color="inherit" aria-label="Go back" onClick={this.handleBackButton}>
                                <ArrowBackIcon />
                        </IconButton>}

                        <Typography type="title" color="inherit" className={classes.logo} component={Link} to="/" onClick={this.handleBackButton}>
                            {this.state.headerText() ? this.state.headerText() : 'Fieldify' }
                        </Typography>

                        <ImportExportSection />
                    </Toolbar>
                </AppBar>

                {this.props.children}

                {snackQueue.map((item) =>
                    <Snackbar message={item.label} key={item.id} id={item.id} duration={item.duration}/>
                )}

            </div>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
    snackQueue: state.snackbarReducer.queue,
})

export default withRoot(withStyles(styles)(connect(mapStateToProps)(App)))