// import type { ExceptionPageProps } from "../../types/error.ts";
//
// export const ExceptionPage = ({ error }: ExceptionPageProps) => {
//
//     return (
//         <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-white p-4">
//             <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-md w-full text-center shadow-xl">
//                 <h2 className="text-xl font-semibold text-rose-400 mb-2">Something went wrong</h2>
//                 {error?.data?.error?.code && (
//                     <p className="text-sm text-gray-400 mb-1">Error Code: {error.data.error.code}</p>
//                 )}
//                 {error?.data?.error?.message ? (
//                     <p className="text-base text-gray-200">{error.data.error.message}</p>
//                 ) : (
//                     <p className="text-base text-gray-200">{typeof error?.error === 'string' ? error.error : "An unexpected error occurred."}</p>
//                 )}
//             </div>
//         </div>
//     );
// };
