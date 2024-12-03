import React, { Component } from "react";
import { View, Text, Image, Linking } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import withUserContext from "../../contexts/UserContext/WithUserContext";
import authService, { Me } from "../../services/Auth/Auth";
import { SafeAreaView } from "react-navigation";
import { DefaultUserContext } from "../../contexts/UserContext/UserContext";
import { confirmAlert, simpleAlert } from "../../utils/common";
import LinearGradient from 'react-native-linear-gradient';
import CreditDetailModal from "./components/CreditDetailModal";

const styles = require('./Profile.scss');

const UserIcon = require('../../assets/icon/user.png');
const ClassIcon = require('../../assets/icon/plan.png');
const PayIcon = require('../../assets/icon/payment.png');
const RightArrow = require('../../assets/icon/right-arrow.png');

type Props = {
  navigation: any;
  userContext: DefaultUserContext;
}

type State = {
  userData: Me;
  showClassicCreditsModal: boolean;
  showOnlineCreditsModal: boolean;
}

class Profile extends Component<Props, State> {

  state = {
    userData: {
      user: {
        name: '',
        last_name: '',
        email: ''
      },
      profile: {
        phone: '',
        birthdate: '',
        emergency_contact: '',
        emergency_contact_name: '',
        notifications: true,
      },
      credits: {
        to_expire: 0,
        online_to_expire: 0,
        available_online: 0,
        available_online_data: [],
        available: 0,
        available_data: [],
      },
      reserves: {
        next_reserves: 0,
      }
    },
    showClassicCreditsModal: false,
    showOnlineCreditsModal: false,
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', (payload) => {
      this.getUserData();
    });
  }

  getUserData = async () => {
    try {
      const userData = await authService.me();
      this.setState({ userData });
    } catch (err) {
      simpleAlert(
        '¡Ups!',
        'Tu sesión ha expirado',
        () => this.logOut()
      );
    }
  }

  logOut() {
    const { userContext } = this.props;
    if (userContext !== undefined && userContext.user) {
      userContext.resetState();
      this.props.navigation.navigate('Auth');
    }
  }

  handleLink = (url: string) => {
    try {
      Linking.openURL(url)
    } catch (err) {
      console.error(err)
    }
  }

  goEditProfile = () => {
    this.props.navigation.navigate('EditProfile');
  }

  goPurchaseHistory = () => {
    this.props.navigation.navigate('PurchaseHistory');
  }

  goChangePassword = () => {
    this.props.navigation.navigate('ChangePassword');
  }

  goNotifications = () => {
    this.props.navigation.navigate('Notifications');
  }
  /**
   * Send the user to the waiting list view
   */
  goToWaitingList = () => {
    this.props.navigation.navigate('WaitingList');
  }

  /**
   * Send the user to the reservations view
   */
  goToReservations = () => {
    this.props.navigation.navigate('Reservations');
  }

  /**
   * Send to payment methods
   */
  goToPayMethods = () => {
    this.props.navigation.navigate('PaymentMethods');
  }

  /**
   * Send to purchases list
   */
  goToPurchases = () => {
    this.props.navigation.navigate('PurchaseHistory');
  }

  showClassicCreditsModal = (show: boolean = true) => {
    this.setState({ showClassicCreditsModal: show });
  }

  showOnlineCreditsModal = (show: boolean = true) => {
    this.setState({ showOnlineCreditsModal: show });
  }

  showConfirm = () => {
    confirmAlert('Espera', '¿Seguro que deseas cerrar sesión?', [{
      text: 'Confimar',
      style: 'destructive',
      onPress: () => this.logOut()
    }])
  }

  render() {
    const { userData, showClassicCreditsModal, showOnlineCreditsModal } = this.state;

    const displayClassicCreditsModal = () => this.showClassicCreditsModal(true);
    const closeClassicCreditsModal = () => this.showClassicCreditsModal(false);
    const displayOnlineCreditsModal = () => this.showOnlineCreditsModal(true);
    const closeOnlineCreditsModal = () => this.showOnlineCreditsModal(false);

    return (
      <SafeAreaView style={styles.profile__mainContainer}>
        <ScrollView style={styles.profile__content}>
          <View style={styles.profile__quickMenu}>
            <CreditDetailModal
              title='Clases presenciales'
              credits={userData.credits.available_data}
              visible={showClassicCreditsModal}
              onClose={closeClassicCreditsModal}
            />
            <CreditDetailModal
              title='Clases online'
              credits={userData.credits.available_online_data}
              visible={showOnlineCreditsModal}
              onClose={closeOnlineCreditsModal}
            />
            <TouchableOpacity
              style={styles.profile__menuButton}
              onPress={this.goEditProfile}>
              <LinearGradient
                style={styles.profile__iconContainer}
                colors={['#58318b', '#04108e']} // PURPLE / BLUE
                start={{ x: 0.2, y: 1 }}
                end={{ x: 0.8, y: 0 }}>
                <Image
                  source={UserIcon}
                  style={styles.profile__menuIcon}
                />
              </LinearGradient>
              <Text style={[styles.profile__text, styles.profile__buttonText]}>Datos de{'\n'}perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.profile__menuButton}
              onPress={() => { this.props.navigation.navigate('Reservations') }}>
              <LinearGradient
                style={styles.profile__iconContainer}
                colors={['#58318b', '#04108e']} // PURPLE / BLUE
                start={{ x: 0.2, y: 1 }}
                end={{ x: 0.8, y: 0 }}>
                <Image
                  source={ClassIcon}
                  style={styles.profile__menuIcon}
                />
              </LinearGradient>
              <Text style={[styles.profile__text, styles.profile__buttonText]}>Mis clases{'\n'}reservadas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.profile__menuButton}
              onPress={() => this.goToPayMethods()}>
              <LinearGradient
                style={styles.profile__iconContainer}
                colors={['#58318b', '#04108e']} // PURPLE / BLUE
                start={{ x: 0.2, y: 1 }}
                end={{ x: 0.8, y: 0 }}>
                <Image
                  source={PayIcon}
                  style={styles.profile__menuIcon}
                />
              </LinearGradient>
              <Text style={[styles.profile__text, styles.profile__buttonText]}>Métodos{'\n'}de pago</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profile__sectionCard}>
            <Text style={styles.profile__sectionHeader}>Mis clases</Text>
            <View style={[styles.profile__sectionContainer]}>
              <TouchableOpacity style={styles.profile__counter} onPress={this.goToReservations}>
                <Text style={styles.profile__text}>Mis reservaciones</Text>
                <Image style={styles.profile__icon} source={RightArrow} resizeMode='contain' />
              </TouchableOpacity>
            </View>
            <View style={[styles.profile__sectionContainer]}>
              <TouchableOpacity style={styles.profile__counter} onPress={this.goToWaitingList}>
                <Text style={styles.profile__text}>Mi lista de espera</Text>
                <Image style={styles.profile__icon} source={RightArrow} resizeMode='contain' />
              </TouchableOpacity>
            </View>
            <View style={[styles.profile__sectionContainer]}>
              <TouchableOpacity style={styles.profile__counter} onPress={this.goToPurchases}>
                <Text style={styles.profile__text}>Mis compras</Text>
                <Image style={styles.profile__icon} source={RightArrow} resizeMode='contain' />
              </TouchableOpacity>
            </View>
            <View style={[styles.profile__sectionContainer]}>
              <TouchableOpacity style={styles.profile__counter} onPress={displayClassicCreditsModal}>
                <Text style={styles.profile__text}>Clases presenciales disponibles</Text>
                <View style={[styles.profile__subContainer, styles.profile__counter]}>
                  <Text style={styles.profile__text}>{userData.credits.available}</Text>
                  <Image style={styles.profile__icon_no_padding} source={RightArrow} resizeMode='contain' />
                </View>
              </TouchableOpacity>
            </View>
            <View style={[styles.profile__sectionContainer]}>
              <TouchableOpacity style={styles.profile__counter} onPress={displayOnlineCreditsModal}>
                <Text style={styles.profile__text}>Clases online disponibles</Text>
                <View style={[styles.profile__subContainer, styles.profile__counter]}>
                  <Text style={styles.profile__text}>{userData.credits.available_online}</Text>
                  <Image style={styles.profile__icon_no_padding} source={RightArrow} resizeMode='contain' />
                </View>
              </TouchableOpacity>
            </View>
            <View style={[styles.profile__sectionContainer, styles.profile__counter, { borderWidth: 0 }]}>
              <Text style={styles.profile__text}>Clases próximas</Text>
              <Text style={styles.profile__text}>{userData.reserves.next_reserves}</Text>
            </View>
          </View>

          <View style={styles.profile__sectionCard}>
            <Text style={styles.profile__sectionHeader}>Mi cuenta</Text>
            <View style={[styles.profile__sectionContainer]}>
              <TouchableOpacity
                style={styles.profile__counter}
                onPress={() => { this.goEditProfile() }}>
                <Text style={styles.profile__text}>Editar datos</Text>
                <Image style={styles.profile__icon} source={RightArrow} resizeMode='contain' />
              </TouchableOpacity>
            </View>
            <View style={[styles.profile__sectionContainer]}>
              <TouchableOpacity
                style={styles.profile__counter}
                onPress={() => { this.goToPayMethods() }}>
                <Text style={styles.profile__text}>Métodos de pago</Text>
                <Image style={styles.profile__icon} source={RightArrow} resizeMode='contain' />
              </TouchableOpacity>
            </View>
            <View style={[styles.profile__sectionContainer]}>
              <TouchableOpacity
                style={styles.profile__counter}
                onPress={() => { this.goNotifications() }}>
                <Text style={styles.profile__text}>Mis notificaciones</Text>
                <Image style={styles.profile__icon} source={RightArrow} resizeMode='contain' />
              </TouchableOpacity>
            </View>
            <View style={[styles.profile__sectionContainer, { borderWidth: 0 }]}>
              <TouchableOpacity
                style={styles.profile__counter}
                onPress={() => { this.goChangePassword() }}>
                <Text style={styles.profile__text}>Cambiar contraseña</Text>
                <Image style={styles.profile__icon} source={RightArrow} resizeMode='contain' />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.profile__sectionCard}>
            <Text style={styles.profile__sectionHeader}>Ayuda</Text>
            <View style={[styles.profile__sectionContainer]}>
              <TouchableOpacity
                style={styles.profile__counter}
                onPress={() => { this.props.navigation.navigate('About') }}>
                <Text style={styles.profile__text}>¿Qué es We?</Text>
                <Image style={styles.profile__icon} source={RightArrow} resizeMode='contain' />
              </TouchableOpacity>
            </View>
            <View style={[styles.profile__sectionContainer, { borderWidth: 0 }]}>
              <TouchableOpacity
                style={styles.profile__counter}
                onPress={() => { this.props.navigation.navigate('Terms') }}>
                <Text style={styles.profile__text}>Términos y condiciones</Text>
                <Image style={styles.profile__icon} source={RightArrow} resizeMode='contain' />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => this.showConfirm()}>
            <View style={styles.profile__button}>
              <Text style={styles.profile__logOut}>Cerrar sesión</Text>
            </View>

          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView >
    )
  }
}

export default withUserContext(Profile);