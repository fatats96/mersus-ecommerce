import React from 'react';

const Categories = React.lazy(() => import('./views/categories/Categories'));
const Products = React.lazy(() => import('./views/products/Products'));
const PurchasedItems = React.lazy(() => import('./views/purchaseditems/PurchasedItems'));

const routes = [
  { path: '/', exact: true, name: 'Anasayfa', component: Categories },
  { path:'/categories', exact: true, name: 'Kategoriler', component: Categories },
  { path: '/products', exact: true, name: 'Ürünler', component: Products },
  { path: '/purchaseditems', exact: true, name: 'Satın Alınan Ürünler', component: PurchasedItems }
];

export default routes;
