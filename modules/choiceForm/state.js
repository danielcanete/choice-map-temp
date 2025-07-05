const initialState = Object.freeze({
  currentStep: 0,
  options: ['', ''],
  criteria: ['', ''],
  weights: {},
  ratings: {},
});

const updateArrayItem = (array, index, value) =>
  array.map((item, i) => (i === index ? value : item));

const addEmptyItem = (array) => [...array, ''];

const setWeight = (weights, { criterion, weight }) => ({
  ...weights,
  [criterion]: weight,
});

const setRating = (ratings, { option, criterion, score }) => ({
  ...ratings,
  [option]: {
    ...(ratings[option] || {}),
    [criterion]: score,
  },
});

export function reducer(state = initialState, action) {
  switch (action.type) {
    case 'INIT':
      return initialState;
    case 'NEXT_STEP':
      return { ...state, currentStep: state.currentStep + 1 };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'UPDATE_OPTION':
      return {
        ...state,
        options: updateArrayItem(state.options, action.payload.index, action.payload.value),
      };
    case 'ADD_OPTION':
      return { ...state, options: addEmptyItem(state.options) };
    case 'UPDATE_CRITERION':
      return {
        ...state,
        criteria: updateArrayItem(state.criteria, action.payload.index, action.payload.value),
      };
    case 'ADD_CRITERION':
      return { ...state, criteria: addEmptyItem(state.criteria) };
    case 'SET_WEIGHT':
      return { ...state, weights: setWeight(state.weights, action.payload) };
    case 'RATE_OPTION':
      return { ...state, ratings: setRating(state.ratings, action.payload) };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}
