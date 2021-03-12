import React, {createRef, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {InputAdornment} from "@material-ui/core";
import {registerReq} from "../apis/tindog";
import ErrorDialog from "../dialogs/ErrorDialog";
import SuccessDialog from "../dialogs/SuccessDialog";
import {useHistory} from "react-router-dom";


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const phoneRe = /^\d+$/;
const emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function SignUp({onError}) {
    const classes = useStyles();

    const history = useHistory();
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [birthday, setBirthday] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorFields, setErrorFields] = useState([]);
    const [successIsOpen, setSuccessIsOpen] = useState(false);

    const isValidFields = () => {
        const fields = [username, email, phone, birthday, password, repeatedPassword];
        //check for empty
        let isValid = true;
        let errorMessage = '';

        let isEmpty = false;
        fields.forEach(field=>{
            if(field.length === 0){
                isEmpty = true;
            }
        })
        if(isEmpty){
            errorMessage+="Все поля должны быть заполнены !";
            isValid = false;
        }
        //check email
        if(!emailRe.test(email)){
            if(errorMessage.length > 0){
                errorMessage+="\n";
            }
            errorMessage+="Указан неверный формат электронной почты !";
            isValid = false;
        }
        //password validation
        if(password !== repeatedPassword){
            if(errorMessage.length > 0){
                errorMessage+="\n";
            }
            errorMessage+="Введенные пароли не совпадают !";
            isValid = false;
        }
        //email validation
        if(!isValid){
            onError(errorMessage)
        }
        return isValid
    }

    const onPhoneChange = value => {
        if(value.length <= 10 && phoneRe.test(value)){
            setPhone(value)
        }
    }

    const onRegisterClick = () => {
        if(isValidFields()){
            registerReq(username, email, phone, birthday, password)
                .then(result=>{
                    clearState();
                    history.push('/login');
                    //setSuccessIsOpen(true)
                    console.log(result)
                })
                .catch(e=> {
                    onError(e.message)
                })
        }else{

        }
    }

    const clearState = () => {
        setUserName('');
        setEmail('');
        setPhone('');
        setBirthday('');
        setPassword('');
        setRepeatedPassword('');
    }


    return (
        <Container component="main" maxWidth="xs">
            <SuccessDialog isOpen={successIsOpen} message={"Поздравляем, вы успешно зарегистрировались !"} onClose={()=>setSuccessIsOpen(false)}/>
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Регистрация
                </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="username"
                                label="Имя"
                                name="username"
                                value={username}
                                onChange={e=>setUserName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Электронная почта"
                                name="email"
                                value={email}
                                onChange={e=>setEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="phone"
                                label="Телефон"
                                id="phone"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">+7</InputAdornment>,
                                }}
                                value={phone}
                                onChange={e=>onPhoneChange(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="birthday"
                                name="birthday"
                                label="Дата рождения"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={birthday}
                                onChange={e=>setBirthday(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Пароль"
                                type="password"
                                id="password"
                                value={password}
                                onChange={e=>setPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="repeatPassword"
                                label="Повторите пароль"
                                type="password"
                                id="repeatPassword"
                                value={repeatedPassword}
                                onChange={e=>setRepeatedPassword(e.target.value)}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={onRegisterClick}
                    >
                        Зарегистрироваться
                    </Button>
                    <Typography style={{fontStyle: 'italic'}} align="justify" variant="subtitle2" >
                        Нажимая кнопку "Зарегистрироваться" Вы даёте свое согласие на обработку введенной персональной информации в соответствии с Федеральным Законом №152-ФЗ от 27.07.2006 "О персональных данных"
                    </Typography>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Уже есть аккаунт ? Войти
                            </Link>
                        </Grid>
                    </Grid>
            </div>
        </Container>
    );
}