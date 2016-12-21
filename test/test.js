let assert = require('chai').assert;
let service = require('../app/services/sealerService');
let bubbletree = require('./data/bubbletree');
let phantom = require('phantom');
let fs = require('fs');
let config = require('config');

describe('Sealer', function () {


    let base_dir = config.get('working_directory');
    let working_dir = base_dir + '/' + 'test';
    let package_path = working_dir + '/' + 'package.zip';
    let signed_path = working_dir + '/' + 'test' + '.zip';

    it('Should find SVG element', function (done) {
        phantom.create()
            .then((instance) => instance.createPage())
            .then(function (page) {
                page.property('content', bubbletree.html).then(function () {
                    service.loadContent(page).then(function () {
                        done();
                    });
                });
            });
    }).timeout(10000);

    it('Should store rendered images', function (done) {
        phantom.create()
            .then((instance) => instance.createPage())
            .then(function (page) {
                page.property('content', bubbletree.html).then(function () {
                    service.renderImages(page, working_dir).then(function () {
                        fs.stat(working_dir, function (err) {
                            assert.equal(err, null);
                            done();
                        });
                    });
                });
            });
    }).timeout(10000);

    it('Should compress existing images', function (done) {
        phantom.create()
            .then((instance) => instance.createPage())
            .then(function (page) {
                page.property('content', bubbletree.html).then(function () {
                    service.zipFiles('./test/data/images', package_path).then(function () {
                        fs.stat(package_path, function (err) {
                            assert.equal(err, null);
                            done();
                        });
                    });
                });
            });
    }).timeout(10000);

    it('Should sign compressed file', function (done) {
        phantom.create()
            .then((instance) => instance.createPage())
            .then(function (page) {
                page.property('content', bubbletree.html).then(function () {
                    service.signFile('./test/data/compressed/678bfd6413ea2e5cac3b23a50e0af6cc.zip', signed_path).then(function () {
                        fs.stat(signed_path, function (err) {
                            assert.equal(err, null);
                            done();
                        });
                    });
                });
            });
    }).timeout(10000);



    it('Should verify signed file', function (done) {
        phantom.create()
            .then((instance) => instance.createPage())
            .then(function (page) {
                page.property('content', bubbletree.html).then(function () {
                    service.verifySignedPackage('./test/data/compressed/test.zip').then(function (result) {
                        assert.equal(result, true);
                        done();
                    });
                });
            });
    }).timeout(10000);




});
