require('dotenv').config();

export const requestHeader = {
  'Content-Type': 'application/json',
  'apikey': process.env.API_KEY
};