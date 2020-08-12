import React from "react";
import CreateAccount from "./account/CreateAccount";
import LoginPage from "./account/LoginPage";
import HomePage from "./HomePage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomeLogin from "./account/HomeLogin";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/create-account" component={CreateAccount} />
        <Route path="/login" component={LoginPage} />
        <Route path="/" component={HomeLogin} />
        <Route path="/home" component={HomePage} />
      </Switch>
</Router>
  );
}

export default App;
