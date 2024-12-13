import {
  getModelForClass,
  index,
  modelOptions,
  prop,
} from '@typegoose/typegoose';

export class CategoryTreeNode {
  id: string;
  name: string;
  children: CategoryTreeNode[] = [];
}

@modelOptions({ schemaOptions: { collection: 'categories' } })
@index({ name: 1, parent: 1 }, { unique: true })
export class Category {
  _id?: string;

  @prop()
  name: string;

  @prop()
  parent: string;

  static get model() {
    return getModelForClass(Category);
  }

  constructor(init?: Partial<Category>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

type State = {
  categoryMap: Record<string, Category[]>;
  ids: Record<string, string>;
};

function createTreeNode({ categoryMap, ids }: State, currentNode: string) {
  const node = new CategoryTreeNode();
  node.name = currentNode;
  node.id = ids[currentNode];
  for (const category of categoryMap[currentNode] || []) {
    node.children.push(createTreeNode({ categoryMap, ids }, category.name));
  }
  return node;
}

export function flatToTree(data: Category[]) {
  const categoryMap: Record<string, Category[]> = {};
  const ids: Record<string, string> = {};
  for (const category of data) {
    if (!categoryMap[category.parent]) {
      categoryMap[category.parent] = [];
    }
    categoryMap[category.parent].push(category);
    if (!ids[category.name]) {
      ids[category.name] = category._id;
    }
  }
  return createTreeNode({ categoryMap, ids }, 'root');
}
