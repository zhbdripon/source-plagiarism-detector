import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const styles = theme => ({
    input:{
        display: "none"
    },
    label: {
        width: "100%",
        padding: "12px 20px",
        margin: "8px 0",
        boxSizing: "border-box",
        border: "2px solid gray",
        borderRadius: "4px"
    }
});

const FileInput = props =>{
    const { classes } = props;
    return (
        <React.Fragment>
            <input 
                id="inputId"
                type="file" 
                multiple
                onChange={props.select}
                className={classes.input}/>

            <label htmlFor="inputId" className={classes.label}>
                <Typography
                    align='center'
                    variant='button'
                >{props.label}
                </Typography>
            </label>
        </React.Fragment>
    )
}

export default withStyles(styles)(FileInput);