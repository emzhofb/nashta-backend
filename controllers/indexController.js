const dbIndex = require('../db/dbIndex');
const path = require('path');

exports.getMethod = async (req, res, next) => {
  let { filter, page, limit } = req.query;

  let response;

  try {
    response = await dbIndex.getData(req);
  } catch (error) {
    response = null;
  }

  if (response.success) {
    let tempData = [...response.data];

    if (filter) {
      tempData = tempData.filter(data => {
        return data.title.toLowerCase().includes(filter) ||
          data.location.toLowerCase().includes(filter) ||
          data.date.toLowerCase().includes(filter) ||
          data.participant.toLowerCase().includes(filter) ||
          data.note.toLowerCase().includes(filter);
      });
    }

    let totalData = tempData.length;
    if (page && limit) {
      page = parseFloat(page);
      limit = parseFloat(limit);
      const datas = tempData.slice(((page - 1) * limit), ((page - 1) * limit) + limit);
      return res.status(200).json({ success: true, data: datas, totalData, page, limit });
    }
    return res.status(200).json({ success: true, data: tempData, totalData, page: 0, limit: 0 });
  }
  return res.status(400).json({ success: false });
}

exports.postMethod = async (req, res, next) => {
  let datas = req.body;

  let existingData;

  try {
    existingData = await dbIndex.getData(req);

    if (existingData) {
      existingData = existingData.data;
    }
  } catch (error) {
    existingData = [];
  }

  let dataToSave = [...existingData, datas];

  let savingData;

  try {
    savingData = await dbIndex.postData(dataToSave);
  } catch (error) {
    savingData = null;
  }

  if (savingData.success) {
    return res.status(200).json({ success: true, message: 'saving data succesful' });
  }

  return res.status(400).json({ success: false, message: 'saving data failed' });
}

exports.editMethod = async (req, res, next) => {
  let { id } = req.params;
  const data = req.body;

  let existingData;

  try {
    existingData = await dbIndex.getData(req);

    if (existingData) {
      existingData = existingData.data;
    }
  } catch (error) {
    existingData = [];
  }

  let idData = existingData.findIndex(theData => theData.id == id);
  if (idData != -1) {
    let dataToSave = existingData;
    dataToSave[idData] = { ...dataToSave[idData], ...data };

    let savingData;

    try {
      savingData = await dbIndex.postData(dataToSave);
    } catch (error) {
      savingData = null;
    }

    if (savingData.success) {
      return res.status(200).json({ success: true, message: 'updating data succesful' });
    }

    return res.status(400).json({ success: false, message: 'updating data failed' });
  }

  return res.status(404).json({ success: false, message: 'data not found' });
}

exports.deleteMethod = async (req, res, next) => {
  let { id } = req.params;

  let existingData;

  try {
    existingData = await dbIndex.getData(req);

    if (existingData) {
      existingData = existingData.data;
    }
  } catch (error) {
    existingData = [];
  }

  let idData = existingData.findIndex(theData => theData.id == id);

  if (idData != -1) {
    let dataToSave = existingData.filter(theData => theData.id != id);

    let savingData;

    try {
      savingData = await dbIndex.postData(dataToSave);
    } catch (error) {
      savingData = null;
    }

    if (savingData.success) {
      return res.status(200).json({ success: true, message: 'deleting data succesful' });
    }

    return res.status(400).json({ success: false, message: 'deleting data failed' });
  }

  return res.status(404).json({ success: false, message: 'data not found' });
}

exports.saveFile = async (req, res, next) => {
  console.log(req.files);
  if (!req.files) {
    return res.status(400).json({ message: 'file not found.' });
  }

  let { files } = req.files;

  try {
    await files.mv((path.join(__dirname, `../public/images/${files.name}`)));

    return res.status(200).json({
      success: true,
      path: `/images/${files.name}`,
      message: 'file uploaded'
    });
  } catch (error) {
    return res.status(500).send(error);
  }
}
