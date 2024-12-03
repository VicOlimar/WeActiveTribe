import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import DatePicker from 'react-datepicker';

import { withUserContext } from '../../../../contexts/UserContext';
import { DefaultUserContext } from '../../../../contexts/UserContext/UserContext';
import ProfileInfo from './../../components/ProfileInfo';

import ProfileImage from './../../assets/profile.png';
import Edit from './../../assets/edit.png';
import AuthService from './../../../../api/Auth/Auth';
import { isUndefined } from 'util';

import "react-datepicker/dist/react-datepicker.css";
import './User.scss';
import moment from 'moment';
import SimpleAlert from '../../../../shared/SimpleAlert';

type Props = RouteComponentProps<any> & {
  userContext?: DefaultUserContext,
}

type State = {
  profile?: {
    name?: string,
    last_name?: string,
    birthdate?: Date,
    email?: string,
    phone?: string,
    time_zone?: string,
    locale?: string,
    emergency_contact?: string,
    emergency_contact_name?: string,
  },
  loading: boolean,
  disableSave: boolean,
  message: string,
  showMessage: boolean,
}

class User extends Component<Props, State> {
  state: Readonly<State> = {
    profile: undefined,
    loading: false,
    disableSave: false,
    message: '',
    showMessage: false,
  }

  setProfileData = () => {
    const userContext: DefaultUserContext | undefined = this.props.userContext;

    if (!isUndefined(userContext)) {
      let profile = {
        name: userContext.user!.name,
        last_name: userContext.user!.last_name,
        birthdate: userContext.profile!.birthdate ? new Date(userContext.profile!.birthdate) : moment().subtract(18, 'year').toDate(),
        email: userContext.user!.email,
        phone: userContext.profile!.phone ? userContext.profile!.phone : '',
        emergency_contact: userContext.profile!.emergency_contact,
        emergency_contact_name: userContext.profile!.emergency_contact_name,
        time_zone: 'America/Mexico_City',
        locale: 'es',
      }
      this.setState({ profile }, () => this.checkDisabledSaveButton());
    }
  }

  /**
   * Send the user to studios for reserve a class
   */
  goToStudios = () => {
    this.props.history.push('/');
  }

  /**
   * Handle the edition action (For show or hide text inputs)
   */
  handleProfileEdition = () => {
    const profile = this.state.profile;

    if (!isUndefined(profile)) {
      this.setState({ profile: undefined });
    } else {
      this.setProfileData();
    }
  }

  handleSaveProfile = async () => {
    const profile: any = this.state.profile;

    if (profile.birthdate !== '' || profile.birthdate !== undefined) {
      if (profile.birthdate.getFullYear() > moment().subtract(18, 'years').toDate().getFullYear()) {
        this.setState({ message: 'Debes colocar una fecha de nacimiento mayor a 18 años', showMessage: true });
        return;
      }
    }

    if (profile.phone === '' || profile.phone === undefined) {
      this.setState({ message: 'Tú teléfono es obligatorio', showMessage: true });
      return;
    }

    if (profile.emergency_contact === '' || profile.emergency_contact === undefined || profile.emergency_contact === null) {
      this.setState({ message: 'Tú número de contacto es obligatorio', showMessage: true });
      return;
    }

    if (profile.emergency_contact_name === '' || profile.emergency_contact_name === undefined || profile.emergency_contact_name === null) {
      this.setState({ message: 'El nombre del contacto de emergencia es obligatorio', showMessage: true });
      return;
    }

    if (profile.name === '' || profile.name === undefined) {
      this.setState({ message: 'Tú nombre es obligatorio', showMessage: true });
      return;
    }

    if (profile.last_name === '' || profile.last_name === undefined) {
      this.setState({ message: 'Tú apellido es obligatorio', showMessage: true });
      return;
    }

    this.setState({ loading: true });
    const updatedProfile = await AuthService.updateProfile(profile);
    if (!isUndefined(updatedProfile)) {
      this.setState({ message: "Perfil actualizado correctamente.", showMessage: true });
      this.props.userContext!.setState(
        { user: { ...updatedProfile.user, profile }, profile },
        this.setState({ loading: false }, () => this.handleProfileEdition())
      );

    } else {
      this.setState({ message: "Ocurrió un error al actualizar tu información.", showMessage: true });
    }
  }

