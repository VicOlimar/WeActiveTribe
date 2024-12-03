import React, { Component } from "react";
import studioService, { Studio as IStudio } from "../../api/Studio/Studio";
import { Col, Row, Card, Button } from "react-bootstrap";
import { Link, RouteComponentProps } from "react-router-dom";
import "./Studio.scss";
import weRideImage from "./images/we-ride.png";
import weHiitImage from "./images/we-hiit.png";
import { withRouterContext } from "../../contexts/RouteContext";
import { DefaultRouteContext } from "../../contexts/RouteContext/RouteContext";

type Props = RouteComponentProps<any> & {
  routeContext?: DefaultRouteContext;
};

type State = {
  loading: boolean;
  error: boolean;
  message: string;
  alertVariant: string;
  studios: IStudio[] | undefined;
};

class Studio extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      error: false,
      message: "",
      alertVariant: "",
      studios: undefined,
    };

    this.goto = this.goto.bind(this);
  }

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const response: IStudio[] | null = await studioService.find();
      if (response) {
        this.setState({ studios: response, loading: false });
      } else {
        this.setState({
          error: true,
          message: "No hay studios disponibles.",
          alertVariant: "warning",
          loading: false,
        });
      }
    } catch (error) {
      this.setState({
        error: true,
        message: "Error al cargar studios.",
        alertVariant: "error",
        loading: false,
      });
    }
  }

  goto = (e: any) => {
    const { value } = e.currentTarget;
    this.props.history.push(`/studio/${value}/lessons/`);
  };

  render() {
    if (this.state.studios) {
      return (
        <div className="studios">
          <Link to="/lessons-report">
            <Button variant="dark" className="report-btn">
              Ver reporte
            </Button>
          </Link>
          <Row className="justify-content-sm-center" style={{ margin: "0" }}>
            <Col lg={6} sm={12} style={{ padding: "0px" }}>
              <Card
                className="studios__left"
                border="primary"
                style={{ width: "100%" }}
              >
                <div className="studios__body">
                  <div className="studios__body__image-row">
                    <img
                      className="studios__body__image-row__image"
                      src={weRideImage}
                      alt="we-ride"
                    />
                  </div>
                  <hr className="studios__body__line studios__body__line-large"></hr>
                  <div className="studios__body__button-row">
                    <Button
                      variant="dark"
                      value={"we-ride"}
                      onClick={this.goto}
                    >
                      Ir a las clases
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
            <Col lg={6} sm={12} style={{ padding: "0px" }}>
              <Card
                className="studios__right"
                border="primary"
                style={{ width: "100%" }}
              >
                <div className="studios__body">
                  <div className="studios__body__image-row">
                    <img
                      className="studios__body__image-row__image"
                      src={weHiitImage}
                      alt="we-hiit"
                    />
                  </div>
                  <hr className="studios__body__line studios__body__line-large"></hr>
                  <div className="studios__body__button-row">
                    <Button
                      variant="dark"
                      value={"we-hiit"}
                      onClick={this.goto}
                    >
                      Ir a las clases
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      );
    } else return null;
  }
}

export default withRouterContext(Studio);
