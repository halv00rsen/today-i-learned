import React from 'react';
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { ContentWrapper } from '../components/ContentWrapper';
import { Header } from '../components/Header';
import {
  AuthenticatedUser,
  useUserStatus,
} from '../utils/useUserStatus';
import { AddPostView } from './AddPostView';
import { AdminView } from './AdminView';
import { EditView } from './EditView';
import { Home } from './Home';
import { LoginView } from './LoginView';
import { PostView } from './PostView';
import { SettingsView } from './SettingsView';
import { UserPostsView } from './UserPostsView';

interface ISecureRoute {
  path: string;

  exact?: boolean;
  children: (
    authenticatedUser: AuthenticatedUser
  ) => React.ReactNode;
}

const SecureRoute = ({ path, children, exact }: ISecureRoute) => {
  const userStatus = useUserStatus();
  if (userStatus.type === 'AUTHENTICATED') {
    return (
      <Route path={path} exact={exact}>
        {children(userStatus)}
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
          <Route exact path="/settings">
            <SettingsView />
          </Route>
          <SecureRoute path="/settings/admin">
            {(userStatus) => <AdminView userStatus={userStatus} />}
          </SecureRoute>
          <Route path="/login">
            <LoginView />
          </Route>
          <SecureRoute path="/add-post">
            {({ user }) => <AddPostView user={user} />}
          </SecureRoute>
          <SecureRoute path="/edit">
            {() => <EditView />}
          </SecureRoute>
          <SecureRoute path="/my-posts">
            {({ user }) => <UserPostsView userId={user.uid} />}
          </SecureRoute>
          <Route path="/post/:postId">
            <PostView />
          </Route>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="*">
            <div>Finner ikke siden du leter etter.</div>
          </Route>
        </Switch>
      </ContentWrapper>
    </BrowserRouter>
  );
};
