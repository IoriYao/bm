
import request from "../utils/request";
import IndexPage from "../routes/IndexPage";
let pageSize = 50
export default {
  namespace: 'bm',

  state: {
    companies: [],
    projects: {},
    currentCompany: {},
    companyCount: 1000,
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
          sql: `select SQL_CALC_FOUND_ROWS * from corp_details limit ${(payload.current - 1 )* payload.pageSize},${payload.pageSize};`
      })
      yield put({
        type: 'saveCompanies',
        payload: response.data
      });
    },
    *fetchProjects({ payload }, { call, put }) {  // eslint-disable-line
      let response = yield call(request, {
        sql: `select * from corp_proj where corpId='${payload.companyId}';`
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
    },
    *queryCompanyByType({ payload }, { call, put }) {
      console.log(payload)
      let condition = ''
      console.log(payload)
      payload.companyFilters.forEach((filter, i) => {
        if (filter.value === undefined || filter.value === '') return
        condition += ' AND'
        if (filter.operator === 'contains') {
          condition += ` corp_details.${IndexPage.attrMap[filter.name]} like '%${filter.value}%' `
        } else {
          condition += ` corp_details.${IndexPage.attrMap[filter.name]}${filter.operator}'${filter.value}'`
        }
      })
      let dateCondition = payload.endDate ? ` corp_proj.endDate > '${payload.endDate}' ` : 'true'
      let typeCondition = payload.roadMaterial != '-1' ? ` corp_proj.roadType = ${payload.roadMaterial} ` : true
      let levelCondition = payload.roadLevel != '-1' ? ` corp_proj.projectTypeEnum >= ${payload.roadLevel} ` : true
      let roadCondition = payload.roadLen ? `lenMatchCompany.totalLen >= ${payload.roadLen * 1000}` : true
      let bridgeCondition = payload.bridgeLen ? ` lenMatchCompany.totalLargeBridgeLen >= ${payload.bridgeLen * 1000} ` : true
      let tunnelCondition = payload.tunnelLen ? ` lenMatchCompany.totalTunnelLen >= ${payload.tunnelLen * 1000} ` : true
      let cptNameCondition = payload.cptName ? `cptTitle like '%${payload.cptName}%'` : true
      let cptTypeCondition = payload.cptType != -1 ? `(cpttype = '%${payload.cptType}%' or cptTitle like '%${payload.cptType}%')` : true
      let cptLevelCondition = payload.cptLevel != -1 ? `cptlevelEnum >= ${payload.cptLevel}` : true
      let sql
      if (cptLevelCondition !== true || cptTypeCondition !== true || cptNameCondition !== true) {
        sql = `SELECT SQL_CALC_FOUND_ROWS * FROM
            demo.corp_details,
              (SELECT corpid, SUM(roadLen) AS totalLen,
                      SUM(tunnel_length) AS totalTunnelLen,
                      SUM(largeBridgeLen) AS totalLargeBridgeLen
                FROM demo.corp_proj, (SELECT corp_id
                  FROM demo.corp_cpt
                  WHERE ${cptLevelCondition}
                      AND ${cptNameCondition}
                      AND ${cptTypeCondition}
                  GROUP BY corp_id) AS cptMatchCompany
                WHERE
                      cptMatchCompany.corp_id = corp_proj.corpid and
                      ${dateCondition} and ${typeCondition} and ${levelCondition}
                  GROUP BY corpid) AS lenMatchCompany
              WHERE ${roadCondition} 
                   AND ${bridgeCondition} 
                   AND ${tunnelCondition} 
                   AND lenMatchCompany.corpid = corp_details.companyId ${condition}
              order by totalLen desc
              limit ${(payload.pagination.current - 1 )* payload.pagination.pageSize},${payload.pagination.pageSize};`
      } else {
        sql = `
          select SQL_CALC_FOUND_ROWS * from corp_details,
          ( select * from 
            ( select corpid,sum(roadLen) as totalLen,
                     SUM(tunnel_length) AS totalTunnelLen,
                     SUM(largeBridgeLen) AS totalLargeBridgeLen
                from corp_proj where
              ${dateCondition} and ${typeCondition} and ${levelCondition} group by corpid) as lenMatchCompany
            where ${roadCondition} AND ${bridgeCondition} AND ${tunnelCondition}) as temp0
          where corp_details.companyId = temp0.corpid ${condition} order by totalLen desc
          limit ${(payload.pagination.current - 1 )* payload.pagination.pageSize},${payload.pagination.pageSize};`
      }
      let response = yield call(request, {
        sql: sql
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
      state.companies = action.payload.results || action.payload
      if (action.payload.count) state.companyCount = action.payload.count
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
