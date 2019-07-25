import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from '@material-ui/styles';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

// Pages
import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

// Components
import Navbar from "./components/layout/Navbar";

//Redux
import { Provider } from "react-redux";
import store from "./store";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#cfd8dc",
      main: "#78909c",
      dark: "#37474f",
      contrastText: "#fff"
    },
    secondary: {
      light: "#ffcc80",
      main: "#ff9800",
      dark: "#ef6c00",
      contrastText: "#fff"
    }
  },
  typography: {
    useNextVariants: true
  }
});

// import setAuthToken from "./utils/setAuthToken";

// if (localStorage.token) {
//   setAuthToken(localStorage.token);
// }

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <div className="App">
          <Router>
            <Navbar />
            <div className="container">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/signup" component={Signup} />
              </Switch>
            </div>
          </Router>
        </div>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
