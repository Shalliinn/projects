const Product = require('../models/product');
const Cart = require('../models/cart');
const Items_Per_Page=2;

exports.getProducts = (req, res, next) => {
  const page=req.query.page;
  Product.findAll({offset:(page-1)*Items_Per_Page,limit:Items_Per_Page})
  .then(products=>{
    res.json({products})
    // res.render('shop/product-list', {
    //   prods: products,
    //   pageTitle: 'All Products',
    //   path: '/products'
   // });
  }).catch(err=>{
    console.log(err)
  })
  };

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
//   Product.findAll({where:{id:prodId}})
//   .then(products => {
//     res.render('shop/product-detail', {
//       product: products[0],
//       pageTitle: products[0].title,
//       path: '/products'
//     });
//   })
// .catch(err => console.log(err));
// };

  Product.findByPk(prodId)  
  .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
  .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  const page=req.query.page;
  Product.findAll({offset:(page-1)*Items_Per_Page,limit:Items_Per_Page})
  .then(products=>{
    res.json({products})
    // res.render('shop/product-list', {
    //   prods: products,
    //   pageTitle: 'All Products',
    //   path: '/products'
   // });
  }).catch(err=>{
    console.log(err)
  })
 
};

exports.getCart = (req, res, next) => {
req.user.getCart()
.then(cart=>{
 // console.log(cart);
 return cart.getProducts()
 .then(products=>{
  res.json({products})
  // res.render('shop/cart', {
  //   path: '/cart',
  //   pageTitle: 'Your Cart',
  //   products:products
  // });
 })
 .catch(err=>console.log(err))
})
.catch(err=>console.log(err))


  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         prod => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  // res.render('shop/cart', {
  //   path: '/cart',
  //   pageTitle: 'Your Cart',
  //   products: cartProducts
  // });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  let fetchedCart;
  let newQuantity=1;
  req.user.getCart()
  .then(cart=>{
    fetchedCart=cart;
return cart.getProducts({where:{id:prodId}})
  })
  .then(products=>{
    let product;
    if(products.length>0){
      product=products[0]
    }
    
    if(product){
const oldQuantity=product.cartItem.quantity;
  newQuantity=oldQuantity+1;
  return product
    }
    return Product.findByPk(prodId)
  })
    .then(product=>{
      return fetchedCart.addProduct(product,{
        through:{quantity:newQuantity}})
    })
  .then(()=>{
    res.status(200).json({success:true,message:'succesfully added'})
  })
  .catch(err=>console.log(err))
}


exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  //console.log(prodId);
  req.user
  .getCart()
  .then(cart=>{
return cart.getProducts({where:{id:prodId}})
  })
  .then(products=>{
    console.log(products,'line 134');
   const product=products[0];
   return product.cartItem.destroy()
  })
  
  .then(result=>{
    res.redirect('/cart')
  })
  .catch(err=>console.log(err))
};
// Product.findById(prodId, product => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect('/cart');
  // });

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include:['products']})
 .then(orders=>{
  res.json(orders);
    })
.catch(err=>console.log(err));
  }


exports.postOrders=(req,res,next)=>{
let fetchCart;
req.user.getCart()
.then(cart=>{
  fetchCart=cart;
  return cart.getProducts();
}).then(products=>{
  req.user.createOrder().then(order=>{
    return order.addProduct(products.map(product=>{
      product.orderItem={quantity:product.cartItem.quantity};
      return product;
    }))
  }).catch(err=>console.log(err))
}).then((result)=>{
  return fetchCart.setProducts(null);
}).then((result)=>{
  res.status(200).json({success:true,message:"succesfully added"})
}).catch(err=>console.log(err))
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
