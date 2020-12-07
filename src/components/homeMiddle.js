import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FileInput from './UI/fileInput';

import { Card, 
        CardContent, 
        Grid, 
        Button, 
        MenuItem, 
        TextField, 
        Typography } from '@material-ui/core';



const styles = theme => ({
    root: {
        width: "auto",
        borderRadius: "16px",
        border: "5px solid #00000020"
    },
    grid: {
        height: "230"
    },
    selectTextField: {
        "& .MuiSelect-outlined": {
            paddingLeft: "15px",
            paddingRight: "30px",
            paddingTop: "5px",
            paddingBottom: "5px",
        }
    }
});


const HomeMiddle = (props) =>{
    const {classes} = props;

    const languageSelectDropdown = (
        <TextField
            select
            variant='outlined'
            id='language-select'
            className={classes.selectTextField}
            value={props.seletedLanguage}
            onChange={props.onLanguageSelect}
            SelectProps={{displayEmpty: true}}
            >
            <MenuItem value="" disabled>
                <Typography variant="button" noWrap>Select Language</Typography>
            </MenuItem>
            {props.languages.map(lan => {
                return (<MenuItem key={lan} value={lan}>
                    <Typography variant="button" noWrap>{lan}</Typography>
                </MenuItem>)
            })}
        </TextField>
    )

    const sourceFileSelector = (
        <FileInput
            label={"Select source files"}
            select={(e) => { console.log(e.target.files) }}
        />
    )
    const baseFileSelector = (
        <FileInput label={"Select Base files"} />
    )

    const submitButton = (
        <Button
            variant="contained"
            color="primary"
        >Check
        </Button>
    )

    return (
        <Card variant="outlined" className={classes.root}>
            <CardContent >
                <Grid container direction="column" justify="center" alignItems="center" spacing={2} className={classes.grid}>
                    <Grid item>
                        {languageSelectDropdown}
                    </Grid>
                    <Grid item>
                        {sourceFileSelector}
                    </Grid>
                    <Grid item>
                        {baseFileSelector}
                    </Grid>
                    <Grid item>
                        {submitButton}
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default withStyles(styles)(HomeMiddle);