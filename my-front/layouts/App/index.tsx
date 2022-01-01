import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import loadable from "@loadable/component";

const Login = loadable(() => import("@pages/Login"));
const SignUp = loadable(() => import("@pages/SignUp"));
const Workspace = loadable(() => import("@layouts/Workspace"));

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="login" />
      <Route path="/login">{<Login />}</Route>
      <Route path="/signup">{<SignUp />}</Route>
      <Route path="/workspace/:workspace">{<Workspace />}</Route>
    </Switch>
  );
};

export default App;
