import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  Alert,
  TouchableOpacity,
  Platform,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import AuthService from '../../services/Auth/Auth';
import {UserContext} from '../../contexts/UserContext';
import LinearGradient from 'react-native-linear-gradient';
import * as Yup from 'yup';
import {Formik} from 'formik';
import Toast from 'react-native-tiny-toast';
import {AuthState} from '../../contexts/UserContext/types';

const Logo = require('../../assets/img/logo.png');
const Pattern = require('../../assets/icon/pattern.png');

// @ts-ignore
import styles from './Login.scss';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../shared/AppContainer/AppContainer';

type FormValues = {
  email: string;
  password: string;
};

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login = ({navigation, route}: LoginScreenProps) => {
  console.log('Login props', navigation);
  console.log('Login props', route);

  const [editable, setEditable] = useState(false);
  const {saveAuthState} = useContext(UserContext);

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Campo requerido'),
    password: Yup.string().required('Campo requerido'),
  });

  const initialValues: FormValues = {
    email: '',
    password: '',
  };

  const login = async (values: FormValues) => {
    const logToast = Toast.showLoading('Iniciando sesión');
    try {
      const userResponse = await AuthService.login(
        values.email,
        values.password,
      );

      saveUserResponse(userResponse);
      Toast.hide(logToast);

      navigation.navigate('App');
    } catch (err: any) {
      Toast.hide(logToast);
      Alert.alert('Alto', err.message, [{text: 'Entendido'}]);
    }
  };

  /**
   * Save the login response in the storage using User Context provider
   */
  const saveUserResponse = (userResponse: AuthState) => {
    userResponse.remember_me = true;

    saveAuthState(userResponse);
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  const goToRecover = () => {
    navigation.navigate('RecoverPassword');
  };

  useEffect(() => {
    navigation.navigate('App');
  }, [navigation]);

  useEffect(() => {
    setTimeout(() => {
      setEditable(true);
    }, 100);
  }, []);

  return (
    <LinearGradient
      colors={['#58318b', '#04108e']} // PURPLE / BLUE
      start={{x: 1.0, y: 0.0}}
      end={{x: 0.0, y: 1.0}}
      style={styles.login__linearGradient}>
      <ImageBackground
        style={styles.login__pattern}
        source={Pattern}
        resizeMode="repeat">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.login__mainContent}>
            <Image style={styles.login__logo} source={Logo} />
            <Formik
              initialValues={initialValues}
              onSubmit={login}
              validationSchema={validationSchema}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={styles.login__form}>
                  {errors.email && touched.email && (
                    <Text style={styles.login__error}>{errors.email}</Text>
                  )}
                  <TextInput
                    style={styles.login__input}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    placeholder="Correo"
                    placeholderTextColor="#fff3"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                    editable={editable}
                  />
                  {errors.password && touched.password && (
                    <Text style={styles.login__error}>{errors.password}</Text>
                  )}
                  <TextInput
                    style={styles.login__input}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    placeholder="Contraseña"
                    placeholderTextColor="#fff3"
                    secureTextEntry={true}
                    returnKeyType="done"
                    onSubmitEditing={() => handleSubmit()}
                    editable={editable}
                  />
                  <Button
                    title="Iniciar Sesión"
                    color={Platform.OS === 'ios' ? 'white' : 'black'}
                    onPress={() => handleSubmit()}
                  />
                </View>
              )}
            </Formik>
            <View>
              <TouchableOpacity onPress={goToRegister}>
                <Text style={styles.login__help}>Registrarse</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={goToRecover}>
                <Text style={styles.login__help}>Olvidé mi contraseña</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </LinearGradient>
  );
};

export default Login;
