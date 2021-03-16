import React from "react";
import ListItem from "@material-ui/core/ListItem";
import {Avatar, ListItemAvatar} from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import PetsIcon from "@material-ui/icons/Pets";
import ClearIcon from "@material-ui/icons/Clear";


export default function MyDogListItem ({name, birthday, sex, image, selected, onClick, key}){

    const date = (new Date(birthday))
    let month = date.getUTCMonth() + 1; //months from 1-12
    let day = date.getUTCDate();
    let year = date.getUTCFullYear();

    day = day < 10 ? "0" + day.toString() : day;
    month = month < 10 ? "0" + month.toString() : month;

    let avatar = image? "/pets/avatar?img="+image : process.env.PUBLIC_URL + '/no-image.png';

    return (
        <ListItem key={key} onClick={onClick} selected={selected} button={!!onClick} alignItems="flex-start">
            <ListItemAvatar>
                {avatar ? <Avatar alt="dogimage" src={avatar} /> : <PetsIcon fontSize="large" style={{ color: 'gray' }}/>}
            </ListItemAvatar>
            <ListItemText
                primary={<strong>{name}</strong>}
                secondary={
                    <Typography variant="body1">
                        Дата рождения: {`${day}.${month}.${year}`}<br/>
                        Пол: {sex === 0 ? "Кобель" : "Сука"}<br/>
                    </Typography>
                }
            >
            </ListItemText>
        </ListItem>
    )
}