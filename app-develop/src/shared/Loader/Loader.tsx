import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import bem from 'react-native-bem';
import styles from './Loader.scss';

type Props = {
    color?: string
}

const Loader = (props: Props) => {
    const { color = '#ffffff' } = props;
    const b = (selector) => bem(selector, props, styles);

    return (
        <View style={b('loader')}>
            <ActivityIndicator size='large' color={color} />
        </View>
    );
}

export default Loader;