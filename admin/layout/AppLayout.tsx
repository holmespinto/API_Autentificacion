import { Component } from 'react';

import AppNavbar from './AppNavbar';
import AppFooter from './AppFooter';

import AuthService from '../services/AuthService';
import isEmptyObject from '../utils/isEmptyObject';

import { generalStyles, visibilityStyles, semanticStyles } from '../utils/globalStyles';
import { User } from '../types';

type LayoutProps = {
  isAuthenticated?: boolean;
  loggedUser?: User;
};

type LayoutState = {
  isAuthenticated: boolean;
  loggedUser?: User | {};
};
class Layout extends Component<LayoutProps, LayoutState> {
  authService: AuthService;

  constructor(props) {
    super(props);
    this.state = { isAuthenticated: false, loggedUser: {} };
  }

  componentDidMount() {
    this.authService = new AuthService();
    const profile = this.authService.getProfile();

    if (!isEmptyObject(profile)) {
      this.setState({
        isAuthenticated: true,
        loggedUser: {
          name: profile.display_name || profile.name,
          email: profile.email,
          picture: profile.picture,
        },
      });
    } else {
      this.setState({ isAuthenticated: false });
    }
  }

  handleLogin = () => {
    this.authService.login();
  };

  handleLogout = () => {
    this.authService.logout();
    window.location.href = '/';
  };

  render() {
    const { children } = this.props;
    const { isAuthenticated, loggedUser } = this.state;

    return (
      <div className='layout'>
        <AppNavbar
          handleLogin={this.handleLogin}
          handleLogout={this.handleLogout}
          isAuthenticated={isAuthenticated}
          loggedUser={loggedUser as User}
        />
        <main className='layout-content'>{children}</main>
        <AppFooter />
        <style jsx global>
          {generalStyles}
        </style>
        <style jsx global>
          {visibilityStyles}
        </style>
        <style jsx global>
          {semanticStyles}
        </style>
      </div>
    );
  }
}

export default Layout;
