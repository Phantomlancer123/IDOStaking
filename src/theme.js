import { red } from '@material-ui/core/colors';
import { createTheme } from '@material-ui/core/styles';

// material ui theme instance used in pages/_document.js
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6'
    },
    secondary: {
      main: '#19857b'
    },
    error: {
      main: red.A400
    },
    background: {
      default: '#fff'
    }
  }
});

export default theme;
