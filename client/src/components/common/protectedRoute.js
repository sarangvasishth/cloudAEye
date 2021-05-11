import React from "react";
import { Route, Redirect } from "react-router-dom";

import Layout from "../layout";

export default function PrivateRoute({ component: Component, ...rest }) {
  const isAuthenticated = localStorage.getItem("token");
  return (
    <Route
      {...rest}
      exact
      render={(props) =>
        isAuthenticated ? (
          <Layout>
            <Component {...props} />
          </Layout>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}
