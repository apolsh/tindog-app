import React from "react";
import Paper from '@material-ui/core/Paper';
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import SendIcon from '@material-ui/icons/Send';
import {getChatLinesReq} from "../../apis/tindog";

function prettyDataPrint(rawDate){
    const t = rawDate;
    const date = ('0' + t.getDate()).slice(-2);
    const month = ('0' + (t.getMonth() + 1)).slice(-2);
    const year = t.getFullYear();
    const hours = ('0' + t.getHours()).slice(-2);
    const minutes = ('0' + t.getMinutes()).slice(-2);
    const seconds = ('0' + t.getSeconds()).slice(-2);
    return `${date}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
}

const style = {
    root:{
        width:500,
    },
    table: {
        minWidth: 650,
    },
    chatSection: {
        width: '100%',
        height: '80vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    }
}

class ChatBox extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            messageValue:""
        }
    }

    componentDidMount() {
        const {getChatLinesCallback, petId} = this.props;
        //
        // getChatLinesCallback(petId)
        //     .then(response=>{
        //         this.setState({chatMessages : response})
        //     })
    }

    renderChatItem(messageId, isOwner, chatText, chatTime){
        return <ListItem key={messageId}>
            <Grid container>
                <Grid item xs={12}>
                    <ListItemText align={isOwner ? "right" : "left"} primary={chatText}/>
                </Grid>
                <Grid item xs={12}>
                    <ListItemText align={isOwner ? "right" : "left"} secondary={prettyDataPrint(new Date(chatTime))}/>
                </Grid>
            </Grid>
        </ListItem>
    }

    onSendMessage= ()=>{
        this.props.onSendMessage(this.state.messageValue);
        this.setState({messageValue:""})
    }

    render(){
        const {classes, chatMessages,owner, sendMessageCallback} = this.props;
        const {messageValue} = this.state;

        return (<div className={classes.root}>
            <Grid container component={Paper} className={classes.chatSection}>
                <Grid item xs={12}>
                    <List className={classes.messageArea}>
                        {chatMessages.map(chatMessage=>this.renderChatItem(chatMessage.chatLine_id, chatMessage.chatLinePetProfile_id===owner, chatMessage.chatLineMessage, chatMessage.chatLineCreated_at))}
                    </List>
                    <Divider />
                    <Grid container style={{padding: '20px'}}>
                        <Grid item xs={11}>
                            <TextField value={messageValue} onChange={e=>this.setState({messageValue:e.target.value})} id="outlined-basic-email" label="Написать сообщение" fullWidth />
                        </Grid>
                        <Grid xs={1} align="right">
                            <Fab onClick={this.onSendMessage} color="primary" aria-label="add" ><SendIcon /></Fab>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>)
    }
}

export default withStyles(style)(ChatBox);