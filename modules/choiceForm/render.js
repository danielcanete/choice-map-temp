export function renderDefineCriteria(container, dispatch, getState) {
  const { criteria } = getState();

  container.innerHTML = `
    <section class="form-step form-step--criteria">
      <h2 class="form-step__title">🧠 Define your decision criteria</h2>
      <div class="form-step__group" id="criteria-container">
        ${criteria
          .map(
            (value, index) => `
            <div class="form-step__field">
              <label class="form-step__label" for="criterion-${index}">
                Criterion ${index + 1}
              </label>
              <input
                type="text"
                id="criterion-${index}"
                data-index="${index}"
                value="${value}"
                class="form-step__input"
              />
            </div>
          `
          )
          .join('')}
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

  // Escuchar cambios en los inputs
  const inputElements = container.querySelectorAll('.form-step__input');
  inputElements.forEach((input) => {
    input.addEventListener('input', (e) => {
      const index = parseInt(e.target.dataset.index, 10);
      dispatch({
        type: 'UPDATE_CRITERION',
        payload: { index, value: e.target.value }
      });
    });
  });

  // Añadir nuevo criterio
  document.getElementById('add-criterion').addEventListener('click', () => {
    dispatch({ type: 'ADD_CRITERION' });
  });

  // Validar y avanzar al siguiente paso
  document.getElementById('next-step').addEventListener('click', () => {
    const { criteria } = getState();
    const hasEmpty = criteria.some((c) => c.trim() === '');
    if (criteria.length < 2 || hasEmpty) {
      alert('Please enter at least two non-empty criteria.');
      return;
    }
    dispatch({ type: 'NEXT_STEP' });
  });
}

export function renderDefineOptions(container, dispatch, getState) {
  const { options } = getState();

  container.innerHTML = `
    <section class="form-step form-step--options">
      <h2 class="form-step__title">🧭 Define the options you want to compare</h2>
      <div class="form-step__group" id="options-container">
        ${options
          .map(
            (value, index) => `
            <div class="form-step__field">
              <label class="form-step__label" for="option-${index}">Option ${index + 1}</label>
              <input
                type="text"
                id="option-${index}"
                data-index="${index}"
                value="${value}"
                class="form-step__input"
              />
            </div>
          `
          )
          .join('')}
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

  // Manejar cambios en inputs
  const inputElements = container.querySelectorAll('.form-step__input');
  inputElements.forEach((input) => {
    input.addEventListener('input', (e) => {
      const index = parseInt(e.target.dataset.index, 10);
      dispatch({
        type: 'UPDATE_OPTION',
        payload: { index, value: e.target.value }
      });
    });
  });

  // Añadir nueva opción
  document.getElementById('add-option').addEventListener('click', () => {
    dispatch({ type: 'ADD_OPTION' });
  });

  // Validar y avanzar al siguiente paso
  document.getElementById('next-step').addEventListener('click', () => {
    const { options } = getState();
    const hasEmpty = options.some((opt) => opt.trim() === '');
    if (options.length < 2 || hasEmpty) {
      alert('Please enter at least two non-empty options.');
      return;
    }
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

  // Añadir listeners a cada input de puntuación
  const inputs = container.querySelectorAll('.form-step__input--score');
  inputs.forEach((input) => {
    input.addEventListener('input', (e) => {
      const option = e.target.dataset.option;
      const criterion = e.target.dataset.criterion;
      const score = parseInt(e.target.value, 10);
      if (score >= 1 && score <= 5) {
        dispatch({
          type: 'RATE_OPTION',
          payload: { option, criterion, score }
        });
      }
    });
  });

  // Validar y continuar
  document.getElementById('next-step').addEventListener('click', () => {
    const { options, criteria, ratings } = getState();
    const allRated = options.every((opt) =>
      criteria.every((crit) => ratings[opt]?.[crit] >= 1 && ratings[opt]?.[crit] <= 5)
    );

    if (!allRated) {
      alert('Please rate every option for every criterion.');
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

  // Manejar cambios en los sliders
  const sliders = container.querySelectorAll('.form-step__input--range');
  sliders.forEach((slider, index) => {
    slider.addEventListener('input', (e) => {
      const criterion = e.target.dataset.criterion;
      const weight = parseInt(e.target.value, 10);
      document.getElementById(`value-${index}`).textContent = weight;
      dispatch({
        type: 'SET_WEIGHT',
        payload: { criterion, weight }
      });
    });
  });

  // Validar y pasar al siguiente paso
  document.getElementById('next-step').addEventListener('click', () => {
    const state = getState();
    const allAssigned = state.criteria.every(
      (c) => typeof state.weights[c] === 'number' && state.weights[c] >= 0
    );

    if (!allAssigned) {
      alert('Please assign a weight to every criterion.');
      return;
    }

    dispatch({ type: 'NEXT_STEP' });
  });
}
