import * as Constants  from './Constants';

export function formatStatusLabel(array) {
    console.log(array);
    for(let obj of array) {
        obj.statusLabel = obj.status === 1 ? Constants.STATUS_ACTIVE : Constants.STATUS_INACTIVE;
    }
    return array;
} 

export const getBadge = (status) => {
    console.log(status);
    switch (status) {
        case 'Aktif': return 'success'
        case 'Pasif': return 'secondary'
        case 'Pending': return 'warning'
        case 'Banned': return 'danger'
        default: return 'primary'
    }
}

export function stringIsNullOrEmpty(val) {
    return val === '' || val === null || typeof val === 'undefined';
}