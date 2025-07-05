// ==============================
// Estado inicial
// ==============================

const initialState = {
  currentStep: 0,
  options: ['Option 1', 'Option 2'],
  criteria: ['Criterion 1', 'Criterion 2'],
  weights: {},         // { criterionName: weight }
  ratings: {}          // { optionName: { criterionName: score } }
};

// ==============================
// Reducer: gestiona el estado según una acción
// ==============================

export function reducer(state, action) {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, currentStep: state.currentStep + 1 };

    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) };

    case 'SET_STEP':
      return { ...state, currentStep: action.payload };

    case 'UPDATE_OPTION':
      return {
        ...state,
        options: state.options.map((opt, i) =>
          i === action.payload.index ? action.payload.value : opt
        )
      };

    case 'ADD_OPTION':
      return { ...state, options: [...state.options, ''] };

    case 'UPDATE_CRITERION':
      return {
        ...state,
        criteria: state.criteria.map((crit, i) =>
          i === action.payload.index ? action.payload.value : crit
        )
      };

    case 'ADD_CRITERION':
      return { ...state, criteria: [...state.criteria, ''] };

    case 'SET_WEIGHT':
      return {
        ...state,
        weights: {
          ...state.weights,
          [action.payload.criterion]: action.payload.weight
        }
      };

    case 'RATE_OPTION':
      return {
        ...state,
        ratings: {
          ...state.ratings,
          [action.payload.option]: {
            ...(state.ratings[action.payload.option] || {}),
            [action.payload.criterion]: action.payload.score
          }
        }
      };

    case 'RESET':
      return JSON.parse(JSON.stringify(initialState));

    default:
      return state;
  }
}