  getProfileRowsData = () => {
    const { user } = this.props.userContext!;
    const { profile } = this.state;
    let profileData: Array<{ label: any, value: any }> = [];

    profileData = [
      {
        label: this.getRequiredLabel('Nombre(s)'),
        value: isUndefined(profile) ? user ? user.name : '' : <input className='user__input' name='name' value={profile.name} onChange={event => this.updateProfileValue('name', event.target.value)} />
      },
      {
        label: this.getRequiredLabel('Apellido(s)'),
        value: isUndefined(profile) ? user ? user.last_name ? user.last_name : 'Sin apellidos' : '' : <input className='user__input' name='last_name' value={profile.last_name} onChange={event => this.updateProfileValue('last_name', event.target.value)} />
      },
      {
        label: this.getRequiredLabel('Fecha de Nacimiento'),
        value: isUndefined(profile) ? user ? user.profile && user.profile.birthdate ? moment(user.profile.birthdate).format("DD/MM/YYYY") : 'Sin fecha de nacimiento' : '' : <span><DatePicker dateFormat="dd/MM/yyyy" selected={profile.birthdate} onChange={(date) => this.updateProfileValue('birthdate', date)} /></span>
      },
      {
        label: this.getRequiredLabel('Correo Electrónico'),
        value: isUndefined(profile) ? user ? user.email : '' : <input className='user__input' type='email' name='email' value={profile.email} onChange={event => this.updateProfileValue('email', event.target.value)} />
      },
      {
        label: this.getRequiredLabel('Teléfono'),
        value: isUndefined(profile) ? user ? user.profile && user.profile.phone ? user.profile.phone : 'Sin número telefónico' : '' : <input className='user__input' type='tel' name='phone' value={profile.phone} onChange={event => this.updateProfileValue('phone', event.target.value)} />
      },
      {
        label: this.getRequiredLabel('Nombre del Contacto de Emergencia'),
        value: isUndefined(profile) ? user ? user.profile && user.profile.emergency_contact_name ? user.profile.emergency_contact_name : 'Sin contacto de emergencia' : '' : <input className='user__input' type='text' name='emergency_contact_name' value={profile.emergency_contact_name === null ? '' : profile.emergency_contact_name} onChange={event => this.updateProfileValue('emergency_contact_name', event.target.value)} />
      },
      {
        label: this.getRequiredLabel('Número de Emergencia'),
        value: isUndefined(profile) ? user ? user.profile && user.profile.emergency_contact ? user.profile.emergency_contact : 'Sin número de emergencia' : '' : <input className='user__input' type='tel' name='emergency_contact' value={profile.emergency_contact === null ? '' : profile.emergency_contact} onChange={event => this.updateProfileValue('emergency_contact', event.target.value)} />
      }
    ]
    return profileData;
  }

  getRequiredLabel(label: string) {
    const { profile } = this.state;

    return <span className={`${!isUndefined(profile) ? 'user__required' : ''}`}>{label}</span>
  }

  updateProfileValue = (name: 'name' | 'last_name' | 'email' | 'birthdate' | 'phone' | 'emergency_contact' | 'emergency_contact_name', value: any) => {
    let profile = this.state.profile;
    if (!isUndefined(profile)) {
      profile[name] = value;
      this.setState({ profile });
      this.checkDisabledSaveButton();
    }
  }

  checkDisabledSaveButton = () => {
    const profile = this.state.profile;
    if (!isUndefined(profile)) {
      if (profile.name === null || profile.name === '') {
        this.setState({ disableSave: true });
        return;
      }
      if (profile.email === null || profile.email === '') {
        this.setState({ disableSave: true });
        return;
      }
      if (profile.emergency_contact === null || profile.emergency_contact === '') {
        this.setState({ disableSave: true });
        return;
      }
      if (profile.emergency_contact_name === null || profile.emergency_contact_name === '') {
        this.setState({ disableSave: true });
        return;
      }
      if (profile.phone === null || profile.phone === '') {
        this.setState({ disableSave: true });
        return;
      }
      if (profile.birthdate === null) {
        this.setState({ disableSave: true });
        return;
      }
    }
    this.setState({ disableSave: false });
  }

  render() {
    const { loading, disableSave, message, showMessage } = this.state;
    const profile = this.state.profile;
    return (
      <div className='user'>
        <ProfileInfo
          image={ProfileImage}
          buttonText={isUndefined(profile) ? 'Editar perfil' : 'Cancelar'}
          buttonIcon={Edit}
          buttonAction={this.handleProfileEdition}
          rowsData={this.getProfileRowsData()}
          secondaryButtonDisabled={disableSave}
          secondaryButtonText={!isUndefined(profile) ? 'Guardar' : undefined}
          secondaryAction={this.handleSaveProfile}
          loading={loading}
        />
        <SimpleAlert title='' text={message} show={showMessage} onConfirm={() => this.setState({ message: '', showMessage: false })} />
      </div>
    );
  }
}

export default withUserContext(withRouter(User));