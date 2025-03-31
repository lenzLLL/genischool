"use client"
import { useSearchParams ,useRouter, usePathname} from 'next/navigation';
import React from 'react'
import ReactPaginate from 'react-paginate';

export default function Secondpagination({itemsPerPage,itemsCount}:{itemsPerPage:number,itemsCount:number}) {
  const pageCount = Math.ceil(itemsCount / itemsPerPage);
  const searchParams = useSearchParams();
  const pathname = usePathname(); 
  const currentQuery = Object.fromEntries(searchParams.entries());
  const initPage = currentQuery.endOffset? Math.floor(parseInt(currentQuery.endOffset)/itemsCount):0
  const router = useRouter()
    const handlePageClick = (event:any) => {
        const newOffset = (event.selected * itemsPerPage) % itemsCount;
        currentQuery.itemOffset = newOffset.toString()
        currentQuery.endOffset = (newOffset+itemsPerPage).toString()
        const newSearch = new URLSearchParams(currentQuery).toString();
        const newUrl = `${pathname}?${newSearch}`;
        // Pousser la nouvelle route avec l'URL complète
        router.push(newUrl); 
      };
    return (
    <ReactPaginate
    previousLabel="previous"
    nextLabel="next"
    breakLabel="..."
    initialPage={initPage}
    breakClassName="page-item"
    breakLinkClassName="page-link"
    pageCount={pageCount}
    pageRangeDisplayed={4}
    marginPagesDisplayed={2}
    onPageChange={handlePageClick}
    containerClassName="pagination justify-content-center"
    pageClassName="page-item"
    pageLinkClassName="page-link"
    previousClassName="page-item"
    previousLinkClassName="page-link"
    nextClassName="page-item"
    nextLinkClassName="page-link"
    activeClassName="active"
    hrefBuilder={(page, pageCount, selected) =>
      page >= 1 && page <= pageCount ? `/page/${page}` : '#'
    }
    hrefAllControls
    // eslint-disable-next-line no-unused-vars
  
    
    // forcePage={currentPage}
    onClick={(clickEvent) => {
      console.log('onClick', clickEvent);
      // Return false to prevent standard page change,
      // return false; // --> Will do nothing.
      // return a number to choose the next page,
      // return 4; --> Will go to page 5 (index 4)
      // return nothing (undefined) to let standard behavior take place.
    }}
  />
  )
}
