const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');
const faker = require('faker');
const bodyParts = ['Chest', 'Sleeve Length', 'Waist', 'Inseam'];
const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

const createProducts = function(fileName) {
  return createCsvWriter({  
    path: __dirname + `/test/products/${fileName}.csv`,
    header: [
      {id: 'product_name', title: 'product_name'}
    ]
  });
}
const createPAVs = function(fileName) {
  return createCsvWriter({
    path: __dirname + `/test/pavs/${fileName}.csv`,
    header: [
      {id: 'link_to_image', title: 'link_to_image'},
      {id: 'star_rating', title: 'star_rating'},
      {id: 'review_count', title: 'review_count'},
      {id: 'short_description', title: 'short_description'},
      {id: 'price', title: 'price'},
      {id: 'product_id', title: 'product_id'} 
    ]
  });
}
const createSize = function(fileName) {
  return createCsvWriter({
    path: __dirname + `/test/sizeChart/${fileName}.csv`,
    header: [
      {id: 'bodyPart', title: 'bodyPart'},
      {id: 'size', title: 'size'},
      {id: 'measurement', title: 'measurement'}
    ]
  });
}


const createFakeProduct = () => ({
  product_name: faker.commerce.product(),
});
const createFakePAV = (productId, image) => ({
  star_rating: faker.random.number({ min: 0, max: 100 }),
  review_count: faker.random.number({ min: 1, max: 100 }),
  short_description: faker.commerce.productName(),
  price: faker.commerce.price(),
  link_to_image: `https://s3.us-east-2.amazonaws.com/sdc-beareipavs/${image}.jpg`,
  product_id: productId
});

const makeData = async function() {
  // fs.mkdirSync('./db/test/products/', {recursive: true});
  // fs.mkdirSync('./db/test/pavs/', {recursive: true});
  // fs.mkdirSync('./db/test/sizeChart/', {recursive: true});

  const clearFiles = async function(directory) {
    await fs.readdir(directory, (err, files) => {
      if (err) throw err;
      for (const file of files) {
        fs.unlink(path.join(directory, file), err => {
          if (err) throw err;
        });
      }
    });
  }

  const products = async function() {
    for (var i = 0; i < 100; i++) {
      var fakeProducts = [];
    
      for (var j = 0; j < 100000; j++) {
        fakeProducts.push(createFakeProduct());
      }
      
      await createProducts(i)  
        .writeRecords(fakeProducts)
        .then(()=> console.log(`Wrote products ${i}`));
    }
  }

  const pavs = async function() {
    var image;

    for (var m = 0; m < 100 ; m++) {
      var fakePAVs = [];
      for (var n = 0; n < 100000; n++) {
        for (var v = 0; v < 4; v ++) {
          image = Math.floor(Math.random() * 400 + 1);
          fakePAVs.push(createFakePAV((m * 100000) + n + 1, image));
        }
      }
    
      await createPAVs(m)
        .writeRecords(fakePAVs)
        .then(()=> console.log(`Wrote pavs ${m}`));
    }
  }

  const sizeChart = async function() {
    var fakeProducts = [];
    var aProd = {};

    bodyParts.forEach((elementP) => {
      sizes.forEach((elementS) => {

        aProd.bodyPart = elementP;
        aProd.size = elementS;
        aProd.measurement = faker.random.number({
          min: 26,
          max: 52,
        });
        fakeProducts.push(aProd);
        aProd = {};
      });
    });
    
    await createSize(1)  
      .writeRecords(fakeProducts)
      .then(()=> console.log('Wrote sizeChart'));
  }

  clearFiles('./db/test/products')
    .then (() => clearFiles('./db/test/pavs'))
    .then (() => clearFiles('./db/test/sizeChart'))
    .then(() => products())
    .then(() => pavs())
    .then (() => sizeChart());
}

makeData();