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
    res.status(500).send({ message: e.message });
  }
});

categoryApi.post('/', async (req, res) => {
  try {
    const category = await Category.model.create(
      new Category({
        name: req.body.name,
        parent: req.body.parent,
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
