import React from "react";
import CreateAccount from "./account/CreateAccount";
import LoginPage from "./account/LoginPage";
import HomePage from "./HomePage";
import HomeLogin from "./account/HomeLogin";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <BrowserRouter history={history} basename={process.env.PUBLIC_URL}>

        <Switch>
          <Route path="/create-account" component={CreateAccount} />
          <Route path="/login" component={LoginPage} />
          <Route path="/" component={HomeLogin} />
          <Route path="/home" component={HomePage} />
        </Switch>
        </BrowserRouter>
    </Router>
  );
}

export default App;
