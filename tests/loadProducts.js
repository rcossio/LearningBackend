import * as mongoose from 'mongoose';
import productModel from "../src/model/products.model.js";


const DB_HOST = 'localhost'
const DB_PORT = 27017
const DB_NAME = 'ecommerce'

let productsData = [
    {
        title:      'First product', 
        description:'Description of the product', 
        price:      '200',
        thumbnail:  [],
        code:       'ABC123',
        stock:      '10',
        category:   'Kitchen',
        status: true
    },
    {
        title:      'Second product', 
        description:'Description of the product', 
        price:      '150',
        thumbnail:  [],
        code:       'UUU875',
        stock:      '30',
        category:   'Kitchen',
        status: true
    },
    {
        title:      'HEAT', 
        description:'Pot stand, cork, 19 cm', 
        price:      '3',
        thumbnail:  ['https://www.ikea.com/ie/en/images/products/heat-pot-stand-cork__0712344_pe728747_s5.jpg'],
        code:       '870.777.00',
        stock:      '50',
        category:   'Kitchen',
        status: true
    },
    {
        title:      'UPPFYLLD', 
        description:'Fruit cutter, set of 4, mixed colours', 
        price:      '6',
        thumbnail:  ['https://www.ikea.com/ie/en/images/products/uppfylld-fruit-cutter-set-of-4-mixed-colours__1121845_pe874377_s5.jpg'],
        code:       '205.293.97',
        stock:      '90',
        category:   'Kitchen',
        status: true
    },     
    {
        title:      'IDEALISK', 
        description:'Colander, stainless steel/black, 34x23 cm', 
        price:      '9',
        thumbnail:  ['https://www.ikea.com/ie/en/images/products/idealisk-colander-stainless-steel-black__0713133_pe729277_s5.jpg'],
        code:       '501.037.55',
        stock:      '20',
        category:   'Kitchen',
        status: true
    }, 
    {
        title:      'GUBBRORA', 
        description:'Rubber spatula, green/pink/blue/white', 
        price:      '1',
        thumbnail:  ['https://www.ikea.com/ie/en/images/products/gubbroera-rubber-spatula-green-pink-blue-white__0711753_pe728442_s5.jpg'],
        code:       '902.257.31',
        stock:      '100',
        category:   'Kitchen',
        status: true
    },     
    {
        title:      'GULLPIGG', 
        description:'Measuring jug, tempered glass, 58 cl', 
        price:      '6',
        thumbnail:  ['https://www.ikea.com/ie/en/images/products/gullpigg-measuring-jug-tempered-glass__1016529_pe830462_s5.jpg'],
        code:       '705.036.15',
        stock:      '80',
        category:   'Kitchen',
        status: true
    }, 
    {
        title:      'GRUNKA', 
        description:'4-piece kitchen utensil set, stainless steel', 
        price:      '8',
        thumbnail:  ['https://www.ikea.com/ie/en/images/products/grunka-4-piece-kitchen-utensil-set-stainless-steel__0711741_pe728430_s5.jpg'],
        code:       '300.833.34',
        stock:      '50',
        category:   'Kitchen',
        status: true
    },     
    {
        title:      'BLANDA BLANK', 
        description:'Serving bowl, stainless steel, 20 cm', 
        price:      '4',
        thumbnail:  ['https://www.ikea.com/ie/en/images/products/blanda-blank-serving-bowl-stainless-steel__0712888_pe729126_s5.jpg'],
        code:       '200.572.55',
        stock:      '130',
        category:   'Kitchen',
        status: true
    }, 
    {
        title:      'KLOCKREN', 
        description:'Colander, 5.0 l', 
        price:      '12',
        thumbnail:  ['https://www.ikea.com/ie/en/images/products/klockren-colander__0791144_pe764530_s5.jpg'],
        code:       '504.491.77',
        stock:      '110',
        category:   'Kitchen',
        status: true
    },     
    {
        title:      'PRICKIG', 
        description:'Microwave lid, grey, 26 cm', 
        price:      '1.5',
        thumbnail:  ['https://www.ikea.com/ie/en/images/products/prickig-microwave-lid-grey__0710828_pe727792_s5.jpg'],
        code:       '701.860.90',
        stock:      '10',
        category:   'Kitchen',
        status: true
    }, 
    {
        title:      'SMAKSAM', 
        description:'Cake decoration set', 
        price:      '7',
        thumbnail:  ['https://www.ikea.com/ie/en/images/products/smaksam-cake-decoration-set__0712273_pe728720_s5.jpg'],
        code:       '102.570.33',
        stock:      '3',
        category:   'Kitchen',
        status: true
    }
]   

mongoose.set('strictQuery', false);

const connection = mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`)
                        .then( async () => {
                            try {
                                console.log('Connected to MongoDB');
                                await productModel.insertMany(productsData, 
                                    { ordered: false }); // ordered: false to avoid errors when inserting duplicate documents
                            } catch (err) {
                                console.error(err);
                            } finally {
                                mongoose.disconnect();
                                console.log('Done');
                            }
                        })
                        .catch((err) => console.log(err))
    
