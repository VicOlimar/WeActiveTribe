import React, { Component, Fragment } from "react"
import { Image, ImageResizeMode } from "react-native"

import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer, createSwitchNavigator, SafeAreaView } from "react-navigation";

import SplashScreen from '../../views/Splash';
import CalendarScreen from "../../views/Calendar";
import LessonScreen from "../../views/Lesson";
import RegisterScreen from '../../views/Register';
import LoginScreen from '../../views/Login';
import InstructorScreen from '../../views/InstructorCard';
import PlansScreen from '../../views/Plans';
import ProfileScreen from '../../views/Profile';
import ReservationsScreen from '../../views/Reservations';
import EditProfileScreen from '../../views/EditProfile';
import PaymentMethodsScreen from '../../views/PaymentMethods';
import ChangePasswordScreen from '../../views/ChangePassword';
import Notifications from '../../views/Notifications';
import WaitingListScreen from '../../views/WaitingList';
import PurchaseHistoryScreen from '../../views/PurchaseHistory';
import RecoverPasswordScreen from '../../views/RecoverPassword';
import TermsScreen from '../../views/Terms';
import AboutScreen from '../../views/About';

const styles = require('./AppContainer.scss');
const WeIcon = require('../../assets/icon/plan.png');
const CalendarIcon = require('../../assets/icon/calendar.png');
const UserIcon = require('../../assets/icon/user.png');

import Navbar from "../Navbar";
import SimpleNav from '../SimpleNav';
import LogoNav from '../LogoNav';
import ProfileNav from '../ProfileNav';
import ErrorBoundary from "../ErrorBoundary";

const navBar = ({ navigation }) => ({
  header: () => {
    return (
      <Navbar navigation={navigation} />
    )
  },
});

const logoNav = ({ navigation }) => ({
  header: () => {
    return (
      <LogoNav navigation={navigation} showLogo={true} />
    )
  },
});

const withoutLogoNav = ({ navigation }) => ({
  header: () => {
    return (
      <LogoNav navigation={navigation} showLogo={false} />
    )
  },
});

const simpleNav = ({ navigation }) => ({
  header: ({ scene }) => {
    return (
      <SimpleNav navigation={navigation} scene={scene} />
    )
  },
});

const profileNav = ({ navigation }) => ({
  header: () => {
    return (
      <ProfileNav navigation={navigation} />
    )
  },
});

const ProfileStack = createStackNavigator({
  Profile: {
    screen: ProfileScreen,
    navigationOptions: profileNav
  },
  Reservations: {
    screen: ReservationsScreen,
    navigationOptions: {
      title: 'Mis reservaciones'
    }
  },
  EditProfile: {
    screen: EditProfileScreen,
    navigationOptions: {
      title: 'Editar datos'
    }
  },
  Notifications: {
    screen: Notifications,
    navigationOptions: {
      title: 'Mis notificaciones',
    }
  },
  PaymentMethods: {
    screen: PaymentMethodsScreen,
    navigationOptions: {
      title: 'Métodos de Pago'
    }
  },
  PurchaseHistory: {
    screen: PurchaseHistoryScreen,
    navigationOptions: {
      title: 'Mis compras'
    }
  },
  ChangePassword: {
    screen: ChangePasswordScreen,
    navigationOptions: {
      title: 'Cambiar contraseña',
    }
  },
  WaitingList: {
    screen: WaitingListScreen,
    navigationOptions: {
      title: 'Mi lista de espera'
    }
  },
  Terms: {
    screen: TermsScreen,
    navigationOptions: withoutLogoNav,
  },
  About: {
    screen: AboutScreen,
    navigationOptions: withoutLogoNav,
  }
}, {
  defaultNavigationOptions: simpleNav,
  headerMode: 'screen',
})

// This hides the tabBar on profile nested views.
ProfileStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = navigation.state.index === 0;

  return {
    tabBarVisible,
  };
};

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen,
  Recover: RecoverPasswordScreen,
  Terms: {
    screen: TermsScreen,
    navigationOptions: withoutLogoNav
  }
}, {
  defaultNavigationOptions: {
    headerShown: false,
  },
  headerMode: 'screen'
})

const PlansStack = createStackNavigator({
  Plans: PlansScreen
}, {
  defaultNavigationOptions: logoNav,
  headerMode: 'screen',
});

const TermsStack = createStackNavigator({
  Terms: TermsScreen
}, {
  defaultNavigationOptions: withoutLogoNav,
  headerMode: 'screen',
})

const CalendarStack = createStackNavigator({
  Calendario: CalendarScreen,
  Lesson: {
    screen: LessonScreen,
    navigationOptions: logoNav,
  },
  Instructor: {
    screen: InstructorScreen,
    navigationOptions: logoNav,
  }
}, {
  headerMode: 'screen',
  defaultNavigationOptions: navBar,
});

const TabIconProps: { resizeMode: ImageResizeMode, style: any } = {
  resizeMode: 'contain',
  style: styles.appContainer__icon
}

const TabNavigator = createBottomTabNavigator({
  'Calendario': {
    screen: CalendarStack,
    navigationOptions: () => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        return (
          <Image
            source={CalendarIcon}
            {...TabIconProps}
          />
        );
      }
    })
  },
  'Paquetes': {
    screen: PlansStack,
    navigationOptions: () => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        return (
          <Image
            source={WeIcon}
            {...TabIconProps}
          />
        );
      }
    })
  },
  'Perfil': {
    screen: ProfileStack,
    navigationOptions: () => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        return (
          <Image
            source={UserIcon}
            {...TabIconProps}
          />
        );
      }
    })
  },
},
  {
    tabBarOptions: {
      activeTintColor: 'white',
      activeBackgroundColor: '#58318b',
      inactiveTintColor: 'white',
      inactiveBackgroundColor: 'black',
      labelStyle: {
        fontSize: 10,
      },
      style: {
        height: 55,
        backgroundColor: 'black',
      }
    },
  });

export default ErrorBoundary(createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: SplashScreen,
      App: {
        screen: TabNavigator,
        navigationOptions: {
          transparentCard: true,
        }
      },
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )));