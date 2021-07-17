import { User } from '@firebase/auth';
import React from 'react';
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { Header } from '../components/Header';
import { useUserStatus } from '../utils/useUserStatus';
import { AddPostView } from './AddPostView';
import { EditView } from './EditView';
import { Home } from './Home';
import { LoginView } from './LoginView';
import { SettingsView } from './SettingsView';

interface ISecureRoute {
  path: string;

  exact?: boolean;
  children: (user: User) => React.ReactNode;
}

const SecureRoute = ({ path, children, exact }: ISecureRoute) => {
  const userStatus = useUserStatus();
  if (userStatus.type === 'AUTHENTICATED') {
    return (
      <Route path={path} exact={exact}>
        {children(userStatus.user)}
      </Route>
    );
  } else if (userStatus.type === 'UNAUTHENTICATED') {
    return <Redirect to="/" />;
  }
  return null;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/settings">
          <SettingsView />
        </Route>
        <Route path="/login">
          <LoginView />
        </Route>
        <SecureRoute path="/addPost">
          {(user) => <AddPostView user={user} />}
        </SecureRoute>
        <SecureRoute path="/edit">
          {(user) => <EditView />}
        </SecureRoute>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="*">
          <div>Finner ikke siden du leter etter.</div>
          <div>er vi her egentlig</div>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
