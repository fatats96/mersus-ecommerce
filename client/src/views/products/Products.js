import React, { Component } from 'react';
import {
  CAlert,
  CBadge,
  CButton,
  CCollapse,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CForm,
  CFormText,
  CFormGroup,
  CInput,
  CLabel,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CRow,
  CSelect,
  CSwitch,
  CTextarea,
  CToast,
  CToastBody,
  CToaster
} from '@coreui/react';

import { Http } from '../../config/Http';
import { formatStatusLabel, getBadge, stringIsNullOrEmpty } from '../../common/common';

const productFields = [
  { key: 'productId', label: 'Ürün ID' },
  { key: 'productName', label: 'Ürün Adı' },
  { key: 'productDetail', label: 'Ürün Açıklaması' },
  { key: 'productQuantity', label: 'Ürün Adedi' },
  { key: 'productPrice', label: 'Ürün Fiyatı' },
  { key: 'statusLabel', label: 'Durum' },
  {
    key: 'show_details',
    label: '',
    _style: { width: '1%' },
    sorter: false,
    filter: false
  }
];

const endpointPrefix = 'product';
const methodNames = {
  list: '/list',
  save: '/save',
  delete: '/delete'
};

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      products: [],
      product: {},
      errors: {},
      notifications: {},
      loading: true,
      showModal: false,
    }
  }

  async getList() {
    try {
      const products = await Http.post(endpointPrefix + methodNames.list, {});
      this.setState({ products: formatStatusLabel(products.data.data) });
    } catch (error) {
      console.log(error);
    }
  }

  async getCategoryList() {
    try {
      const categories = await Http.post('/category/list', { });
      this.setState({ categories: categories.data.data.filter(c => c.status === 1) });
    } catch(error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this.getList();
    this.getCategoryList();
  }

  toggleModal = (newRecord = false) => {
    const { showModal } = this.state;
    let { product } = this.state;
    if (showModal) {
      product = {};
    }
    this.setState({ showModal: !showModal, product: newRecord === true ? {} : product });
  }

  toggleDetails = (id) => {
    const { products, product } = this.state;
    const productDetail = products.find(c => c.productId === id);
    if (product && product.productId) {
      this.setState({ product: {} });
    }
    if (productDetail) {
      if (productDetail.productId !== product.productId) this.setState({ product: productDetail });
    }
  }

  _onChangeEventHandler = (e) => {
    const { name, value } = e.target;
    this.setState({
      product: {
        ...this.state.product,
        [name]: name === 'productPrice' ? 
          Number.parseFloat(value) : 
          name === 'productQuantity' ?
          Number.parseInt(value) :
          value,
      }
    });
  }

  _onToggleStatus = (e) => {
    const { product } = this.state;
    product.status = e.target.checked === true ? 1 : 0;
    this.setState({ product });
  }

  _onChangeCategory = (categoryId) => {
    if (categoryId !== 'PleaseSelect') {
      const { categories, product } = this.state;
      const category = categories.find(c => c.categoryId === Number.parseInt(categoryId));
      console.log(category);
      if (category) {
        product.category = { ...category };
      }
      console.log(product)
      this.setState({ product });
    } else {
      const { product } = this.state;
      product.category = { };
      this.setState({ product });
    }
  }

  submit = async (e) => {
    e.preventDefault();
    const { product } = this.state;
    delete product.statusLabel;
    if (product) {
      if (stringIsNullOrEmpty(product.productName)) {
        this.setState({
          errors: {
            ...this.state.errors,
            productName: 'Ürün Adı Boş Bırakılamaz',
          },
        });
        return;
      }
      try {
        delete product.category.products;
        const res = await Http.post(endpointPrefix + methodNames.save, { ...product });
        this.setState({
          product: res.data.data || { }, 
          notifications: {
            message: 'Kayıt Başarılı',
            success: true,
          }
        });
        this.toggleModal();
        this.getList();
      } catch (error) {
        console.log(error);
      }
    }
  }

  delete = async (e) => {
    e.preventDefault();
    const { product } = this.state;
    if (product) {
      try {
        const res = await Http.post(endpointPrefix + methodNames.delete, { ...product });
        if (res.data.data === true) {
          this.setState({
            notifications: {
              message: 'Silme İşlemi Başarılı',
              success: true
            }
          });
          this.getList();
        } else {
          this.setState({
            notifications: {
              message: 'Silme İşlemi Başarısız',
              success: false,
            }
          });
        }

      } catch (error) {
        console.log(error);
      }
    }
  }

  render() {
    const { products, showModal, product, errors, notifications, categories } = this.state;

    return (
      <CRow>
        <CToaster position={'bottom-right'}>
          <CToast
            show={notifications && notifications.message ? true : false}
            autohide={'2000'}
            fade={true}
            onStateChange={(props) => {
              if (props === 'hiding')
                this.setState({ notifications: {} })
            }}
          >
            <CToastBody>
              <CAlert color={notifications.success ? 'success' : 'danger'}>
                {notifications.message}
              </CAlert>
            </CToastBody>
          </CToast>
        </CToaster>
        <CModal
          show={showModal}
          onClose={this.toggleModal}
        >
          <CModalHeader closeButton>{product && product.productId ? 'Kayıt Güncelle' : 'Yeni Kayıt'}</CModalHeader>
          <CModalBody>
            <CRow>
              <CCol sm="12">
                <CForm action="" method="post">
                  <CFormGroup>
                    <CLabel htmlFor="nf-email">Ürün Adı</CLabel>
                    <CInput
                      type="text"
                      id="productName"
                      name="productName"
                      placeholder="Ürün Adı Giriniz.."
                      onChange={this._onChangeEventHandler}
                      value={product.productName ? product.productName : ''}
                    />
                    {errors && errors.productName ?
                      <CFormText className="help-block">{errors.productName}</CFormText> : null
                    }
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="nf-email">Ürün Adı</CLabel>
                    <CTextarea 
                      id="productDetail"
                      name="productDetail"
                      rows="9"
                      placeholder="Ürün Açıklaması Giriniz.."
                      onChange={this._onChangeEventHandler}
                      value={product.productDetail ? product.productDetail : ''}                    
                    />
                    {errors && errors.productName ?
                      <CFormText className="help-block">{errors.productDetail}</CFormText> : null
                    }
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="select">Kategori Adı</CLabel>
                    <CSelect 
                      custom 
                      name="select" 
                      id="select"
                      onChange={(e) => this._onChangeCategory(e.target.value)}
                      value={product && product.category && product.category.categoryId ? product.category.categoryId : 'PleaseSelect'}  
                    >
                      <option value="PleaseSelect">Kategori Seçimi</option>
                      {
                        categories.length > 0 ? 
                          categories.map((c, index) => <option key={`c-${index}`} value={c.categoryId}>{c.categoryName}</option>) : 
                          null
                    }
                    </CSelect>
                    {errors && errors.categoryId ?
                      <CFormText className="help-block">{errors.categoryId}</CFormText> : null
                    }
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="nf-email">Ürün Adedi</CLabel>
                    <CInput
                      type="number"
                      id="productQuantity"
                      name="productQuantity"
                      placeholder="Ürün Adedi Giriniz.."
                      onChange={this._onChangeEventHandler}
                      value={product.productQuantity ? product.productQuantity : ''}
                    />
                    {errors && errors.productQuantity ?
                      <CFormText className="help-block">{errors.productQuantity}</CFormText> : null
                    }
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="nf-email">Ürün Fiyatı</CLabel>
                    <CInput
                      type="number"
                      id="productPrice"
                      name="productPrice"
                      placeholder="Ürün Fiyatı Giriniz.."
                      onChange={this._onChangeEventHandler}
                      value={product.productPrice ? product.productPrice : ''}
                    />
                    {errors && errors.productPrice ?
                      <CFormText className="help-block">{errors.productPrice}</CFormText> : null
                    }
                  </CFormGroup>
                  <CFormGroup>
                    <CSwitch
                      name="status"
                      color={'primary'}
                      onChange={this._onToggleStatus}
                      checked={product.status === 1 ? true : false}
                    />
                  </CFormGroup>
                </CForm>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={this.submit} >Kaydet</CButton>{' '}
            <CButton
              color="secondary"
              onClick={this.toggleModal}
            >İptal</CButton>
          </CModalFooter>
        </CModal>
        <CCol>
          <CCard>
            <CCardHeader>
              Ürünler
             <CButton color="primary" size="sm" style={{ float: 'right' }} onClick={() => this.toggleModal(true)}>Yeni Ekle</CButton>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                items={products}
                fields={productFields}
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
                scopedSlots={{
                  'statusLabel':
                    (item) => (
                      <td>
                        <CBadge color={getBadge(item.statusLabel)}>
                          {item.statusLabel}
                        </CBadge>
                      </td>
                    ),
                  'show_details':
                    (item, index) => {
                      return (
                        <td className="py-2">
                          <CButton
                            color="primary"
                            variant="outline"
                            shape="square"
                            size="sm"
                            onClick={() => { this.toggleDetails(item.productId) }}
                          >
                            {product && product.productId && item.productId === product.productId ? 'Gizle' : 'Göster'}
                          </CButton>
                        </td>
                      )
                    },
                  'details':
                    (item, index) => {
                      return (
                        <CCollapse show={item.productId === product.productId}>
                          <CCardBody>
                            <h4>
                              {item.productName}
                            </h4>
                            <p className="text-muted">Durumu: {item.statusLabel}</p>
                            <CButton size="sm" color="info" onClick={this.toggleModal}>
                              Ürün Düzenle
                            </CButton>
                            <CButton size="sm" color="danger" className="ml-1" onClick={this.delete}>
                              Sil
                            </CButton>
                          </CCardBody>
                        </CCollapse>
                      )
                    }
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

    );
  }
}

export default Products;