import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';

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

            <label htmlFor="inputId">
                <Button
                    variant="outlined"
                    component="span">
                    <Typography
                        variant="button"
                        noWrap>
                        {props.label}
                    </Typography>
                </Button>
            </label>
        </React.Fragment>
    )
}

export default withStyles(styles)(FileInput);