import React from 'react';
import { Col, Row } from 'react-bootstrap';
import './SpecialMessage.scss';
import WE_RIDE_BG from './../../assets/we-ride-bg.jpg';
import WE_HIIT_BG from './../../assets/we-hiit-bg.jpg';
import CLOSE from './../../assets/close.png';

function displayStep(step: any) {
    return <li>{step}</li>;
}

type Props = {
    title?: String,
    subtitle?: any,
    steps: Array<any>,
    showClose?: boolean,
    onClose?: Function,
    isDefaultBackground?: boolean
};

const SpecialMessage = ({ title, subtitle, steps, showClose = false, onClose = () => { }, isDefaultBackground = false }: Props) => {
    const defaultBackground = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.71), rgba(0, 0, 0, 0.71)), linear-gradient(45deg, #ed1a59, #c10c90, #944e9e 49%, #4067b1)'

    const style = { backgroundImage: isDefaultBackground ? defaultBackground : `url(${window.location.href.includes('we-ride') ? WE_RIDE_BG : WE_HIIT_BG})` };
    return (
        <div className='special-message' style={style}>
            {
                showClose && <button onClick={() => onClose()} className='special-message__close'><img src={CLOSE} alt='close' /></button>
            }
            <Row>
                <Col>
                    <h1 className='special-message__main-title'>{title}</h1>
                    <div className='special-message__subtitle'>{subtitle}</div>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col xs lg='6'>
                    <ul className='special-message__list'>
                        {
                            steps.map((step, index) => <Row key={index} className='special-message__descriptions'>
                                {displayStep(step)}
                            </Row>)
                        }
                    </ul>
                </Col>
            </Row>
        </div>
    )
}

export default SpecialMessage;