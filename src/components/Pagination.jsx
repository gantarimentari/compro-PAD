export const Pagination=({ currentPage, totalPages, totalData, handlePageChange }) => {
  const perPage= 20;
  const startIndex =(currentPage-1)*perPage;
  const currentEnd= totalData > 0 ? Math.min(startIndex + perPage, totalData) : 0;
  return (
    <div className="flex item-center justify-end pt-4 ">
      
      <div className="flex items-center gap-2 ">

        {Array.from({length: Math.min(3, totalPages)},(_, i) => {
          let pageNum;
          if (totalPages<=3){
            pageNum = i + 1;
          }else if (currentPage === 1){
            pageNum = i +1;
          }else if (currentPage === totalPages){
            pageNum = totalPages - 2 + i;
          } else {
            pageNum = currentPage - 1 + i;
          }
          return(
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`w-10 h-10 rounded-md font-medium transition-all duration-300 shadow-sm ${
              currentPage === pageNum
              ? 'bg-accent-yellow-300 text-accent-neutral-1000 border-2 border-accent-yellow-400 scale-11'
              : 'bg-white text-accent-neutral-700 hover:bg-accent-yellow-50 border-2 border-accent-neutral-200'  }`} >
                {pageNum}
            </button>
          );
        })}
      </div>
    </div>
  )
}; 
