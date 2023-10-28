export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'THIS_IS_A_SECRET',
    expiresIn: 3600,
  },
  hash: {
    secret: process.env.JWT_SECRET || 'THIS_IS_A_SECRET',
  },
});
