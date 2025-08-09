// src/App.tsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CreateForm from './pages/CreateForm';
import PreviewForm from './pages/PreviewForm';
import MyForm from './pages/MyForm';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flex: 1 }}>Upliance Form Builder</Typography>
          <Button color="inherit" component={Link} to="/create">Create</Button>
          <Button color="inherit" component={Link} to="/preview">Preview</Button>
          <Button color="inherit" component={Link} to="/myform">My Form</Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<CreateForm />} />
        <Route path="/create" element={<CreateForm />} />
        <Route path="/preview" element={<PreviewForm />} />
        <Route path="/preview/:id" element={<PreviewForm />} />
        <Route path="/myform" element={<MyForm />} />
      </Routes>
    </>
  );
}