import React, { Component } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CJumbotron,
  CLabel,
  CRow,
} from '@coreui/react';

import { Http } from '../../config/Http';
import { getUserId } from '../../config/UserManager';

const endpointPrefix = 'product';
const methodNames = {
  getProduct: '/getById',
};

const basketEndPoint = 'basket';
const basketEPMethodNames = {
  getBasket: '/getBasket',
  addItemToBasket: '/addItem'
};

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {},
      basketProduct: {},
      productBasket: {},
      basketCost: 0,
      productQuantity: 1,
    };
    console.log(this.props.match.params.productid);
  }

  async getProduct() {
    try {
      const product = await Http.post(endpointPrefix + methodNames.getProduct, {
        productId: Number.parseInt(this.props.match.params.productid),
      });
      this.setState({ product: product.data.data, basketCost: product.data.data.productPrice });
    } catch (error) {
      console.log(error);
    }
  }

  async getBasket() {
    try {
      const basket = await Http.post(basketEndPoint + basketEPMethodNames.getBasket, {
      });
      this.setState({ basket: basket.data.data });
    } catch (error) {
      console.log(error);
    }
  }


  componentDidMount() {
    this.getProduct();
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
    const { basketProduct, product, basketCost, productQuantity, basket } = this.state;
    try {
       const response = await Http.post(basketEndPoint + basketEPMethodNames.addItemToBasket, {
         basketId: (basket && basket.basketId ? basket.basketId : 0) || 0,
         basketProduct: [{
          productId: product.productId,
          ...basketProduct,
          productQuantity,
          productDetail: product.productDetail,
          productPrice: product.productPrice,
          productName: product.productName,
        }],
        basketCost,
        userId: Number.parseInt(getUserId()),
       });
       this.getProduct();
       this.getBasket();
       console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { product, productQuantity } = this.state;
    if (product && product.productName) return (
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              {product.productName}
            </CCardHeader>
            <CCardBody>
              <CJumbotron className="border">
                <h1 className="display-6">{product.productName + ' - ' + product.category.categoryName}</h1>
                <p className="lead">{product.productDetail}</p>
                <hr className="my-2" />
                <p>{'Stokta Kalan: ' + product.productQuantity + '       Adet Fiyatı: ' + product.productPrice + '₺'}</p>
                <p className="lead">
                  <CCol sm="2">
                  <CForm>
                  <CFormGroup>
                    <CLabel htmlFor="nf-email">Ürün Adedi</CLabel>
                    <CInput
                      type="number"
                      min={1}
                      max={product.productQuantity}
                      value={productQuantity > 20 ? 20 : productQuantity}
                      id="productQuantity"
                      name="productQuantity"
                      onChange={this._onChangeHandler}
                      placeholder="Ürün Adedi Giriniz.."
                    />

                  </CFormGroup>
                </CForm>
                  </CCol>
                  {product.productQuantity > 0 ?  <CButton color="primary" size="sm" onClick={this.submit} disabled={!product.productQuantity}>Sepete Ekle</CButton> : 'Stoğa Gelince Haber Ver!'}
                </p>
              </CJumbotron>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>);

    return <h1>Yükleniyor</h1>;
  }
}

export default ProductDetail;