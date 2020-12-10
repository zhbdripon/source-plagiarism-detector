import React, {useState,useEffect} from 'react';
import axios from 'axios';

import { Grid } from '@material-ui/core';

import HomeMiddle from '../components/homeMiddle';
import RightSideMenu from '../components/rightSideMenu';
import LeftSideMenu from '../components/leftSideMenu';

import { makeStyles } from '@material-ui/core/styles';



const useStyles = makeStyles(theme =>({
    leftSideBar: {
        order: 0,
        [theme.breakpoints.down("xs")]: {
            order: 1
        }
    },
    rightSideBar: {
        order: 2,
    }
}));

const Home = () => {
    const [languages,setLanguages] = useState([]);
    const [selectedLanguage,setSelectedLanguage] = useState("");
    const [baseFileSelectionWarning, setBaseFileSelectionWarning] = useState(null)

    const classes = useStyles();

    useEffect(()=>{
        axios.get('http://localhost:8000/api/plagiarism-app/languages/').then(res=>{
            setLanguages(res.data);
        })
    },[])

    const handleLanguageSelect = (e) =>{
        setSelectedLanguage(e.target.value);
    }

    const handleSubmissionFileSelect = (e) =>{
        console.log('submission file');
        console.log(e.target.files);
    }
    const handleBaseFileSelect = (e) => {
        console.log('base file');
        console.log(e.target.files);
        if(e.target.files.length<2){
            setBaseFileSelectionWarning("Select Atlest two files");
        }else{
            setBaseFileSelectionWarning(e.target.files.length + " file(s) selected");
        }
    }

    const handleSubmit = () =>{
        console.log('submitting');
    }

    return (
        <Grid container direction="row" justify="center" alignItems="flex-start" spacing={2} style={{height:"500px"}}>
            <Grid item xs={12} sm={2} className={classes.leftSideBar}>
                <LeftSideMenu/>
            </Grid>
            <Grid item xs={12} sm={8}>
                <HomeMiddle
                    selectedLanguage={selectedLanguage}
                    languages={languages}
                    onLanguageSelect={e=>handleLanguageSelect(e)}
                    onSubmissionFileSelect={e=>handleSubmissionFileSelect(e)}
                    onBaseFileSelect={e => handleBaseFileSelect(e)}
                    onSubmit={handleSubmit}
                    baseFileSelectionWarning={baseFileSelectionWarning}
                />
            </Grid>
            <Grid xs={12} sm={2} item className={classes.rightSideBar}>
                <RightSideMenu/>
            </Grid>
        </Grid>
    )
}

export default Home;