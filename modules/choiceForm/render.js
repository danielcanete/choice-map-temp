export function renderDefineOptions(container, dispatch, getState) {
  const { options } = getState();

  container.innerHTML = `
    <section class="form-step form-step--options">
      <h2 class="form-step__title">🧭 Define the options you want to compare</h2>
      <div class="form-step__group" id="options-container">
        ${renderFields('option', options, 'Option')}
      </div>
      <div class="form-step__actions">
        <button type="button" id="add-option" class="form-step__button form-step__button--secondary">
          + Add Option
        </button>
        <button type="button" id="next-step" class="form-step__button form-step__button--primary">
          Next
        </button>
      </div>
    </section>
  `;

  attachOptionEvents(container, dispatch);
}

function attachOptionEvents(container, dispatch) {
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

function renderFields(containerId, items, labelPrefix, inputType = 'text') {
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

export function renderDefineCriteria(container, dispatch, getState) {
  const { criteria } = getState();

  container.innerHTML = `
    <section class="form-step form-step--criteria">
      <h2 class="form-step__title">🧠 Define your decision criteria</h2>
      <div class="form-step__group" id="criteria-container">
        ${renderFields('criterion', criteria, 'Criterion')}
      </div>
      <div class="form-step__actions">
        <button type="button" id="add-criterion" class="form-step__button form-step__button--secondary">
          + Add Criterion
        </button>
        <button type="button" id="next-step" class="form-step__button form-step__button--primary">
          Next
        </button>
      </div>
    </section>
  `;

  attachCriteriaEvents(container, dispatch);
}

function attachCriteriaEvents(container, dispatch) {
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

export function renderRateOptions(container, dispatch, getState) {
  const { options, criteria, ratings } = getState();

  container.innerHTML = `
    <section class="form-step form-step--ratings">
      <h2 class="form-step__title">📊 Rate each option by each criterion</h2>
      <div class="form-step__grid">
        <table class="form-step__table">
          <thead>
            <tr>
              <th>Option \\ Criterion</th>
              ${criteria.map(c => `<th>${c}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${options
      .map(
        (option) => `
                  <tr>
                    <td><strong>${option}</strong></td>
                    ${criteria
            .map((criterion) => {
              const value = ratings[option]?.[criterion] ?? '';
              return `
                          <td>
                            <input
                              type="number"
                              min="1"
                              max="5"
                              step="1"
                              value="${value}"
                              class="form-step__input form-step__input--score"
                              data-option="${option}"
                              data-criterion="${criterion}"
                            />
                          </td>
                        `;
            })
            .join('')}
                  </tr>
                `
      )
      .join('')}
          </tbody>
        </table>
      </div>

      <div class="form-step__actions">
        <button type="button" id="next-step" class="form-step__button form-step__button--primary">
          Finish
        </button>
      </div>
    </section>
  `;

  // Validar y continuar solo al pulsar "Finish"
  document.getElementById('next-step').addEventListener('click', () => {
    // Leer todos los valores de los inputs
    const inputs = container.querySelectorAll('.form-step__input--score');
    let valid = true;

    // Guardar los ratings en el estado
    inputs.forEach((input) => {
      const option = input.dataset.option;
      const criterion = input.dataset.criterion;
      const score = parseInt(input.value, 10);
      if (isNaN(score) || score < 1 || score > 5) {
        valid = false;
      } else {
        dispatch({
          type: 'RATE_OPTION',
          payload: { option, criterion, score }
        });
      }
    });

    if (!valid) {
      alert('Please rate every option for every criterion (1-5).');
      return;
    }

    dispatch({ type: 'NEXT_STEP' });
  });
}

export function renderWeightCriteria(container, dispatch, getState) {
  const { criteria, weights } = getState();

  container.innerHTML = `
    <section class="form-step form-step--weights">
      <h2 class="form-step__title">⚖️ Assign weight to each criterion</h2>
      <div class="form-step__group" id="weights-container">
        ${criteria
          .map((criterion, index) => {
            const value = weights[criterion] ?? 5;
            return `
              <div class="form-step__field">
                <label class="form-step__label" for="weight-${index}">
                  ${criterion} <span class="form-step__weight-value" id="value-${index}">${value}</span>/10
                </label>
                <input
                  type="range"
                  id="weight-${index}"
                  data-criterion="${criterion}"
                  min="0"
                  max="10"
                  step="1"
                  value="${value}"
                  class="form-step__input--range"
                />
              </div>
            `;
          })
          .join('')}
      </div>

      <div class="form-step__actions">
        <button type="button" id="next-step" class="form-step__button form-step__button--primary">
          Next
        </button>
      </div>
    </section>
  `;

  // Actualizar el valor visual del slider al moverlo (sin actualizar el estado global)
  const sliders = container.querySelectorAll('.form-step__input--range');
  sliders.forEach((slider, index) => {
    slider.addEventListener('input', (e) => {
      document.getElementById(`value-${index}`).textContent = e.target.value;
    });
  });

  // Validar y pasar al siguiente paso solo al pulsar "Next"
  document.getElementById('next-step').addEventListener('click', () => {
    const sliders = container.querySelectorAll('.form-step__input--range');
    let allAssigned = true;

    sliders.forEach((slider) => {
      const criterion = slider.dataset.criterion;
      const weight = parseInt(slider.value, 10);
      if (isNaN(weight) || weight < 0 || weight > 10) {
        allAssigned = false;
      } else {
        dispatch({
          type: 'SET_WEIGHT',
          payload: { criterion, weight }
        });
      }
    });

    if (!allAssigned) {
      alert('Please assign a weight (0-10) to every criterion.');
      return;
    }

    dispatch({ type: 'NEXT_STEP' });
  });
}

export function renderSummary(container, _dispatch, getState) {
  const { options, criteria, weights, ratings } = getState();

  container.innerHTML = `
    <section class="form-step form-step--summary">
      <h2 class="form-step__title">📋 Summary of your inputs</h2>

      <div class="form-step__block">
        <h3 class="form-step__subtitle">Options</h3>
        <ul class="form-step__list">
          ${options.map((opt) => `<li class="form-step__list-item">${opt}</li>`).join('')}
        </ul>
      </div>

      <div class="form-step__block">
        <h3 class="form-step__subtitle">Criteria & Weights</h3>
        <ul class="form-step__list">
          ${criteria
            .map(
              (crit) => `
                <li class="form-step__list-item">
                  ${crit}: <strong>${weights[crit] ?? 0}</strong>/10
                </li>
              `
            )
            .join('')}
        </ul>
      </div>

      <div class="form-step__block">
        <h3 class="form-step__subtitle">Ratings</h3>
        <table class="form-step__table">
          <thead>
            <tr>
              <th>Option \\ Criterion</th>
              ${criteria.map((c) => `<th>${c}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${options
              .map(
                (opt) => `
                  <tr>
                    <td><strong>${opt}</strong></td>
                    ${criteria
                      .map(
                        (crit) =>
                          `<td>${ratings[opt]?.[crit] ?? '-'}</td>`
                      )
                      .join('')}
                  </tr>
                `
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <div class="form-step__actions">
        <a href="./charts.html" class="form-step__button form-step__button--primary">
          View Charts
        </a>
      </div>
    </section>
  `;

  // (Opcional) Guardar en localStorage aquí si quieres persistir
  localStorage.setItem('choice-map-data', JSON.stringify(getState()));
}
