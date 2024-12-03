import React, {useContext, useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ImageBackground,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AuthService from '../../services/Auth/Auth';
import UserContext from '../../contexts/UserContext/UserContext';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {CheckBox} from '@rneui/themed';

const arrowLeft = require('../../assets/img/arrow-left.png');
const LogoImage = require('../../assets/img/logo.png');
const Pattern = require('../../assets/icon/pattern.png');

// @ts-ignore
import styles from './Register.scss';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../shared/AppContainer/AppContainer';
import {AuthState} from '../../contexts/UserContext/types';

type FormValues = {
  email: string;
  name: string;
  last_name: string;
  password: string;
  repeatPass: string;
};

type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Register'
>;

const Register = ({navigation}: RegisterScreenProps) => {
  const [checked, setChecked] = useState(false);
  const {saveAuthState} = useContext(UserContext);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Introduce un email válido')
      .required('Campo requerido'),
    name: Yup.string().required('Campo requerido'),
    last_name: Yup.string().required('Campo requerido'),
    password: Yup.string()
      .min(8, 'La contraseña debe contener al menos 8 caracteres')
      .required('Campo requerido'),
    repeatPass: Yup.string()
      .min(8, 'La contraseña debe contener al menos 8 caracteres')
      .required('Campo requerido'),
  });

  const initialValues: FormValues = {
    email: '',
    name: '',
    last_name: '',
    password: '',
    repeatPass: '',
  };

  const register = async (values: FormValues) => {
    try {
      if (checked) {
        if (values.password === values.repeatPass) {
          const userResponse = await AuthService.register(
            values.email,
            values.password,
            values.name,
            values.last_name,
          );
          saveUserResponse(userResponse);
          navigation.navigate('App');
        } else {
          Alert.alert('Las contraseñas no coinciden.');
        }
      } else {
        Alert.alert('Debes aceptar los términos y condiciones primero.');
      }
    } catch (err: any) {
      Alert.alert('Alto', err.message, [{text: 'Entendido'}]);
    }
  };

  /**
   * Save the login response in the storage using User Context provider
   */
  const saveUserResponse = (userResponse: AuthState) => {
    if (checked) {
      userResponse.remember_me = true;
    }
    saveAuthState(userResponse);
  };

  const goToTerms = () => navigation.navigate('Login');
  const goBack = () => navigation.goBack();

  return (
    <LinearGradient
      colors={['#58318b', '#04108e']} // PURPLE / BLUE
      start={{x: 1.0, y: 0.0}}
      end={{x: 0.0, y: 1.0}}
      style={styles.register__linearGradient}>
      <SafeAreaView>
        <ImageBackground
          style={styles.register__pattern}
          source={Pattern}
          resizeMode="repeat">
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}>
            <View style={styles.register__mainContent}>
              <TouchableOpacity onPress={goBack}>
                <Image style={styles.register__backButton} source={arrowLeft} />
              </TouchableOpacity>
              <Image
                style={styles.register__logo}
                source={LogoImage}
                resizeMode="contain"
              />
              <Formik
                initialValues={initialValues}
                onSubmit={register}
                validationSchema={validationSchema}>
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <View>
                    <View style={styles.register__form}>
                      {errors.name && touched.name && (
                        <Text style={styles.register__error}>
                          {errors.name}
                        </Text>
                      )}
                      <TextInput
                        style={styles.register__input}
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        value={values.name}
                        placeholder="Nombre"
                        placeholderTextColor="#fff3"
                      />
                      {errors.last_name && touched.last_name && (
                        <Text style={styles.register__error}>
                          {errors.last_name}
                        </Text>
                      )}
                      <TextInput
                        style={styles.register__input}
                        onChangeText={handleChange('last_name')}
                        onBlur={handleBlur('last_name')}
                        value={values.last_name}
                        placeholder="Apellido"
                        placeholderTextColor="#fff3"
                      />
                      {errors.email && touched.email && (
                        <Text style={styles.register__error}>
                          {errors.email}
                        </Text>
                      )}
                      <TextInput
                        style={styles.register__input}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                        placeholder="Correo"
                        placeholderTextColor="#fff3"
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                      {errors.password && touched.password && (
                        <Text style={styles.register__error}>
                          {errors.password}
                        </Text>
                      )}
                      <TextInput
                        style={styles.register__input}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                        placeholder="Contraseña"
                        placeholderTextColor="#fff3"
                        secureTextEntry={true}
                      />
                      {errors.repeatPass && touched.repeatPass && (
                        <Text style={styles.register__error}>
                          {errors.repeatPass}
                        </Text>
                      )}
                      <TextInput
                        style={styles.register__input}
                        onChangeText={handleChange('repeatPass')}
                        onBlur={handleBlur('repeatPass')}
                        value={values.repeatPass}
                        placeholder="Repetir contraseña"
                        placeholderTextColor="#fff3"
                        secureTextEntry={true}
                      />
                      <CheckBox
                        title="Acepto términos y condiciones"
                        containerStyle={styles.register__checkbox}
                        textStyle={styles.register__checkText}
                        fontFamily="Raleway-Light"
                        checked={checked}
                        onIconPress={() => setChecked(!checked)}
                        onPress={goToTerms}
                      />
                      <Button
                        title="Registrarse"
                        color="black"
                        onPress={handleSubmit}
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
};

export default Register;
