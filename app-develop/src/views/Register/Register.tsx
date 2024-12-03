import React, { Component } from 'react';
import { View, TextInput, Button, Image, TouchableOpacity, Alert, SafeAreaView, ImageBackground, Text, Linking, TouchableWithoutFeedback, Keyboard } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AuthService from '../../services/Auth/Auth';
import withUserContext from '../../contexts/UserContext/WithUserContext';
import { DefaultUserContext } from '../../contexts/UserContext/UserContext';
import hoistNonReactStatics from 'hoist-non-react-statics';
import * as Yup from 'yup';
import { Formik } from "formik";
import { CheckBox } from 'react-native-elements'

const arrowLeft = require('../../assets/img/arrow-left.png');
const LogoImage = require('../../assets/img/logo.png');
const Pattern = require('../../assets/icon/pattern.png');

const styles = require('./Register.scss');

type Props = {
  navigation: any,
  userContext: DefaultUserContext,
}

type State = {
  checked: boolean
}

type FormValues = {
  email: string;
  name: string;
  last_name: string;
  password: string;
  repeatPass: string;
}
class Register extends Component<Props, State> {

  state = {
    checked: false
  }

  register = async (values: FormValues) => {
    try {
      const { checked } = this.state;
      if (checked) {
        if (values.password === values.repeatPass) {
          const userResponse = await AuthService.register(values.email, values.password, values.name, values.last_name);
          this.saveUserResponse(userResponse);
          this.props.navigation.navigate('App');
        } else {
          Alert.alert('Las contraseñas no coinciden.');
        }
      } else {
        Alert.alert('Debes aceptar los términos y condiciones primero.');
      }
    }
    catch (err) {
      Alert.alert('Alto', err.message, [{ text: 'Entendido' }]);
    }
  }

  /**
   * Save the login response in the storage using User Context provider
   */
  saveUserResponse = (userResponse: DefaultUserContext) => {

    userResponse.remember_me = true;
    this.props.userContext.setState(userResponse);
  }

  render() {
    const { checked } = this.state;
    const validationSchema = Yup.object().shape({
      email: Yup.string().email('Introduce un email válido').required('Campo requerido'),
      name: Yup.string().required('Campo requerido'),
      last_name: Yup.string().required('Campo requerido'),
      password: Yup.string().min(8, 'La contraseña debe contener al menos 8 caracteres').required('Campo requerido'),
      repeatPass: Yup.string().min(8, 'La contraseña debe contener al menos 8 caracteres').required('Campo requerido')
    })
    const initialValues: FormValues = {
      email: '',
      name: '',
      last_name: '',
      password: '',
      repeatPass: ''
    }

    return (
      <LinearGradient
        colors={['#58318b', '#04108e']} // PURPLE / BLUE
        start={{ x: 1.0, y: 0.0 }} end={{ x: 0.0, y: 1.0 }}
        style={styles.register__linearGradient}>

        <SafeAreaView>
          <ImageBackground
            style={styles.register__pattern}
            source={Pattern}
            resizeMode='repeat'>
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}>
              <View style={styles.register__mainContent}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                  <Image style={styles.register__backButton} source={arrowLeft} />
                </TouchableOpacity>
                <Image style={styles.register__logo}
                  source={LogoImage}
                  resizeMode='contain'
                />
                <Formik
                  initialValues={initialValues}
                  onSubmit={this.register}
                  validationSchema={validationSchema}>
                  {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View>
                      <View style={styles.register__form}>
                        {errors.name && touched.name && <Text style={styles.register__error}>{errors.name}</Text>}
                        <TextInput
                          style={styles.register__input}
                          onChangeText={handleChange('name')}
                          onBlur={handleBlur('name')}
                          value={values.name}
                          placeholder='Nombre'
                          placeholderTextColor="#fff3"
                        />
                        {errors.last_name && touched.last_name && <Text style={styles.register__error}>{errors.last_name}</Text>}
                        <TextInput
                          style={styles.register__input}
                          onChangeText={handleChange('last_name')}
                          onBlur={handleBlur('last_name')}
                          value={values.last_name}
                          placeholder='Apellido'
                          placeholderTextColor="#fff3"
                        />
                        {errors.email && touched.email && <Text style={styles.register__error}>{errors.email}</Text>}
                        <TextInput
                          style={styles.register__input}
                          onChangeText={handleChange('email')}
                          onBlur={handleBlur('email')}
                          value={values.email}
                          placeholder='Correo'
                          placeholderTextColor="#fff3"
                          keyboardType='email-address'
                          autoCapitalize='none'
                        />
                        {errors.password && touched.password && <Text style={styles.register__error}>{errors.password}</Text>}
                        <TextInput
                          style={styles.register__input}
                          onChangeText={handleChange('password')}
                          onBlur={handleBlur('password')}
                          value={values.password}
                          placeholder='Contraseña'
                          placeholderTextColor="#fff3"
                          secureTextEntry={true}
                        />
                        {errors.repeatPass && touched.repeatPass && <Text style={styles.register__error}>{errors.repeatPass}</Text>}
                        <TextInput
                          style={styles.register__input}
                          onChangeText={handleChange('repeatPass')}
                          onBlur={handleBlur('repeatPass')}
                          value={values.repeatPass}
                          placeholder='Repetir contraseña'
                          placeholderTextColor="#fff3"
                          secureTextEntry={true}
                        />
                        <CheckBox
                          title='Acepto términos y condiciones'
                          containerStyle={styles.register__checkbox}
                          textStyle={styles.register__checkText}
                          fontFamily='Raleway-Light'
                          checked={checked}
                          onIconPress={() => this.setState({ checked: !checked })}
                          onPress={() => { this.props.navigation.navigate('Terms') }}
                        />
                        <Button
                          title='Registrarse'
                          color='black'
                          onPress={() => handleSubmit()}
                        />
                      </View>
                    </View>
                  )}
                </Formik>
              </View>
            </TouchableWithoutFeedback>
          </ImageBackground>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

export default hoistNonReactStatics(withUserContext(Register), Register);