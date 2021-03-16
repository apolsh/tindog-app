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
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from '@material-ui/icons/Favorite';
import ClearIcon from '@material-ui/icons/Clear';
import {getDefaultDateString} from "../utils/date";

const useStyles = makeStyles({
    root: {
        maxWidth: 500,
    },
});

export default function CandidateCard({petName, codeKleimo, numberKleimo, rod_isConfirmed, petBirthDate, onLikeClick, onDislikeClick, avatar }) {
    const classes = useStyles();

    const birthdayDate = getDefaultDateString(petBirthDate);

    const image = avatar ? "/pets/avatar?img=" + avatar : process.env.PUBLIC_URL + '/no-image.png'

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    alt="Contemplative Reptile"
                    height="500"
                    image={image}
                    title="Contemplative Reptile"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {petName}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Дата рождения: </strong>{birthdayDate}<br/>
                        <strong>Клеймо: </strong>{`${codeKleimo} ${numberKleimo}`}<br/>
                        <strong>Родословная подтверждена: </strong>{rod_isConfirmed === 0 ? 'Нет' : 'Да'}<br/>
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Grid container
                      direction="row"
                      justify="space-between" >
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            startIcon={<ClearIcon  />}
                            onClick={onDislikeClick}
                        >
                            Не нравится
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            startIcon={<FavoriteIcon  />}
                            onClick={onLikeClick}
                        >
                            Нравится
                        </Button>
                    </Grid>
                </Grid>


            </CardActions>
        </Card>
    );
}