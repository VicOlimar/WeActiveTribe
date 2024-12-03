import React from "react";
import { RouteComponentProps } from "react-router-dom";
import Icon from "@mdi/react";
import { ItemT } from './sideMenuItems';
import './sidebarItem.scss';

type Props = RouteComponentProps<any> & {
  item: ItemT;
};

const Item = (props: Props) => {

  const goTo: any = () => {
    if (props.item.routeTo !== '#') {
      props.history.push(`${props.item.routeTo}`);
    }
  };

  const active = () => {
    const { pathname } = props.history.location;
    const mainRoute = pathname.split('/');
    return props.item.routeTo.includes(mainRoute[1]);
  }

  const renderItem = () => {
    if (props.item.component) {
      return (
        <div className="side-item" onClick={goTo}>
          <div className="side-item__component">
            {props.item.component}
          </div>
        </div>
      );
    }
    return (
      <div className="side-item" onClick={goTo}>
        <Icon
            path={props.item.pathIcon}
            title="User Profile"
            size={props.item.size}
            color={props.item.color}
          />
          <p>{props.item.text}</p>
          {active() &&
            <div className='dot'></div>
          }
        </div>
      );
  }

  return renderItem();
}

export default Item;