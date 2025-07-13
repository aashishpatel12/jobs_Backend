

const xml2js = require('xml2js');
const parser = new xml2js.Parser({ explicitArray: false });

module.exports = async function xmlToJson(xml) {
  const result = await parser.parseStringPromise(xml);
  return result?.rss?.channel?.item || [];
};

