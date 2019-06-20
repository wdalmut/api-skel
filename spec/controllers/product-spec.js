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

  fit('should list products', (done) => {
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

  it('should get an product', (done) => {
    request(app)
      .get('/v1/product/1')
      .set('Authorization', 'Bearer admin')
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err
        }

        expect(R.pick(['code'], res.body)).toEqual({ code: 'wdalmut' })
        done()
      })
  })

  it('should reply with 404 on missing product', (done) => {
    request(app)
      .get('/v1/product/571398')
      .set('Authorization', 'Bearer admin')
      .expect(404, done)
  })

  it('should create a new products', (done) => {
    request(app)
      .post('/v1/product')
      .set('Authorization', 'Bearer admin')
      .send({
        code: 'admin@gmail.com',
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err
        }

        expect(R.pick(['code'], res.body)).toEqual({ code: 'admin@gmail.com' })
        expect(R.not(R.isNil(res.body.created_at))).toBe(true)
        expect(R.isNil(res.body.updated_at)).toBe(true)
        done()
      })
  })

  it('should cannot create a products with an existing code', (done) => {
    request(app)
      .post('/v1/product')
      .set('Authorization', 'Bearer admin')
      .send({
        code: 'wdalmut',
      })
      .expect(409, done)
  })

  it('should update products information', (done) => {
    request(app)
      .patch('/v1/product/1')
      .set('Authorization', 'Bearer admin')
      .send({
        code: 'hello',
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err
        }

        expect(R.pick(['code'], res.body)).toEqual({
          code: 'hello',
        })
        expect(R.not(R.isNil(res.body.created_at))).toBe(true)
        expect(R.not(R.isNil(res.body.updated_at))).toBe(true)
        done()
      })
  })

  it('should cannot update products information on existing codes', (done) => {
    request(app)
      .patch('/v1/product/1')
      .set('Authorization', 'Bearer admin')
      .send({
        code: 'gmittica',
      })
      .expect(409, done)
  })
})
