import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import ProjectsPage from "./routes/ProjectsPage";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/projects" exact component={ProjectsPage} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
