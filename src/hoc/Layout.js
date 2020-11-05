import React, { Component } from 'react';
import classes from './Layout.module.css';

import {AppBar, Toolbar, Button, Box, IconButton} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

class Layout extends Component{

    render(){
        const appbar = (
            <AppBar position="static">
                <Toolbar>
                    <IconButton color="inherit" >
                        <MenuIcon />
                    </IconButton >
                    <section className={classes.appbarRight}>
                        <Button color="inherit" >Login</Button>
                    </section>
                </Toolbar>
            </AppBar>
        )

        return (
            <Box>
                {appbar}
                {this.props.children}
            </Box>
        )
    } 
}

export default Layout;