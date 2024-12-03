import React, { Component } from "react";
import { ImageBackground, TouchableWithoutFeedback, Keyboard, View, TouchableOpacity, Image, Text, TextInput, Button } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import * as Yup from 'yup';
import { Formik } from "formik";
import authService from "../../services/Auth/Auth";
import Toast from 'react-native-tiny-toast';

const arrowLeft = require('../../assets/img/arrow-left.png');
const LogoImage = require('../../assets/img/logo.png');
const Pattern = require('../../assets/icon/pattern.png');

const styles = require('./RecoverPassword.scss');

type Props = {
  navigation: any,
}

type FormValues = {
  email: string;
}

class RecoverPassword extends Component<Props> {

  recover = async (values) => {
    try {
      const recover = await authService.resetPassword(values.email)
      if (recover) Toast.showSuccess('Enviado enlace de recuperación')
    } catch (err) {
      Toast.show('Algo salió mal, intenta de nuevo')
    }
  }

  render() {
    const validationSchema = Yup.object().shape({
      email: Yup.string().email('Introduce un email válido').required('Campo requerido'),

    })
    const initialValues: FormValues = {
      email: '',
    }
    return (
      <LinearGradient
        colors={['#58318b', '#04108e']} // PURPLE / BLUE
        start={{ x: 1.0, y: 0.0 }} end={{ x: 0.0, y: 1.0 }}
        style={styles.recoverPassword__linearGradient}>
        <ImageBackground
          style={styles.recoverPassword__pattern}
          source={Pattern}
          resizeMode='repeat'>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}>
            <View style={styles.recoverPassword__mainContent}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                <Image style={styles.recoverPassword__backButton} source={arrowLeft} />
              </TouchableOpacity>
              <Image style={styles.recoverPassword__logo}
                source={LogoImage}
                resizeMode='contain'
              />
              <Formik
                initialValues={initialValues}
                onSubmit={this.recover}
                validationSchema={validationSchema}>
                {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                  <View>
                    {errors.email && <Text style={styles.recoverPassword__error}>{errors.email}</Text>}
                    <TextInput
                      style={styles.recoverPassword__input}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      placeholder='Correo'
                      placeholderTextColor="#fff3"
                      keyboardType='email-address'
                      autoCapitalize='none'
                      returnKeyType='done'
                      onSubmitEditing={() => handleSubmit()}
                    />
                    <Button
                      title='Recuperar contraseña'
                      color='black'
                      onPress={() => handleSubmit()}
                    />
                  </View>
                )}
              </Formik>
            </View>
          </TouchableWithoutFeedback>
        </ImageBackground>
      </LinearGradient>
    )
  }

}

export default RecoverPassword