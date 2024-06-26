import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import useApi from "./hooks/useApi";

import { MuiThemeProvider, createMuiTheme, colors } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      [500]: colors.blue[700]
    }
  },
  typography: {
    fontFamily: "Livvic",
    fontWeightMedium: 600
  }
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <useApi.Provider>
      <App />
    </useApi.Provider>
  </MuiThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
