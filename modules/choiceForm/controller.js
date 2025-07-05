import * as renderers from './render.js';
import { reducer } from './state.js';
import { steps } from './steps.js';

const RENDERER_MAP = {
  'define-options': renderers.renderDefineOptions,
  'define-criteria': renderers.renderDefineCriteria,
  'weight-criteria': renderers.renderWeightCriteria,
  'rate-options': renderers.renderRateOptions,
  'summary': renderers.renderSummary
};

export const createFormController = () => {
  let state = reducer(undefined, { type: 'INIT' });

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    renderCurrentStep();
  };

  const renderCurrentStep = () => {
    const container = document.getElementById('choice-form');
    if (!container) return;

    const stepId = steps[state.currentStep]?.id;
    const renderer = RENDERER_MAP[stepId];

    if (renderer) {
      renderer(container, dispatch, getState);
    } else {
      container.innerHTML = `<p class="form-step__error">Invalid step: ${stepId}</p>`;
    }
  };

  const init = () => renderCurrentStep();

  return Object.freeze({
    init,
    dispatch,
    getState
  });
};
