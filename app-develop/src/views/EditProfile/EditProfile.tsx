import React, { Component } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, Switch } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import authService, { Me } from "../../services/Auth/Auth";
import { DefaultUserContext } from "../../contexts/UserContext/UserContext";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment-timezone';
import Toast from 'react-native-tiny-toast';
import Loader from "../../shared/Loader";
import * as Yup from 'yup';
import { Formik } from "formik";
import { SafeAreaView } from "react-navigation";
import hoistNonReactStatics from 'hoist-non-react-statics';
import withUserContext from "../../contexts/UserContext/WithUserContext";

const styles = require('./EditProfile.scss');

type Props = {
  navigation: any,
  userContext: DefaultUserContext,
}

type State = {
  userData: Me,
  birthdate: string,
  showDatePicker: boolean,
  notifications: boolean,
}

type FormValues = {
  name: string,
  last_name: string,
  email: string,
  phone: string,
  emergency_contact: string,
  emergency_contact_name: string,
  notifications: boolean,
}

class EditProfile extends Component<Props, State> {

  state = {
    userData: undefined,
    birthdate: undefined,
    showDatePicker: false,
    notifications: true,
  }

  componentDidMount() {
    this.loadCurrentData();
  }

  async loadCurrentData() {
    try {
      const userData = await authService.me();
      this.setState({
        userData,
        birthdate: userData.profile.birthdate,
        notifications: userData.profile.notifications,
      });
    }
    catch (err) {
      Toast.show('Hubo un problema cargando tus datos');
    }
  }

  updateProfile = async (values: FormValues) => {
    try {
      const { birthdate, notifications } = this.state;
      const userData: Me = {
        user: {
          name: values.name,
          last_name: values.last_name,
          email: values.email
        },
        profile: {
          birthdate: birthdate,
          phone: values.phone,
          emergency_contact: values.emergency_contact,
          emergency_contact_name: values.emergency_contact_name,
          notifications: notifications,
        }
      }
      const update = await authService.updateProfile(userData);

      this.props.userContext.setState({ user: update.user, profile: userData.profile });
      if (update) {
        Toast.showSuccess('Perfil actualizado');
        this.props.navigation.goBack(null);
      }
    }
    catch (err) {
      console.log(err);
      Toast.show('Hubo un problema, intenta más tarde');
    }
  }

  dateUpdate = (event, date) => {
    if (date !== undefined) {
      this.setState({
        birthdate: moment(date).toISOString(),
        showDatePicker: Platform.OS === 'ios'
      })
    } else {
      this.setState({ showDatePicker: Platform.OS === 'ios' })
    }
  }

  showDatePicker = () => {
    const { showDatePicker } = this.state;
    this.setState({ showDatePicker: !showDatePicker });
  }

