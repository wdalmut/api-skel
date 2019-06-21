/* eslint-disable no-sequences */
/* eslint-disable no-undef */
/* global beforeEach describe it db_init expect */
/* eslint no-undef: 'error' */

const R = require('ramda')
const request = require('supertest')

describe('Product action', () => {
  beforeEach(db_init)

  let app

  beforeEach((done) => {
    app = require('../../src')
    done()
  })

  it('should list products', (done) => {
    request(app)
      .get('/v1/product')
      .set('Authorization', 'Bearer admin')
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err
        }

        expect(R.map(R.pick(['code']), res.body)).toEqual([
          { code: '12345abcde' },
          { code: 'reqsdc23459' },
          { code: 'lowesq90876' },
        ])

        done()
      })
  })
  it('should list products ROLE_USER', (done) => {
    request(app)
      .get('/v1/product')
      .set('Authorization', 'Bearer user')
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err
        }
        const status = 'ACTIVE'
        const differentStatus = R.propSatisfies(R.compose(R.not, R.equals(status)), 'status')
        expect(R.compose(R.isNil, R.find(differentStatus))(res.body)).toEqual(true)

        done()
      })
  })

  it('should list products filtered by query params status ACTIVE', (done) => {
    const status = 'ACTIVE'
    request(app)
      .get(`/v1/product?status=${status}`)
      .set('Authorization', 'Bearer admin')
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err
        }
        const differentStatus = R.propSatisfies(R.compose(R.not, R.equals(status)), 'status')
        expect(R.compose(R.isNil, R.find(differentStatus))(res.body)).toEqual(true)
        done()
      })
  })

  it('should get an product', (done) => {
    request(app)
      .get('/v1/product/2')
      .set('Authorization', 'Bearer admin')
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err
        }

        expect(R.pick(['code'], res.body)).toEqual({ code: 'reqsdc23459' })
        done()
      })
  })

  it('should get an product ROLE_USER', (done) => {
    request(app)
      .get('/v1/product/2')
      .set('Authorization', 'Bearer user')
      .expect(404, done)
  })

  it('should reply with 404 on missing product', (done) => {
    request(app)
      .get('/v1/product/571398')
      .set('Authorization', 'Bearer admin')
      .expect(404, done)
  })

  it('should create a new product ROLE_USER', (done) => {
    const body = {
      name: 'product 1',
      code: '23222',
      price: 53.22,
      exit_date: '2018-09-21',
      available: true,
    }

    request(app)
      .post('/v1/product')
      .set('Authorization', 'Bearer user')
      .send(body)
      .expect(201)
      .end((err, res) => {
        if (err) {
          throw err
        }
        expect(R.whereEq(body)(res.body)).toEqual(true)
        expect(res.body.status).toEqual('PENDING')
        expect(R.not(R.isNil(res.body.created_at))).toBe(true)
        expect(R.isNil(res.body.edited_at)).toBe(true)
        done()
      })
  })
  it('should create a new product ROLE_ADMIN', (done) => {
    const body = {
      name: 'product 1',
      code: '23222',
      price: 53.22,
      exit_date: '2018-09-21',
      available: true,
    }

    request(app)
      .post('/v1/product')
      .set('Authorization', 'Bearer admin')
      .send(body)
      .expect(201)
      .end((err, res) => {
        if (err) {
          throw err
        }
        // console.log(res.body)
        expect(R.whereEq(body)(res.body)).toEqual(true)
        expect(res.body.status).toEqual('ACTIVE')
        expect(R.not(R.isNil(res.body.created_at))).toBe(true)
        expect(R.isNil(res.body.edited_at)).toBe(true)
        done()
      })
  })

  it('should require all required fields on create products', (done) => {
    request(app)
      .post('/v1/product')
      .set('Authorization', 'Bearer admin')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          throw err
        }
        // console.log(res.body, res.error)

        const requiredProprieties = R.compose(R.keys, R.pickBy(R.equals('is required')))
        const expectedRequiredProprieties = ['name', 'code', 'price']
        expect(R.compose(R.isEmpty, R.symmetricDifference(expectedRequiredProprieties), requiredProprieties, R.prop('details'))(res.body)).toEqual(true)
        done()
      })
  })

  it('should cannot create a product with an existing code', (done) => {
    const body = {
      name: 'product 1',
      code: '12345abcde',
      price: 53.22,
      exit_date: '2018-09-21',
      available: true,
    }
    request(app)
      .post('/v1/product')
      .set('Authorization', 'Bearer admin')
      .send(body)
      .expect(409, done)
  })

  it('should update products information ROLE_ADMIN', (done) => {
    const body = {
      code: 'hello',
      price: 12.2,
      exit_date: null,
      available: null,
      status: 'ACTIVE',
    }
    const id = 2

    request(app)
      .patch(`/v1/product/${id}`)
      .set('Authorization', 'Bearer admin')
      .send(body)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err
        }

        expect(R.whereEq(body)(res.body)).toEqual(true)
        expect(R.equals(res.body.id, id)).toBe(true)
        expect(R.not(R.isNil(res.body.created_at))).toBe(true)
        expect(R.not(R.isNil(res.body.edited_at))).toBe(true)
        done()
      })
  })
  it('should update products information ROLE_USER', (done) => {
    const body = {
      code: 'hello',
      price: 12.2,
      exit_date: null,
      available: null,
    }
    const id = 2

    request(app)
      .patch(`/v1/product/${id}`)
      .set('Authorization', 'Bearer user')
      .send(body)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err
        }

        expect(R.whereEq(body)(res.body)).toEqual(true)
        expect(R.equals(res.body.id, id)).toBe(true)
        expect(R.not(R.isNil(res.body.created_at))).toBe(true)
        expect(R.not(R.isNil(res.body.edited_at))).toBe(true)
        done()
      })
  })
  it('should cannot update products information ROLE_USER not can send status', (done) => {
    const body = {
      code: 'hello',
      price: 12.2,
      exit_date: null,
      available: null,
      status: 'ACTIVE',
    }
    const id = 2

    request(app)
      .patch(`/v1/product/${id}`)
      .set('Authorization', 'Bearer user')
      .send(body)
      .expect(400)
      .end((err, res) => {
        if (err) {
          throw err
        }
        const requiredProprieties = R.compose(R.keys, R.pickBy(R.equals('is not allowed')))
        const expectedRequiredProprieties = ['status']
        expect(R.compose(R.isEmpty, R.symmetricDifference(expectedRequiredProprieties), requiredProprieties, R.prop('details'))(res.body)).toEqual(true)
        done()
        done()
      })
  })

  it('should cannot update products information on existing code', (done) => {
    request(app)
      .patch('/v1/product/2')
      .set('Authorization', 'Bearer admin')
      .send({
        code: 'lowesq90876',
      })
      .expect(409, done)
  })
})
