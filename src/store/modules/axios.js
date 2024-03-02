
export default {
  namespaced: true,
  state() {
    return {
      // 用户信息
      signal: ''
    }
  },
  mutations: {
    // 修改用户信息,payload为用户信息对象
    setUser(state, payload) {
      state.profile = payload
      for (const key in payload) {
        state[key] = payload[key]
      }
    }
  },
  getters: {
    testGetter1() {
      return 'testGetter1'
    }
  }
}
