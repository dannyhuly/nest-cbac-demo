export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'THIS_IS_A_SECRET',
    expiresIn: 3600,
  },
  hash: {
    secret: process.env.HASH_SECRET || 'THIS_IS_A_SECRET',
    saltRounds: process.env.HASH_SALT_ROUNDS || 10,
  },
});
