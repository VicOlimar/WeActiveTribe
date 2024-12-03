import React from 'react';
import { View } from 'react-native';

import bem from 'react-native-bem';
import styles from './Divider.scss';

type Props = {
    color?: string,
}

const Divider = (props: Props) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <View
            style={props.color ? [b('divider'), { borderBottomColor: props.color }] : b('divider')}
        />
    );
}

export default Divider;