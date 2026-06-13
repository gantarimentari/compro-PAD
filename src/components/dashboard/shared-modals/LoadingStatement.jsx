export const LoadingTable =({})=>{
  return(
    <div className="space-y-3 rounded-lg bg-white p-6 shadow-xl">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
  )
}

// export