import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import user from './modules/user.js'
import cart from './modules/cart.js'
import category from './modules/category.js'

export default createStore({
  modules: {
    user,
    cart,
    category
  },
  plugins: [
    createPersistedState({
      key: 'erabbit-client-pc-store',
      paths: ['user', 'cart']
    })
  ]
})
