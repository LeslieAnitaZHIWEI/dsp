const formModel = {
  namespace: 'form',
  state: {
    formClose: false,
  },
  effects: {},
  reducers: {
    changeClosedStatus(state, { payload }) {
      return { ...state, formClose: payload };
    },
  },
};
export default formModel;
