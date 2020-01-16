const createErrors = require('http-errors');
const cheerio = require('cheerio');
const { Notice, File } = require('../../../models');

const getUrls = async (id, notice) => {
  const attachments = await Promise.all(
    (notice.attachments || []).map(a => File.findById(typeof a === 'string' ? a : a._id))
  );
  const urls = attachments.map(a => a.url);
  const $ = cheerio.load(notice.content);
  $('img').each((i, img) => urls.push($(img).attr('src')));
  await File.updateMany({ url: { $in: urls } }, { target: id, targetModel: 'Notice' });
  return urls;
};

const removeFiles = async (target, urls) => {
  const files = (await File.find({ target, targetModel: 'Notice' }))
    .filter(file => !urls.includes(file.url));
  await Promise.all(files.map(file => file.deleteOne()));
};

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
  const no = Number(id);

  try {
    const query = Number.isNaN(no) ? Notice.findById(id) : Notice.findByNo(no);
    const notice = await query
      .populate({ path: 'author', select: 'name' })
      .populate({ path: 'attachments' })
      .exec();

    if (!notice) return next(createErrors(404, '찾을 수 없는 공지입니다.'));

    if (!req.user || req.user.role !== 'admin') notice.hits++;
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
    await removeFiles(notice._id, getUrls(notice._id, notice));
    res.json({ success: true, data: notice._id });
  } catch (e) {
    next(e);
  }
};

const upload = async (req, res, next) => {
  if (req.file) {
    const file = {
      url: `/uploads/${req.file.filename}`,
      target: null,
      targetModel: null,
      ...req.file,
    };
    res.json({ success: true, data: await File.create(file) });
  } else {
    res.json({ success: false })
  }
};

const updateNotice = async (req, res, next) => {
  const { id } = req.params;
  const $set = req.body;

  let query;
  const no = Number(id);

  if (Number.isNaN(no)) {
    query = Notice.findById(id);
  } else {
    query = Notice.findOne({ no });
  }

  try {
    const notice = await query.exec();
    if (String(notice.author) !== String(req.user._id)) {
      return next(createErrors(403, 'forbidden'));
    }
    await notice.updateOne({ $set });
    await removeFiles(id, await getUrls(notice._id, $set));

    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

const removeNotice = async (req, res, next) => {
  const { id } = req.params;
  try {
    const notice = await Notice.findById(id);
    if (!notice) {
      res.json({ success: false, message: 'notice is not existed.' });
    } else {
      await notice.deleteOne();
      await removeFiles(notice._id, getUrls(notice._id, notice));
      res.json({ success: true });
    }
  } catch (e) {
    next(e);
  }
};

exports.getNotices = getNotices;
exports.getNotice = getNotice;
exports.createNotice = createNotice;
exports.upload = upload;
exports.updateNotice = updateNotice;
exports.removeNotice = removeNotice;
