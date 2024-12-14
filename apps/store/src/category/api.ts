import { Router } from 'express';
import { Category, flatToTree } from './category';

export const categoryApi = Router();

categoryApi.get('/', async (req, res) => {
  try {
    const entries = await Category.model.find({});
    const tree = flatToTree(entries);
    res.send({
      success: true,
      data: tree,
      message: 'Categories fetched!',
    });
  } catch (e) {
    res.status(500).send({ success: false, message: e.message });
  }
});

categoryApi.post('/', async (req, res) => {
  try {
    const parent = await Category.model.findOne({ _id: req.body.parent });
    const category = await Category.model.create(
      new Category({
        name: req.body.name?.toLowerCase(),
        parent: parent,
      })
    );
    const entries = await Category.model.find({});
    res.send({
      success: true,
      // data: category,
      data: flatToTree(entries),
      message: 'Category created!',
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: e.message,
    });
  }
});

categoryApi.put('/', async (req, res) => {
  try {
    const updated = await Category.model.findOneAndUpdate(
      {
        _id: req.body.id,
      },
      {
        name: req.body.name?.toLowerCase(),
      }
    );
    const entries = await Category.model.find({});
    res.send({
      success: true,
      // data: updated,
      data: flatToTree(entries),
      message: 'Category updated!',
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: e.message,
    });
  }
});

categoryApi.delete('/:id', async (req, res) => {
  try {
    const deleted = await Category.model.findOneAndDelete({
      $or: [{ _id: req.params.id }, { parent: req.params.id }],
    });
    const entries = await Category.model.find({});
    res.send({
      success: true,
      // data: deleted,
      data: flatToTree(entries),
      message: 'Category deleted!',
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: e.message,
    });
  }
});
