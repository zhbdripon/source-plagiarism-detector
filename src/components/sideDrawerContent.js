import React from 'react';
import { List, ListItem, Divider, ListItemIcon, ListItemText } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';

const sideDrawerContent = () => (
    <div>
        <List>
            <ListItem>
                <ListItemIcon>
                    <MailIcon />
                </ListItemIcon>
                <ListItemText primary={'item 1'} />
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemIcon>
                    <MailIcon />
                </ListItemIcon>
                <ListItemText primary={'item 2'} />
            </ListItem>
        </List>
    </div>
)

export default sideDrawerContent;