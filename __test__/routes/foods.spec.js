const request = require('supertest');
const app = require('./../../src/app');
const foodService = require('./../../src/services/food.service');

jest.mock('./../../src/services/food.service');
jest.mock('../../src/models');

describe('GET /food', () => {
    it('responds with a 200 status code', async () => {
        const response = await request(app)
        .get('/food')
        .send();

        expect(response.statusCode).toBe(200);
    })  
});

describe('POST /food', () => {
    it('responds with a 200 status code', async () => {
        const mockFood = {
            name: 'Test food',
            amount: '100 g',
            price: 100, 
            picture: 'https://example.com/test.jpg',
            categoryId: 1,
        }
        foodService.createOrUpdate.mockResolvedValue(mockFood);

        const response = await request(app)
        .post('/food')
        .send(mockFood);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockFood)
    })
});

describe('POST /food/:id', () => {
    it('responds with a 200 status code', async () => {
        const mockFood = {
            name: 'Test food',
            amount: '100 g',
            price: 100, 
            picture: 'https://example.com/test.jpg',
            categoryId: 1,
        }
        foodService.createOrUpdate.mockResolvedValue(mockFood);

        const response = await request(app)
        .put(`/food/${mockFood.id}`)
        .send(mockFood);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockFood)
    })

    it('responds with status 404 if id is missing', async () =>{
        const response = await request(app)
        .put('/food/')

        expect(response.statusCode).toBe(404);
    })
});

describe('DELETE /food/:id', () => {
    it('responds with status 200', async () => {
        const response = await request(app).delete(`/food/:0`)

        expect(response.statusCode).toBe(200);
    })

    it('responds with status 404 if id is missing', async () =>{
        const response = await request(app).delete('/food/')

        expect(response.statusCode).toBe(404);
    })
});

