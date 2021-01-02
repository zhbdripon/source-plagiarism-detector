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
        Snackbar,
        CircularProgress 
    } from '@material-ui/core';
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

    const initialSubmissionFilesState = {
        label: "Submission Files *",
        files: [],
        isVaild: false,
        touched: false
    }

    const initialBaseFilesState = {
        label: "Base Files",
        files: [],
        isVaild: false,
        touched: false
    }

    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState({ name: "", value: "" });
    const [submissionFiles, setSubmissionFiles] = useState(initialSubmissionFilesState);
    const [baseFiles, setBaseFiles] = useState(initialBaseFilesState);
    const [snackbarData, setSnackbarData] = useState({open:false,message:"",type:null});
    const [runningPlagiarism, setRunningPlagiarism] = useState(false);
    const classes = useStyles();

    
    
    useEffect(() => {
        axios.get('/api/plagiarism-app/languages/').then(res => {
            setLanguages(res.data);
        })
    }, [])
    
    const handleLanguageSelect = (e) => {
        setSnackbarData({ ...snackbarData, open: false });
        setSelectedLanguage(languages.reduce((accum, lan) => e.target.value === lan['name'] ? lan : accum, {}))
    }

    const isValidFileExtension = (file) =>{
        let re = /(?:\.([^.]+))?$/;
        let supportedExtensions = selectedLanguage['extensions'];
        let fileExtension = re.exec(file.name)[1];
        for (let ext of supportedExtensions) {
            if (ext === fileExtension) return true;
        }
        return false;
    }
    
    const validateFiles = (files,required_files) => {
        let valid = true;
        let errorMessage = "";

        if (files.length < required_files) {
            errorMessage = `select atleast ${required_files} files`;
            valid = false;
        }else{
            for(let file of files){
                if (file.size > 524288) {
                    errorMessage = 'file too large, max file size 512 kb';
                    valid = false;
                }else if (!isValidFileExtension(file)){
                    errorMessage = 'Unsupported File Extension';
                    valid = false;
                }
                if(!valid)  break;
            }
        }
        if(!valid)  setSnackbarData({open:true,message:errorMessage,type:"error"})
        return valid;
    }
    
    const handleSubmissionFileSelect = (e) => {
        setSnackbarData({ ...snackbarData, open: false });
        setSubmissionFiles({ ...initialSubmissionFilesState,touched: true});
        let file_array = Array.from(e.target.files)
        if (validateFiles(file_array,2)) {
            setSubmissionFiles(prv=>({
                    ...prv,
                    label: file_array.length + " file(s) selected", 
                    files: file_array, 
                    isVaild: true,
                })
             );
        }
    }
    
    const handleBaseFileSelect = (e) => {
        setSnackbarData({ ...snackbarData, open: false });
        setBaseFiles({ ...initialBaseFilesState,touched: true});
        let file_array = Array.from(e.target.files)
        if (file_array.length>0 && validateFiles(file_array, 0)) {
            setBaseFiles(prv=>({
                    ...prv,
                    label: file_array.length + " file(s) selected",
                    files: file_array,
                    isVaild: true
                })
            );
        }
    }

    const getFormData = () =>{
        let formData = new FormData();
        formData.append('language', selectedLanguage['value']);
        submissionFiles.files.forEach(file => formData.append('source', file));
        baseFiles.files.forEach(file => formData.append('base', file));
        return formData;
    }
    
    const handleSubmit = () => {
        setSnackbarData({ ...snackbarData, open: false });
        setRunningPlagiarism(true);
        let formData = getFormData()
        let headers = {...formData.getHeaders,"Content-Length": formData.getLengthSync}

        axios.post('/api/plagiarism-app/plagiarism/', formData, headers)
            .then((response) => {
                setSnackbarData({ open: true, message: response['data']['result'], type: "success" })
                setBaseFiles({ ...initialBaseFilesState });
                setSubmissionFiles({ ...initialSubmissionFilesState });
            }).catch((err) => {
                console.log(err.response);
                let msg = "Something went wrong, Please Try again"
                setSnackbarData({ open: true, message: msg, type: "error" })
            }).finally(()=>{
                setRunningPlagiarism(false);
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
                <Typography 
                    variant="button" 
                    noWrap
                    >Select Language *
                </Typography>
            </MenuItem>
            {languages.map(lan => {
                return (
                    <MenuItem key={lan['name']} value={lan['name']}>
                        <Typography variant="button" noWrap>{lan['name']}</Typography>
                    </MenuItem>
                )
            })}
        </TextField>
    )
    
    const submissionFileSelector = (
        <FileInput
            inputID="submissionFileInputId"
            label={submissionFiles['label']}
            select={e=>handleSubmissionFileSelect(e)}
            disabled={selectedLanguage['name'].length===0}
            valid={!submissionFiles['touched'] || submissionFiles['isVaild']}
        />
    )
    const baseFileSelector = (
        <FileInput 
            inputID="baseFileInputId"
            label={baseFiles['label']}
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
        >Plagiarism
        </Button>
    )

    const gridContent = (
        <React.Fragment>
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
        </React.Fragment>
    )

    const progressCircle = (
        <CircularProgress color="primary" size={180} thickness={3} />
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
                    {runningPlagiarism?progressCircle:gridContent}
                </Grid>
                {snackbar}
            </CardContent>
        </Card>
    )
}

export default HomeMiddle;