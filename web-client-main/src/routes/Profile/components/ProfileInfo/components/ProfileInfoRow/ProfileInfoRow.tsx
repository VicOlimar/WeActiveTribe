import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ProfileText from '../ProfileText';

const ProfileInfoRow = ({ label, value }: { label: string, value: any }) => {
  return (
    <Row>
      <Col xs={6} lg={6}>
        <ProfileText>{label}</ProfileText>
      </Col>
      <Col xs={6} lg={6}>
        {
          typeof value === "string" ? <ProfileText>{value}</ProfileText> : value
        }
      </Col>
    </Row>
  )
}

export default ProfileInfoRow;