import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'request';

import config from './config';
import encodeBasic from './utils/encodeBasic';

const app = express();
const port = 5000;

// body-parser
app.use(express.json());

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

app.post('/api/auth/token', (req, res) => {
  const { email, username, name } = req.body;
  const token = jwt.sign({ sub: username, email, name }, config.authJwtSecret);
  res.json({ token });
});

app.get('/api/auth/verify', (req, res, next) => {
  const { access_token } = req.query;

  try {
    const decoded = jwt.verify(access_token as string, config.authJwtSecret);
    res.json({ message: 'Valid Access Token', username: decoded.sub });
  } catch (error) {
    next(error);
  }
});

app.get('/api/playlists', (req, res, next) => {
  const { userId } = req.query;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization: `Basic ${encodeBasic(config.spotify.clientId, config.spotify.clientSecret)}`,
    },
    form: {
      grant_type: 'client_credentials',
    },
    json: true,
  };

  request.post(authOptions, async function (error, response, body) {
    if (error || response.statusCode !== 200) {
      next(error);
    }

    const token = body.access_token;
    const userPlaylists = await getUserPlaylists(token, userId as string);
    res.json({ playlists: userPlaylists });
  });
});

app.listen(port, () => console.log(`Listening on localhost:${port}`));
