import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import authService from '../../services/Auth';
import Toast from 'react-native-tiny-toast';

const styles = require('./ChangePassword.scss');

type Props = {
  navigation: any,
}

type State = {
  oldPass: string;
  newPass: string;
  repeatPass: string;
}


class ChangePassword extends Component<Props, State> {

  state = {
    oldPass: '',
    newPass: '',
    repeatPass: ''
  }

  updatePassword = async () => {
    try {
      const { oldPass, newPass, repeatPass } = this.state;
      if (newPass === repeatPass) {

        if (!this.validatePasswordLenght(newPass, repeatPass)) {
          Toast.show('La contraseña debe tener 8 caracteres mínimo');
          return
        }

        if (this.containsBlankSpace(newPass) || this.containsBlankSpace(repeatPass)) {
          Toast.show('Tu nueva contraseña no puede contener espacios en blanco');
          return
        }

        const loadingToast = Toast.showLoading('Espere...');

        try {
          const update = await authService.changePassword(oldPass, newPass);
          if (update) {
            Toast.hide(loadingToast);
            Toast.showSuccess('Contraseña actualizada');
            this.props.navigation.goBack(null);
          }
        } catch (error) {
          Toast.hide(loadingToast);
          Toast.show(error.message);
        }
      } else {
        Toast.show('Las contraseñas no coinciden')
      }
    } catch (err) {
      Toast.show(err)
    }
  }

  /**
   * Validate the password lenght, min 8 chars
   */
  validatePasswordLenght = (newPass: string, repeatPass: string) => {
    return newPass.length >= 8 && repeatPass.length >= 8;
  }

  /**
   * Return if a text string contains blank space
   */
  containsBlankSpace = (text: string) => {
    return text.includes(' ');
  }

  render() {
    return (
      <View style={styles.changePassword__content}>
        <View style={styles.changePassword__form}>

          <Text style={styles.changePassword__inputHeader}>Contraseña anterior</Text>
          <TextInput
            style={styles.changePassword__input}
            placeholderTextColor="#fff3"
            secureTextEntry={true}
            placeholder={'Contraseña anterior'}
            onChangeText={(oldPass) => this.setState({ oldPass })} />

          <Text style={styles.changePassword__inputHeader}>Contraseña nueva</Text>
          <TextInput
            style={styles.changePassword__input}
            placeholderTextColor="#fff3"
            secureTextEntry={true}
            placeholder={'Contraseña nueva'}
            onChangeText={(newPass) => this.setState({ newPass })} />

          <Text style={styles.changePassword__inputHeader}>Repetir contraseña nueva</Text>
          <TextInput
            style={styles.changePassword__input}
            placeholderTextColor="#fff3"
            secureTextEntry={true}
            placeholder={'Repetir contraseña'}
            onChangeText={(repeatPass) => this.setState({ repeatPass })} />
        </View>
        <TouchableOpacity
          onPress={() => this.updatePassword()}>
          <View style={styles.changePassword__button}>
            <Text style={styles.changePassword__updateProfile}>Actualizar contraseña</Text>
          </View>

        </TouchableOpacity>
      </View>
    )
  }
}

export default ChangePassword