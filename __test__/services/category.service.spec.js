const db = require('../../src/models');
const service = require('../../src/services/category.service');

jest.mock('../../src/models');

describe('get()', () => {
  let mockCategories;

  beforeEach(() => {
    mockCategories = [
      { name: 'Test category' }
    ];
  });
  
  it('should return an array of categories', async () => {
    db.Category.findAndCountAll.mockReturnValue(mockCategories);
    const querys = {
        search: '',
        order: 'name',
        direction: 'ASC',
        pagination: true,
        limit: 10,
        offset: 0
      };
    const categories = await service.get(querys);

    expect(Array.isArray(categories)).toBe(true);
    expect(categories).toEqual(mockCategories);
  });
});

describe('createOrUpdate()', () => {
  it('should edit a category if body.id is not null', async () => {
    const mockCategory = {
      id: 1,
      name: 'Test category',
      update: jest.fn(),
    };
    db.Category.findByPk.mockResolvedValue(mockCategory);

    const body = {
      id: 1,
      name: 'Updated category',
    };
    const category = await service.createOrUpdate(body);

    expect(mockCategory.update).toHaveBeenCalledWith({
      name: 'Updated category',
    });
    expect(category).toEqual(mockCategory);
  });

  it('should create a category if body.id is null', async () => {
    const expectCategory = {
      name: 'Test category',
    };
    db.Category.create.mockResolvedValue(expectCategory);

    const category = await service.createOrUpdate(expectCategory);

    expect(category).toEqual(expectCategory);
  });

  it('should send a error if body.id is not in db', async () => {
    db.Category.findByPk.mockResolvedValue(null);

    const body = {
      id: 1,
      name: 'Test category',
    };

    await expect(service.createOrUpdate(body)).rejects.toThrow(
      `Category with ID ${body.id} not found.`
    );
  });
});

describe('del()', () => {
  it('should delete a category if exist', async () => {
    const mockCategory = {
      id: 1,
      name: 'Test category',
      destroy: jest.fn()
    };
    db.Category.findByPk.mockReturnValue(mockCategory);

    expect(await service.del(mockCategory.id)).toEqual(
      'The category 1 has been deleted.'
    );
  });
  
  it('should send a error if category is null', async () => {
    db.Category.findByPk.mockResolvedValue(null);
    await expect(service.del(999)).rejects.toThrow(
      'Category with ID 999 not found.'
    );
  });
});
