import auth0 from 'auth0-js';

import scopesArray from '../utils/scopesArray';

export default class AuthService {
  private auth0 = new auth0.WebAuth({
    domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN as string,
    clientID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID as string,
    audience: process.env.NEXT_PUBLIC_AUTH0_API_AUDIENCE,
    redirectUri: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URL,
    responseType: 'token id_token',
    scope: scopesArray.join(' '),
  });

  login = () => {
    this.auth0.authorize();
  };

  logout = () => {
    // clear access token, id token and profile
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('profile');
  };

  handleAuthentication = () => {
    return new Promise<string>((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) {
          console.log('Error parsing hash in Auth0 service');
          return reject(err);
        }

        if (authResult && authResult.accessToken && authResult.idToken) {
          this.setSession({
            expiresIn: authResult.expiresIn as number,
            accessToken: authResult.accessToken,
            idToken: authResult.idToken,
          });
          return resolve(authResult.accessToken);
        }
      });
    }).then((accessToken) => this.handleUserInfo(accessToken));
  };

  setSession = (authResult: { expiresIn: number; accessToken: string; idToken: string }) => {
    const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  };

  isAuthenticated = () => {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') as string);
    return new Date().getTime() < expiresAt;
  };

  handleUserInfo = (accessToken: string) => {
    return new Promise((resolve, reject) => {
      this.auth0.client.userInfo(accessToken, (err, profile) => {
        if (err) {
          console.log('Error getting user info in Auth0 service');
          return reject(err);
        }

        if (profile) {
          this.setProfile(profile);
          return resolve(profile);
        }
      });
    });
  };

  setProfile = (profile) => {
    localStorage.setItem('profile', JSON.stringify(profile));
  };

  getProfile = () => {
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(localStorage.profile) : {};
  };
}
