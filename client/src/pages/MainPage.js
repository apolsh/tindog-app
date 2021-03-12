import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import PetsIcon from '@material-ui/icons/Pets';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import {Avatar, ListItemAvatar} from "@material-ui/core";
import MyDogCard from "../components/MyDogCard";
import Grid from "@material-ui/core/Grid";
import MyDogListItem from "../components/MyDogListItem";
import NewDogDialog from "../dialogs/NewDogDialog";
import Button from "@material-ui/core/Button";
import {AuthContext} from "../context/AuthContext";
import {addPetReq, citiesDirReq, dogKindsDirReq, getUserPetsReq, userInfoReq} from "../apis/tindog";
import MyProfileInfo from "../components/MyProfileInfo";

const drawerWidth = 340;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        }
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    petControlIcons:{
        marginLeft:20,
        marginRight:20
    }
}));

const emptyUser = {
    userName:'',
    email:'',
    phone:'',
    birthDate:''
}


function MainPage(props) {
    const onError = props.onError;
    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [user, setUser] = React.useState(emptyUser);
    const [newDogIsOpen, setNewDogIsOpen] = React.useState(false);
    const [isProfileMode, setIsProfileMode] = React.useState(true);
    const [citiesDir, setCitiesDir] = React.useState([]);
    const [dogKindsDir, setDogKindsDir] = React.useState([]);
    const [userPets, setUserPets] = React.useState([])
    const [selectedPetIndex, setSelectedPetIndex] = React.useState(0);

    const auth = useContext(AuthContext);

    useEffect(()=>{
        userInfoReq(auth.token)
            .then(userData=> {
                setUser(userData);
            })
            .catch(e=> {
                onError(e.message)
            })

        citiesDirReq()
            .then(result=>{
                console.log(result)
                setCitiesDir(result)
            })
            .catch(e=>onError(e.message))

        dogKindsDirReq()
            .then(result=>{
                console.log(result)
                setDogKindsDir(result)
            })
            .catch(e=>onError(e.message))

        updateUserPetList();


    },[])

    const updateUserPetList = ()=>{
        getUserPetsReq(auth.token)
            .then(result=>{
                console.log(result)
                setUserPets(result)
            })
            .catch(e=>onError(e.message))
    }

    const addPet = (petName, isFemine, petBirthDate, codeKleimo, numberKleimo, rod_isConfirmed, petClub, city, dogKind) => {
        addPetReq(petName, isFemine, petBirthDate, codeKleimo, numberKleimo, rod_isConfirmed, petClub, city, dogKind, auth.token)
            .then(result=>{
                console.log(result);
                updateUserPetList();
            })
            .catch(e=>onError(e))
            .finally(()=>setNewDogIsOpen(false))
    }

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    useEffect(() => {
    },[selectedPetIndex, dogKindsDir]);

    const handlePetListItemClick = (event, index) => {
        setSelectedPetIndex(index);
    };

    const drawer = (
        <div>
            <div className={classes.toolbar}>
            </div>
            <Divider />
            <MyProfileInfo
                userName={user.userName}
                phone={user.phone}
                email={user.email}
                birthDate={user.birthDate}
                />
            <Divider />
            <Typography variant="h6" noWrap style={{width:'100%', textAlign:'center'}}>
                 <PetsIcon/>
                Мои питомцы:
                <PetsIcon/>
            </Typography>
            <div style={{textAlign:'center'}}>
                <IconButton onClick={()=>setNewDogIsOpen(true)} className={classes.petControlIcons} color="primary" aria-label="upload picture" component="span">
                    <AddCircleOutlineIcon />
                </IconButton>
                <IconButton className={classes.petControlIcons} color="secondary" aria-label="upload picture" component="span">
                    <DeleteIcon />
                </IconButton>
            </div>
            <List component="nav"  aria-label="main mailbox folders">
                {userPets.map((pet,index)=><MyDogListItem
                    selected={selectedPetIndex === index}
                    onClick={()=>setSelectedPetIndex(index)}
                    key={pet.petProfile_id}
                    name={pet.petName}
                    birthday={pet.petBirthDate}
                    sex={pet.isFemine}
                    image={undefined}
                />)}
            </List>

        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    function logout() {
        auth.logout();
    }

    const renderSelectedPet = (selectedPet)=>{
        const dogKind = dogKindsDir.find(kind=>kind.sprDogKind_id === selectedPet.dogKind_id);
        const dogCity = citiesDir.find(city=>city.city_id === selectedPet.petCity_id)

        return(
        <MyDogCard
            petName={selectedPet.petName || ''}
            isFemine={selectedPet.isFemine || ''}
            dogKind={dogKind.nameRus || ''}
            codeKleimo={selectedPet.codeKleimo || ''}
            numberKleimo={selectedPet.numberKleimo || ''}
            rod_isConfirmed={selectedPet.rod_isConfirmed || ''}
            petBirthDate={selectedPet.petBirthDate || ''}
            petClub={selectedPet.petClub || ''}
            petCity={dogCity.cityName || ''}
        />)
    }

    return (


        <div className={classes.root}>
            <NewDogDialog onAddPet={addPet} onError={onError} cities={citiesDir} dogKinds={dogKindsDir} open={newDogIsOpen} onClose={()=>setNewDogIsOpen(false)}/>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar style={{justifyContent:'space-between'}} className={classes.toolbar}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        {isProfileMode ? "Профиль" : "Поиск"}
                    </Typography>
                    <Button color="inherit" onClick={logout}>Выйти</Button>
                </Toolbar>

            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Grid container justify="center">
                    <Grid item>
                        {userPets.length > 0 && citiesDir.length > 0 && dogKindsDir.length>0 ? renderSelectedPet(userPets[selectedPetIndex]) : null}
                    </Grid>
                </Grid>

            </main>
        </div>
    );
}

MainPage.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default MainPage;