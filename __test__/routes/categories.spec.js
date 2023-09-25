const request = require('supertest');
const app = require('./../../src/app');
const categoryService = require('./../../src/services/category.service');

jest.mock('./../../src/services/category.service');
jest.mock('../../src/models');

describe('GET /category', () => {
    it('responds with a 200 status code', async () => {
        const response = await request(app)
        .get('/category')
        .send();

        expect(response.statusCode).toBe(200);
    })  
});

describe('POST /category', () => {
    it('responds with a 200 status code', async () => {
        const mockCategory = { name: 'Test category' }
        categoryService.createOrUpdate.mockResolvedValue(mockCategory);

        const response = await request(app)
        .post('/category')
        .send(mockCategory);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockCategory)
    })
});

describe('PUT /category/:id', () => {
    it('responds with a 200 status code', async () => {
        const mockCategory = { name: 'Test category' }
        categoryService.createOrUpdate.mockResolvedValue(mockCategory);

        const response = await request(app)
        .put(`/category/${mockCategory.id}`)
        .send(mockCategory);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockCategory)
    })

    it('responds with status 404 if id is missing', async () =>{
        const response = await request(app)
        .put('/category/')

        expect(response.statusCode).toBe(404);
    })
});

describe('DELETE /category/:id', () => {
    it('responds with status 200', async () => {
        const response = await request(app).delete(`/category/:0`)

        expect(response.statusCode).toBe(200);
    })

    it('responds with status 404 if id is missing', async () =>{
        const response = await request(app).delete('/category/')

        expect(response.statusCode).toBe(404);
    })
});

