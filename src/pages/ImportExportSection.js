import React from 'react';
import withRoot from '../withRoot';
import Button from 'material-ui/Button';
import { showSnack, hideSnack } from '../state/snackbarActions'
import { loadResources } from '../state/resourceActions'
import { connect } from 'react-redux'
import client from '../client';

class ImportExportSection extends React.Component {

    handleImport = () => this.call('import')

    handleExport = () => this.call('export')

    call = async (action) => {

        let data = null

        this.props.showSnack('Running ' + action + '...', 1000000, 'progress')

        try {
            data = await (await client.get('/' + action + '.resource/data'))
        }

        catch(error) {
            throw(error)
        }

        this.props.loadResources()

        this.props.hideSnack('progress')

        this.props.showSnack(!data ? ('Failed to ' + action) : 'Succesfully ' + action + 'ed', 2000)
    }

    render() {
        return (
            <div>
                <Button color="inherit" onClick={this.handleImport}>
                    Import
                </Button>
                <Button color="inherit" onClick={this.handleExport}>
                    Export
                </Button>
            </div>
        );
    }
}

export default withRoot(connect(null, {showSnack, hideSnack, loadResources})(ImportExportSection))