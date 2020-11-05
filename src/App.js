import React from 'react';
import './App.css';

import { Button } from '@material-ui/core';

import Layout from './hoc/Layout'

function App() {
  return (
      <Layout>
          <h1>Hello world</h1>
          <Button variant="contained" color="primary">Sample Button</Button>
      </Layout>
  );
}

export default App;
