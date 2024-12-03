import React, { Fragment } from 'react';
import { Field, ErrorMessage } from 'formik';
import './Input.scss';
import { Link } from 'react-router-dom';

const Input = (props: any) => {
  const Label = <label htmlFor={props.name}>{props.label}</label>;

  /**
   * Set the focus in the current input
   * @param input - Input React REF
   */
  function setFocus(input: any) {
    input.focus();
  }

  /**
   * Verify if onFocus callback is not undefined and call it
   * @param event HTML Event
   */
  function changeFocus(event: any) {
    if (props.onFocus) {
      props.onFocus();
    }
  }

  function renderTextArea() {
    return (
      <div className={`app__input ${props.center ? 'app__input-center' : ''}`}>
        <Field
          type={props.type}
          name={props.name}
          value={props.value}
          render={({ field, form, meta }: any) => (
            <div>
              <Fragment>
                {Label}
                <textarea ref={(input) => { if (props.focus && input) setFocus(input) }} onFocus={changeFocus} value={field.value} placeholder={props.placeholder} onChange={props.onChange}></textarea>
              </Fragment>
            </div>
          )}
        />
      </div>
    )
  }

  /**
   * Render the checkbox component layout
   */
  function renderCheckbox() {
    return (
      <div className={`app__input ${props.center ? 'app__input-center' : ''}`}>
        <Field
          type={props.type}
          name={props.name}
          checked={props.checked}
          render={({ field, form, meta }: any) => (
            <div>
              <label className="app__input__checkbox" htmlFor={props.name}>
                <input
                  type={props.type}
                  placeholder={props.placeholder}
                  onChange={props.onChange}
                  checked={props.checked}
                  style={{ width: props.link ? '30px' : '100%' }}
                />
                {props.link ? <Link to={props.link} target='_blank'>{props.label}</Link> : props.label}
                <span className="app__input__checkbox__checkmark"></span>
              </label>
            </div>
          )}
        />
      </div>
    )
  }

  /**
   * Render the input component layout
   */
  function renderInput() {
    return (
      <div className={`app__input ${props.center ? 'app__input-center' : ''}`}>
        <Field
          type={props.type}
          name={props.name}
          value={props.value}
          render={({ field, form, meta }: any) => (
            <div>
              <Fragment>
                {Label}
                <input ref={(input) => { if (props.focus && input) setFocus(input) }} onFocus={changeFocus} type={props.type} value={field.value} placeholder={props.placeholder} onChange={props.onChange} />
              </Fragment>
            </div>
          )}
        />
      </div>
    )
  }

  return (
    <div className={`app__input ${props.center ? 'app__input-center' : ''}`}>
      <Field
        type={props.type}
        name={props.name}
        value={props.value}
        render={({ field, form, meta }: any) => (
          <div>
            {
              props.type === 'textarea' && renderTextArea()
            }
            {
              props.type !== 'checkbox' && props.type !== 'textarea' && renderInput()
            }
            {
              props.type === 'checkbox' && renderCheckbox()
            }
          </div>
        )}
      />
      <ErrorMessage className='app__input__error-message' name={props.name} component='div' />
    </div>
  );
};

export default Input;
