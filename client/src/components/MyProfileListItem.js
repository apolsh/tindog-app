import React from "react";
import ListItem from "@material-ui/core/ListItem";
import {Avatar, ListItemAvatar, ListItemIcon, makeStyles} from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';


const useStyles = makeStyles((theme) => ({
    large: {
        width: theme.spacing(6),
        height: theme.spacing(6),
    },
}));

export default function MyProfileListItem({name, image, key, onClick}) {

    const classes = useStyles();

    return (

        <ListItem button onClick={onClick}>
            <ListItemIcon>
                {image ? <Avatar className={classes.large}  alt="dogimage" src={image}/> :
                    <AccountCircleIcon fontSize="large" style={{color: 'gray'}}/>}
            </ListItemIcon>
            <ListItemText  primary={<strong>{name}</strong>} />
        </ListItem>

    )
}