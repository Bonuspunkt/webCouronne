module.exports = function safeJson(string) {
  try {
    return JSON.parse(string);
  } catch (e) {
    return {};
  }
};
