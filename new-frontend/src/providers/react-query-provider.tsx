import { withScope, captureException } from "@sentry/react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useMemo } from "react";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false, // default: 3
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Setup from somewhere:
// const queryClient = useMemo(
//   () =>
//     new QueryClient({
//       mutationCache: new MutationCache({
//         onError: (err, _variables, _context, mutation) => {
//           withScope((scope) => {
//             scope.setContext("mutation", {
//               mutationId: mutation.mutationId,
//               variables: mutation.state.variables,
//             });
//             if (mutation.options.mutationKey) {
//               scope.setFingerprint(
//                 // Duplicate to prevent modification
//                 Array.from(mutation.options.mutationKey) as string[],
//               );
//             }
//             captureException(err);
//           });
//         },
//       }),
//       queryCache: new QueryCache({
//         onError: (err, query) => {
//           withScope((scope) => {
//             scope.setContext("query", { queryHash: query.queryHash });
//             scope.setFingerprint([query.queryHash.replaceAll(/[0-9]/g, "0")]);
//             captureException(err);
//           });
//         },
//       }),
//       defaultOptions: {
//         queries: {
//           onError: (err) => {
//             showAlert(err);
//           },
//         },
//         mutations: {
//           onError: (err) => {
//             showAlert(err);
//           },
//         },
//       },
//     }),
//   [showAlert],
// );

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

export const ReactQueryProvider: React.FC<ReactQueryProviderProps> = ({
  children,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
