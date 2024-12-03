import React, { Component, Fragment } from 'react';
import { View, Text, TextInput, Button, Image, Alert, TouchableOpacity, Platform, ImageBackground, Keyboard, TouchableWithoutFeedback } from 'react-native';
import AuthService from '../../services/Auth/Auth';
import withUserContext from '../../contexts/UserContext/WithUserContext';
import { DefaultUserContext } from '../../contexts/UserContext/UserContext';
import LinearGradient from 'react-native-linear-gradient';
import * as Yup from 'yup';
import { Formik } from "formik";
import Toast from 'react-native-tiny-toast';
import SpecialMessageModal from '../../shared/SpecialMessageModal';

const Logo = require('../../assets/img/logo.png');
const Pattern = require('../../assets/icon/pattern.png');

const styles = require('./Login.scss');

type Props = {
  navigation: any,
  userContext: DefaultUserContext,
}

type State = {
  showSpecialMessage: boolean;
  editable: boolean;
}

type FormValues = {
  email: string,
  password: string,
}

class Login extends Component<Props, State> {

  state = {
    showSpecialMessage: false,
    editable: false,
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ editable: true });
    }, 100);
  }

  login = async (values: FormValues) => {
    const logToast = Toast.showLoading('Iniciando sesión');
    try {
      const userResponse = await AuthService.login(values.email, values.password);

      this.saveUserResponse(userResponse);
      Toast.hide(logToast);
      
      if (userResponse.charge) {
        this.setState({ showSpecialMessage: true });
      } else {
        this.props.navigation.navigate('App');
      }
    } catch (err) {
      Toast.hide(logToast);
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

  goToRegister = () => {
    this.props.navigation.navigate('Register');
  }

  goToRecover = () => {
    this.props.navigation.navigate('Recover');
  }

  handleModalClose = () => {
    this.setState({ showSpecialMessage: false }, () => this.props.navigation.navigate('App'));
  }

  render() {
    const { showSpecialMessage, editable } = this.state;
    const validationSchema = Yup.object().shape({
      email: Yup.string().required('Campo requerido'),
      password: Yup.string().required('Campo requerido')
    })
    const initialValues: FormValues = {
      email: '',
      password: ''
    }

    return (
      <LinearGradient
        colors={['#58318b', '#04108e']} // PURPLE / BLUE
        start={{ x: 1.0, y: 0.0 }} end={{ x: 0.0, y: 1.0 }}
        style={styles.login__linearGradient}>
        <SpecialMessageModal
          title={'¡We Are Family!'}
          subtitle={'Clase de cortesía'}
          thirdTitle={'Por descargar la aplicación te hemos regalado una clase de cortesía, ¡Es hora de reservar!'}
          visible={showSpecialMessage}
          onClose={this.handleModalClose}
          steps={[]}
        />
        <ImageBackground
          style={styles.login__pattern}
          source={Pattern}
          resizeMode='repeat'>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}>
            <View style={styles.login__mainContent}>
              <Image style={styles.login__logo} source={Logo} />
              <Formik
                initialValues={initialValues}
                onSubmit={this.login}
                validationSchema={validationSchema}>
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                  <View style={styles.login__form}>
                    {errors.email && touched.email && <Text style={styles.login__error}>{errors.email}</Text>}
                    <TextInput
                      style={styles.login__input}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      placeholder='Correo'
                      placeholderTextColor="#fff3"
                      keyboardType='email-address'
                      autoCapitalize='none'
                      returnKeyType='next'
                      editable={editable}
                    />
                    {errors.password && touched.password && <Text style={styles.login__error}>{errors.password}</Text>}
                    <TextInput
                      style={styles.login__input}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      placeholder='Contraseña'
                      placeholderTextColor="#fff3"
                      secureTextEntry={true}
                      returnKeyType='done'
                      onSubmitEditing={() => handleSubmit()}
                      editable={editable}
                    />
                    <Button
                      title='Iniciar Sesión'
                      color={Platform.OS === 'ios' ? 'white' : 'black'}
                      onPress={() => handleSubmit()}
                    />
                  </View>
                )}
              </Formik>
              <View>
                <TouchableOpacity onPress={this.goToRegister}>
                  <Text style={styles.login__help}>Registrarse</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.goToRecover}>
                  <Text style={styles.login__help}>Olvidé mi contraseña</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ImageBackground>
      </LinearGradient>
    );
  }
}

export default withUserContext(Login);