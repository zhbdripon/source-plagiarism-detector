import React from 'react';

import { Card, CardContent, Grid, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import FileInput from './UI/fileInput';


const styles = theme => ({
    root: {
        width: "auto",
        borderRadius: "16px",
        border: "5px solid #00000020"
    },
    grid: {
        height: "200px"
    }
});

const HomeMiddle = (props) =>{
    const {classes} = props;
    return (
        <Card variant="outlined" className={classes.root}>
            <CardContent >
                <Grid container direction="column" justify="center" alignItems="center" spacing={4} className={classes.grid}>
                    <Grid item>
                        <FileInput 
                        label={"Select source files"}
                        select={(e)=>{console.log(e.target.files)}}
                        />
                    </Grid>
                    <Grid item>
                        <FileInput label={"Select Base files"} />
                    </Grid>
                    <Grid item>
                        <Button
                            style={{marginTop:"-10px"}} 
                            variant="contained" 
                            color="primary"
                            >Check
                        </Button>

                    </Grid>

                </Grid>
            </CardContent>
        </Card>
    )
}

export default withStyles(styles)(HomeMiddle);