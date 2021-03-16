import React, {useContext} from "react";
import {
    Avatar,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl,
    FormControlLabel, FormLabel, InputLabel, ListItemAvatar, MenuItem,
    Radio, RadioGroup, Select, Typography,
    withStyles
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import {addPetReq, rkfCheckReq} from "../apis/tindog";
import {AuthContext} from "../context/AuthContext";
import PetsIcon from "@material-ui/icons/Pets";
import ListItem from "@material-ui/core/ListItem";

const styles = theme => ({
    formControl: {
        width: '100%',
    }
})

const numRe = /^\d+$/;

const cleanState = {
    petName:'',
    isFemine:'0',
    petBirthDate:'',
    codeKleimo:'',
    numberKleimo:'',
    rod_isConfirmed: 0,
    petClub: '',
    city:'',
    dogKind:'',
    isRkfChecking: false
}

class NewDogDialog extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            petName:'',
            isFemine:'0',
            petBirthDate:'',
            codeKleimo:'',
            numberKleimo:'',
            rod_isConfirmed: 0,
            petClub: '',
            city:'',
            dogKind:'',
            avatar: null,
            avatarUrl: null,
            isRkfChecking: false
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
            const { open } = this.props;
            if (prevProps.open !== open && open===true) {
                this.clearState();
            }
    }


    handleAcceptClick = ()=>{
        const {petName, isFemine, petBirthDate, codeKleimo, numberKleimo, rod_isConfirmed, petClub, city, dogKind, avatar} = this.state;
        const {onAddPet, onError} = this.props;

        if(this.isValidFields()){
            onAddPet(petName, isFemine, petBirthDate, codeKleimo, numberKleimo, rod_isConfirmed, petClub, city, dogKind, avatar)
        }
    }

    clearState = () => {
        this.setState({    petName:'',
            isFemine:'0',
            petBirthDate:'',
            codeKleimo:'',
            numberKleimo:'',
            rod_isConfirmed: 0,
            petClub: '',
            city:'',
            dogKind:'',
            avatar: null,
            avatarUrl: null,
            isRkfChecking: false})
    }

    isValidFields = () => {
        const {petName, isFemine, petBirthDate, codeKleimo, numberKleimo, rod_isConfirmed, petClub, city, dogKind} = this.state;
        const {onError} = this.props;


        const checkForEmptyFields = [petName, petBirthDate, city, dogKind]
        //check for empty
        let isValid = true;
        let errorMessage = '';

        let isEmpty = false;
        checkForEmptyFields.forEach(field=>{
            if(field.length === 0){
                isEmpty = true;
            }
        })
        if(isEmpty){
            errorMessage+="Поля: кличка, порода, дата рождения, код клейма, номер клейма, город должны быть заполнены !";
            isValid = false;
        }
        if(!isValid){
            onError(errorMessage)
        }
        return isValid
    }

    handleCodeKleimoChange = (value)=>{
        if(value.length === 0 || value.length <=3){
            this.setState({codeKleimo: value})
        }
    }

    handleNumberKleimoChange = (value)=>{
        if(value.length === 0 || numRe.test(value)){
            this.setState({numberKleimo: value})
        }
    }

    checkRkf = () =>{
        const {codeKleimo, numberKleimo} = this.state;
        const {onError} = this.props;

        this.setState({isRkfChecking: true})
        rkfCheckReq(codeKleimo, numberKleimo)
            .then(result=> {
                this.setState({rod_isConfirmed: result.isConfirmed})
            })
            .catch(e=>onError(e))
            .finally(()=>this.setState({isRkfChecking: false}))
    }

    renderRkfStatus(){
        const {rod_isConfirmed} = this.state;

        if(rod_isConfirmed){
            return <CheckIcon  fontSize="large" style={{ color: 'green' }}/>
        }
        return <ClearIcon  fontSize="large" style={{ color: 'red' }}/>
    }

    handleCloseBtn = () => {
        const { onClose } = this.props;
        onClose();
        // this.clearState();
    }

    handleAvatarChange = (event) =>{
        const file = event.target.files[0]
        const reader = new FileReader();
        this.setState({avatar: file})
        reader.onload = e => {
            this.setState({avatarUrl: reader.result})
        }
        reader.readAsDataURL(file);
    }


    render(){
        const {cities, dogKinds, open, onClose, classes} = this.props;
        const {petName, isFemine, petBirthDate, codeKleimo, numberKleimo, rod_isConfirmed, petClub, city, dogKind, isRkfChecking, avatar, avatarUrl} = this.state;

        return (
            <Dialog disableBackdropClick={true} open={open} onClose={onClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Добавить нового питомца</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="petName"
                                label="Кличка"
                                name="petName"
                                value={petName}
                                onChange={e=>this.setState({petName: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="demo-simple-select-outlined-label">Порода</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={dogKind}
                                    onChange={(e)=>this.setState({dogKind:e.target.value})}
                                    label="Порода"
                                >
                                    {dogKinds.map(dogKind=><MenuItem key={dogKind.sprDogKind_id} value={dogKind.sprDogKind_id}>{dogKind.nameRus}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Пол:</FormLabel>
                                <RadioGroup aria-label="gender" name="gender1" value={isFemine} onChange={(event)=>this.setState({isFemine: event.target.value})}>
                                    <FormControlLabel value="0" control={<Radio />} label="Кобель" />
                                    <FormControlLabel value="1" control={<Radio />} label="Сука" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="petBirthDate"
                                name="petBirthDate"
                                label="Дата рождения"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={petBirthDate}
                                onChange={e=>this.setState({petBirthDate: e.target.value})}
                            />
                        </Grid>
                        <Divider/>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="codeKleimo"
                                label="Код клейма"
                                name="codeKleimo"
                                value={codeKleimo}
                                onChange={e=>this.handleCodeKleimoChange(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={7}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="numberKleimo"
                                label="Номер клейма"
                                name="numberKleimo"
                                value={numberKleimo}
                                onChange={e=>this.handleNumberKleimoChange(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            {isRkfChecking ? <CircularProgress /> : this.renderRkfStatus() }
                        </Grid>
                        <Button disabled={numberKleimo.length === 0 || codeKleimo.length === 0} onClick={this.checkRkf} color="primary">
                            Проверить клеймо
                        </Button>
                        <Divider/>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="petClub"
                                label="Клуб"
                                name="petClub"
                                value={petClub}
                                onChange={e=>this.setState({petClub: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="demo-simple-select-outlined-label">Город</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={city}
                                    onChange={(e)=>this.setState({city:e.target.value})}
                                    label="City"
                                >
                                    {
                                        cities.map(city=><MenuItem key={city.city_id} value={city.city_id}>{city.cityName}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>Добавьте фотографию питомца:</Typography>
                        </Grid>
                        <Grid item xs={12} sm={3} style={{textAlign: 'center'}}>
                            <ListItemAvatar>
                                {avatar ? <Avatar alt="dogimage" src={avatarUrl} /> : <PetsIcon fontSize="large" style={{ color: 'gray' }}/>}
                            </ListItemAvatar>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <input onChange={this.handleAvatarChange} type="file"/>
                        </Grid>





                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCloseBtn} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={this.handleAcceptClick} disabled={isRkfChecking} color="primary">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

}

export default withStyles(styles)(NewDogDialog)