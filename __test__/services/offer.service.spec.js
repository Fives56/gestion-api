const db = require('../../src/models');
const service = require('../../src/services/offer.service');

jest.mock('../../src/models');

describe('get()', () => {
  let mockOffers;

  beforeEach(() => {
    mockOffers = {
      rows: [],
    };
  });
  
  it('should return an array of offers', async () => {
    db.Offer.findAndCountAll.mockReturnValue(mockOffers);
    const querys = {
        search: '',
        order: 'name',
        direction: 'ASC',
        pagination: true,
        limit: 10,
        offset: 0
      };
    const offers = await service.get(querys);

    expect(Array.isArray(offers.rows)).toBe(true);
    expect(offers).toEqual(offers);
  });
});

describe('createOrUpdate()', () => {
  it('should edit a offer if body.id is not null', async () => {
    const mockOffer = {
      id: 1,
      name: 'Test offer',
      price: 100,
      setCategories: jest.fn(),
      setFood: jest.fn(),
      update: jest.fn(),
    };
    db.Offer.findByPk.mockResolvedValue(mockOffer);

    const body = {
      id: 1,
      name: 'Updated offer',
      categories: [1, 2],
      foods: [1, 2]
    };
    const offer = await service.createOrUpdate(body);

    expect(mockOffer.update).toHaveBeenCalledWith({
      name: 'Updated offer',
    });
    expect(offer).toEqual(mockOffer);
  });

  it('should create a offer if body.id is null', async () => {
    const expectOffer = {
      name: 'Test offer',
      categories: [1, 2],
      foods: [1, 2],
      setCategories: jest.fn(),
      setFood: jest.fn(),
      update: jest.fn(),
    };
    db.Offer.create.mockResolvedValue(expectOffer);

    const offer = await service.createOrUpdate(expectOffer);

    expect(offer).toEqual(expectOffer);
  });

  it('should send a error if body.id is not in db', async () => {
    db.Offer.findByPk.mockResolvedValue(null);

    const body = {
      id: 1,
      name: 'Test offer',
    };

    await expect(service.createOrUpdate(body)).rejects.toThrow(
      `Offer with ID ${body.id} not found.`
    );
  });
});

describe('del()', () => {
  it('should delete a offer if exist', async () => {
    const mockOffer = {
      id: 1,
      name: 'Test offer',
      destroy: jest.fn()
    };
    db.Offer.findByPk.mockReturnValue(mockOffer);

    expect(await service.del(mockOffer.id)).toEqual(
      'The offer 1 has been deleted.'
    );
  });
  
  it('should send a error if offer is null', async () => {
    db.Offer.findByPk.mockResolvedValue(null);
    await expect(service.del(999)).rejects.toThrow(
      'Offer with ID 999 not found.'
    );
  });
});
