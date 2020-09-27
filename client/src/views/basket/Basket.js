import React, { Component } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardSubtitle,
  CCardTitle,
  CCardText,
  CCol,
  CRow,
} from '@coreui/react';

import _ from 'lodash';

import { Http } from '../../config/Http';
import { getUserId } from '../../config/UserManager';

const basketEndPoint = 'basket';
const basketEPMethodNames = {
  getBasket: '/getBasket',
  confirmBasket: '/confirmBasket',
  removeItem: '/removeItem'
};

class Basket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      basketProducts: [],
      product: {},
      basketProduct: {},
      productBasket: {},
      loading: true,
      basketCost: 0,
      productQuantity: 1,
    };
  }

  async getBasket() {
    try {
      const basket = await Http.post(basketEndPoint + basketEPMethodNames.getBasket, {
      });
      const basketProducts = basket.data.data && basket.data.data.basketProduct ? basket.data.data.basketProduct : [];
      this.setState({ loading: false, basket: basket.data.data, basketProducts: basketProducts });
    } catch (error) {
      console.log(error);
    }
  }


  componentDidMount() {
    this.getBasket();
  }

  _onChangeHandler = (e) => {
    const { product } = this.state;
    let { basketProduct } = this.state;
    const productQuantity = Number.parseInt(e.target.value) > 20 ? 20 : Number.parseInt(e.target.value);
    const basketCost = productQuantity * product.productPrice;
    basketProduct = { productQuantity };
    this.setState({
      productQuantity,
      basketCost,
      basketProduct
    });
  }

  submit = async (e) => {
    e.preventDefault();
    const { basket } = this.state;
    this.setState({ loading: true });
    try {
      const response = await Http.post(basketEndPoint + basketEPMethodNames.confirmBasket, {
        basketId: (basket && basket.basketId ? basket.basketId : 0) || 0,
        userId: Number.parseInt(getUserId()),
      });
      this.getBasket();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  removeItem = async (e, index) => {
    e.preventDefault();
    try {
      const { basketProducts, basket } = this.state;
      const newBasketProducts = _.remove(basketProducts, function(n, m) {
        if (m === index) return false;
        return true;
      });
      let newPrice = 0;
      for(let o of newBasketProducts) {
        newPrice += o.productQuantity * o.productPrice;
      }
      const response = await Http.post(basketEndPoint + basketEPMethodNames.removeItem, {
        ...basket,
        basketCost: newPrice,
        basketProduct: newBasketProducts,
      }); 
      this.setState({
        basketProducts: newBasketProducts,
      })
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { basketProducts, basket, loading } = this.state;
    if (loading === true) return <h1>Yükleniyor</h1>;

    if (basketProducts.length > 0) {
      return (
        <>
        <CRow>
          {basketProducts.map((bp, index) => {
            return (
                <CCol sm="4">
                  <CCard>
                    <CCardHeader>
                    <CButton style={{ float: 'left'}} size="sm" color="danger" onClick={(e) => this.removeItem(e, index)}>
                      Ürünü Kaldır
                    </CButton>
                    </CCardHeader>
                    <CCardBody>
                      <CCardTitle>
                        {bp.productName || ''}
                      </CCardTitle>
                      <CCardSubtitle>
                        {bp.productDetail || ''}
                        <br />
                        <br />
                        {'Fiyat: ' + bp.productPrice + '₺'}
                      </CCardSubtitle>
                      <CCardText>
                        {'Adet: ' + (bp.productQuantity || '')}
                      </CCardText>
                    </CCardBody>
                  </CCard>
                </CCol>
                )
              })}
          </CRow>
          <div>
            <p>Toplam Fiyat: {basket.basketCost}₺</p>
            <CButton style={{ float: 'left'}} size="sm" color="info" onClick={this.submit}>
              Sepeti Onayla
            </CButton>
          </div>
        </>
      );
    }
    return <h1>Sepetinizde Ürün Bulunmamaktadır</h1>;
  }
}

export default Basket;