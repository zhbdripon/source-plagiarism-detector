import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormData from 'form-data';

import {Card, 
        CardContent, 
        Grid, 
        Button, 
        MenuItem, 
        TextField, 
        Typography,
        Snackbar } from '@material-ui/core';
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from '@material-ui/core/styles';

import FileInput from './UI/fileInput';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const useStyles = makeStyles(theme => ({
    root: {
        width: "auto",
        borderRadius: "16px",
        border: "5px solid #00000020"
    },
    grid: {
        height: "auto"
    },
    selectTextField: {
        "& .MuiSelect-outlined": {
            paddingLeft: "15px",
            paddingRight: "30px",
            paddingTop: "5px",
            paddingBottom: "5px",
        }
    }
}));

const HomeMiddle = (props) =>{
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState({ name: "", value: "" });
    const [submissionFiles, setSubmissionFiles] = useState({files:[],isVaild:false,touched:false})
    const [baseFiles, setBaseFiles] = useState({ files: [], isVaild: false, touched: false})
    const [submissionUploadLabel, setSubmissionUploadLabel] = useState("Submission Files *")
    const [baseUploadLabel, setBaseUploadLabel] = useState("Base Files")
    const [snackbarData, setSnackbarData] = useState({open:false,message:"",type:null});
    const classes = useStyles();

    
    
    useEffect(() => {
        axios.get('/api/plagiarism-app/languages/').then(res => {
            setLanguages(res.data);
        })
    }, [])
    
    const handleLanguageSelect = (e) => {
        setSelectedLanguage(languages.reduce((accum, lan) => e.target.value === lan['name'] ? lan : accum, {}))
    }
    
    const validateFiles = (files,required_files) => {
        let valid = true;
        if (files.length < required_files) {
            setSnackbarData({ open: true, message: `select atleast ${required_files} files`,type:"error" });
            valid = false;
        }
        for(let file of files){
            if (file.size > 524288) {
                setSnackbarData({ open: true, message: 'file too large, max file size 512 kb', type: "error" });
                valid = false;
                break;
            }
            let re = /(?:\.([^.]+))?$/;
            let supportedExtension = selectedLanguage['extensions'];
            let fileExtension = re.exec(file.name)[1];
            let notFound = true
            for(let ext of supportedExtension){
                console.log(ext,fileExtension)
                if (ext === fileExtension) notFound = false;
            }
            if (notFound){
                console.log('extension erreo')
                setSnackbarData({ open:true, message: "please select one of these extension", type: "error" });
                valid = false;
                break;
            }
        }
        console.log(snackbarData);
        
        return valid;
    }
    
    const handleSubmissionFileSelect = (e) => {
        let file_array = Array.from(e.target.files)
        setSubmissionFiles({...submissionFiles,touched: true,files:[],isVaild:false});
        setSubmissionUploadLabel("Submission Files *");
        if (validateFiles(file_array,2)) {
            setSubmissionFiles({...submissionFiles, files: file_array, isVaild: true });
            setSubmissionUploadLabel(file_array.length + " file(s) selected");
        }
    }
    
    const handleBaseFileSelect = (e) => {
        let file_array = Array.from(e.target.files)
        setBaseFiles({ ...baseFiles, touched: true, files: [], isVaild: false });
        setBaseUploadLabel("Base Files");
        if (validateFiles(file_array, 0)) {
            setBaseFiles({...baseFiles,files: file_array,isVaild: true});
            setBaseUploadLabel(file_array.length + " file(s) selected");
        }
    }
    
    const handleSubmit = () => {
        console.log(submissionFiles)
        let formData = new FormData();
        formData.append('language', selectedLanguage['value']);
        submissionFiles.files.forEach(file => formData.append('source', file));
        baseFiles.files.forEach(file => formData.append('base', file));
        
        axios.post('/api/plagiarism-app/plagiarism/', formData, {
            ...formData.getHeaders,
            "Content-Length": formData.getLengthSync
        }).then((response) => {
            console.log(response);
        }).catch((err) => {
            console.log(err.response);
        })
    }

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarData({ ...snackbarData, open: false });
    };
    
    const languageSelectDropdown = (
        <TextField
        select
        variant='outlined'
        id='language-select'
        className={classes.selectTextField}
        value={selectedLanguage['name']}
        onChange={handleLanguageSelect}
        SelectProps={{displayEmpty: true}}
        >
            <MenuItem value="" disabled>
                <Typography variant="button" noWrap>Select Language *</Typography>
            </MenuItem>
            {languages.map(lan => {
                return (<MenuItem key={lan['name']} value={lan['name']}>
                    <Typography variant="button" noWrap>{lan['name']}</Typography>
                </MenuItem>)
            })}
        </TextField>
    )
    
    const submissionFileSelector = (
        <FileInput
        inputID="submissionFileInputId"
            label={submissionUploadLabel}
            select={e=>handleSubmissionFileSelect(e)}
            disabled={selectedLanguage['name'].length===0}
            valid={!submissionFiles['touched'] || submissionFiles['isVaild']}
        />
    )
    const baseFileSelector = (
        <FileInput 
            inputID="baseFileInputId"
            label={baseUploadLabel}
            select={e=>handleBaseFileSelect(e)}
            disabled={!submissionFiles['isVaild']}
            valid={!baseFiles['touched'] || baseFiles['isVaild']}
        />
    )

    const submitButton = (
        <Button
            variant="contained"
            color="primary"
            disabled={selectedLanguage['value'] === 0 || !submissionFiles['isVaild']}
            onClick={handleSubmit}
        >Check
        </Button>
    )

    const snackbar = (
        <Snackbar open={snackbarData['open']} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity={snackbarData['type']}>
                {snackbarData['message']}
            </Alert>
        </Snackbar>
    )

    return (
        <Card variant="outlined" className={classes.root}>
            <CardContent >
                <Grid container direction="column" justify="center" alignItems="center" spacing={2} className={classes.grid}>
                    <Grid item>
                        {languageSelectDropdown}
                    </Grid>
                    <Grid item>
                        {submissionFileSelector}
                    </Grid>
                    <Grid item>
                        {baseFileSelector}
                    </Grid>
                    <Grid item>
                        {submitButton}
                    </Grid>
                </Grid>
                {snackbar}
            </CardContent>
        </Card>
    )
}

export default HomeMiddle;