import Pagination from "react-js-pagination";

const pagination = (props) => {
  const { pageChange, activePage, totalCount, itemsCountPerPage } = props;

  return (
    <div
      style={{
        width: "60%",
        display: "flex",
        marginTop: "0px",
        alignItems: "center",
        justifyContent: "left",
      }}
    >
      <Pagination
        firstPageText="FIRST"
        lastPageText="LAST"
        itemClass="page-item"
        itemClassLast="page-item"
        itemClassFirst="page-item"
        linkClass="page-link"
        linkClassLast="page-link"
        linkClassFirst="page-link"
        activeLinkClass="page-link"
        activePage={parseInt(activePage)}
        itemsCountPerPage={itemsCountPerPage}
        totalItemsCount={totalCount}
        pageRangeDisplayed={3}
        onChange={pageChange}
      />
    </div>
  );
};

export default pagination;
