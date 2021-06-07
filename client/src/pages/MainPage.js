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
import {
    addLike,
    addDisLike,
    addPetReq,
    citiesDirReq,
    dogKindsDirReq, getLikesReq, getMatchesReq, getChatsReq,
    getUserPetsReq,
    searchCandidatesReq,
    userInfoReq, getChatLinesReq, sendChatMessageByChatId, getChatIdReq
} from "../apis/tindog";
import MyProfileInfo from "../components/MyProfileInfo";
import MyProfileListItem from "../components/MyProfileListItem";
import SearchModeTabs from "../components/SearchModeTabs";
import CandidateCard from "../components/CandidateCard";
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import ClearIcon from "@material-ui/icons/Clear";
import ChatBox from "../components/chat/ChatBox";
import RefreshIcon from '@material-ui/icons/Refresh';

const drawerWidth = 400;

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
    const [petCandidates, setPetCandidates] = React.useState([]);
    const [viewedCandidateIndex, setViewedCandidateIndex] = React.useState(0);
    const [candidatesAreOver, setCandidatesAreOver] = React.useState(false);
    const [likes, setLikes] = React.useState([]);
    const [matches, setMatches] = React.useState([]);
    const [chats, setChats] = React.useState([]);
    const [searchModeTab, setSearchModeTab] = React.useState(null);
    const [selectedPetItemListId, setSelectedPetItemListId] = React.useState(0);
    const [searchModeSelectedPet, setSearchModeSelectedPet] = React.useState(null);
    const [chatMessages, setChatMessages] = React.useState([]);
    const [forceUpdateIndex, setForceUpdateIndex] = React.useState(null);

    const auth = useContext(AuthContext);

    useEffect(()=>{
        userInfoReq(auth.token)
            .then(userData=> {
                setUser(userData);
            })
            .catch(e=> {
                if(e.code === "NOT_AUTHORIZED"){
                    auth.logout();
                }
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

    const addPet = (petName, isFemine, petBirthDate, codeKleimo, numberKleimo, rod_isConfirmed, petClub, city, dogKind, avatar) => {
        addPetReq(petName, isFemine, petBirthDate, codeKleimo, numberKleimo, rod_isConfirmed, petClub, city, dogKind, avatar, auth.token)
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

    const onTabChange = tabIndex => {
        setSelectedPetItemListId(0);
        setSearchModeSelectedPet(null);
        const selectedPet = userPets[selectedPetIndex]
        setSearchModeTab(tabIndex);

        switch (tabIndex){
            //update candidates
            case 0:
                searchCandidatesReq(selectedPet.petProfile_id, auth.token)
                    .then(r => setPetCandidates(r))
                break;
            //update matches
            case 1:
                getMatchesReq(selectedPet.petProfile_id, auth.token)
                    .then(r=>setMatches(r))
                break;
            //update chats
            case 2:
                getChatsReq(selectedPet.petProfile_id, auth.token)
                    .then(r=>{
                        setChats(r);
                        if(r){
                            getChatLinesReq(r[0].chat_id, auth.token)
                                .then(messages=>{
                                    setChatMessages(messages);
                                })
                        }
                    })
                break;
            //update likes
            case 3:
                getLikesReq(selectedPet.petProfile_id, auth.token)
                    .then(r => setLikes(r))
                break;
        }
    };

    const handleSearchModeTabListItemClick = (index, item)=>{
        setSelectedPetItemListId(index);
        setSearchModeSelectedPet(item);
    }

    const forceUpdateMode = (index, updateCallback)=>{
        updateCallback(index);
    }

    const drawer = (
        <div>
            <div className={classes.toolbar}>
            </div>
            <Divider />
            {isProfileMode ?             <div>
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
                    <IconButton disabled={true} className={classes.petControlIcons} color="secondary" aria-label="upload picture" component="span">
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
                        image={pet.petAvatar}
                    />)}
                </List>
            </div>
            :
                <div>
                    <List>
                        <MyProfileListItem onClick={()=>setIsProfileMode(true)} key={user.userName} image={undefined} name={user.userName}/>
                        <Divider />
                        {userPets.length ?
                            <MyDogListItem
                                key={userPets[selectedPetIndex].petProfile_id}
                                name={userPets[selectedPetIndex].petName}
                                birthday={userPets[selectedPetIndex].petBirthDate}
                                sex={userPets[selectedPetIndex].isFemine}
                                image={userPets[selectedPetIndex].petAvatar}
                                onClick={()=>{
                                    setIsProfileMode(true)
                                }  }
                            /> : null
                        }
                        <Divider/>
                        <div style={{textAlign:'center'}}>
                            <Button
                                onClick={()=>setSearchModeTab(-1)}
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                startIcon={<RefreshIcon />}
                            >
                                Обновить
                            </Button>
                        </div>
                            <Divider/>
                        <SearchModeTabs petLikes={likes}
                                        chats={chats}
                                        petMatches = {matches}
                                        setSearchModeTab = {setSearchModeTab}
                                        onTabChange={onTabChange}
                                        selectedPetItemListId = {selectedPetItemListId}
                                        handleSearchModeTabListItemClick={handleSearchModeTabListItemClick}
                                        setSelectedPetItemListId={setSelectedPetItemListId}
                                        searchModeSelectedIPet={searchModeSelectedPet}
                                        setSearchModeSelectedPet={setSearchModeSelectedPet}
                                        forceUpdateIndex={forceUpdateIndex}
                                        setForceUpdateIndex={setForceUpdateIndex}
                        />
                    </List>
                </div>
            }
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    function logout() {
        auth.logout();
    }

    const onSearchClick = () => {

        const selectedPet = userPets[selectedPetIndex]

        setIsProfileMode(false);
        searchCandidatesReq(selectedPet.petProfile_id, auth.token)
            .then(r => setPetCandidates(r))
        //
        // getLikesReq(selectedPet.petProfile_id, auth.token)
        //     .then(r => setLikes(r))
        //
        // getMatchesReq(selectedPet.petProfile_id, auth.token)
        //     .then(r=>setMatches(r))
        //
        // getChatsReq(selectedPet.petProfile_id, auth.token)
        //     .then(r=>setChats(r))
    }

    const renderSelectedPet = (selectedPet)=>{
        const dogKind = dogKindsDir.find(kind=>kind.sprDogKind_id === selectedPet.dogKind_id);
        const dogCity = citiesDir.find(city=>city.city_id === selectedPet.petCity_id)

        return(
        <MyDogCard
            petName={selectedPet.petName}
            isFemine={selectedPet.isFemine}
            dogKind={dogKind.nameRus}
            codeKleimo={selectedPet.codeKleimo}
            numberKleimo={selectedPet.numberKleimo }
            rod_isConfirmed={selectedPet.rod_isConfirmed}
            petBirthDate={selectedPet.petBirthDate}
            petClub={selectedPet.petClub}
            petCity={dogCity.cityName}
            avatar={selectedPet.petAvatar}
            onSearchClick = {onSearchClick}
        />)
    }

    const nextCandidate = () => {
        let newCandidateIndex = viewedCandidateIndex + 1;
        if(newCandidateIndex >= petCandidates.length){
            setCandidatesAreOver(true);
        }else{
            setViewedCandidateIndex(newCandidateIndex)
        }
    }

    const onLikeClick = (likeRecieverId) => {
        const selectedPet = userPets[selectedPetIndex]
        const likeSenderId = selectedPet.petProfile_id;
        addLike(likeSenderId, likeRecieverId, auth.token)
            .then(()=>{})
            .catch(e=>onError(e.message))
        //set like
        nextCandidate();
    }

    const onSendMessage = (message) => {
        const selectedChatId = chats[selectedPetItemListId].chat_id;
        const selectedPet = userPets[selectedPetIndex]
        const disLikeSenderId = selectedPet.petProfile_id;


        sendChatMessageByChatId(selectedChatId, disLikeSenderId, message, auth.token)
            .then(response=>{
                getChatLinesReq(selectedChatId, auth.token)
                    .then(messages=>{
                        setChatMessages(messages);
                    })
            })
    }

    const onDislikeClick = (disLikeRecieverId) => {
        //set dislike
        //работает только со списком поиска - потому что массив здесь userPets
        const selectedPet = userPets[selectedPetIndex]
        const disLikeSenderId = selectedPet.petProfile_id;
        addDisLike(disLikeSenderId, disLikeRecieverId, auth.token)
            .then(()=>{})
            .catch(e=>onError(e.message))
        nextCandidate();
    }

    const onDislikeClickFromLikes = (disLikeRecieverId) => {
        //set dislike
        //работает только со списком лайков
        //исправить
        const selectedPet = likes[selectedPetItemListId]
        const disLikeSenderId = selectedPet.petProfile_id;
        addDisLike(disLikeSenderId, disLikeRecieverId, auth.token)
            .then(()=>{})
            .catch(e=>onError(e.message))
    }

    const onDislikeClickFromMatches = (disLikeRecieverId) => {
        //set dislike
        //работает только со списком матчей
        //исправить
        const selectedPet = matches[selectedPetItemListId]
        const disLikeSenderId = selectedPet.petProfile_id;
        addDisLike(disLikeSenderId, disLikeRecieverId, auth.token)
            .then(()=>{})
            .catch(e=>onError(e.message))
    }

    const getChatId = (candidateId) => {
        const selectedPet = userPets[selectedPetIndex]
        const myPetId = selectedPet.petProfile_id;

        getChatIdReq(myPetId, candidateId, auth.token)
            .then(result=>{
                console.log(result);
                setForceUpdateIndex(2);
            })
            .catch(e=>onError(e.message))

    }

    const renderCandidate = () => {
        //исправить
        switch (searchModeTab){
            case 0:
                if(petCandidates.length > 0){
                    const candidate = petCandidates[viewedCandidateIndex]

                    if(candidatesAreOver){
                        return <Typography variant="h3">Увы, кандидаты закончились</Typography>
                    }
                    return (
                        <CandidateCard petName={candidate.petName}
                                       petProfile_id={candidate.petProfile_id}
                                       codeKleimo={candidate.codeKleimo}
                                       numberKleimo={candidate.numberKleimo}
                                       rod_isConfirmed={candidate.rod_isConfirmed}
                                       petBirthDate={candidate.petBirthDate}
                                       onLikeClick={onLikeClick}
                                       onDislikeClick={onDislikeClick}
                                       avatar={candidate.petAvatar}
                                       searchModeTabIndex={searchModeTab}
                        />
                    )
                }else{
                    return <Typography  variant="h3">Увы, не удалось найти кандидатов</Typography>
                }
            case 1:
                if(matches.length > 0){
                    const matchSelected = matches[selectedPetItemListId]
                    return(
                        <CandidateCard petName={matchSelected.petName}
                                       petProfile_id={matchSelected.petProfile1_id}
                                       codeKleimo={matchSelected.codeKleimo}
                                       numberKleimo={matchSelected.numberKleimo}
                                       rod_isConfirmed={matchSelected.rod_isConfirmed}
                                       petBirthDate={matchSelected.petBirthDate}
                                       onLikeClick={onLikeClick}
                                       onDislikeClick={onDislikeClickFromMatches}
                                       avatar={matchSelected.petAvatar}
                                       searchModeTabIndex={searchModeTab}
                                       getChatId={getChatId}
                        />
                    )
                }else{
                    return <Typography  variant="h3">Увы, у вашего питомца еще нет сопадений</Typography>
                }
            case 2:
                let selectedPet = userPets ? userPets[selectedPetIndex].petProfile_id : null;
                return <ChatBox onSendMessage={onSendMessage} chatMessages={chatMessages} owner={selectedPet} sendMessageCb={console.log} getChatLinesCallback={console.log}/>
                break;
            case 3:
                if (likes.length > 0) {
                    const likePetSelected = likes[selectedPetItemListId]
                    return (
                        <CandidateCard petName={likePetSelected.petName}
                                       petProfile_id={likePetSelected.petProfile_id}
                                       codeKleimo={likePetSelected.codeKleimo}
                                       numberKleimo={likePetSelected.numberKleimo}
                                       rod_isConfirmed={likePetSelected.rod_isConfirmed}
                                       petBirthDate={likePetSelected.petBirthDate}
                                       onLikeClick={onLikeClick}
                                       onDislikeClick={onDislikeClickFromLikes}
                                       avatar={likePetSelected.petAvatar}
                                       searchModeTabIndex={searchModeTab}
                        />
                    )
                } else {
                    return <Typography variant="h3">Увы, у вашего питомца еще нет лайков</Typography>
                }

        }}


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
                        {isProfileMode ? "Профиль" : "Карточки питомцев"}
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
                <Grid container alignItems="center" justify="center">
                    {isProfileMode ?                     <Grid item>
                        {userPets.length > 0 && citiesDir.length > 0 && dogKindsDir.length>0 ? renderSelectedPet(userPets[selectedPetIndex]) : null}
                    </Grid>
                    :
                        <Grid item>
                            {renderCandidate()}
                            {/*chatbox */}
                            {/*<Grid item>*/}
                            {/*    <ChatBox sendMessageCb={console.log} getChatLinesCallback={console.log}/>*/}
                            {/*</Grid>*/}
                        </Grid>
                    }



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