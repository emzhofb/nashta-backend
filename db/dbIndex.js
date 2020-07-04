const jsonHelpers = require('../helpers/jsonHelpers');

exports.getData = async (req) => {
  let data;

  try {
    data = await jsonHelpers.readFile();
  } catch (error) {
    data = null;
  }

  if (data) {
    return {
      success: true,
      data: data
    };
  }

  return { success: false };
}

exports.postData = async (dataToSave) => {
  let data;
  try {
    data = await jsonHelpers.writeFile(dataToSave);
  } catch (error) {
    data = null
  }

  if (data) {
    return {
      success: true,
      data: data
    };
  }

  return { success: false };
}
