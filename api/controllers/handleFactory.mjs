// import { AppError } from '../utils/appError';
import catchAsync from '../utils/catchAsync.mjs';

export const getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const doc = await query;

    if (!doc) {
      return next(new Error('No document found with that ID'), 404);
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const getAll = (Model, populateOptions) =>
  catchAsync(async (req, res) => {
    let query = Model.find();
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const docs = await query;
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        docs,
      },
    });
  });
