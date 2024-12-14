import {
  getModelForClass,
  index,
  modelOptions,
  prop,
  Ref,
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

  @prop({ ref: () => Category })
  parent?: Ref<Category>;

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
  idNameMap: Record<string, string>;
};

function createTreeNode(
  { categoryMap, idNameMap }: State,
  currentNode: string
) {
  const node = new CategoryTreeNode();
  node.id = currentNode;
  node.name = idNameMap[currentNode] || 'root';
  for (const category of categoryMap[currentNode] || []) {
    node.children.push(
      createTreeNode({ categoryMap, idNameMap }, category._id)
    );
  }
  return node;
}

export function flatToTree(data: Category[]) {
  const categoryMap: Record<string, Category[]> = {};
  const idNameMap: Record<string, string> = {};
  for (const category of data) {
    const parent = (category.parent as string) || 'root';
    if (!categoryMap[category.parent as string]) {
      categoryMap[parent] = [];
    }
    categoryMap[parent].push(category);
    if (!idNameMap[category._id]) {
      idNameMap[category._id] = category.name;
    }
  }
  idNameMap['root'] = null;
  return createTreeNode({ categoryMap, idNameMap }, 'root');
}
