const refs = {
  form: document.querySelector('.form'),
  delay: document.querySelector('[name="delay"]'),
  step: document.querySelector('[name="step"]'),
  amount: document.querySelector('[name="amount"]'),
  btn: document.querySelector('button'),
  allInputs: document.querySelectorAll('input'),
};

refs.form.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
  e.preventDefault();

  refs.btn.setAttribute('disabled', true);

  let position = 1;
  let delay = Number(refs.delay.value);
  const step = Number(refs.step.value);

  for (let i = 1; i <= refs.amount.value; i += 1) {
    if (i > 1) {
      delay += step;
    }

    if (i === Number(refs.amount.value)) {
      setTimeout(() => {
        refs.btn.removeAttribute('disabled');
      }, delay);
    }

    position = i;

    createPromise(position, delay)
      .then(({ position, delay }) => {
        setTimeout(() => {
          console.log(`✅ Fulfilled promise ${position} in ${delay} ms`);
        }, delay);
      })
      .catch(({ position, delay }) => {
        setTimeout(() => {
          console.log(`❌ Rejected promise ${position} in ${delay} ms`);
        }, delay);
      });
  }

  clearInputs(refs.allInputs);
}

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;
  return new Promise((resolve, reject) => {
    if (shouldResolve) {
      return resolve({ position, delay });
    } else {
      return reject({ position, delay });
    }
  });
}

function clearInputs(inputs) {
  inputs.forEach(input => {
    input.value = '';
  });
}
