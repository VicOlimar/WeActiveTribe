import React from 'react';
import './Paragraph.scss';
import { isUndefined } from 'util';

type Props = {
  title?: string,
  text: string,
  terms?: string[],
  color?: 'white' | 'black',
}

export const Paragraph = ({ title, text, color = 'white', terms = [] }: Props) => {
  return (
    <div className='paragraph'>
      {
        !isUndefined(title) && <h2 className={`paragraph__title ${color ? `paragraph__title-${color}`: ''}`}>{title}</h2>
      }
      <p className={`paragraph__text ${color ? `paragraph__text-${color}`: ''}`}>
        {text}
      </p>
      {
        terms.length > 0 && <ul className={`paragraph__terms ${color ? `paragraph__terms-${color}`: ''}`}>
          {terms.map(term => <li key={term}>{term}</li>)}
        </ul>
      }
    </div>
  )
}

export default Paragraph;