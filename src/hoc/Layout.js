import React, { Component } from 'react';

import {AppBar,
        Toolbar, 
        Button, 
        Box, 
        IconButton, 
        Drawer, 
        Hidden } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { withStyles } from '@material-ui/core/styles';

import SideDrawerContent from '../components/sideDrawerContent';

const styles = theme => ({
    appbarRight:{
        marginLeft: "auto",
        marginRight: "-12px"
    }
});

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
        const { classes } = this.props;
        const appbar = (
            <AppBar position="sticky" >
                <Toolbar>
                    <Hidden smUp>
                        <IconButton  color="inherit" onClick={this.handleDrawerToggle} >
                            <MenuIcon/>
                        </IconButton >
                    </Hidden>
                    <Hidden xsDown>
                        <p>Plagiarism detector</p>                
                    </Hidden>
            
                    <section className={classes.appbarRight}>
                        <Hidden xsDown>
                            <Button color="inherit" >Classroom</Button>
                        </Hidden>
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

export default withStyles(styles)(Layout);