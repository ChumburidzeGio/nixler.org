import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';
import Button from 'material-ui/Button';
import { Link } from 'react-router-component';

const styles = theme => ({
    root: {
        textAlign: 'center',
        paddingTop: theme.spacing.unit * 20,
    },
    button: {
        marginTop: 20
    }
});

class NotFoundPage extends React.Component {

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Typography type="display1" gutterBottom>
                    Sorry Page Not Found
                </Typography>
                    <Button raised color="accent" className={classes.button} component={Link} href="/">
                        Go to home page
                    </Button>
            </div>

        );
    }
}

NotFoundPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(NotFoundPage));
