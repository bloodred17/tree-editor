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
    console.log(parent);
    const category = await Category.model.create(
      new Category({
        name: req.body.name?.toLowerCase(),
        parent: parent,
      })
    );
    res.send({
      success: true,
      data: category,
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
    res.send({
      success: true,
      data: updated,
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
    res.send({
      success: true,
      data: deleted,
      message: 'Category deleted!',
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: e.message,
    });
  }
});
