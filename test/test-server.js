process.env.NODE_ENV = 'test'

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose')

const server = require('../server/app');
const Blob = require('../server/models/blob')

const should = chai.should();
chai.use(chaiHttp);


describe('Blobs', function() {

    beforeEach(function(done) {
        const newBlob = new Blob({
            name: 'Bat',
            lastName: 'man'
        })

        newBlob.save(function(err) {
            done()
        })
    })

    afterEach(function(done) {
        Blob.collection.drop()
        done()
    })



    it('should list ALL blobs on /blobs GET', function(done) {
        chai.request(server)
          .get('/blobs')
          .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body[0].should.be.a('object')
            res.body[0].should.have.property('name')
            res.body[0].should.have.property('lastName')
            res.body[0].should.have.property('_id')
            res.body[0].name.should.equal('Bat')
            res.body[0].lastName.should.equal('man')
            done();
          });
      });

    it('should list a SINGLE blob on /blob/<id> GET', function(done) {
        const newBlob = Blob({
            name: 'New',
            lastName: 'Blob'
        })

        newBlob.save(function(err, data) {
            chai.request(server)
                .get(`/blob/${data._id}`)
                .end(function(err, res) {
                    res.should.have.status(200)
                    res.should.be.json;
                    res.body.should.be.a('object')
                    res.body.should.have.property('name')
                    res.body.should.have.property('lastName')
                    res.body.should.have.property('_id')
                    res.body.name.should.equal(newBlob.name)
                    res.body.lastName.should.equal(newBlob.lastName)
                    res.body._id.should.equal(data.id)
                    done()
                })
        })
    });

    it('should add a SINGLE blob on /blobs POST', function(done) {
        const name = 'Java'
        const lastName = 'Script'

        chai.request(server)
          .post('/blobs')
          .send({'name': name, 'lastName': lastName})
          .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('SUCCESS');
            res.body.SUCCESS.should.be.a('object');
            res.body.SUCCESS.should.have.property('name');
            res.body.SUCCESS.should.have.property('lastName');
            res.body.SUCCESS.should.have.property('_id');
            res.body.SUCCESS.name.should.equal(name);
            res.body.SUCCESS.lastName.should.equal(lastName);
            done();
          });
      });

    it('should update a SINGLE blob on /blob/<id> PUT', function(done) {
        chai.request(server)
            .get('/blobs')
            .end(function(err, res) {
                chai.request(server)
                    .put(`/blob/${res.body[0]._id}`)
                    .send({ 'name': 'Spider' })
                    .end(function(error, response) {
                        response.should.have.status(200);
                        response.should.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('UPDATED');
                        response.body.UPDATED.should.be.a('object');
                        response.body.UPDATED.should.have.property('name');
                        response.body.UPDATED.should.have.property('_id');
                        response.body.UPDATED.name.should.equal('Spider');
                        done();
                    })
            })
    });
    
    it('should delete a SINGLE blob on /blob/<id> DELETE', function(done) {
        chai.request(server)
            .get('/blobs')
            .end(function(err, res){
            chai.request(server)
                .delete('/blob/'+res.body[0]._id)
                .end(function(error, response){
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('REMOVED');
                response.body.REMOVED.should.be.a('object');
                response.body.REMOVED.should.have.property('name');
                response.body.REMOVED.should.have.property('_id');
                response.body.REMOVED.name.should.equal('Bat');
                done();
            });
            });
    });
});