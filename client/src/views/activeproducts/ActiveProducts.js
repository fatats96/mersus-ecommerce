import React, { Component } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardSubtitle,
  CCardTitle,
  CCardText,
  CCol,
  CRow,
} from '@coreui/react';

import _ from 'lodash';

import { Http } from '../../config/Http';
import { formatStatusLabel } from '../../common/common';

const endpointPrefix = 'product';
const methodNames = {
  list: '/list',
};

export default class ActiveProducts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      products: [],
    };
  }

  async getList() {
    try {
      const products = await Http.post(endpointPrefix + methodNames.list, {});
      const categories = [];
      if (products.data.data) {
        products.data.data.map(p => {
          if (p.category) {
            delete p.category.products;
            categories.push(p.category);
          }
        });
      }
      this.setState({
        products: formatStatusLabel(products.data.data),
        categories: [..._.uniqBy(categories, 'categoryId')],
      });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this.getList();
  }

  render() {
    const { categories, products } = this.state;
    console.log(this.props);
    return (
      <>
        {categories.length > 0 ?
          categories.map((c, index) => {
            return (
              <>
                <h4>{c.categoryName}</h4>
                <CRow>
                  {products.length > 0 ?
                    products.map(p => {
                    if (p.category.categoryId === c.categoryId)
                      return (
                        <CCol sm="4">
                          <CCard>
                            <CCardBody>
                              <CCardTitle>
                                {p.productName}
                              </CCardTitle>
                              <CCardSubtitle>
                                {p.productDetail}
                                <br />
                                <br />
                                {'Fiyat: ' + p.productPrice + '₺'}
                              </CCardSubtitle>
                              <CCardText>
                                {'Stok Sayısı: ' + p.productQuantity}
                              </CCardText>
                            </CCardBody>
                            <CCardFooter>
                              {p.productQuantity > 0 ? <CButton size="sm" color="info" onClick={() => this.props.history.push('/product/' + p.productId)}>
                              Ürüne Git
                            </CButton> : 'Stoğa Gelince Haber ver'}
                            </CCardFooter>
                          </CCard>
                        </CCol>
                      )
                    })
                    : null}
                </CRow>
              </>
            )
          })
          : null}
        <CRow>

        </CRow>
      </>
    )
  }
}