import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Login from "./containers/Login";
import SignUp from "./containers/SignUp";
import Denied from "./containers/Denied";
import Requests from "./containers/Requests";
import Approved from "./containers/Approved";
import NotFound from "./containers/NotFound";

import { ProtectedRoute } from "./components/common";

require("dotenv").config();

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/sign-up" component={SignUp} />
        <ProtectedRoute exact path="/" component={Requests} />
        <ProtectedRoute exact path="/denied" component={Denied} />
        <ProtectedRoute exact path="/approved" component={Approved} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
