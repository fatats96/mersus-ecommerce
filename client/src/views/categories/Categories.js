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
    CSwitch,
    CToast,
    CToastBody,
    CToaster
} from '@coreui/react';

import { Http } from '../../config/Http';
import { formatStatusLabel, getBadge, stringIsNullOrEmpty } from '../../common/common';

const categoryFields = [
    { key: 'categoryId', label: 'Kategori ID' },
    { key: 'categoryName', label: 'Kategori Adı' },
    { key: 'statusLabel', label: 'Durum' },
    {
        key: 'show_details',
        label: '',
        _style: { width: '1%' },
        sorter: false,
        filter: false
    }
];

const endpointPrefix = 'category';
const methodNames = {
    list: '/list',
    save: '/save',
    delete: '/delete'
};

class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            category: {},
            errors: {},
            notifications: {},
            loading: true,
            showModal: false,
        }
    }

    async getList() {
        try {
            const categories = await Http.post(endpointPrefix + methodNames.list, {});
            this.setState({ categories: formatStatusLabel(categories.data.data), loading: false });
        } catch (error) {
            console.log(error);
        }
    }

    componentDidMount() {
        this.getList();
    }

    toggleModal = (newRecord = false) => {
        const { showModal } = this.state;
        let { category } = this.state;
        if (showModal) {
            category = {};
        }
        this.setState({ showModal: !showModal, category: newRecord === true ? {} : category });
    }

    toggleDetails = (id) => {
        const { categories, category } = this.state;
        const categoryDetail = categories.find(c => c.categoryId === id);
        if (category && category.categoryId) {
            this.setState({ category: {} });
        }
        if (categoryDetail) {
            if (categoryDetail.categoryId !== category.categoryId) this.setState({ category: categoryDetail });
        }
    }

    _onChangeEventHandler = (e) => {
        const { name, value } = e.target;
        this.setState({
            category: {
                ...this.state.category,
                [name]: value,
            }
        });
    }

    _onToggleStatus = (e) => {
        const { category } = this.state;
        category.status = e.target.checked === true ? 1 : 0;
        this.setState({ category });
    }

    submit = async (e) => {
        e.preventDefault();
        this.setState({ loading: true });
        const { category } = this.state;
        delete category.statusLabel;
        if (category) {
            if (stringIsNullOrEmpty(category.categoryName)) {
                this.setState({
                    errors: {
                        ...this.state.errors,
                        categoryName: 'Kategori Adı Boş Bırakılamaz',
                    },
                    loading: false,
                });
                return;
            }
            try {

                const res = await Http.post(endpointPrefix + methodNames.save, { ...category });
                this.setState({
                    category: res.data.data, notifications: {
                        message: 'Kayıt Başarılı',
                        success: true,
                    },
                    loading: false,
                });
                this.toggleModal();
                this.getList();
            } catch (error) {
                this.setState({ loading: false, });
                console.log(error);
            }
        }
    }

    delete = async (e) => {
        e.preventDefault();
        this.setState({ loading: true });
        const { category } = this.state;
        if (category) {
            try {
                const res = await Http.post(endpointPrefix + methodNames.delete, { ...category });
                if (res.data.data === true) {
                    this.setState({
                        notifications: {
                            message: 'Silme İşlemi Başarılı',
                            success: true
                        },
                        loading: false,
                    });
                    this.getList();
                } else {
                    this.setState({
                        notifications: {
                            message: 'Silme İşlemi Başarısız',
                            success: false,
                        },
                        loading: false,
                    });
                }

            } catch (error) {
                this.setState({ loading: false });
                console.log(error);
            }
        }
    }

    render() {
        const { categories, showModal, category, errors, notifications, loading } = this.state;
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
                    <CModalHeader closeButton>{category && category.categoryId ? 'Kayıt Güncelle' : 'Yeni Kayıt'}</CModalHeader>
                    <CModalBody>
                        <CRow>
                            <CCol sm="12">
                                <CForm action="" method="post">
                                    <CFormGroup>
                                        <CLabel htmlFor="nf-email">Kategori Adı</CLabel>
                                        <CInput
                                            type="text"
                                            id="categoryName"
                                            name="categoryName"
                                            placeholder="Kategori Adı Giriniz.."
                                            onChange={this._onChangeEventHandler}
                                            value={category.categoryName ? category.categoryName : ''}
                                        />
                                        {errors && errors.categoryName ?
                                            <CFormText className="help-block">{errors.categoryName}</CFormText> : null
                                        }
                                    </CFormGroup>
                                    <CFormGroup>
                                        <CSwitch
                                            name="status"
                                            color={'primary'}
                                            onChange={this._onToggleStatus}
                                            checked={category.status === 1 ? true : false}
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
                            Kategoriler
                            <CButton color="primary" size="sm" style={{ float: 'right' }} onClick={() => this.toggleModal(true)}>Yeni Ekle</CButton>
                        </CCardHeader>
                        <CCardBody>
                            <CDataTable
                                items={categories}
                                fields={categoryFields}
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
                                loading={loading}
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
                                                        onClick={() => { this.toggleDetails(item.categoryId) }}
                                                    >
                                                        {category && category.categoryId && item.categoryId === category.categoryId ? 'Gizle' : 'Göster'}
                                                    </CButton>
                                                </td>
                                            )
                                        },
                                    'details':
                                        (item, index) => {
                                            return (
                                                <CCollapse show={item.categoryId === category.categoryId}>
                                                    <CCardBody>
                                                        <h4>
                                                            {item.categoryName}
                                                        </h4>
                                                        <p className="text-muted">Durumu: {item.statusLabel}</p>
                                                        <CButton size="sm" color="info" onClick={this.toggleModal}>
                                                            Kategori Düzenle
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

export default Categories;