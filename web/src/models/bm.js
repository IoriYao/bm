
import request from "../utils/request";
import IndexPage from "../routes/IndexPage";
let pageSize = 50
export default {
  namespace: 'bm',

  state: {
    companies: [],
    projects: {},
    currentCompany: {},
    companyCount: 0,
    companyFilters: [
      { name: '企业名称', operator: 'contains', value: ''},
    ]
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *fetchCompanyCount(_, { call, put }) {
      let response = yield call(request, {
        sql: `select count(id) from corp_details;`
      })
      yield put({
        type: 'saveCompanyCount',
        payload: response.data[0]['count(id)']
      });
    },
    *fetchCompanies({ payload }, { call, put }) {  // eslint-disable-line
      let response = yield call(request, {
          sql: `select * from corp_details limit ${(payload.current - 1 )* payload.pageSize},${payload.pageSize};`
      })
      yield put({
        type: 'saveCompanies',
        payload: response.data
      });
    },
    *fetchProjects({ payload }, { call, put }) {  // eslint-disable-line
      let response = yield call(request, {
        sql: `select * from corp_proj where corpid='${payload.companyId}';`
      })
      yield put({
        type: 'saveProjects',
        payload: {
          company: payload.companyId,
          projects: response.data
        }
      });
    },
    *queryCompany({ payload }, { call, put }) {
      let condition = ''
      console.log(payload)
      payload.forEach((filter, i) => {
        if (i > 0) condition += ' AND'
        if (filter.operator === 'contains') {
          condition += ` ${IndexPage.attrMap[filter.name]} like '%${filter.value}%' `
        } else {
          condition += ` ${IndexPage.attrMap[filter.name]}${filter.operator}'${filter.value}'`
        }
      })
      console.log(`select * from corp_details where ${condition};`)
      let response = yield call(request, {
        sql: `select * from corp_details where ${condition};`
      })
      console.log(response)
      yield put({
        type: 'saveCompanies',
        payload: response.data
      });
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveCompanies(state, action) {
      state.companies = action.payload
      return {...state}
    },
    saveCompanyCount(state, action) {
      state.companyCount = action.payload
      return {...state}
    },
    saveProjects(state, action) {
      state.projects[action.payload.company] = action.payload.projects
      return {...state}
    },
    saveCurrentCompany(state, action) {
      return {...state, currentCompany: action.payload}
    },
    saveCompanyFilter(state, action) {
      return {...state, companyFilters: action.payload}
    },
  },

};
