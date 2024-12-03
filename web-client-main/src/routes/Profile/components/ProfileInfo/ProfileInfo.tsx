import React, { Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';

import './ProfileInfo.scss';
import ProfileButton from '../ProfileButton';
import SectionBackground from './../../assets/section_background.jpg';
import AppPagination from '../AppPagination';
import SectionError from '../SectionError';
import ProfileInfoRow from './components/ProfileInfoRow';
import ImageContainer from './components/ImageContainer/ImageContainer';
import Loader from '../../../../shared/Loader';

type Props = {
  children?: any,
  rowsData?: Array<{ label: any, value: any }>,
  image?: string,
  buttonText?: string,
  buttonIcon?: string,
  buttonAction?: Function,
  errorMessage?: string,
  retryText?: string,
  retryCallback?: Function,
  emptyText?: string,
  emptyActionText?: string,
  emptyActionCallback?: Function,
  loading?: boolean,
  secondaryButtonDisabled?: boolean,
  secondaryButtonText?: string,
  secondaryAction?: Function,
  secondaryTextCenter?: boolean,
  pagination?: {
    pages: number,
    active: number,
    onClick: Function
  }
}

const ProfileInfo = ({
  children,
  image = undefined,
  buttonText = '',
  buttonIcon = undefined,
  buttonAction = undefined,
  rowsData,
  pagination,
  errorMessage = '',
  retryText = '',
  retryCallback = undefined,
  emptyText = '',
  emptyActionText = '',
  emptyActionCallback = undefined,
  secondaryButtonDisabled = false,
  secondaryButtonText = undefined,
  secondaryAction = undefined,
  loading = false,
  secondaryTextCenter = false,
}: Props) => {
  return (
    <div className='profile-info' style={{ backgroundImage: `url(${SectionBackground})` }}>
      <div className='profile-info__content'>
        <Row>
          {
            children && <Col xs={12}>
              {children}
            </Col>
          }
          <Col className='text-center' xs={12} md={3}>
            <ImageContainer image={image} buttonIcon={buttonIcon} buttonText={buttonText} buttonAction={buttonAction} />
            <br /><br />
          </Col>
          <Col xs={12} md={9}>
            {
              loading ? <Loader show={loading} /> : <Fragment>
                {
                  (rowsData === null || rowsData === undefined) &&
                  <SectionError errorMessage={errorMessage} retryText={retryText} retryCallback={retryCallback} />
                }
                {
                  rowsData !== undefined && rowsData.map((row: { label: string, value: any }, index: number) => <ProfileInfoRow key={index} label={row.label} value={row.value} />)
                }
                {
                  rowsData !== undefined && rowsData.length === 0 && <SectionError errorMessage={emptyText} retryText={emptyActionText} retryCallback={emptyActionCallback} />
                }
                {
                  secondaryButtonText && <div className={`profile-info__secondary_action${secondaryTextCenter ? '-center' : ''}`}>
                    <ProfileButton onClick={secondaryAction} disabled={secondaryButtonDisabled}>{secondaryButtonText}</ProfileButton>
                  </div>
                }
                {
                  pagination && rowsData !== undefined && rowsData.length > 0 && pagination.pages > 1 && <div className='profile-info__pagination'>
                    <AppPagination pages={pagination.pages} active={pagination.active} onClick={pagination.onClick} />
                  </div>
                }
              </Fragment>
            }
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ProfileInfo;