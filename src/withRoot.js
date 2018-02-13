import React from 'react'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import blue from 'material-ui/colors/blue'
import green from 'material-ui/colors/green'
import Reboot from 'material-ui/Reboot'

// A theme with custom primary and secondary color.
const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: green,
  }
})

function withRoot(Component) {
  function WithRoot(props) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        {/* Reboot kickstart an elegant, consistent, and simple baseline to build upon. */}
        <Reboot />
        <Component {...props} />
      </MuiThemeProvider>
    )
  }

  return WithRoot
}

export default withRoot
