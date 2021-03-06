import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { NotificationContainer } from 'react-notifications';
import Comments from './pages/Comments';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <div className="content">
        <Comments />
    </div>
    <ReactQueryDevtools initialIsOpen={false} />

    <NotificationContainer />
  </QueryClientProvider>
);

export default App;
