import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { ContentWrapper } from '../components/ContentWrapper';
import { Header } from '../components/Header';
import { Spinner } from '../components/Spinner/Spinner';
import {
  AuthenticatedUser,
  useUserStatus,
} from '../utils/useUserStatus';

const SettingsView = lazy(() =>
  import('./SettingsView').then((module) => ({
    default: module.SettingsView,
  }))
);
const AddPostView = lazy(() =>
  import('./AddPostView').then((module) => ({
    default: module.AddPostView,
  }))
);
const AdminView = lazy(() =>
  import('./AdminView').then((module) => ({
    default: module.AdminView,
  }))
);
const EditView = lazy(() =>
  import('./EditView').then((module) => ({
    default: module.EditView,
  }))
);
const Home = lazy(() =>
  import('./Home').then((module) => ({
    default: module.Home,
  }))
);
const LoginView = lazy(() =>
  import('./LoginView').then((module) => ({
    default: module.LoginView,
  }))
);
const PostView = lazy(() =>
  import('./PostView').then((module) => ({
    default: module.PostView,
  }))
);
const UserPostsView = lazy(() =>
  import('./UserPostsView').then((module) => ({
    default: module.UserPostsView,
  }))
);

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
        <Suspense fallback={<Spinner />}>
          <Switch>
            <Route exact path="/settings">
              <SettingsView />
            </Route>
            <SecureRoute path="/settings/admin">
              {(userStatus) => (
                <AdminView userStatus={userStatus} />
              )}
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
        </Suspense>
      </ContentWrapper>
    </BrowserRouter>
  );
};
