import React, { useState } from "react";
import { User } from "../../../api/Users/Users";
import userService from "../../../api/Users";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { LessonType } from "../../../api/LessonType/LessonType";

type Props = {
  userId: number;
  show: boolean;
  parentLevelClose: () => void;
  parentLevelAlert: (
    error: boolean,
    message: string,
    alertVariant: string
  ) => void;
};

type CreditTypeInfoType = {
  name: string;
  count: Number;
};

type Credit = {
  expires_at: Date;
  canceled: boolean;
  used: boolean;
  lesson_type_id: number;
  lesson_type: LessonType;
  studio_id: number;
  studio: Studio;
};

type Studio = {
  name: string;
  slug: string;
};

const CreditTypeInfo: React.FC<{ info: CreditTypeInfoType }> = ({ info }) => {
  return (
    <Row>
      <Col xs={6}>
        <p className="credit_type__text">{info.name}</p>
      </Col>
      <Col xs={6}>
        <p className="credit_type__value">{info.count}</p>
      </Col>
    </Row>
  );
};

const ReduceCreditModal = (props: Props) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [type, setType] = useState<"classic" | "online">("classic");
  const [typeLesson, setTypeLesson] = useState<string>("");
  const [creditTypesInfo, setCreditTypesInfo] = useState<CreditTypeInfoType[]>(
    []
  );

  function getLessonTypeIDS(credits: Credit[]): Array<Number> {
    const lessonTypesIds: Array<Number> = [];
    credits.forEach((credit) => {
      if (!lessonTypesIds.includes(credit.lesson_type_id)) {
        lessonTypesIds.push(credit.lesson_type_id);
      }
    });
    return lessonTypesIds;
  }

  function getStudioIDS(credits: Credit[]): Array<Number> {
    const studiosIds: Array<Number> = [];
    credits.forEach((credit) => {
      if (!studiosIds.includes(credit.studio_id)) {
        studiosIds.push(credit.studio_id);
      }
    });
    return studiosIds;
  }

  const getUser = async () => {
    try {
      const user = await userService.findOne(props.userId);
      if (user!.user && user!.credits) {
        setUser(user!.user);
        if (
          user!.credits.available_data < 1 &&
          user!.credits.available_online_data.length < 1
        ) {
          props.parentLevelAlert(
            true,
            "Este usuario no cuenta con créditos disponibles.",
            "warning"
          );
        }
        const lessonTypesIds: Array<Number> = getLessonTypeIDS(
          user!.credits.available_data
        );
        const studiosIds: Array<Number> = getStudioIDS(
          user!.credits.available_data
        );
        const creditsInfo: Array<CreditTypeInfoType> = [];

        lessonTypesIds.forEach((id: Number) => {
          const filteredCredits: Credit[] = user!.credits.available_data.filter(
            (credit: Credit) =>
              credit.lesson_type_id === id &&
              credit.lesson_type &&
              !credit.studio_id
          );
          if (filteredCredits.length > 0) {
            creditsInfo.push({
              name: filteredCredits[0].lesson_type
                ? filteredCredits[0].lesson_type.name
                : "Normales",
              count: filteredCredits.length,
            });
          }
        });

        studiosIds.forEach((id: Number) => {
          const filteredCredits: Credit[] = user!.credits.available_data.filter(
            (credit: Credit) =>
              credit.studio_id === id && !credit.lesson_type_id
          );
          if (filteredCredits.length > 0) {
            creditsInfo.push({
              name: filteredCredits[0].studio
                ? filteredCredits[0].studio.name
                : "Normales",
              count: filteredCredits.length,
            });
          }
        });
        setCreditTypesInfo(creditsInfo);
      } else {
        props.parentLevelAlert(true, "Error obteniedo el usuario", "error");
        props.parentLevelClose();
      }
    } catch (error) {
      props.parentLevelAlert(true, "Error obteniendo el usuario", "error");
      props.parentLevelClose();
    }
  };

  const reduceCredits = async () => {
    try {
      if (user) {
        const userResponse: User | undefined =
          typeLesson !== ""
            ? await userService.reduceCredits(
                user.id as number,
                type,
                typeLesson
              )
            : await userService.reduceCredits(user.id as number, type);
        if (userResponse) {
          props.parentLevelAlert(
            true,
            "Créditos reducidos con éxito",
            "success"
          );
          props.parentLevelClose();
        } else {
          props.parentLevelAlert(
            true,
            "No se pudo restar créditos al usuario",
            "error"
          );
        }
      }
    } catch (error) {
      props.parentLevelAlert(
        true,
        "No es posible restar créditos a este usuario",
        "warning"
      );
    }
  };

  return (
    <React.Fragment>
      <Modal
        onEnter={getUser}
        show={props.show}
        onHide={props.parentLevelClose}
      >
        <Modal.Header>
          <Modal.Title>Restar crédito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>¿Desea restar un crédito a {user ? user.name : ""} ?</h6>
          {user && user.available_credits && (
            <p>Créditos disponibles: {user.available_credits.length}</p>
          )}
          <br />
          {user &&
            user.available_online_credits &&
            user.available_online_credits.length > 0 && (
              <p>Créditos online: {user.available_online_credits.length}</p>
            )}
          {creditTypesInfo.map(
            (creditTypeInfo: CreditTypeInfoType, index: number) => (
              <CreditTypeInfo key={index} info={creditTypeInfo} />
            )
          )}
          <br />
          <br />
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Tipo de crédito a restar</Form.Label>
            <Form.Control
              as="select"
              onChange={(event: any) => setType(event.target.value)}
              value={type}
            >
              <option value="classic">Presencial</option>
              {user && user.available_online_credits.length > 0 && (
                <option value="online">Online</option>
              )}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect2">
            <Form.Label>Tipo de clase</Form.Label>
            <Form.Control
              as="select"
              onChange={(event: any) => setTypeLesson(event.target.value)}
              value={typeLesson}
            >
              <option value="">Selecciona un tipo de clase</option>
              {creditTypesInfo.map((item: any, index: number) => {
                return (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                );
              })}
              {user && user.available_online_credits.length > 0 && (
                <option value="online">Online</option>
              )}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.parentLevelClose}>Cancelar</Button>
          <Button onClick={reduceCredits}>Aceptar</Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default ReduceCreditModal;
