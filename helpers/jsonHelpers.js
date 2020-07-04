const fs = require('fs');

exports.readFile = async () => {
  let data = fs.readFileSync('./data/database.json');

  if (data) {
    let parsedData;

    try {
      parsedData = await JSON.parse(data);
    } catch (error) {
      parsedData = null;
    }

    return parsedData;
  }

  return data;
};

exports.writeFile = async (data) => {
  let stringifiedData;

  try {
    stringifiedData = await JSON.stringify(data, null, 2);
  } catch (error) {
    stringifiedData = null;
  }

  if (stringifiedData) {
    fs.writeFileSync('./data/database.json', stringifiedData);
    return true;
  }

  return false;
}
