import React from 'react';
import { View, Text } from 'react-native';
import bem from 'react-native-bem';
// @ts-ignore
import styles from  './Paragraph.scss';

type Props = {
  title?: string,
  text: string,
  terms?: string[],
  color?: 'white' | 'black',
}

export const Paragraph = ({ title, text, color = 'white', terms = [] }: Props) => {
  const b = (selector) => bem(selector, {}, styles);
  return (
    <View style={styles.paragraph}>
      {
        title !== undefined && <Text style={[b('paragraph__title'), b(`${`paragraph__title-${color}`}`)]}>{title}</Text>
      }
      <Text style={[b('paragraph__text'), b(`${`paragraph__text-${color}`}`)]}>
        {text}
      </Text>
      {
        terms.length > 0 && <ul className={`paragraph__terms ${color ? `paragraph__terms-${color}` : ''}`}>
          {terms.map(term => <li key={term}>{term}</li>)}
        </ul>
      }
    </View>
  )
}

export default Paragraph;