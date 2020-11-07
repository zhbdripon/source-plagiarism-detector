import React, {Component} from 'react';

import { Grid } from '@material-ui/core';
import { withStyles} from '@material-ui/core/styles';

import HomeCard from '../components/homeCard';
import RightSideBar from '../components/rightSideBar';
import LeftSideBar from '../components/leftSideBar';


const styles = theme => ({
    leftSideBar: {
        order: 0,
        [theme.breakpoints.down("xs")]: {
            order: 1
        }
    },
    rightSideBar: {
        order: 2,
    }
});

class Home extends Component {
    render(){
        const { classes } = this.props;
        return (
            <Grid container direction="row" justify="center" alignItems="flex-start" spacing={2} style={{height:"500px"}}>
                <Grid item xs={12} sm={2} className={classes.leftSideBar}>
                    <LeftSideBar/>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <HomeCard />
                </Grid>
                <Grid xs={12} sm={2} item className={classes.rightSideBar}>
                    <RightSideBar/>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(Home);