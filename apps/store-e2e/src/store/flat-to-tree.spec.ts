import { flatToTree } from '../../../store/src/category/category';

describe('flatToTree Function', () => {
  it('should convert a flat array into a tree structure', () => {
    const flatData = [
      { _id: '1', name: 'Electronics', parent: null },
      { _id: '2', name: 'Laptops', parent: '1' },
      { _id: '3', name: 'Phones', parent: '1' },
      { _id: '4', name: 'Gaming Laptops', parent: '2' },
    ];

    const expectedTree = {
      children: [
        {
          children: [
            {
              children: [{ children: [], id: '4', name: 'Gaming Laptops' }],
              id: '2',
              name: 'Laptops',
            },
            { children: [], id: '3', name: 'Phones' },
          ],
          id: '1',
          name: 'Electronics',
        },
      ],
      id: 'root',
      name: 'root',
    };

    const result = flatToTree(flatData);
    expect(result).toEqual(expectedTree);
  });

  it('should return only root node if input is empty', () => {
    const result = flatToTree([]);
    expect(result).toEqual({ children: [], id: 'root', name: 'root' });
  });

  it('should handle a flat array with no parent-child relationships', () => {
    const flatData = [
      { _id: '1', name: 'Electronics', parent: null },
      { _id: '2', name: 'Clothing', parent: null },
    ];

    const expectedTree = [
      { id: '1', name: 'Electronics', children: [] },
      { id: '2', name: 'Clothing', children: [] },
    ];

    const result = flatToTree(flatData);
    expect(result.children).toEqual(expectedTree);
  });

  it('should throw an error if input is invalid', () => {
    expect(() => {
      flatToTree(null as unknown as any[]);
    }).toThrow('data is not iterable');
  });
});
