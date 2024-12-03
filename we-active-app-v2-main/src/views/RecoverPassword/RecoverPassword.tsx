import React from 'react';
import {
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  Button,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Yup from 'yup';
import {Formik} from 'formik';
import authService from '../../services/Auth/Auth';
import Toast from 'react-native-tiny-toast';

const arrowLeft = require('../../assets/img/arrow-left.png');
const LogoImage = require('../../assets/img/logo.png');
const Pattern = require('../../assets/icon/pattern.png');

// @ts-ignore
import styles from './RecoverPassword.scss';
import {RootStackParamList} from '../../shared/AppContainer/AppContainer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type FormValues = {
  email: string;
};

type RecoverPasswordScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RecoverPassword'
>;

const RecoverPassword = ({navigation}: RecoverPasswordScreenProps) => {
  const recover = async (values: FormValues) => {
    try {
      const recoverResult = await authService.resetPassword(values.email);
      if (recoverResult) {
        Toast.showSuccess('Enviado enlace de recuperación');
      }
    } catch (err: any) {
      Toast.show('Algo salió mal, intenta de nuevo');
    }
  };

  const goBack = () => navigation.goBack();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Introduce un email válido')
      .required('Campo requerido'),
  });

  const initialValues: FormValues = {
    email: '',
  };

  return (
    <LinearGradient
      colors={['#58318b', '#04108e']} // PURPLE / BLUE
      start={{x: 1.0, y: 0.0}}
      end={{x: 0.0, y: 1.0}}
      style={styles.recoverPassword__linearGradient}>
      <ImageBackground
        style={styles.recoverPassword__pattern}
        source={Pattern}
        resizeMode="repeat">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.recoverPassword__mainContent}>
            <TouchableOpacity onPress={goBack}>
              <Image
                style={styles.recoverPassword__backButton}
                source={arrowLeft}
              />
            </TouchableOpacity>
            <Image
              style={styles.recoverPassword__logo}
              source={LogoImage}
              resizeMode="contain"
            />
            <Formik<FormValues>
              initialValues={initialValues}
              onSubmit={recover}
              validationSchema={validationSchema}>
              {({handleChange, handleBlur, handleSubmit, values, errors}) => (
                <View>
                  {errors.email && (
                    <Text style={styles.recoverPassword__error}>
                      {errors.email}
                    </Text>
                  )}
                  <TextInput
                    style={styles.recoverPassword__input}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    placeholder="Correo"
                    placeholderTextColor="#fff3"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                  <Button
                    title="Recuperar contraseña"
                    color="black"
                    onPress={handleSubmit}
                  />
                </View>
              )}
            </Formik>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </LinearGradient>
  );
};

export default RecoverPassword;
