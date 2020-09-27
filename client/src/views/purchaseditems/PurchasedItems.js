import React, { Component } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
} from '@coreui/react';

import { Http } from '../../config/Http';
import { getUserId, getUserType } from '../../config/UserManager';

const purchasedItemsFields = [
  { key: 'productName', label: 'Ürün Adı' },
  { key: 'productDetail', label: 'Ürün Açıklaması' },
  { key: 'productQuantity', label: 'Ürün Adedi' },
  { key: 'productPrice', label: 'Ürün Fiyatı' },
  { key: 'totalPrice', label: 'Toplam Ödenen' },

];

const endPointPrefix = 'purchased';
const methodNames = {
  purchasedItems: '/purchasedItems',
}

class PurchasedItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      purchasedItems: [],
    }
  }

  calculateTotalPriceForProduct(data) {
    const dataToBeReturned = [];
    for (let d of data) {
      dataToBeReturned.push({
        ...d,
        productPrice: `${d.productPrice}₺`,
        totalPrice: `${d.productQuantity * d.productPrice}₺`,
      });
    }
    return dataToBeReturned;
  }

  async getPurchasedItems() {
    try {
      const data = await Http.post(endPointPrefix + methodNames.purchasedItems, {
        userId: getUserType() === 'admin' ? 0 : getUserId(),
      });
      this.setState({
        purchasedItems: this.calculateTotalPriceForProduct(data.data.data),
      });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this.getPurchasedItems();
  }

  render() {
    const { purchasedItems } = this.state;
    return (
      <CCol>
        <CCard>
          <CCardHeader>
            {getUserType() === 'admin' ? 'Satılmış Ürünler' : 'Satın Alınan Ürünler'}
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={purchasedItems}
              fields={purchasedItemsFields}
              noItemsViewSlot={() => null}
              columnFilter
              tableFilter={{
                label: 'Filtrele: ',
                placeholder: 'Yazmaya başla..'
              }}
              footer
              itemsPerPageSelect={{
                label: 'Sayfa Başına Kayıt: ',
                values: [10, 20, 50]
              }}
              itemsPerPage={10}
              hover
              sorter
              pagination
            />
          </CCardBody>
        </CCard>
      </CCol>
    );
  }
}

export default PurchasedItems;