import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import List from "@material-ui/core/List";
import MyDogListItem from "./MyDogListItem";
import Hidden from '@material-ui/core/Hidden';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function SearchModeTabs({petLikes, petMatches, chats, onTabChange, setSearchModeTab, selectedListItem, handleSearchModeTabListItemClick,
                                           selectedPetItemListId, searchModeSelectedPet, setSearchModeSelectedPet, forceUpdateIndex, setForceUpdateIndex,
                                           setSelectedPetItemListId}) {

    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const [selectedPetIndex, setSelectedPetIndex] = useState(-1);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        onTabChange(newValue);
        setSearchModeTab(newValue);
        if(forceUpdateIndex!=null){
            forceUpdateIndex=null;
            setForceUpdateIndex(null);
        }
    };

    if(forceUpdateIndex!=null && value !==2){
        handleChange(null, forceUpdateIndex);
    }

    return (
        <div className={classes.root} key={new Date().getMilliseconds()}>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                    <Tab style={{minWidth:70}} label="Поиск" {...a11yProps(0)} />
                    <Tab style={{minWidth:85}} label="Совпадения" {...a11yProps(1)} />
                    <Tab style={{minWidth:75}} label="Чаты" {...a11yProps(2)} />
                    <Tab style={{minWidth:90}} label="Поклонники" {...a11yProps(3)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <Typography>
                    Вам нравится этот питомец? Выберите вашу реакцию.
                </Typography>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <List component="nav"  aria-label="main mailbox folders">
                    {petMatches.map((pet,index)=>{
                        if(index===0 && !searchModeSelectedPet){
                            setSearchModeSelectedPet(pet);
                        }

                        return <MyDogListItem
                            //selected={selectedPetItemListId === index}
                            onClick={()=>handleSearchModeTabListItemClick(index, pet.petProfile_id)}
                            key={pet.petProfile1_id}
                            name={pet.petName}
                            birthday={pet.petBirthDate}
                            sex={pet.isFemine}
                            image={pet.petAvatar}
                            selected={index===selectedPetItemListId}
                        />
                    })}
                </List>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <List component="nav"  aria-label="main mailbox folders">
                    {chats.map((pet,index)=>{
                        if(index===0 && !searchModeSelectedPet){
                            setSearchModeSelectedPet(pet);
                        }

                        return <MyDogListItem
                            //selected={selectedPetItemListId === index}
                            onClick={()=>handleSearchModeTabListItemClick(index, pet.petProfile_id)}
                            key={pet.petProfile_id}
                            name={pet.petName}
                            birthday={pet.petBirthDate}
                            sex={pet.isFemine}
                            image={pet.petAvatar}
                            selected={index===selectedPetItemListId}
                        />
                    })}
                </List>
            </TabPanel>
            <TabPanel value={value} index={3}>
                <List component="nav"  aria-label="main mailbox folders">
                    {petLikes.map((pet,index)=>{
                        if(index===0 && !searchModeSelectedPet){
                            setSearchModeSelectedPet(pet);
                        }

                        return <MyDogListItem
                            //selected={selectedPetIndex === index}
                            onClick={()=>handleSearchModeTabListItemClick(index, pet.petProfile_id)}
                            key={pet.petProfile_id}
                            name={pet.petName}
                            birthday={pet.petBirthDate}
                            sex={pet.isFemine}
                            image={pet.petAvatar}
                            selected={index===selectedPetItemListId}
                        />
                    })}
                </List>
            </TabPanel>
        </div>
    );
}