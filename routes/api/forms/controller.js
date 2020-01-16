const createErrors = require('http-errors');
const { Types } = require('mongoose');
const { AppForm, Questionnaire } = require('../../../models');

const getForms = async (req, res, next) => {
  try {
    const data = await AppForm.find().sort('-no').populate({ path: 'author', select: 'name' });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

const getMyForms = async (req, res, next) => {
  try {
    const data = await AppForm.find({ author: req.user._id }).sort('-no').populate({ path: 'author', select: 'name' });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

const getOpenForms = async (req, res, next) => {
  try {
    const data = await AppForm.find({ open: true }).sort('-no').populate({ path: 'author', select: 'name' });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

const getForm = async (req, res, next) => {
  const { id } = req.params;
  let query;

  try {
    const no = Number(id);
    if (isNaN(no)) query = AppForm.findById(id);
    else query = AppForm.findByNo(no);
    const data = await query.populate({ path: 'author', select: 'name' }).exec();

    if (!data)
      return next(createErrors(404, '찾을 수 없는 신청서 양식입니다.'));
    if (!data.open && (!req.user || req.user.role !== 'admin'))
      return next(createErrors(403, '접근할 수 없습니다.'));

    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

const getQuestionnaires = async (req, res, next) => {
  const { id } = req.params;

  try {
    const questionnaires = await Questionnaire.find({ form: Types.ObjectId(id) });
    res.json(questionnaires);
  } catch (e) {
    next(e);
  }
};

const createForm = async (req, res, next) => {
  const form = req.body;
  try {
    form.author = req.user._id;
    await AppForm.create(form);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

const submitQuestionnaire = async (req, res, next) => {
  const { id } = req.params;
  const { contents } = req.body;

  try {
    const form = await AppForm.findById(id);

    if (!form) return next(404, '찾을 수 없는 신청서 양식입니다.');
    if (!form.response) return next(createErrors(400, '마감된 신청서입니다.'));
    if (!form.open) return next(createErrors(403, '권한이 없습니다.'));

    console.log(form);

    const valid = form.sections.reduce((acc, cur, i) =>
      acc && cur.forms.filter(f => f.type !== 'description').reduce((a, c, j) => {
        let r = true;
        if (r && c.required && !contents[i][String(j)]) r = false;
        return a && r;
      }, true), true);

    if (!valid) return next(createErrors(400, '올바르지 않은 제출 양식입니다.'));

    await Questionnaire.create({ contents, form: id });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

const updateForm = async (req, res, next) => {
  const { id } = req.params;
  const updated = req.body;

  try {
    const form = await AppForm.findById(id);
    if (!form) return next(createErrors(404, '찾을 수 없는 신청서 양식입니다.'));
    const responseCount = await Questionnaire.countDocuments({ form: form._id });
    if (responseCount > 0) return next(createErrors(400, '이미 응답한 데이터가 있어 수정할 수 없습니다.'));

    await form.update({ $set: updated });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

const setOpen = async (req, res, next) => {
  const { id } = req.params;
  const { open } = req.body;

  try {
    const form = await AppForm.findById(id);
    if (!form) return next(404, '찾을 수 없는 신청서 양식입니다.');
    form.open = open;
    await form.save();
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

const setResponse = async (req, res, next) => {
  const { id } = req.params;
  const { response } = req.body;

  try {
    const form = await AppForm.findById(id);
    if (!form) return next(404, '찾을 수 없는 신청서 양식입니다.');
    form.response = response;
    await form.save();
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

const removeForm = async (req, res, next) => {
  const { id } = req.params;

  const form = await AppForm.findById(id);
  if (!form) return next(createErrors(404, '찾을 수 없는 신청서 양식입니다.'));
  await Promise.all([form.deleteOne(), Questionnaire.deleteMany({ form: form._id })]);
  res.json({ success: true });
};

exports.getForms = getForms;
exports.getMyForms = getMyForms;
exports.getOpenForms = getOpenForms;
exports.getForm = getForm;
exports.getQuestionnaires = getQuestionnaires;
exports.createForm = createForm;
exports.submitQuestionnaire = submitQuestionnaire;
exports.updateForm = updateForm;
exports.setOpen = setOpen;
exports.setResponse = setResponse;
exports.removeForm = removeForm;
