import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {Icon} from '@mdi/react';
import {mdiArrowLeft} from '@mdi/js';
import './ReturnBtn.scss';

type Props = RouteComponentProps & {
    goBackCallBack?: (data: any) => void;
}

const Return = ({goBackCallBack, location}: Props) => {


    const pushToPrevRoute = () => {
        if(goBackCallBack) {
            return goBackCallBack(location.state? location.state : null)
        }
    }

    return (
        <button className='return-btn' onClick={()=>{pushToPrevRoute()}}><Icon path={mdiArrowLeft} size={1} title={'Return'} color={'#000000'}></Icon> Regresar</button>
    )
}

export default withRouter(Return);

