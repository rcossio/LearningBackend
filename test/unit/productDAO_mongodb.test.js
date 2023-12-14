import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import ProductDAO from '../../src/data/mongo/dao/productsDAO.js';
import connectDB from '../../src/config/dbConnection.js';
import ProductsService from '../../src/services/products.js';

const { expect } = chai;
chai.use(chaiAsPromised);

describe('ProductDAO MongoDB', function () {
  let createdProductIds = [];

  before(async function() {
    await connectDB();
  });

  afterEach(async function() {
    for (const productId of createdProductIds) {
      try {
        await ProductDAO.deleteProduct(productId);
      } catch (err) {
        console.log(`       TEST MESSAGE: Unable to delete product ${productId}.`);
      }
    };
    createdProductIds = []; 
  });

  describe('addProduct', function () {
    it('should add a valid product', async function () {
      const product = {
        title: 'Test Product',
        description: 'Test Description',
        price: 10.0,
        thumbnails: ['thumbnail1', 'thumbnail2'],
        code: 'XYZ369',
        stock: 10,
        category: 'TestCategory',
        status: true,
        owner: 'admin'
      };
      const addedProduct = await ProductDAO.addProduct(product);
      createdProductIds.push(addedProduct._id);
      expect(addedProduct).to.have.property('_id');
      expect(addedProduct.title).to.equal('Test Product');
    });

    it('should add a valid product with mocker', async function () {
      const products = ProductsService.mockProducts(1);
      const addedProduct = await ProductDAO.addProduct(products[0]);
      createdProductIds.push(addedProduct._id);
      expect(addedProduct).to.have.property('_id');
    });

    it('should add a valid product without optional properties', async function () {
      const product = {
        title: 'Test Product',
        description: 'Test Description',
        price: 10.0,
        code: 'XYZ369',
        stock: 10,
        category: 'TestCategory',
      };
      const addedProduct = await ProductDAO.addProduct(product);
      createdProductIds.push(addedProduct._id);
      expect(addedProduct).to.have.property('_id');
      expect(addedProduct.title).to.equal('Test Product');
      expect(addedProduct.thumbnails).to.be.an('array');
      expect(addedProduct.thumbnails.length).to.equal(0);
      expect(addedProduct.status).to.equal(true);
      expect(addedProduct.owner).to.equal('admin');
    });

    it('should add a product with price ans stock parseable to Number', async function () {
      const product = {
          title: 'Test Product2',
          description: 'Test Description',
          price: '10.0',
          thumbnails: ['thumbnail1', 'thumbnail2'],
          code: 'TestCode',
          stock: '10',
          category: 'TestCategory',
          status: true
      };
      const addedProduct = await ProductDAO.addProduct(product);
      createdProductIds.push(addedProduct._id);
      expect(addedProduct.price).to.equal(10.0);
      expect(addedProduct.stock).to.equal(10);
    });

    it('should throw an error for incomplete product details', function () {
        const product = { title: 'Incomplete Product' };
        return expect(ProductDAO.addProduct(product)).to.be.rejected;
      });
    
    it('should throw an error for invalid price type (non-parseable to Number)', function () {
      const product = {
          title: 'Test Product2',
          description: 'Test Description',
          price: 'clearly-not-a-number',
          thumbnails: ['thumbnail1', 'thumbnail2'],
          code: 'TestCode',
          stock: 10,
          category: 'TestCategory',
          status: true
      };
      return expect(ProductDAO.addProduct(product)).to.be.rejected;
    });

    it('should throw an error for invalid stock type (non-parseable to Number)', function () {
      const product = {
          title: 'Test Product2',
          description: 'Test Description',
          price: 10.0,
          thumbnails: ['thumbnail1', 'thumbnail2'],
          code: 'TestCode',
          stock: 'clearly-not-a-number',
          category: 'TestCategory',
          status: true
      };
      return expect(ProductDAO.addProduct(product)).to.be.rejected;
    });

    it('should throw an error for negative stock', function () {
        const product = {
            title: 'Test Product3',
            description: 'Test Description',
            price: 10.0,
            thumbnails: ['thumbnail1', 'thumbnail2'],
            code: 'TestCode',
            stock: -5,
            category: 'TestCategory',
            status: true
        };
        return expect(ProductDAO.addProduct(product)).to.be.rejected;
    });
    
    it('should throw an error for duplicate product code', async function () {
        // First, add a product with a unique code
        const uniqueProduct = {
          title: 'Unique Product',
          description: 'Unique Description',
          price: 30.0,
          thumbnails: ['thumbnail1', 'thumbnail2'],
          code: 'UniqueCode123',
          stock: 15,
          category: 'UniqueCategory',
          status: true
        };
        const addedProduct = await ProductDAO.addProduct(uniqueProduct);
        createdProductIds.push(addedProduct._id);
      
        // Then, try to add another product with the same code
        const duplicateProduct = {
          title: 'Another Product',
          description: 'Another Description',
          price: 35.0,
          thumbnails: ['thumbnail3', 'thumbnail4'],
          code: 'UniqueCode123', // Same code as the uniqueProduct
          stock: 20,
          category: 'AnotherCategory',
          status: true
        };
        await expect(ProductDAO.addProduct(duplicateProduct)).to.be.rejected;
    });      

  });

  describe('getPaginatedProducts', function () {
    let createdProductIds = [];
    
    before(async function() {
      const products = ProductsService.mockProducts(10);
      for (const product of products) {
        const addedProduct = await ProductDAO.addProduct(product);
        createdProductIds.push(addedProduct._id);
      }
    });
  
    after(async function() {
      for (const productId of createdProductIds) {
        try {
          await ProductDAO.deleteProduct(productId);
        } catch (err) {
          console.log(`       TEST MESSAGE: Unable to delete product ${productId}.`);
        }
      }
    });

    it('should retrieve all products', async function () {
      const filter = {};
      const options = { limit: 99, page: 1 };
      const products = await ProductDAO.getPaginatedProducts(filter, options);
      expect(products).to.be.an('object');
      expect(products.docs).to.be.an('array');
      expect(products.docs.length).to.equal(10);
    });

    it('should retrieve products according to page and limit', async function () {
      const filter = {};
      const options = { limit: 7, page: 2 };
      const products = await ProductDAO.getPaginatedProducts(filter, options);
      expect(products).to.be.an('object');
      expect(products.docs).to.be.an('array');
      expect(products.docs.length).to.equal(3);
    });


    it('should return no products with non-existent category', async function () {
      const filter = { category: 'NonExistentCategory' };
      const options = { limit: 5, page: 1 };
      const result = await ProductDAO.getPaginatedProducts(filter, options)
      expect(result.docs.length).to.equal(0);
    });
  });

  describe('getProductById', function () {
    it('should retrieve a product by ID', async function () {
      // Add a product first
      const newProduct = {
          title: 'New Product',
          description: 'New Description',
          price: 20.0,
          thumbnails: ['thumbnail1', 'thumbnail2'],
          code: 'NewCode',
          stock: 10,
          category: 'NewCategory',
          status: true
      };
      const addedProduct = await ProductDAO.addProduct(newProduct);
      createdProductIds.push(addedProduct._id);

      const retrievedProduct = await ProductDAO.getProductById(addedProduct._id);
      //expect(retrievedProduct).to.be.an('object');
      expect(retrievedProduct._id).to.deep.equal(addedProduct._id);
    });

    it('should throw an error for non-existing ID', async function () {
      await expect(ProductDAO.getProductById('nonExistingId')).to.be.rejected;
    });
  });

  describe('updateProduct', function () {
    it('should update an existing product', async function () {
      // Add a product, then update it
      const originalProduct = {
          title: 'Original Product',
          description: 'Original Description',
          price: 20.0,
          thumbnails: ['thumbnail1', 'thumbnail2'],
          code: 'OriginalCode',
          stock: 10,
          category: 'OriginalCategory',
          status: true
      };
      const addedProduct = await ProductDAO.addProduct(originalProduct);
      createdProductIds.push(addedProduct._id);

      const updatedProductDetails = {
          title: 'Updated Product',
          description: 'Updated Description',
          price: 25.0,
          thumbnails: ['thumbnail3', 'thumbnail4'],
          code: 'UpdatedCode',
          stock: 15,
          category: 'UpdatedCategory',
          status: false
      };
      const updatedProduct = await ProductDAO.updateProduct(addedProduct._id, updatedProductDetails);

      expect(updatedProduct.title).to.equal('Updated Product');
      expect(updatedProduct.price).to.equal(25.0);
    });

    it('should throw an error when updating a non-existent product', async function () {
      const nonExistentProductId = 'non-existent-id';
      const updatedProductDetails = {
          title: 'Updated Product',
          description: 'Test Description',
          price: 10.0,
          thumbnails: ['thumbnail1', 'thumbnail2'],
          code: 'XYZ369',
          stock: 10,
          category: 'TestCategory',
          status: true,
      };
      await expect(ProductDAO.updateProduct(nonExistentProductId, updatedProductDetails)).to.be.rejected;
    });
  });

  describe('deleteProduct', function () {
    it('should delete an existing product', async function () {
      const product = {
          title: 'Product to Delete',
          description: 'Description',
          price: 15.0,
          thumbnails: ['thumbnail1', 'thumbnail2'],
          code: 'DeleteCode',
          stock: 5,
          category: 'DeleteCategory',
          status: true
      };
      const addedProduct = await ProductDAO.addProduct(product);
      createdProductIds.push(addedProduct._id);

      const deletionResult = await ProductDAO.deleteProduct(addedProduct._id);
      expect(deletionResult).to.be.an('object');
      expect(deletionResult.title).to.equal('Product to Delete');
    });

    it('should throw an error when deleting a non-existent product', async function () {
      const nonExistentProductId = 'non-existent-id';
      await expect(ProductDAO.deleteProduct(nonExistentProductId))
          .to.be.rejected;
    });
  });
});