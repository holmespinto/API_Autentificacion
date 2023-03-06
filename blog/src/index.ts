import express from 'express';
import path from 'path';
import { URLSearchParams } from 'url';
import request from 'request';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import generateRandomString from './utils/generateRandomString';
import encodeBasic from './utils/encodeBasic';
import scopesArray from './utils/scopesArray';

import playlistMock from './utils/mocks/playlist';

import config from './config';

const app = express();
const port = 3000;

// static files
app.use('/static', express.static(path.join(__dirname, 'public')));

// middlewares
app.use(cors());
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

function getUserInfo(accessToken: string): Promise<any | null> {
  if (!accessToken) {
    console.log(accessToken);

    return Promise.resolve(null);
  }

  const options = {
    url: 'https://api.spotify.com/v1/me',
    headers: { Authorization: `Bearer ${accessToken}` },
    json: true,
  };

  return new Promise((resolve, reject) => {
    request.get(options, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        reject(error);
      }

      resolve(body);
    });
  });
}

function getUserPlaylists(accessToken: string, userId: string): Promise<any | null> {
  if (!accessToken || !userId) {
    return Promise.resolve(null);
  }

  const options = {
    url: `https://api.spotify.com/v1/users/${userId}/playlists`,
    headers: { Authorization: `Bearer ${accessToken}` },
    json: true,
  };

  return new Promise((resolve, reject) => {
    request.get(options, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        reject(error);
      }

      resolve(body);
    });
  });
}

// routes
app.get('/', async function (req, res, next) {
  const { access_token: accessToken } = req.cookies;

  try {
    const userInfo = await getUserInfo(accessToken);
    res.render('playlists', {
      userInfo,
      isHome: true,
      playlists: { items: playlistMock },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.get('/playlists', async function (req, res, next) {
  const { access_token: accessToken } = req.cookies;

  if (!accessToken) {
    return res.redirect('/');
  }

  try {
    const userInfo = await getUserInfo(accessToken);
    const userPlaylists = await getUserPlaylists(accessToken, userInfo.id);

    res.render('playlists', { userInfo, playlists: userPlaylists });
  } catch (error) {
    next(error);
  }
});

app.get('/login', function (req, res) {
  const state = generateRandomString(16);

  const queryString = new URLSearchParams({
    response_type: 'code',
    client_id: config.spotify.clientId,
    scope: scopesArray.join(' '),
    redirect_uri: config.spotify.redirectUri,
    state,
  }).toString();

  res.cookie('auth_state', state, { httpOnly: true });
  res.redirect(`https://accounts.spotify.com/authorize?${queryString}`);
});

app.get('/logout', function (req, res) {
  res.clearCookie('access_token');
  res.redirect('/');
});

app.get('/callback', function (req, res, next) {
  const { code, state } = req.query;
  const { auth_state } = req.cookies;

  if (state === null || state !== auth_state) {
    next(new Error("The state doesn't match"));
  }

  res.clearCookie('auth_state');

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code,
      redirect_uri: config.spotify.redirectUri,
      grant_type: 'authorization_code',
    },
    headers: {
      Authorization: `Basic ${encodeBasic(config.spotify.clientId, config.spotify.clientSecret)}`,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      next(new Error('The token is invalid'));
    }

    res.cookie('access_token', body.access_token, { httpOnly: true });
    res.redirect('/playlists');
  });
});

// server
app.listen(port, function () {
  console.log(`Listening http://localhost:${port}`);
});
