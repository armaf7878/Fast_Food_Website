import axios from 'axios';
import axiosClient from './apiClient';
const BASE_URL = 'http://127.0.0.1:8000/api';

const API_Login = async(email, password) => {
    return axios
    .post(`${BASE_URL}/accounts/login/`, {email, password})
    .then((res) => res.data)
    .catch((err) => {throw err});
}; export {API_Login}

const API_CateShowAll= async() => {
    return axios
    .get(`${BASE_URL}/catalog/showall/`)
    .then((res) => res.data)
    .catch((err) => {throw err});
}; export {API_CateShowAll}

const API_FoodShowAll= async() => {
    return axios
    .get(`${BASE_URL}/foods/showall/`)
    .then((res) => res.data)
    .catch((err) => {throw err});
}; export {API_FoodShowAll}

const API_VoucherShowAll = async() => {
    return axios
    .get(`${BASE_URL}/voucher/showallCanused/`)
    .then((res) => res.data)
    .catch((err) => {throw err});
}; export {API_VoucherShowAll}

const API_CartShowAll = async() => {
    return axiosClient
    .get(`${BASE_URL}/cart/showall/`)
    .then((res) => res.data)
    .catch((err) => {throw err});
}; export {API_CartShowAll}

const API_OrderCreate = async(orderPayload) => {
    return axiosClient
    .post(`${BASE_URL}/ordering/create/`, orderPayload)
    .then((res) => res.data)
    .catch((err) => {throw err});
}; export {API_OrderCreate}

const API_OrderPendingShowAll = async() => {
    return axiosClient
    .get(`${BASE_URL}/ordering/pending/`)
    .then((res) => res.data)
    .catch((err) => {throw err});
}; export {API_OrderPendingShowAll}

const API_OrderCookingShowAll = async() => {
    return axiosClient
    .get(`${BASE_URL}/ordering/cooking/`)
    .then((res) => res.data)
    .catch((err) => {throw err});
}; export {API_OrderCookingShowAll}

const API_OrderClientShowAll = async() => {
    return axiosClient
    .get(`${BASE_URL}/ordering/orderlist_client/`)
    .then((res) => res.data)
    .catch((err) => {throw err});
}; export {API_OrderClientShowAll}

const API_OrderStaffAssgin = async(order_id) => {
    return axiosClient
    .post(`${BASE_URL}/ordering/assign-staff/${order_id}/`)
    .then((res) => res.data)
    .catch((err) => {throw err});
}; export {API_OrderStaffAssgin}

const API_OrderReady= async(order_id) => {
    return axiosClient
    .post(`${BASE_URL}/ordering/ready/${order_id}/`)
    .then((res) => res.data)
    .catch((err) => {throw err});
}; export {API_OrderReady}

const API_OrderCanceled = async(order_id) => {
    return axiosClient
    .post(`${BASE_URL}/ordering/canceled/`, {order_id})
    .then((res) => res.data)
    .catch((err) => {throw err})
}; export {API_OrderCanceled}

const API_DeliveringShowAll= async() => {
    return axiosClient
    .get(`${BASE_URL}/ordering/waiting-deliver/`)
    .then((res) => res.data)
    .catch((err) => {throw err});
}; export {API_DeliveringShowAll}

const API_DeliveringOnline = async() => {
    return axiosClient
    .post(`${BASE_URL}/accounts/online/`)
    .then((res) => res.data)
    .catch((err) => {throw err;})
}; export {API_DeliveringOnline}

const API_DeliveringOffline = async() => {
    return axiosClient
    .post(`${BASE_URL}/accounts/offline/`)
    .then((res) => res.data)
    .catch((err) => {throw err;})
}; export {API_DeliveringOffline}

const API_OrderFinish = async(order_id) => {
    return axiosClient
    .post(`${BASE_URL}/ordering/finish/${order_id}/`)
    .then((res) => res.data)
    .catch((err) => {throw err;})
}; export {API_OrderFinish}

const API_CartAdd = async(food_id, quantity) => {
    return axiosClient
    .post(`${BASE_URL}/cart/create/${food_id}/`, {quantity})
    .then((res) => res.data)
    .catch((err) => {throw err;})
}; export {API_CartAdd}

const API_CartItemRemove = async(cartItem_id) => {
    return axiosClient
    .delete(`${BASE_URL}/cart/delete/${cartItem_id}/`)
    .then((res) => res.data)
    .catch((err) => {throw err;})
}; export {API_CartItemRemove}

const API_CartItemUpdate = async(cartItem_id, quantity) => {
    return axiosClient
    .patch(`${BASE_URL}/cart/update/${cartItem_id}/`, {quantity})
    .then((res) => res.data)
    .catch((err) => {throw err;})
}; export {API_CartItemUpdate}

const API_ChatBot = async(question ) => {
    return axiosClient
    .post(`${BASE_URL}/chatbot/send/`, {question})
    .then((res) => res.data)
    .catch((err) => {throw err})
}; export {API_ChatBot}