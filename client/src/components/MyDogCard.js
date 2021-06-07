import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
    root: {
        maxWidth: 500,
    },
});

export default function MyDogCard({petName, isFemine, dogKind, codeKleimo, numberKleimo,
                                      rod_isConfirmed, petBirthDate, petClub, petCity, onSearchClick, avatar}) {
    const classes = useStyles();
    const date = (new Date(petBirthDate))
    let month = date.getUTCMonth() + 1; //months from 1-12
    let day = date.getUTCDate();
    let year = date.getUTCFullYear();

    day = day < 10 ? "0" + day.toString() : day;
    month = month < 10 ? "0" + month.toString() : month;

    const image = avatar ? "/pets/avatar?img=" + avatar : process.env.PUBLIC_URL + '/no-image.png'

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    alt="Contemplative Reptile"
                    image={image}
                    title="Contemplative Reptile"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {petName}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Дата рождения: </strong>{`${day}.${month}.${year}`}<br/>
                        <strong>Пол: </strong>{isFemine === 0 ? "Кобель" : "Сука"}<br/>
                        <strong>Порода: </strong>{dogKind}<br/>
                        <strong>Код клейма: </strong>{codeKleimo}<br/>
                        <strong>Номер клейма: </strong>{numberKleimo}<br/>
                        <strong>Родословная подтверждена: </strong>{rod_isConfirmed === 0 ? 'Нет' : 'Да'}<br/>
                        <strong>Клуб: </strong>{petClub}<br/>
                        <strong>Город: </strong>{petCity}<br/>
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Grid container
                      direction="row"
                      justify="space-between" >
                    <Grid item>
                        <Button disabled={true} size="small" color="secondary">
                            Убрать из поиска
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button onClick={onSearchClick} size="small" color="primary">
                            Перейти к поиску партнёра
                        </Button>
                    </Grid>
                </Grid>


            </CardActions>
        </Card>
    );
}