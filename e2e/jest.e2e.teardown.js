module.exports = async () => {
  if (global.__SERVER__) {
    await global.__SERVER__.stop();
  }
};