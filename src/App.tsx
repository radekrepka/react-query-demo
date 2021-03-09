import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <div className="content">

    </div>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default App;