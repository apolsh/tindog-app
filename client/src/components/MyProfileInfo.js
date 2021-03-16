import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";


export default function MyProfileInfo({userName, phone, email, birthDate}){

    const date = (new Date(birthDate))
    let month = date.getUTCMonth() + 1; //months from 1-12
    let day = date.getUTCDate();
    let year = date.getUTCFullYear();

    day = day < 10 ? "0" + day.toString() : day;
    month = month < 10 ? "0" + month.toString() : month;

    return (<List>
        <ListItem>
            <Typography variant="body1"><strong>Имя пользователя: </strong>{userName}</Typography>
        </ListItem>
        {phone ?
            <ListItem>
                <Typography variant="body1"><strong>Телефон: </strong>{`+7${phone}`}</Typography>
            </ListItem>
            :null
        }

        <ListItem>
            <Typography variant="body1"><strong>Электронная почта: </strong>{email}</Typography>
        </ListItem>
        <ListItem>
            <Typography variant="body1"><strong>Дата рождения: </strong>{`${day}.${month}.${year}`}</Typography>
        </ListItem>
    </List>)
}