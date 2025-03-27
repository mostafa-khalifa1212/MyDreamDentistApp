import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';
import StaffRoute from './components/auth/StaffRoute';
import AdminRoute from './components/auth/AdminRoute';
import routes from './routes';

const App = () => (
  <AppProvider>
    <Router>
      <Layout>
        <Routes>
          {routes.map(({ path, component: Component, protected: isProtected, role }) => {
            const RouteComponent = isProtected 
              ? role === 'admin' 
                ? AdminRoute 
                : role === 'staff' 
                  ? StaffRoute 
                  : PrivateRoute
              : React.Fragment;
            
            return (
              <Route
                key={path}
                path={path}
                element={
                  <RouteComponent>
                    <Component />
                  </RouteComponent>
                }
              />
            );
          })}
        </Routes>
      </Layout>
    </Router>
  </AppProvider>
);

export default App;