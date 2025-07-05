import {
  renderDefineCriteria,
  renderDefineOptions,
  renderRateOptions,
  renderSummary,
  renderWeightCriteria
} from './render.js';
import { reducer } from './state.js';
import { steps } from './steps.js';

export const createFormController = () => {
  let state = reducer(undefined, { type: 'INIT' });

  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action);
    renderCurrentStep();
  }

  function renderCurrentStep() {
    const container = document.getElementById('choice-form');
    if (!container) return;

    const step = steps[state.currentStep]?.id;

    const rendererMap = {
      'define-options': renderDefineOptions,
      'define-criteria': renderDefineCriteria,
      'weight-criteria': renderWeightCriteria,
      'rate-options': renderRateOptions,
      'summary': renderSummary
    };

    const renderer = rendererMap[step];

    if (typeof renderer === 'function') {
      renderer(container, dispatch, getState);
    } else {
      container.innerHTML = `<p class="form-step__error">Invalid step: ${step}</p>`;
    }
  }

  function init() {
    renderCurrentStep();
  }

  return {
    init,
    dispatch,
    getState
  };
};
