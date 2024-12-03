import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import './AppPagination.scss';

import ReactPaginate from 'react-paginate';


export type PaginationData = {
  itemsAmount: (itemsAmount: number) => void,
  pages?: number,
  active?: number,
  onClick: (page: any) => void,
}

type State = {

}

class AppPagination extends Component<PaginationData, State> {

  clickChange = (data: any) => {
    let selected = data.selected;
    this.props.onClick(selected + 1)
  }
  changeAmountItems = (e: any) => {
    if(this.props.itemsAmount){
      this.props.itemsAmount(e.currentTarget.value);
    }
  }

  render() {
    return (
      <div className='app-pagination'>
        <ReactPaginate
          previousLabel={'Anterior'}
          nextLabel={'Siguiente'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={this.props.pages!}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.clickChange}
          pageClassName={'page'}
          pageLinkClassName={'page-link'}
          activeClassName={'active'}
          activeLinkClassName={'active-link'}
          previousLinkClassName={'prev-link'}
          nextLinkClassName={'next-link'}
          disabledClassName={'disable'}
          containerClassName={'container'}
          previousClassName={'prev-class'}
          nextClassName={'next-class'}
          breakLinkClassName={'break-link'}
        />
        <Form.Group controlId="app-pagination__select__id">
          <Form.Control onChange={(e)=>this.changeAmountItems(e)} as="select">
            <option value={6}>6</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </Form.Control>
        </Form.Group>
      </div>
    )
  }
}

export default AppPagination;