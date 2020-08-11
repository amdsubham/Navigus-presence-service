import React, { Component } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import FirebaseConfig from "../../API_calls/config/FirebaseConfig";
import { Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import AvatarProfile from "../../static/Avatars/ico2.png";
import {
  AppBar,
  Toolbar,
  Typography,
  Link,
  CssBaseline,
} from "@material-ui/core";
import Logo from "../../static/logo.png";
import GroupAvatars from "../avatar/Avatar";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";


const drawerWidth = 0;
const styles = (theme) => ({
  root: {
    display: "flex",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
  toolbar: {
    paddingRight: 24,

  },
  cover: {
    width: 51,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    boxShadow: "none",
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  title: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing(1),
    color: "#ffff", //EDCA53
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    spacing: 3,
  },
});

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //open: true,
      redirectToReferrer: false,
      open: false,
      openPast: false,
      AvtarStyles: [],
      lastvisit: null,
      PastAvtarStyles: [],
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleOpenPast = this.handleOpenPast.bind(this);
    this.handleClosePast = this.handleClosePast.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.ActiveUserDetails = this.ActiveUserDetails.bind(this);
    this.PastViewerDetails = this.PastViewerDetails.bind(this);
    this.logout = this.logout.bind(this);
    // this.RemoveActiveUser = this.RemoveActiveUser.bind(this);
  }
  // RemoveActiveUser() {

  // }
  logout() {
    FirebaseConfig.auth().onAuthStateChanged((user) => {
      if (user) {
        var adaRef = FirebaseConfig.database().ref("/ActiveUsers/" + user.uid);
        adaRef
          .remove()
          .then(function () {
          })
          .catch(function (error) {
          });
        // User logged in already or has just logged in.
      } else {
        // User not logged in or has just logged out.
      }
    });
    var that = this;
    FirebaseConfig.auth()
      .signOut()
      .then(
        function () {
          that.setState({ redirectToReferrer: true });
        },
        function (error) {
        }
      );
  }
  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }
  handleOpenPast() {
    this.setState({ openPast: true });
  }

  handleClosePast() {
    this.setState({ openPast: false });
  }
  // ActiveImageDetails()
  PastViewerDetails() {
    const { classes } = this.props;

    var ReturnJsx = [];
    var UserDetails = this.state.PastAvtarStyles;
    for (var i = 0; i < UserDetails.length; i++) {
      //CardPush  //avatar fullname uid
      ReturnJsx.push(
        <Card className={classes.root}>
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography component="h5" variant="h5">
                {UserDetails[i].fullname}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {UserDetails[i].lastvisit}
              </Typography>
            </CardContent>
          </div>
          <CardMedia
            className={classes.cover}
            image={AvatarProfile}
            title="Live from space album cover"
          />
        </Card>
      );
    }
    return ReturnJsx;
  }

  ActiveUserDetails() {
    const { classes } = this.props;

    var ReturnJsx = [];
    var UserDetails = this.state.AvtarStyles;
    for (var i = 0; i < UserDetails.length; i++) {
      //CardPush  //avatar fullname uid
      ReturnJsx.push(
        <Card className={classes.root}>
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography component="h5" variant="h5">
                {UserDetails[i].fullname}
              </Typography>
            </CardContent>
          </div>
          <CardMedia
            className={classes.cover}
            image={AvatarProfile}
            title="Live from space album cover"
          />
        </Card>
      );
    }
    return ReturnJsx;
  }
  componentWillMount() {
    var avatarsDetails = [];
    var pastavatarsDetails = [];
    var that = this;
    FirebaseConfig.auth().onAuthStateChanged((user) => {
      if (user) {
        var ref = FirebaseConfig.database().ref("/ActiveUsers/");
        ref.on(
          "value",
          function (snapshot) {
            var OnlineUsers = Object.keys(snapshot.val());
            for (var j = 0; j < OnlineUsers.length; j++) {
              var time = snapshot
                .child(OnlineUsers[j])
                .child("lastvisit")
                .val();
              that.setState({
                lastvisit: time,
              });
            }
            for (var i = 0; i < OnlineUsers.length; i++) {
              var refDB = FirebaseConfig.database().ref(
                "/Users Data/" + OnlineUsers[i]
              );

              refDB.on("value", function (snapshot) {
                avatarsDetails.push(snapshot.val());
                that.setState({
                  AvtarStyles: [...that.state.AvtarStyles, snapshot.val()],
                });
              });
            }
          },
          function (errorObject) {
          }
        );
        // User logged in already or has just logged in.
      } else {
        // User not logged in or has just logged out.
      }
    });
    //PastViewers
    FirebaseConfig.auth().onAuthStateChanged((user) => {
      if (user) {
        var ref = FirebaseConfig.database().ref("/PermanentView/");
        ref.on(
          "value",
          function (snapshot) {
            var pastOnlineUsers = Object.keys(snapshot.val());
            for (var i = 0; i < pastOnlineUsers.length; i++) {
              var refDB = FirebaseConfig.database().ref(
                "/Users Data/" + pastOnlineUsers[i]
              );

              refDB.on("value", function (snapshot) {
                pastavatarsDetails.push(snapshot.val());
                that.setState({
                  PastAvtarStyles: [
                    ...that.state.PastAvtarStyles,
                    snapshot.val(),
                  ],
                });
              });
            }
          },
          function (errorObject) {
          }
        );
        // User logged in already or has just logged in.
      } else {
        // User not logged in or has just logged out.
      }
    });
  }

  render() {
    if (this.state.redirectToReferrer) {
      return <Redirect to={"/login"} />;
    }
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          color="transparent"
          position="absolute"
          className={clsx(
            classes.appBar,
            this.state.open && classes.appBarShift
          )}
          style={{ margin: 0 }}
          spacing={2}
        >
          <Toolbar className={classes.toolbar}>
            <div className={classes.title}>
              <img src={Logo} width="156" />
            </div>
            <GroupAvatars />
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.handleOpen}
            >
              Present Viewers
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.handleOpenPast}
            >
              Past Viewers
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Share
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.logout}
            >
              Logout
            </Button>
          </Toolbar>
          {classes.children}
        </AppBar>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={this.state.openPast}
          onClose={this.handleClosePast}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.openPast}>
            <div className={classes.paper}>
              <h2 id="transition-modal-title">Past Viewers</h2>
              {this.PastViewerDetails()}
            </div>
          </Fade>
        </Modal>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={this.state.open}
          onClose={this.handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.open}>
            <div className={classes.paper}>
              <h2 id="transition-modal-title">Current Online Viewers</h2>
              {this.ActiveUserDetails()}
            </div>
          </Fade>
        </Modal>
      </div>
    );
  }
}
export default withStyles(styles, { withTheme: true })(Header);
