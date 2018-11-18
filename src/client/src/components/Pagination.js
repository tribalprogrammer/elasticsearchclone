import React from 'react';
import '../App.css';

const Pagination = (props) => {
  return (
    <div className="Pagination-wrapper">
      <PaginationBody {...props} />
      <PaginationText {...props} />
    </div>
  )
}

const PaginationBody = ({limit, offset, count, search}) => {

  return (
    <div className="Pagination">
      <div
        className={offset === 0 ? "Pagination-button-disabled" : "Pagination-button"}
        onClick={() => {
          if (offset === 0) { return; }
          search(limit, offset - limit);
        }}
      >
        &lt;
      </div>
      <div
        className={ (offset + limit >= count) ? "Pagination-button-disabled" : "Pagination-button"}
        onClick={() => {
          if (offset + limit >= count) { return; }
          search(limit, offset + limit);
        }}
      >
        &gt;
      </div>
    </div>
  );
};

const PaginationText = ({limit, offset, count, search}) => {
  const currentPage = Math.ceil(offset / limit + 1);
  const totalPages = Math.ceil(count/limit);
  return (
    <div className="Pagination-text">
      Page {currentPage} of {totalPages}
    </div>
  );
}


export default Pagination;