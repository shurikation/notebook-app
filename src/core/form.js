export class Form {
  constructor(form, inputsData) {
    this.$form = form;
    this.inputsData = inputsData; //{title: "*some text*"}{fulltext: "*some text*"}
  }

  getValue() {
    const value = {};
    Object.keys(this.inputsData).forEach(input => {
      value[input] = this.$form[input].value; // = текст из заголовка и текст из фуллтекста
    });
    return value;
  }

  clear() {
    Object.keys(this.inputsData).forEach(input => {
      this.$form[input].value = '';
    });
  }

  isValid() {
    let isFormValid = true;
    let isInputValid = true;

    Object.keys(this.inputsData).forEach(input => {
      const validators = this.inputsData[input]; // функция валидирования из Validator

      validators.forEach(validator => {
        isInputValid = validator(this.$form[input].value);
      });

      (isInputValid)
          ? this.hideErrorWarning(this.$form[input])
          : this.showErrorWarning(this.$form[input]);

      isFormValid = isFormValid && isInputValid;
    });

    return isFormValid;
  }

  showErrorWarning($input) {
    this.hideErrorWarning($input);
    const error = `<p class="validation-error">Введите текст!</p>`;
    $input.classList.add('invalid-border');
    $input.insertAdjacentHTML('afterEnd', error);
  }

  hideErrorWarning($input) {
    $input.classList.remove('invalid-border');

    if ($input.nextSibling) {
      $input.closest('.form__input-wrap').removeChild($input.nextSibling);
    }
  }
}