  render() {
    const { userData, birthdate, notifications } = this.state;
    const { showDatePicker } = this.state;
    const validationSchema = Yup.object().shape({
      name: Yup.string().required('Campo requerido'),
      last_name: Yup.string().required('Campo requerido'),
      email: Yup.string().required('Campo requerido'),
      phone: Yup.string().required('Campo requerido'),
      emergency_contact: Yup.string().required('Campo requerido'),
      emergency_contact_name: Yup.string().required('Campo requerido'),
    })
    const date = moment();
    const minDate = date.clone().subtract(99, 'year').toDate();
    const maxDate = date.clone().subtract(18, 'year').toDate();
    let initialValues: FormValues;
    if (userData !== undefined) {
      initialValues = {
        name: userData.user.name,
        last_name: userData.user.last_name ? userData.user.last_name : '',
        email: userData.user.email,
        phone: userData.profile.phone ? userData.profile.phone : '',
        emergency_contact: userData.profile.emergency_contact ? userData.profile.emergency_contact : '',
        emergency_contact_name: userData.profile.emergency_contact_name ? userData.profile.emergency_contact_name : '',
        notifications: userData.profile.notifications,
      }
      if (birthdate === undefined) this.setState({ birthdate: minDate })
    }

    return (
      userData === undefined ? <SafeAreaView style={styles.editProfile__empty}>
        <Loader />
      </SafeAreaView> :
        <ScrollView style={styles.editProfile__content}>
          <Formik
            initialValues={initialValues}
            onSubmit={this.updateProfile}
            validationSchema={validationSchema}>
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (

              <View style={styles.editProfile__form}>
                <View>
                  <Text style={styles.editProfile__inputHeader}>Nombre</Text>
                  {errors.name && touched.name && <Text style={styles.editProfile__error}>{errors.name}</Text>}
                  <TextInput
                    style={styles.editProfile__input}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                    placeholder={initialValues.name}
                    placeholderTextColor="#fff3"
                  />
                </View>

                <View>
                  <Text style={styles.editProfile__inputHeader}>Apellido</Text>
                  {errors.last_name && touched.last_name && <Text style={styles.editProfile__error}>{errors.last_name}</Text>}
                  <TextInput
                    style={styles.editProfile__input}
                    onChangeText={handleChange('last_name')}
                    onBlur={handleBlur('last_name')}
                    value={values.last_name}
                    placeholder={initialValues.last_name}
                    placeholderTextColor="#fff3"
                  />
                </View>

                <View>
                  <Text style={styles.editProfile__inputHeader}>Fecha de nacimiento</Text>
                  {birthdate === undefined && <Text style={styles.editProfile__error}>Campo requerido</Text>}
                  <TouchableOpacity onPress={this.showDatePicker}>
                    <View>
                      <Text style={styles.editProfile__input}>
                        {birthdate ? moment(birthdate).format('DD-MMM-YYYY') : 'No se ha seleccionado'}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {showDatePicker &&
                    <DateTimePicker
                      style={styles.editProfile__datePicker}
                      maximumDate={maxDate}
                      minimumDate={minDate}
                      value={birthdate ? moment(birthdate).toDate() : moment().subtract(18, 'year').toDate()}
                      onChange={this.dateUpdate}
                    />}

                </View>

                <View>
                  <Text style={styles.editProfile__inputHeader}>Correo</Text>
                  {errors.email && touched.email && <Text style={styles.editProfile__error}>{errors.email}</Text>}
                  <TextInput
                    style={styles.editProfile__input}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    placeholder={initialValues.email}
                    placeholderTextColor="#fff3"
                  />
                </View>

                <View>
                  <Text style={styles.editProfile__inputHeader}>Teléfono</Text>
                  {errors.phone && touched.phone && <Text style={styles.editProfile__error}>{errors.phone}</Text>}
                  <TextInput
                    style={styles.editProfile__input}
                    onChangeText={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                    value={values.phone}
                    placeholder={initialValues.phone}
                    placeholderTextColor="#fff3"
                  />
                </View>

                <View>
                  <Text style={styles.editProfile__inputHeader}>Contacto de Emergencia</Text>
                  {errors.emergency_contact_name && touched.emergency_contact_name && <Text style={styles.editProfile__error}>{errors.emergency_contact_name}</Text>}
                  <TextInput
                    style={styles.editProfile__input}
                    onChangeText={handleChange('emergency_contact_name')}
                    onBlur={handleBlur('emergency_contact_name')}
                    value={values.emergency_contact_name}
                    placeholder={initialValues.emergency_contact_name}
                    placeholderTextColor="#fff3"
                  />
                </View>

                <View>
                  <Text style={styles.editProfile__inputHeader}>Número de Emergencia</Text>
                  {errors.emergency_contact && touched.emergency_contact && <Text style={styles.editProfile__error}>{errors.emergency_contact}</Text>}
                  <TextInput
                    style={styles.editProfile__input}
                    onChangeText={handleChange('emergency_contact')}
                    onBlur={handleBlur('emergency_contact')}
                    value={values.emergency_contact}
                    placeholder={initialValues.emergency_contact}
                    placeholderTextColor="#fff3"
                  />
                </View>

                <View>
                  <Text style={styles.editProfile__inputHeader}>Notificationes</Text>
                  <Switch
                    onValueChange={(value) => this.setState({ notifications: value })}
                    value={notifications}
                    style={styles.editProfile__notifications_switch}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => handleSubmit()}>
                  <View style={styles.editProfile__button}>
                    <Text style={styles.editProfile__updateProfile}>Actualizar datos</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </ScrollView>
    )
  }
}

export default withUserContext(hoistNonReactStatics(EditProfile, EditProfile));