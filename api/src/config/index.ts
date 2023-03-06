import dotenv from 'dotenv';

dotenv.config();

const config = {
  authJwtSecret: process.env.AUTH_JWT_SECRET as string,
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID as string,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
  },
};

export default config;
