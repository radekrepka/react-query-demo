import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { NotificationContainer } from 'react-notifications';
import Users from './pages/Users';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <div className="content">
        <Users />
    </div>
    <ReactQueryDevtools initialIsOpen={false} />

    <NotificationContainer />
  </QueryClientProvider>
);

export default App;
