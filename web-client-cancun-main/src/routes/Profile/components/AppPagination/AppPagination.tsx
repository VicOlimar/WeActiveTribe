import React from 'react';
import { Pagination } from 'react-bootstrap';
import './AppPagination.scss';

import RightArrow from './../../assets/right-arrow.png';
import LeftArrow from './../../assets/left-arrow.png';

export type PaginationData = {
  pages?: number,
  active?: number,
  onClick?: Function,
}

function displayPages(pages = 0, active = 0, onClick: Function) {
  const pageComponents: any = [];
  for (let index = 0; index < pages; index++) {
    pageComponents.push(<Pagination.Item key={index} active={index + 1 === active} onClick={() => onClick(index + 1)}>{index + 1}</Pagination.Item>);
  }
  return pageComponents;
}

const AppPagination = ({ pages = 0, active = 0, onClick = () => { } }: PaginationData) => {
  return (
    <Pagination className='text-center app-pagination'>
      <Pagination.Prev><img className='app-pagination__arrow' src={LeftArrow} alt='left arrow' onClick={() => { if (active - 1 >= 0) onClick(active - 1) }} /></Pagination.Prev>
      {
        displayPages(pages, active, onClick)
      }
      <Pagination.Next><img className='app-pagination__arrow' src={RightArrow} alt='right arrow' onClick={() => { if (active + 1 <= pages) onClick(active + 1) }} /></Pagination.Next>
    </Pagination>
  )
}

export default AppPagination;