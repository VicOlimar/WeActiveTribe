import React from 'react';
import { View, Image, Dimensions } from 'react-native';

import bem from 'react-native-bem';
import styles from './InstructorAvatar.scss';
import { Instructor } from '../../../../services/Instructor/Instructor';
import WeLogo from './../../../../assets/img/logo-white.png';

type Props = {
    instructor: Instructor,
}

const InstructorAvatar = (props: Props) => {
    const { instructor } = props;
    const b = (selector) => bem(selector, props, styles);
    const deviceWith = getDeviceWidth() / 2;

    let source = WeLogo;
    if (instructor.avatar) {
        source = { uri: instructor.avatar };
    }
    
    function getDeviceWidth() {
      return Dimensions.get('window').width;
    }

    return (
        <View style={b('instructor_avatar')}>
            <Image resizeMode='cover' style={{
                width: deviceWith,
                height: deviceWith,
                borderRadius: deviceWith,
                margin: 'auto'
            }} source={source} />
        </View>
    );
}

export default InstructorAvatar;