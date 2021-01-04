import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormData from 'form-data';

import {
    Card,
    CardContent,
    Grid,
    Button,
    MenuItem,
    TextField,
    Typography,
    Snackbar,
    CircularProgress,
} from '@material-ui/core';
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from '@material-ui/core/styles';

import CloudDoneOutlinedIcon from '@material-ui/icons/CloudDoneOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

import FileInput from './UI/fileInput';


const useStyles = makeStyles({
    card: {
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
    },
    successAlert: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "150px"
    },
    cardResult: {
        backgroundColor: "#25DE2B20"
    },
    successTypography: {
        color: "#17511a"
    },
    successIcon: {
        color: "#17511a",
        fontSize: "4.5rem"
    }
});

const HomeMiddle = (props) => {

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
    const [snackbarData, setSnackbarData] = useState({ open: false, message: "", type: null });
    const [plagiarismStatus, setPlagiarismStatus] = useState({ running: false, result: null });
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

    const isValidFileExtension = (file) => {
        let re = /(?:\.([^.]+))?$/;
        let supportedExtensions = selectedLanguage['extensions'];
        let fileExtension = re.exec(file.name)[1];
        for (let ext of supportedExtensions) {
            if (ext === fileExtension) return true;
        }
        return false;
    }

    const validateFiles = (files, required_files) => {
        let valid = true;
        let errorMessage = "";

        if (files.length < required_files) {
            errorMessage = `select atleast ${required_files} files`;
            valid = false;
        } else {
            for (let file of files) {
                if (file.size > 524288) {
                    errorMessage = 'file too large, max file size 512 kb';
                    valid = false;
                } else if (!isValidFileExtension(file)) {
                    errorMessage = 'Unsupported File Extension';
                    valid = false;
                }
                if (!valid) break;
            }
        }
        if (!valid) setSnackbarData({ open: true, message: errorMessage, type: "error" })
        return valid;
    }

    const handleSubmissionFileSelect = (e) => {
        setSnackbarData({ ...snackbarData, open: false });
        setSubmissionFiles({ ...initialSubmissionFilesState, touched: true });
        let file_array = Array.from(e.target.files)
        if (validateFiles(file_array, 2)) {
            setSubmissionFiles(prv => ({
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
        setBaseFiles({ ...initialBaseFilesState, touched: true });
        let file_array = Array.from(e.target.files)
        if (file_array.length > 0 && validateFiles(file_array, 0)) {
            setBaseFiles(prv => ({
                ...prv,
                label: file_array.length + " file(s) selected",
                files: file_array,
                isVaild: true
            })
            );
        }
    }

    const getFormData = () => {
        let formData = new FormData();
        formData.append('language', selectedLanguage['value']);
        submissionFiles.files.forEach(file => formData.append('source', file));
        baseFiles.files.forEach(file => formData.append('base', file));
        return formData;
    }

    const handleSubmit = () => {
        setSnackbarData({ ...snackbarData, open: false });
        setPlagiarismStatus({ running: true, result: null });
        let formData = getFormData()
        let headers = { ...formData.getHeaders, "Content-Length": formData.getLengthSync }

        axios.post('/api/plagiarism-app/plagiarism/', formData, headers)
            .then((response) => {
                setPlagiarismStatus(prv => ({ ...prv, result: response['data']['result'] }));
                setBaseFiles({ ...initialBaseFilesState });
                setSubmissionFiles({ ...initialSubmissionFilesState });
            }).catch((err) => {
                console.log(err.response);
                let msg = "Something went wrong, Please Try again"
                setSnackbarData({ open: true, message: msg, type: "error" })
            }).finally(() => {
                setPlagiarismStatus(prv => ({ ...prv, running: false }));
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
            SelectProps={{ displayEmpty: true }}
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
            select={e => handleSubmissionFileSelect(e)}
            disabled={selectedLanguage['name'].length === 0}
            valid={!submissionFiles['touched'] || submissionFiles['isVaild']}
        />
    )
    const baseFileSelector = (
        <FileInput
            inputID="baseFileInputId"
            label={baseFiles['label']}
            select={e => handleBaseFileSelect(e)}
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

    let gridContent = (
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
        <React.Fragment>
            <CircularProgress color="primary" size={150} thickness={3} />
            <Typography>Plagiarism Running...</Typography>
        </React.Fragment>
    )


    const snackbar = (
        <Snackbar
            open={snackbarData['open']}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}>
            <MuiAlert
                elevation={6}
                variant="filled"
                onClose={handleSnackbarClose}
                severity={snackbarData['type']} >
                {snackbarData['message']}
            </MuiAlert>
        </Snackbar>
    )

    if (plagiarismStatus.result) {
        gridContent = (
            <React.Fragment>
                <span style={{ width: "100%" }} onClick={() => { setPlagiarismStatus(prv=>({...prv,result:null})) }}>
                    <CancelOutlinedIcon style={{ float: "right" }} />
                </span>
                <CloudDoneOutlinedIcon className={classes.successIcon}></CloudDoneOutlinedIcon>
                <Typography className={classes.successTypography}>Plagiarism Completed</Typography>
                <a href={plagiarismStatus['result']} target="_blank" rel="noopener noreferrer" ><strong><u>check out the result!</u></strong></a>
            </React.Fragment>
        )
    }

    return (
        <Card variant="outlined" className={classes.card}>
            <CardContent className={plagiarismStatus.result ? classes.cardResult : null}>
                <Grid container direction="column" justify="center" alignItems="center" spacing={2} className={classes.grid}>
                    {plagiarismStatus.running ? progressCircle : gridContent}
                </Grid>
                {snackbar}
            </CardContent>
        </Card>
    )
}

export default HomeMiddle;