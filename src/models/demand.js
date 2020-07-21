import { getDetail } from '@/services/demand';
import { getCategory } from '@/services/adplan';
const demandModel = {
  namespace: 'demand',
  state: {
    demandDetail: {},
    dstagcategory: [],
    selectedTags: [],
    selectedTagsCrowd: [],
    tagRowNum: 0,
    areaString: '',
    keywordList: '',
    demandSaveOrUpdateDTO: {},
    tagInfo: '近30天',
    keywordNum: 0,
    brand: '',
  },
  effects: {
    *getDetail({ payload }, { call, put, select }) {
      const response = yield call(getDetail, { id: payload });
      yield put({
        type: 'saveDemand',
        payload: response.data,
      });
    },
    *getCategory({ payload }, { call, put, select }) {
      const response = yield call(getCategory, {});
      yield put({
        type: 'setCategory',
        payload: response.data,
      });
    },
  },
  reducers: {
    saveDemand(state, action) {

      return { ...state, demandDetail: action.payload || {} };
    },
    setBrand(state, action) {
      return { ...state, brand: action.brand || '' };
    },
    setSelectedTags(state, action) {
      const { payload } = action;
      const { selectedTags } = state;
      var idArr = [];
      let allArr = [...payload, ...selectedTags];
      var newArr = [];
      allArr.forEach(ele => {
        if (idArr.indexOf(ele.tag) == -1) {
          idArr.push(ele.tag);
          newArr.push(ele);
        }
      });
      let tagRowNum = 0;
      newArr.forEach((ant, index) => {
        if (newArr[index].tagName == undefined) {
          if (ant.tag == '地理位置') {
            newArr[index].tagName = ' : \n包含' + state.areaString;
          } else if (ant.tag == '产品关键词') {
            newArr[index].tagName = ' : ' + state.keywordList.split('\n').join(' ');
            newArr[index].tagInfo = state.tagInfo;
            newArr[index].predictNum = state.keywordNum;
          } else if (ant.categoryId == 0) {
            ant.tagName = '(自定义标签)';
          } else if (ant.tag.indexOf('品牌偏好-自定义') != -1) {
            newArr[index].tagName = ' : ' + state.brand;
          } else if (ant.tag.indexOf('品牌偏好') != -1) {
            newArr[index].tagName = ' : ' + ant.remark;
          } else {
            newArr[index].tagName = ant.tag;
          }
        } else {
        }

        tagRowNum += ant.predictNum;
      });
      return { ...state, selectedTags: newArr, tagRowNum };
    },
    deleteSelectTag(state, action) {
      var arr = state.selectedTags.filter(item => {
        return item.tag != action.payload.tag;
      });
      let tagRowNum = 0;
      arr.forEach(ant => {
        tagRowNum += ant.predictNum;
      });
      return { ...state, selectedTags: arr, tagRowNum };
    },
    deleteSelectedTagsCrowd(state, action) {
      var arr = state.selectedTagsCrowd.filter(item => {
        return item.tag != action.payload.tag;
      });
      let tagRowNum = 0;
      arr.forEach(ant => {
        tagRowNum += ant.predictNum;
      });
      return { ...state, selectedTagsCrowd: arr, tagRowNum };
    },
    deleteAll(state, action) {
      return {
        ...state,
        selectedTags: [],
        tagRowNum: 0,
      };
    },
    setAll(state, action) {
      var arr = [...action.payload];
      action.payload.forEach((item, index) => {
        if (item.tag == '地理位置') {
          arr.push({
            ...item,
            tagName: item.tagName.substring(5),
          });
        } else if (item.tag == '产品关键词') {
          arr.push({
            ...item,
            tagName: item.tagName.substring(6),
          });
        }else if (item.tag == '品牌偏好-自定义') {
          arr.push({
            ...item,
            tagName: item.tagName.substring(8),
          });
        } else {
          arr.push(item);
        }
      });
      var idArr = [];
      let allArr = [...state.selectedTags, ...arr];
      var newArr = [];
      allArr.reverse();
      allArr.forEach(ele => {
        if (idArr.indexOf(ele.tag) == -1) {
          idArr.push(ele.tag);
          newArr.push(ele);
        }
      });
      return {
        ...state,
        selectedTags: newArr,
      };
    },
    setCategory(state, action) {
      return {
        ...state,
        dstagcategory: action.payload || {},
      };
    },
    setAreaString(state, action) {
      return {
        ...state,
        areaString: action.payload || '',
      };
    },
    setKeywordList(state, action) {
      return {
        ...state,
        keywordList: action.payload || '',
      };
    },
    setKeywordNum(state, action) {
      return {
        ...state,
        keywordNum: action.payload || '',
      };
    },
    setDirectSelectedTags(state, action) {
      var arr = [...action.payload];
      action.payload.forEach((item, index) => {
        if (item.tag == '地理位置') {
          arr.push({
            ...item,
            tagName: item.tagName.substring(5),
          });
        } else if (item.tag == '产品关键词') {
          arr.push({
            ...item,
            tagName: item.tagName.substring(6),
          });
        } else if (item.tag == '品牌偏好-自定义') {
          arr.push({
            ...item,
            tagName: item.tagName.substring(8),
          });
        } else {
          arr.push(item);
        }
      });
      var idArr = [];
      let allArr = [...state.selectedTags, ...arr];
      var newArr = [];
      allArr.reverse();
      allArr.forEach(ele => {
        if (idArr.indexOf(ele.tag) == -1) {
          idArr.push(ele.tag);
          newArr.push(ele);
        }
      });
      return {
        ...state,
        selectedTagsCrowd: newArr,
      };
    },
    settagInfo(state, action) {
      return {
        ...state,
        tagInfo: action.payload || '',
      };
    },
    addToSelect(state, action) {
      var idArr = [];
      let allArr = [...state.selectedTagsCrowd, ...state.selectedTags];
      var newArr = [];
      allArr.forEach(ele => {
        if (idArr.indexOf(ele.tag) == -1) {
          idArr.push(ele.tag);
          newArr.push(ele);
        }
      });
      return {
        ...state,
        selectedTags: newArr,
      };
    },
  },
};
export default demandModel;
