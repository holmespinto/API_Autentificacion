import dotenv from 'dotenv';
dotenv.config();

const getConfig = (key: string) => {
  const value = process.env[key];
  if (!value) throw new Error(`Env variable ${key} required`);
  return value;
};

const config = {
  spotify: {
    clientId: getConfig('SPOTIFY_CLIENT_ID'),
    clientSecret: getConfig('SPOTIFY_CLIENT_SECRET'),
    redirectUri: getConfig('SPOTIFY_REDIRECT_URI'),
  },
};

export default config;
