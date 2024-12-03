import React, { useState, FC, CSSProperties } from "react";
import { CreditDetail } from "../../../api/Users/Users";
import userService from "../../../api/Users";
import { Modal, Button, Row, Col, Card, Container } from "react-bootstrap";
import moment from "moment";
import { mdiPauseCircle } from "@mdi/js";
import Icon from "@mdi/react";
import Loader from "../../../shared/Loader";

type Props = {
  userId: number;
  show: boolean;
  onClose: () => void;
  handleAlert: (error: boolean, message: string, alertVariant: string) => void;
};

const TextBold: FC = ({ children }) => (
  <span style={{ fontWeight: "bold" }}>{children}</span>
);

const centerFlexStyle: CSSProperties = {
	display: "flex",
	flexDirection: "row",
    alignItems: "center"
}

const CreditDetailCard: FC<{ detail: CreditDetail }> = ({ detail }) => {
  if (!detail) {
    return null;
  }

  const expires_at = detail.expires_at
    ? moment(detail.expires_at).format("DD/MM/YYYY")
    : "N.D";
   const paused_date = detail.expires_at && detail.paused ? 
      moment(detail.expires_at).subtract(1, 'year').format("DD/MM/YYYY") : "N.A";
  
      return (
    <Card style={{ padding: "0.5rem 0.25rem" }}>
      <Row>
        <Col xs={12}>
          <p className="credit_type__text">
            <TextBold>{detail.lesson_type || "Normal"}</TextBold>
          </p>
        </Col>
        <Col xs={6}>
          <p className="credit_type__text">{`Créditos: ${detail.amount}`}</p>
        </Col>
        <Col xs={6}>
          { !detail.paused &&
            <p className="credit_type__value">{`Vigencia : ${expires_at}`}</p> 
          }
        </Col>
        {detail.paused && (
          <>
            <Col xs={6} style={centerFlexStyle}>
              <Icon path={mdiPauseCircle} size={0.8} color="#141010" />
              <p className="credit_type__value">{`Pausado : ${paused_date}`}</p>
            </Col>
            <Col xs={6}>
              <p className="credit_type__value">{`Días restantes : ${detail.validity}`}</p>
            </Col>
          </>
        )}
      </Row>
    </Card>
  );
};

const CreditsDetailModal = ({ userId, show, onClose, handleAlert }: Props) => {
  const [creditsDetail, setCreditsDetails] = useState<CreditDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getCreditsDetail = async () => {
    try {
      setLoading(true);
      const creditsDetail = await userService.getCreditsDetail(userId);
      if (!creditsDetail) {
        throw Error("");
      }
      setCreditsDetails(creditsDetail);
    } catch (error) {
      handleAlert(true, "Error obteniendo el usuario", "error");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onEnter={getCreditsDetail} show={show} onHide={onClose}>
      <Modal.Header>
        <Modal.Title>Detalles de créditos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container style={{ display: "grid", gridGap: 20 }}>
          {loading && <Loader />}
          {!loading &&
            creditsDetail.map((detail, index) => (
              <CreditDetailCard detail={detail} key={index} />
            ))}
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreditsDetailModal;
