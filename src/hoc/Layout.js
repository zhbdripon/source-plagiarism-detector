import React, { Component } from 'react';
import classes from './Layout.module.css';

import {AppBar,
        Toolbar, 
        Button, 
        Box, 
        IconButton, 
        Drawer, 
        Hidden } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
    
import SideDrawerContent from '../components/sideDrawerContent';


class Layout extends Component{

    state = {
        showDrawer : false,
    }

    handleDrawerToggle = () => {
        this.setState(prevState =>({
            drawerOpen:!prevState.drawerOpen
        }))
    }

    render(){
        const appbar = (
            <AppBar position="sticky" >
                <Toolbar>
                    <Hidden smUp>
                        <IconButton  color="inherit" onClick={this.handleDrawerToggle} >
                            <MenuIcon/>
                        </IconButton >
                    </Hidden>
                    <section className={classes.appbarRight}>
                        <Button color="inherit" >Login</Button>
                    </section>
                </Toolbar>
            </AppBar>
        )

        const sideDrawer = (
            <Drawer 
                anchor={'left'} 
                open={this.state.drawerOpen} 
                variant={'temporary'}
                ModalProps={{ onBackdropClick: this.handleDrawerToggle}}>
                <SideDrawerContent/>
            </Drawer>
        )

        return (
            <Box>
                {appbar}
                {sideDrawer}
                <main>
                    {this.props.children}
                </main>
            </Box>
        )
    } 
}

export default Layout;