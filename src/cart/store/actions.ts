import { ActionContext } from "vuex"
import { CartItem, CartState } from "./states"
import { AxiosResponse } from "axios"
import axiosInst from "@/utility/axiosInstance"
import { REQUEST_CART_LIST_TO_DJANGO } from "./mutation-types"

export type CartActions = {
    requestAddCartToDjango(
        context: ActionContext<CartState, any>,
        cartData: CartItem
    ): Promise<AxiosResponse>;

    requestCartListToDjango(
        context: ActionContext<CartState, any>
    ): Promise<AxiosResponse>;

    requestRemoveCartItemToDjango(
        context: ActionContext<CartState, any>,
        cartItemId: number[]
    ): Promise<void>
}

const actions: CartActions = {
    async requestAddCartToDjango({ commit }, cartData: CartItem) {
        try {
            const userToken = localStorage.getItem('userToken');
            if (!userToken) {
                throw new Error('User token not found');
            }

            const requestData = {
                ...cartData,
                userToken
            };

            console.log('requestData:', requestData);

            const response = await axiosInst.djangoAxiosInst.post('/cart/register', requestData);
            return response.data;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    },
    async requestCartListToDjango({ commit }) {
        try {
            const userToken = localStorage.getItem('userToken');
            if (!userToken) {
                throw new Error('User token not found');
            }

            const requestData = {
                userToken
            };

            console.log('requestCartListToDjango requestData:', requestData);

            const response = await axiosInst.djangoAxiosInst.post('/cart/list', requestData);
            return response.data;
        } catch (error) {
            console.error('Error fetching cart list:', error);
            throw error;
        }
    },
    async requestRemoveCartItemToDjango(context: ActionContext<CartState, any>, cartItemId: number[]): Promise<void> {
        try {
            await axiosInst.djangoAxiosInst.delete('/cart/remove', { data: cartItemId })
            console.log('requestRemoveCartItemToDjango()')
        } catch (error) {
            console.log('requestRemoveCartItemToDjango() 과정에서 문제 발생')
            throw error
        }
    }
};

export default actions;