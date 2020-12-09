import React, {Component} from 'react';
import axios from 'axios';

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
            selectedLanguage:"",
            languages: []
        },
        baseFileSelectionWarning:null
    }

    componentDidMount() {
        axios.get('http://localhost:8000/api/plagiarism-app/languages/').then(res=>{
            this.setState({
                homeMiddle:{
                    ...this.state.homeMiddle,
                    languages:res.data
                }
            })
        })
    }
    

    handleLanguageSelect = (e) =>{
        this.setState({
            homeMiddle:{
                ...this.state.homeMiddle,
                selectedLanguage : e.target.value
            }
        })
    }

    handleSubmissionFileSelect = (e) =>{
        console.log('submission file');
        console.log(e.target.files);
    }
    handleBaseFileSelect = (e) => {
        console.log('base file');
        console.log(e.target.files);
        if(e.target.files.length<2){
            this.setState({ baseFileSelectionWarning:"Select Atlest two files"})
        }else{
            this.setState({ baseFileSelectionWarning: e.target.files.length+" file(s) selected" })
        }
    }

    handleSubmit = () =>{
        console.log('submitting');
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
                        selectedLanguage={this.state.homeMiddle.selectedLanguage}
                        languages={this.state.homeMiddle.languages}
                        onLanguageSelect={e=>this.handleLanguageSelect(e)}
                        onSubmissionFileSelect={e=>this.handleSubmissionFileSelect(e)}
                        onBaseFileSelect={e => this.handleBaseFileSelect(e)}
                        onSubmit={this.handleSubmit}
                        baseFileSelectionWarning={this.state.baseFileSelectionWarning}
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