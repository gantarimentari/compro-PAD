import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
export const Pagination=({ currentPage, totalPages, totalData, handlePageChange }) => {
  const perPage= 20;
  const startIndex =(currentPage-1)*perPage;
  const currentEnd= totalData > 0 ? Math.min(startIndex + perPage, totalData) : 0;
  return (
    <div className="flex item-center justify-end pt-4 border-t border-accent-neutral-400">
      <p className="text-body-2 text-accent-neutral-700">
         Menampilkan {totalData > 0 ? startIndex + 1 : 0}-{currentEnd} dari {totalData} data
      </p>
      <div className="flex items-center gap-2 ">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-colors ${
          currentPage === 1
            ? 'bg-accent-neutral-225 text-accent-neutral-400 cursor-not-allowed'
            : 'bg-white text-accent-neutral-800 hover:bg-accent-neutral-225 border border-accent-neutral-400'
          }`} >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
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
              className={`px-3 py-2 rounded-lg text-body-2 font-medium transition-colors ${
              currentPage === pageNum
              ? 'bg-accent-blue-300 text-white'
              : 'bg-white text-accent-neutral-800 hover:bg-accent-neutral-225 border border-accent-neutral-400'  }`} >
                {pageNum}
            </button>
          );
        })}
        <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? 'bg-accent-neutral-225 text-accent-neutral-400 cursor-not-allowed'
                      : 'bg-white text-accent-neutral-800 hover:bg-accent-neutral-225 border border-accent-neutral-400'
                  }`}
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
      </div>
    </div>
  )
}; 
