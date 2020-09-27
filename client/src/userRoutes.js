import React from 'react';

const ActiveProducts = React.lazy(() => import('./views/activeproducts/ActiveProducts'));
const ProductDetail = React.lazy(() => import('./views/activeproducts/ProductDetail'));
const Basket = React.lazy(() => import('./views/basket/Basket'));
const PurchasedItems = React.lazy(() => import('./views/purchaseditems/PurchasedItems'));

const routes = [
  { path: '/', exact: true, name: 'Anasayfa', component: ActiveProducts },
  { path: '/dashboard', exact: true, name: 'Anasayfa', component: ActiveProducts },
  { path:'/products', exact: true, name: 'Ürünler', component: ActiveProducts },
  { path:'/product/:productid', exact: true, name: 'Ürünler', component: ProductDetail },
  { path: '/basket', exact: true, name: 'Sepet', component: Basket },
  { path: '/purchaseditems', exact: true, name: 'Satın Alınan Ürünler', component: PurchasedItems }
];

export default routes;
