import React, {Component} from 'react';

import { Grid } from '@material-ui/core';
import { withStyles} from '@material-ui/core/styles';

import HomeMiddle from '../components/homeMiddle';
import RightSideMenu from '../components/rightSideMenu';
import LeftSideMenu from '../components/leftSideMenu';


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
    state  = {
        homeMiddle: {
            languageSelectValue: "",
            languages: [
                'c++',
                'java',
                'python',
                
                    
            ]
        }
    }

    hangleLanguageSelect = (e) =>{
        this.setState({
            homeMiddle:{
                ...this.state.homeMiddle,
                languageSelectValue : e.target.value
            }
        })
    }

    render(){
        const { classes } = this.props;
        return (
            <Grid container direction="row" justify="center" alignItems="flex-start" spacing={2} style={{height:"500px"}}>
                <Grid item xs={12} sm={2} className={classes.leftSideBar}>
                    <LeftSideMenu/>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <HomeMiddle
                        seletedLanguage = {this.state.homeMiddle.languageSelectValue}
                        languages={this.state.homeMiddle.languages}
                        onLanguageSelect={(e)=>this.hangleLanguageSelect(e)}

                    />
                </Grid>
                <Grid xs={12} sm={2} item className={classes.rightSideBar}>
                    <RightSideMenu/>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(Home);