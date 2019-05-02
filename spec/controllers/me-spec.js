/* global beforeEach describe it db_init expect */
/* eslint no-undef: 'error' */

const request = require('supertest')

describe('User action', () => {
  beforeEach(db_init)

  let app

  beforeEach((done) => {
    app = require('../..')
    done()
  })

  it('should expose my information as user', (done) => {
    request(app)
      .get('/v1/me')
      .set('Authorization', 'Bearer test')
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err
        }

        expect(res.body.username).toEqual('test-user@gmail.com')
        done()
      })
  })
})
