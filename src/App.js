import React from 'react';
import './App.css';

import { Button, Grid } from '@material-ui/core';

import Layout from './hoc/Layout'

function App() {
  return (
      <Layout>
          <h1>Hello world</h1>
      <Grid container spacing={4} justify="center">
          <Grid container item xs={12} sm={4} spacing={3}>
            <Button variant="contained" color="primary" fullWidth={true}>Sample Button</Button>
          </Grid>
          <Grid container item xs={12} sm={4} spacing={3} >
            <Button variant="contained" color="primary" fullWidth={true}>Sample Button</Button>
          </Grid>
          <Grid container item xs={12} sm={4} spacing={3}>
            <Button variant="contained" color="primary" fullWidth={true} >Sample Button</Button>
          </Grid>
        </Grid>
      </Layout>
  );
}

export default App;
