import { User } from '@firebase/auth';
import React from 'react';
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { ContentWrapper } from '../components/ContentWrapper';
import { Header } from '../components/Header';
import { useUserStatus } from '../utils/useUserStatus';
import { AddPostView } from './AddPostView';
import { EditView } from './EditView';
import { Home } from './Home';
import { LoginView } from './LoginView';
import { SettingsView } from './SettingsView';
import { UserPostsView } from './UserPostsView';

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
      <ContentWrapper>
        <Switch>
          <Route path="/settings">
            <SettingsView />
          </Route>
          <Route path="/login">
            <LoginView />
          </Route>
          <SecureRoute path="/add-post">
            {(user) => <AddPostView user={user} />}
          </SecureRoute>
          <SecureRoute path="/edit">
            {() => <EditView />}
          </SecureRoute>
          <SecureRoute path="/my-posts">
            {(user) => <UserPostsView userId={user.uid} />}
          </SecureRoute>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="*">
            <div>Finner ikke siden du leter etter.</div>
            <div>er vi her egentlig</div>
          </Route>
        </Switch>
      </ContentWrapper>
    </BrowserRouter>
  );
};
