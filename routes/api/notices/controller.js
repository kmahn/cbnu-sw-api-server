const createErrors = require('http-errors');
const { Notice } = require('../../../models');

const getNotices = async (req, res, next) => {
  try {
    const data = await Notice.find().sort('-no').populate({ path: 'author', select: 'name' });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

const getNotice = async (req, res, next) => {
  const { id } = req.params;
  try {
    const notice = await Notice.findById(id).populate({ path: 'author', select: 'name' });
    notice.hits++;
    notice.save();
    res.json({ success: true, data: notice });
  } catch (e) {
    next(e);
  }
};

const createNotice = async (req, res, next) => {
  let notice = req.body;
  delete notice._id;
  notice.author = req.user._id;
  try {
    notice = await Notice.create(notice);
    res.json({ success: true, data: notice._id });
  } catch (e) {
    next(e);
  }
};

const uploadImage = async (req, res, next) => {
  console.log(req.file);
  res.json({});
};

const updateNotice = async (req, res, next) => {
  const { id } = req.params;
  const $set = req.body;

  try {
    const notice = await Notice.findById(id);
    if (String(notice.author) !== String(req.user._id)) {
      return next(createErrors(403, 'forbidden'));
    }
    await notice.updateOne({ $set });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

const removeNotice = async (req, res, next) => {
  const { id } = req.params;
  try {

  } catch (e) {
    next(e);
  }
};

exports.getNotices = getNotices;
exports.getNotice = getNotice;
exports.createNotice = createNotice;
exports.uploadImage = uploadImage;
exports.updateNotice = updateNotice;
exports.removeNotice = removeNotice;
