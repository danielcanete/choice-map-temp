export function attachOptionEvents(container, dispatch) {
  container.querySelector('#add-option').addEventListener('click', () => {
    const inputElements = container.querySelectorAll('.form-step__input');
    inputElements.forEach((input, index) => {
      dispatch({
        type: 'UPDATE_OPTION',
        payload: { index, value: input.value }
      });
    });
    dispatch({ type: 'ADD_OPTION' });
  });

  container.querySelector('#next-step').addEventListener('click', () => {
    const inputElements = container.querySelectorAll('.form-step__input');
    const newOptions = Array.from(inputElements).map(input => input.value);
    if (newOptions.length < 2 || newOptions.some(opt => opt.trim() === '')) {
      alert('Please enter at least two non-empty options.');
      return;
    }
    newOptions.forEach((value, index) => {
      dispatch({
        type: 'UPDATE_OPTION',
        payload: { index, value }
      });
    });
    dispatch({ type: 'NEXT_STEP' });
  });
}

export function attachCriteriaEvents(container, dispatch) {
  container.querySelector('#add-criterion').addEventListener('click', () => {
    const inputElements = container.querySelectorAll('.form-step__input');
    inputElements.forEach((input, index) => {
      dispatch({
        type: 'UPDATE_CRITERION',
        payload: { index, value: input.value }
      });
    });
    dispatch({ type: 'ADD_CRITERION' });
  });

  container.querySelector('#next-step').addEventListener('click', () => {
    const inputElements = container.querySelectorAll('.form-step__input');
    const newCriteria = Array.from(inputElements).map(input => input.value);
    if (newCriteria.length < 2 || newCriteria.some(c => c.trim() === '')) {
      alert('Please enter at least two non-empty criteria.');
      return;
    }
    newCriteria.forEach((value, index) => {
      dispatch({
        type: 'UPDATE_CRITERION',
        payload: { index, value }
      });
    });
    dispatch({ type: 'NEXT_STEP' });
  });
}

function createInputField({ id, label, value, className = '', type = 'text', data = {} }) {
  const dataAttrs = Object.entries(data)
    .map(([k, v]) => `data-${k}="${v}"`)
    .join(' ');
  return `
    <div class="form-step__field">
      <label class="form-step__label" for="${id}">${label}</label>
      <input
        type="${type}"
        id="${id}"
        value="${value}"
        class="form-step__input${className ? ' ' + className : ''}"
        ${dataAttrs}
      />
    </div>
  `;
}

export function renderFields(containerId, items, labelPrefix, inputType = 'text') {
  return items
    .map((value, index) =>
      createInputField({
        id: `${containerId}-${index}`,
        label: `${labelPrefix} ${index + 1}`,
        value,
        type: inputType,
        data: { index }
      })
    )
    .join('');
}
