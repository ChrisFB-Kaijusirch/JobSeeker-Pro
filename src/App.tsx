import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './Pages/Dashboard';
import Upload from './Pages/Upload';
import Applications from './Pages/Applications';
import Preferences from './Pages/Preferences';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <Layout currentPageName="Dashboard">
              <Dashboard />
            </Layout>
          } 
        />
        <Route 
          path="/upload" 
          element={
            <Layout currentPageName="Upload">
              <Upload />
            </Layout>
          } 
        />
        <Route 
          path="/applications" 
          element={
            <Layout currentPageName="Applications">
              <Applications />
            </Layout>
          } 
        />
        <Route 
          path="/preferences" 
          element={
            <Layout currentPageName="Preferences">
              <Preferences />
            </Layout>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}