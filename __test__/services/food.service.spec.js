const db = require('../../src/models');
const service = require('../../src/services/food.service');

jest.mock('../../src/models');

describe('get()', () => {
  let mockFoods;

  beforeEach(() => {
    mockFoods = [{
      name: 'Test food',
      amount: '100 g',
      price: 100, 
      picture: 'https://example.com/test.jpg',
      categoryId: 1,
    }];
  });
  
  it('should return an array of foods', async () => {
    db.Food.findAndCountAll.mockReturnValue(mockFoods);
    const querys = {
        search: '',
        order: 'name',
        direction: 'ASC',
        pagination: true,
        limit: 10,
        offset: 0
      };
    const foods = await service.get(querys);

    expect(Array.isArray(foods)).toBe(true);
    expect(foods).toEqual(foods);
  });
});

describe('createOrUpdate()', () => {
  it('should edit a food if body.id is not null', async () => {
    const mockFood = {
      name: 'Test food',
      amount: '100 g',
      price: 100, 
      picture: 'https://example.com/test.jpg',
      categoryId: 1,
      update: jest.fn(),
    };
    db.Food.findByPk.mockResolvedValue(mockFood);

    const body = {
      id: 1,
      name: 'Updated food',
    };
    const food = await service.createOrUpdate(body);

    expect(mockFood.update).toHaveBeenCalledWith({
      name: 'Updated food',
    });
    expect(food).toEqual(mockFood);
  });

  it('should create a food if body.id is null', async () => {
    const expectFood = {
      name: 'Test food',
    };
    db.Food.create.mockResolvedValue(expectFood);

    const food = await service.createOrUpdate(expectFood);

    expect(food).toEqual(expectFood);
  });

  it('should send a error if body.id is not in db', async () => {
    db.Food.findByPk.mockResolvedValue(null);

    const body = {
      id: 1,
      name: 'Test food',
      amount: '100 g',
      price: 100, 
      picture: 'https://example.com/test.jpg',
      categoryId: 1,
    };

    await expect(service.createOrUpdate(body)).rejects.toThrow(
      `Food with ID ${body.id} not found.`
    );
  });
});

describe('del()', () => {
  it('should delete a food if exist', async () => {
    const mockFood = {    
      id: 1,  
      name: 'Test food',
      amount: '100 g',
      price: 100, 
      picture: 'https://example.com/test.jpg',
      categoryId: 1, 
      destroy: jest.fn()
    };
    db.Food.findByPk.mockReturnValue(mockFood);

    expect(await service.del(mockFood.id)).toEqual(
      'The food 1 has been deleted.'
    );
  });
  
  it('should send a error if food is null', async () => {
    db.Food.findByPk.mockResolvedValue(null);
    await expect(service.del(999)).rejects.toThrow(
      'Food with ID 999 not found.'
    );
  });
});
