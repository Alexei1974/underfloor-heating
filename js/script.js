new Swiper('.hero__slider', {
  // Optional parameters
  slidesPerView: 1,
  loop: true,
  spaceBetween: 10,
  //  loopedSlides: 2,

  // Navigation arrows
  navigation: {
    nextEl: '.hero__slider-btn_prev',
    prevEl: '.hero__slider-btn_next',
  },
  autoplay: {
    delay: 2000,
  },

  breakpoints: {
    540: {
      slidesPerView: 2,
    }
  },
});

// калкулятор

const calcForm = document.querySelector('.js-calc-form');
const totalSquare = document.querySelector('.js-square');
const totalPrice = document.querySelector('.js-total-price');
const calcResultWrapper = document.querySelector('.calc__result-wrapper');
const submitBtn = document.querySelector('.js-submit');
const calcOrder = document.querySelector('.calc__order');

const tariff = {
  economy: 550,
  comfort: 850,
  premium: 970,
}

calcForm.addEventListener('input', () => {
  if (calcForm.width.value > 0 && calcForm.length.value > 0) {
    submitBtn.disabled = false
  } else {
    submitBtn.disabled = true
  }
})

calcForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (calcForm.width.value > 0 && calcForm.length.value > 0) {
    const square = (calcForm.width.value * calcForm.length.value);
    const price = (square * tariff[calcForm.tariff.value]);

    calcResultWrapper.style.display = 'block';
    calcOrder.classList.add('calc__order_show');

    totalSquare.textContent = `${square} кв м`
    totalPrice.textContent = `${price} руб`

  }
});

// модальное окно

const scrollController = {
  scrollPosition: 0,
  disabledScroll() {
    scrollController.scrollPosition = window.scrollY;
    document.body.style.cssText = `
        overflow: hidden;
        position: fixed;
        top: -${scrollController.scrollPosition}px;
        left: 0;
        height: 100vh;
        width: 100vw;
        padding-right: ${window.innerWidth - document.body.offsetWidth}px
      `;
    document.documentElement.style.scrollBehavior = 'unset';
  },
  enabledScroll() {
    document.body.style.cssText = '';
    window.scroll({ top: scrollController.scrollPosition })
    document.documentElement.style.scrollBehavior = '';
  },
}


const modalController = ({ modal, btnOpen, btnClose, time = 300 }) => {
  const buttonElems = document.querySelectorAll(btnOpen);
  const modalElem = document.querySelector(modal);

  modalElem.style.cssText = `
      display: flex;
      visibility: hidden;
      opacity: 0;
      transition: opacity ${time}ms ease-in-out;
    `;

  const closeModal = event => {
    const target = event.target;

    if (
      target === modalElem ||
      (btnClose && target.closest(btnClose)) ||
      event.code === 'Escape'
    ) {

      modalElem.style.opacity = 0;

      setTimeout(() => {
        modalElem.style.visibility = 'hidden';
        scrollController.enabledScroll();
      }, time);

      window.removeEventListener('keydown', closeModal);
    }
  }

  const openModal = () => {
    modalElem.style.visibility = 'visible';
    modalElem.style.opacity = 1;
    window.addEventListener('keydown', closeModal);
    scrollController.disabledScroll();
  };

  buttonElems.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  modalElem.addEventListener('click', closeModal);
};

modalController({
  modal: '.modal',
  btnOpen: '.js-order',
  btnClose: '.modal__close',
});


const phone = document.querySelector('#phone');
const imPhone = new Inputmask('+7(999)999-99-99');
console.log(imPhone);
imPhone.mask(phone);


const validator = new JustValidate('.modal__form', {

  errorLabelCssClass: 'modal__inpur-error',

  errorLabelStyle: {
    color: 'red',
  },
});

validator
  .addField('#name', [
    {
      rule: 'required',
      errorMessage: 'как вас зовут'
    },
    {
      rule: 'minLength',
      value: 3,
      errorMessage: 'не  короче 3 символов'
    }
  ])
  .addField('#phone', [
    {
      rule: 'required',
      errorMessage: 'укажите ваш телефон'
    },
    {
      validator: value => {
        const number = phone.inputmask.unmaskedvalue()
        return number.length === 10;
        console.log(number);
      },
      errorMessage: 'телефон неккоретный'
    }
  ]);

validator.onSuccess((event) => {
  const form = event.currentTarget

  fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  body: JSON.stringify({
   name: form.name.value,
   phone: form.phone.value
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((data) => {
    form.reset();
    alert(`спасибо мы с  вами свяжемся, ваша заявка под  номером: ${data.id}`)
  });
})