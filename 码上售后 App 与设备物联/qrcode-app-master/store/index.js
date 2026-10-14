import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
	state: {
		userInfo: {}
	},
	mutations: {
		set_userInfo(state, userInfo) {
			state.userInfo = userInfo
		}
	},
	strict: debug
});
