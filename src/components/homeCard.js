import React from 'react';

import { Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(()=>({
    root: {
        width: "auto",
        borderRadius: "16px",
        border: "5px solid #00000020"
    },
    div: {
        textAlign: "center"
    }
}));

const HomeCard = () =>{
    const classes = useStyles();
    return (
        <Card variant="outlined" className={classes.root}>
            <div className={classes.div}>
                <CardContent>
                    <h1>Hello world</h1>
                </CardContent>
            </div>
        </Card>
    )
}

export default HomeCard;