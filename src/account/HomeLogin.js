import React from "react";
import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Typography,
  withStyles,
  Paper,
} from "@material-ui/core";
import isEmail from "validator/lib/isEmail";
import Logo from "../static/logo.png";
import NavigusRight from "../static/rightnavigus.jpg";
import FirebaseConfig from "../API_calls/config/FirebaseConfig";
import { Redirect } from "react-router-dom";

var passwordValidator = require("password-validator");

const styles = (theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${NavigusRight})`,
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    backgroundImage: `url(${Logo})`,
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "30%",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(1, 0, 1),
  },
  alignItemsAndJustifyContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainerLogo: {
    width: "40%",
    margin: "2rem 0",
    objectFit: "contain",
  },
});

class HomeLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      redirectToReferrer: false,
      emailAddressErr: false,
      passwordErr: false,
      formInvalidMessage: null,
    };

    this.login = this.login.bind(this);
    this.onChange = this.onChange.bind(this);
    this.userActiveTimeStamp = this.userActiveTimeStamp.bind(this);
    this.userPermanentTimeStamp = this.userPermanentTimeStamp.bind(this);
    this.PushTime = this.PushTime.bind(this);
  }
  PushTime(uid) {
    // A post entry.
    var currentdate = new Date();
    var datetime =
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear() +
      "  " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();

    return FirebaseConfig.database()
      .ref()
      .child("/Users Data/" + uid)
      .update({ lastvisit: datetime });
  }
  userActiveTimeStamp(uid) {
    this.PushTime(uid);
    var currentdate = new Date();
    var datetime =
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear() +
      "  " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();
    // A post entry.
    var postData = {
      Status: "Viewed",
      lastvisit: datetime,
    };
    var updates = {};
    updates["/ActiveUsers/" + uid] = postData;
    return FirebaseConfig.database().ref().update(updates);
  }
  userPermanentTimeStamp(uid) {
    var postData = {
      Status: "Online User",
    };
    var updates = {};
    updates["/PermanentView/" + uid] = postData;
    return FirebaseConfig.database().ref().update(updates);
  }
  login() {
    if (this.state.email && this.state.password) {
      FirebaseConfig.auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((data) => {
          this.userActiveTimeStamp(data.user.uid);
          this.userPermanentTimeStamp(data.user.uid);
          this.setState({ redirectToReferrer: true });
        })
        .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
        });
    } else {
      this.setState({ formInvalidMessage: "Please fill up all the fields" });
    }
  }
  onChange(e) {
    e.preventDefault();
    var password = new passwordValidator();
    password
      .is()
      .min(8) // Minimum length 8
      .is()
      .max(100) // Maximum length 100
      .has()
      .uppercase() // Must have uppercase letters
      .has()
      .lowercase() // Must have lowercase letters
      .has()
      .digits() // Must have digits
      .has()
      .symbols() //Must have digits
      .has()
      .not()
      .spaces() // Should not have spaces
      .is()
      .not()
      .oneOf(["Passw0rd", "Password123"]);
    switch (e.target.id) {
      case "email":
        isEmail(e.target.value)
          ? this.setState({ email: e.target.value, emailAddressErr: false })
          : this.setState({ email: null, emailAddressErr: true });
        break;
      case "password":
        password.validate(e.target.value)
          ? this.setState({ password: e.target.value, passwordErr: false })
          : this.setState({ password: null, passwordErr: true });
        break;
      default:
        break;
    }
  }

  render() {
    if (this.state.redirectToReferrer) {
      return <Redirect to={"/home"} />;
    }

    if (localStorage.getItem("userData")) {
      return <Redirect to={"/home"} />;
    }
    const { classes } = this.props;
    return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          component={Paper}
          elevation={6}
          square
          className={classes.alignItemsAndJustifyContent}
        >
          <Grid
            item
            xs={12}
            sm={8}
            md={8}
            className={classes.alignItemsAndJustifyContent}
          >
            <div className={classes.paper}>
              <Grid container>
                <img src={Logo} className={classes.imageContainerLogo} />
              </Grid>
              <Typography
                component="h1"
                variant="h5"
                style={{ marginRight: "auto", fontWeight: "700" }}
              >
                SIGN IN TO YOUR ACCOUNT
              </Typography>

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={this.state.emailAddressErr}
                helperText={
                  this.state.emailAddressErr
                    ? "Please enter a valid email"
                    : null
                }
                onChange={this.onChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={this.state.passwordErr}
                helperText={
                  this.state.passwordErr
                    ? "Please enter a valid password"
                    : null
                }
                onChange={this.onChange}
              />
              {this.state.formInvalidMessage != null ? (
                <h2 style={{ color: "red" }}>Please fill all the forms</h2>
              ) : null}
              <Button
                type="submit"
                value="Login"
                fullWidth
                variant="contained"
                style={{
                  color: "white",
                  background: "red",
                  padding: "1rem 0",
                }}
                className={classes.submit}
                disableElevation
                onClick={this.login}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link
                    href="#"
                    variant="body2"
                    style={{ fontSize: "1.2rem" }}
                    href="/create-account"
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>

        <Grid item xs={false} sm={4} md={6} className={classes.image} />
      </Grid>
    );
  }
}
export default withStyles(styles, { withTheme: true })(HomeLogin);
