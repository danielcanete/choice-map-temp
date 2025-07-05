import { createFormController } from './controller.js';

export const initChoiceForm = () => {
  try {
    const controller = createFormController();
    controller.init();
    return controller;
  } catch (error) {
    console.error('Failed to initialize Choice Form:', error);
  }
};

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initChoiceForm);
}
