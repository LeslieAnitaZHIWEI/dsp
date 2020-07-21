const adjustModel = {
  namespace: 'adjust',
  state: {
    cAdData: [],

    images: [],
    videos: [],
    icons: [],
  },
  effects: {},
  reducers: {
    addToSelect(state, action) {
      return {
        ...state,
        cAdData: action.cAdData,
      };
    },
    deleteAll(state, action) {
      return {
        ...state,
        cAdData: [],
      };
    },
    addImages(state, action) {
      var idArr = [];
      let allArr = [...action.images];
      var newArr = [];
      allArr.forEach(ele => {
        if (idArr.indexOf(ele.url) == -1) {
          idArr.push(ele.url);
          newArr.push(ele);
        }
      });
      return {
        ...state,
        images: newArr,
      };
    },
    addVideos(state, action) {
        var idArr = [];
      let allArr = [...action.videos];
      var newArr = [];
      allArr.forEach(ele => {
        if (idArr.indexOf(ele.url) == -1) {
          idArr.push(ele.url);
          newArr.push(ele);
        }
      });
      return {
        ...state,
        videos: newArr
      };
    },
    addIcons(state, action) {
        var idArr = [];
      let allArr = [...action.icons];
      var newArr = [];
      allArr.forEach(ele => {
        if (idArr.indexOf(ele.url) == -1) {
          idArr.push(ele.url);
          newArr.push(ele);
        }
      });
      return {
        ...state,
        icons: newArr
      };
    },
    filterAll(state, action) {
      var images = state.images.filter(item => item.url != action.url);
      var videos = state.videos.filter(item => item.url != action.url);
      var icons = state.icons.filter(item => item.url != action.url);
      return {
        ...state,
        icons,
        videos,
        images,
      };
    },
  },
};
export default adjustModel;
