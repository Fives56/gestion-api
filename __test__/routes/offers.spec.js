const request = require('supertest');
const app = require('./../../src/app');
const offerService = require('./../../src/services/offer.service');

jest.mock('./../../src/services/offer.service');
jest.mock('../../src/models');

describe('GET /offer', () => {
    it('responds with a 200 status code', async () => {
        const response = await request(app)
        .get('/offer')
        .send();

        expect(response.statusCode).toBe(200);
    })  
});

describe('POST /offer', () => {
    it('responds with a 200 status code', async () => {
        const mockOffer = {
            name: 'Test offer',
            price: 100
        }
        offerService.createOrUpdate.mockResolvedValue(mockOffer);

        const response = await request(app)
        .post('/offer')
        .send(mockOffer);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockOffer)
    })
});

describe('POST /offer/:id', () => {
    it('responds with a 200 status code', async () => {
        const mockOffer = {
                name: 'Test offer',
                price: 100
            }
        offerService.createOrUpdate.mockResolvedValue(mockOffer);

        const response = await request(app)
        .put(`/offer/${mockOffer.id}`)
        .send(mockOffer);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockOffer)
    })

    it('responds with status 404 if id is missing', async () =>{
        const response = await request(app)
        .put('/offer/')

        expect(response.statusCode).toBe(404);
    })
});

describe('DELETE /offer/:id', () => {
    it('responds with status 200', async () => {
        const response = await request(app).delete(`/offer/:0`)

        expect(response.statusCode).toBe(200);
    })

    it('responds with status 404 if id is missing', async () =>{
        const response = await request(app).delete('/offer/')

        expect(response.statusCode).toBe(404);
    })
});

