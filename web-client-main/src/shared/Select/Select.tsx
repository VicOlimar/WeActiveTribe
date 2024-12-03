import React from 'react';
import { Field } from 'formik';
import './Select.scss';

type Option = {
  label: string,
  value: string | number,
}

type Props = {
  name: string,
  options: Option[],
  label?: string,
  onChange: Function,
  required: boolean,
  value: string | number | null,
  emptyLabel?: string,
  placeholder?: string,
  defaultLabel?: string,
}

const Select = (props: Props) => {
  const { options, label, defaultLabel = 'Selecciona' } = props

  const handleChange = (event: any) => {
    if (props.onChange) {
      props.onChange(event);
    }
  }

  return (
    <div className={`app-input`}>
      <label className='app-input__label' htmlFor={props.name}>{label}</label>
      <Field
        required={props.required}
        component='select'
        name={props.name}
        onChange={handleChange}
        className='app-input__select'
        value={props.value}
      >
        {
          options.length === 0 && <option value={'null'} >{props.emptyLabel || 'Sin elementos'}</option>

        }
        {
          options.length > 0 && <option value={''}>{defaultLabel}</option>
        }
        {options.map((option, index) => {
          return (
            <option key={index} value={option.value}>{option.label}</option>
          )
        })}
      </Field>
    </div>
  )
}

export default Select;