import React, { Component } from 'react';
import classes from './Layout.module.css';

import SideDrawerContent from '../components/sideDrawerContent';

import { AppBar, Toolbar, Button, Box, IconButton, Drawer } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';


class Layout extends Component{

    state = {
        drawerOpen : false
    }

    handleDrawerToggle = () => {
        this.setState(prevState =>({
            drawerOpen:!prevState.drawerOpen
        }))
    }

    render(){
        const appbar = (
            <AppBar position="static">
                <Toolbar>
                    <IconButton color="inherit" onClick={this.handleDrawerToggle} >
                        <MenuIcon/>
                    </IconButton >
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
                {sideDrawer}
                {appbar}
                <main>
                    {this.props.children}
                </main>
            </Box>
        )
    } 
}

export default Layout;