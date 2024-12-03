import React, { Component } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import NotificationService, { Notification } from "../../services/Notification/Notification";
import { DefaultUserContext } from "../../contexts/UserContext/UserContext";
import Loader from "../../shared/Loader";
import { SafeAreaView } from "react-navigation";
import hoistNonReactStatics from 'hoist-non-react-statics';
import withUserContext from "../../contexts/UserContext/WithUserContext";
import NotificationItem from "./components/NotificationItem";

import bem from 'react-native-bem';
const styles = require('./Notifications.scss');

type Props = {
  navigation: any,
  userContext: DefaultUserContext,
}

type State = {
  loading: boolean,
  notifications: Notification[]
}



class Notifications extends Component<Props, State> {
  
  state = {
    notifications: undefined,
    loading: true
  }

  componentDidMount() {
    const { userContext } = this.props;
    if(userContext && userContext.user) {
      this.getNotificationsPerUser(userContext.user);
    } 
  }

  getNotificationsPerUser = async (user) => {
    this.setState({ loading: true })
    try {
      const notifications = await NotificationService.getUserNotification(user.id);
    if (notifications !== null) {
      this.setState({ notifications });
    } else {
      throw 'Error obteniendo tus notificaciones'
    }
    } catch (error) {
      console.error(error);
    }
    
    this.setState({ loading: false });
  }

  handlePlanPress = (notification: Notification) => {
    Alert.alert(notification.title, notification.content);
  }
   
  renderNotifications(notifications) {
    const b = (selector) => bem(selector, {}, styles);
    return !notifications || !notifications.length? 
     (
      <View style={b('notifications__empty')}>
        <Text style={b('notifications__text')}>Aún no tienes notificaciones.</Text>
      </View> 
     ):
    (
      <View style={b('notifications__content')}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={notifications}
          renderItem={(notification: any) => (
            <NotificationItem notification={notification.item} onPress={this.handlePlanPress} />)}
      />
    </View>
     );
  }

  render() {
    const { notifications, loading } = this.state;

    return (
     loading ? <SafeAreaView style={styles.notifications__empty}>
        <Loader />
      </SafeAreaView> :
        this.renderNotifications(notifications)
    )
  }
}

export default withUserContext(hoistNonReactStatics(Notifications, Notifications));