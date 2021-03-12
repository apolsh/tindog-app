import React, {useContext} from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl,
    FormControlLabel, FormLabel, InputLabel, MenuItem,
    Radio, RadioGroup, Select,
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

const styles = theme => ({
    formControl: {
        width: '100%',
    }
})

const numRe = /^\d+$/;

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
        }
    }

    handleAcceptClick = ()=>{
        const {petName, isFemine, petBirthDate, codeKleimo, numberKleimo, rod_isConfirmed, petClub, city, dogKind} = this.state;
        const {onAddPet, onError} = this.props;

        if(this.isValidFields()){
            onAddPet(petName, isFemine, petBirthDate, codeKleimo, numberKleimo, rod_isConfirmed, petClub, city, dogKind)
        }
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

        rkfCheckReq(codeKleimo, numberKleimo)
            .then(result=> {
                this.setState({rod_isConfirmed: result.isConfirmed})
            })
            .then(e=>onError(e))
    }



    render(){
        const {cities, dogKinds, open, onClose, classes} = this.props;
        const {petName, isFemine, petBirthDate, codeKleimo, numberKleimo, rod_isConfirmed, petClub, city, dogKind} = this.state;

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
                            {rod_isConfirmed ? <CheckIcon  fontSize="large" style={{ color: 'green' }}/>
                            : <ClearIcon  fontSize="large" style={{ color: 'red' }}/>
                            }
                        </Grid>
                        <Button onClick={this.checkRkf} color="primary">
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





                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={this.handleAcceptClick} color="primary">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

}

export default withStyles(styles)(NewDogDialog)