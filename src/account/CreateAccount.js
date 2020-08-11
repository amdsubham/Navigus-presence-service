import React, { useState } from "react";
import {Button,Avatar,CssBaseline,TextField,} from '@material-ui/core';
import isEmail from "validator/lib/isEmail";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Badge from '@material-ui/core/Badge';
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Logo from "../static/logo.png";
import NavigusRight from "../static/rightnavigus.jpg";
import FirebaseConfig from "../API_calls/config/FirebaseConfig";
import {  withStyles } from '@material-ui/core/styles';
import AvatarOne from '../static/Avatars/ico1.png';
import AvatarTwo from '../static/Avatars/ico2.png';
import AvatarThree from '../static/Avatars/ico3.png';
import AvatarFour from '../static/Avatars/ico4.png';

var passwordValidator = require("password-validator");
const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(Badge);

const useStyles = makeStyles((theme) => ({
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
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
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
  submit: {
    margin: theme.spacing(1, 0, 1),
  },
  avatarroot: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

const CreateAccount = (props) => {

  //css
  const classes = useStyles();


  //password validator
  var password = new passwordValidator();

  //if true displays loading backdrop
  const [loadIcon, setloadIcon] = React.useState(false);
  //avatar
  const [selectAvatarNo, setAvatarSelect] = React.useState(0);

  //if true redirects to login page
  // const [redirect, setRedirect] = React.useState(false);

  //if true redirects to registration page
  const [error, setError] = React.useState(false);

  //if true opens notification
  const [open, setOpen] = React.useState(false);

  const [message, setMessage] = useState({
    heading: "",
    discription: "",
    route: "",
    state: false,
  });

  //status and message to be added to notification
  const [alert, setAlert] = React.useState({
    status: "",
    message: "",
  });

  //if false error is displayed in read on InputField
  const [validation, setValidation] = useState({
    fnameExist: true,
    emailExist: true,
    isPasswordValid: true,
    passwordEqualsConfirmPass: true,

  });

  //contains the values of the input filed
  const [inputValues, setInputValues] = useState({
    fname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //Dynamic error messages on password field
  const [passwordHelperText, setPasswordHelperText] = useState("");

  //password schema
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
    .not()
    .spaces() // Must not have spaces
    .has()
    .symbols(); // Should not have spaces

  //Shows errors for making the password strong
  const validatePassword = (pass) => {
    let a = password.validate(pass, { list: true });

    if (password.validate(pass)) {
      setValidation({ ...validation, isPasswordValid: true });
      setPasswordHelperText("");
    } else {
      //Should not innclude s
      if (a.includes("spaces")) {
        setValidation({ ...validation, isPasswordValid: false });
        setPasswordHelperText("Should not contain spaces");
        return;
      } // Minimum length 8
      else if (a.includes("min")) {
        setValidation({ ...validation, isPasswordValid: false });
        setPasswordHelperText("Min 8 Character Required");
        return;
      } // Maximum length 100
      else if (a.includes("uppercase")) {
        setValidation({ ...validation, isPasswordValid: false });
        setPasswordHelperText("Must contain 1 Captial Letter");
        return;
      } // Must have digits
      else if (a.includes("digits")) {
        setValidation({ ...validation, isPasswordValid: false });
        setPasswordHelperText("Must contain 1 Numeric Value");
        return;
      } // Must not have Symbols
      else if (a.includes("symbols")) {
        setValidation({ ...validation, isPasswordValid: false });
        setPasswordHelperText("Must contain 1 Special Character");
        return;
      } //Unknown Reason
      else {
        setValidation({ ...validation, isPasswordValid: false });
        setPasswordHelperText("Enter a vaild password");
        return;
      }
    }
  };
  function userDataPost(uid, fullname, picture) {
    // A post entry.
    var postData = {
      fullname: fullname,
      uid: uid,
      avatar: picture
    };
  
    // Get a key for a new Post.
  
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/Users Data/' + uid ] = postData;
  
    return FirebaseConfig.database().ref().update(updates);
  }


  //Displays Error message if some fields are wrong
  const errorDisplay = () => {
    return (
      <Typography>
        <Box
          component={"span"}
          variant={"body2"}
          style={{
            textAlign: "left",
            color: "#ec1e27",
            marginRight: "auto",
            fontWeight: "700",
            fontSize: "16px",
          }}
        ></Box>
      </Typography>
    );
  };

  //Displays Error message of Output
  const messageDisplay = () => {
    return (
      <React.Fragment>
        <Typography component={"div"}>
          <Box
            textAlign="center"
            fontWeight="fontWeightBold"
            component={"h1"}
            variant={"h5"}
            style={{ marginRight: "auto", marginTop: 10, marginBottom: 10 }}
          >
            {message.heading}
          </Box>
          <Box
            textAlign="center"
            component={"h1"}
            variant={"h5"}
            style={{
              marginRight: "auto",
              fontWeight: "500",
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            {message.discription}
          </Box>
        </Typography>
        <Grid
          container
          style={{
            justifyContent: "center",
            paddingTop: "18px",
            borderTop: "solid 1px #ebebeb",
          }}
        >
          <Grid item>
            <Link
              href={`/${message.route}`}
              variant="body2"
              style={{ fontSize: "1.2rem" }}
            >
              <span style={{ color: "#2a2d31" }}>Click here to </span>
              <span style={{ color: "#ec1e27" }}>{`${message.route}`}</span>
            </Link>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  };

  //When Add account is clicked
  const onSubmit = async (e) => {
    //to avoid default form submition
    e.preventDefault();

    //De-Structuring of data
    let {
      fnameExist,
      emailExist,
      isPasswordValid,
      passwordEqualsConfirmPass
    } = validation;
    let {
      fname,
      email,
      password,
      confirmPassword,
    } = inputValues;

    //Checks if all fields vaild
    if (
      fnameExist &&
      emailExist &&
      isPasswordValid &&
      passwordEqualsConfirmPass &&
      fname.length !== 0 &&
      email.length !== 0 &&
      password.length !== 0 &&
      confirmPassword.length !== 0 
    ) {
      //loads loading backdrop
      setloadIcon(true);
      FirebaseConfig.auth()
        .createUserWithEmailAndPassword(
          email,
          confirmPassword
        )
        .then((data) => {
          var uid= data.user.uid
          userDataPost(uid, fname, selectAvatarNo)
          setMessage({
            heading: "THANK YOU!",
            discription: "You have successfully created your account.",
            route: "login",
            state: true,
          });
        })
        .catch(function (err) {
          setMessage({
            heading: "Error!",
            discription: "Error Creating Account",
            route: "login",
            state: true,
          });
        });

      setloadIcon(false);

    } else {
      //checks if any field is empty and throws error
      if (fname.length == 0) {
        // notification("error", "Enter Vaild First Name")
        setValidation({ ...validation, fnameExist: false });
        return;
      }
      if (isEmail(email)) {
        // notification("error", "Enter Vaild Last Name")
        setValidation({ ...validation, emailExist: false });
        return;
      }
      if (password.length == 0) {
        // notification("error", "Enter Vaild Password")
        setValidation({ ...validation, isPasswordValid: false });
        return;
      }
      if (password !== confirmPassword) {
        // notification("error", "Retype the same password")
        setValidation({ ...validation, passwordEqualsConfirmPass: false });
        return;
      }
    }
  };

  return (
    <Grid container component="main" className={classes.root}>
      {/* <Backdrop open={loadIcon} /> */}
      {/* {redirect || error ? renderRedirect() : ""} */}
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
              style={{
                marginRight: "auto",
                fontWeight: "500",
                marginTop: 10,
                marginBottom: 10,
                display: message.state ? "none" : "",
              }}
            >
              Hi there, Before you start lets get to know you better.
            </Typography>

            {message.state ? messageDisplay() : ""}

            <form className={classes.form} noValidate>
              <Grid
                container
                spacing={2}
                style={{ display: message.state ? "none" : "" }}
              >
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="fname"
                    name="fullName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="Full Name"
                    autoFocus
                    error={!validation.fnameExist}
                    helperText={
                      validation.fnameExist ? "" : "* Field is Mandatory"
                    }
                    value={inputValues.fname}
                    onChange={(e) => {
                      setInputValues({
                        ...inputValues,
                        fname: e.target.value,
                      });
                      if (e.target.value.length === 0) {
                        setValidation({ ...validation, fnameExist: false });
                      } else {
                        setValidation({ ...validation, fnameExist: true });
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={!validation.emailExist}
                helperText={
                  validation.emailExist ? "" : "* Field is Mandatory"
                }
                value={inputValues.email}
                onChange={(e) => {
                  setInputValues({
                    ...inputValues,
                    email: e.target.value,
                  });
                  if (e.target.value.length === 0) {
                    setValidation({ ...validation, emailExist: false });
                  } else {
                    setValidation({ ...validation, emailExist: true });
                  }
                }}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="PassWord"
                    variant="outlined"
                    required
                    fullWidth
                    type="password"
                    id="password_create_account"
                    label="Password"
                    error={!validation.isPasswordValid}
                    helperText={
                      !validation.isPasswordValid ? passwordHelperText : ""
                    }
                    value={inputValues.password}
                    onChange={(e) => {
                      setInputValues({
                        ...inputValues,
                        password: e.target.value,
                      });
                      validatePassword(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    type="password"
                    id="confirmPassword_create_account"
                    label="Confirm Password"
                    name="Confirm Password"
                    error={!validation.passwordEqualsConfirmPass}
                    helperText={
                      validation.passwordEqualsConfirmPass
                        ? ""
                        : "Password and Confirm Passwords don't match"
                    }
                    value={inputValues.confirmPassword}
                    onChange={(e) => {
                      setInputValues({
                        ...inputValues,
                        confirmPassword: e.target.value,
                      });

                      if (inputValues.password === e.target.value) {
                        setValidation({
                          ...validation,
                          passwordEqualsConfirmPass: true,
                        });
                      } else {
                        setValidation({
                          ...validation,
                          passwordEqualsConfirmPass: false,
                        });
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Typography>Choose Avatar</Typography>
                </Grid>

                <Grid item xs={12} sm={12} className={classes.avatarroot}>
                  <StyledBadge
                    overlap="circle"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    variant="dot"
                    invisible={selectAvatarNo==1?false:true}
                    
                  >
                    <Avatar
                      alt="Remy Sharp"
                      src= {AvatarOne}
                      onClick={()=> setAvatarSelect(1)}
                      sizes='150px'
                      
                    />
                  </StyledBadge>
                  <StyledBadge
                    overlap="circle"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    variant="dot"
                    invisible={selectAvatarNo==2?false:true}
                  >
                    <Avatar
                      alt="Remy Sharp"
                      src= {AvatarTwo}
                      onClick={()=> setAvatarSelect(2)}
                    />
                  </StyledBadge>
                  <StyledBadge
                    overlap="circle"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    variant="dot"
                    invisible={selectAvatarNo==3?false:true}
                  >
                    <Avatar
                      alt="Remy Sharp"
                      src= {AvatarThree}
                      onClick={()=> setAvatarSelect(3)}
                    />
                  </StyledBadge>
                  <StyledBadge
                    overlap="circle"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    variant="dot"
                    invisible={selectAvatarNo==4?false:true}
                  >
                    <Avatar
                      alt="Remy Sharp"
                      src= {AvatarFour}
                      onClick={()=> setAvatarSelect(4)}
                    />
                  </StyledBadge>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  container
                  alignItems="center"
                  justify="center"
                >
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    style={{
                      color: "white",
                      background: "red",
                      padding: "1rem 0",
                    }}
                    className={classes.submit}
                    disableElevation
                    onClick={(e) => {
                      onSubmit(e);
                    }}
                  >
                    Create Account
                  </Button>
                </Grid>
                <CircularProgress
                  disableShrink
                  style={{
                    display: loadIcon ? "block" : "none",
                    margin: "0 auto",
                  }}
                />
                {alert.status == "error" ? errorDisplay() : ""}
              </Grid>
            </form>
          </div>
        </Grid>
      </Grid>
      <Grid item xs={false} sm={4} md={6} className={classes.image} />
    </Grid>
  );
};

export default CreateAccount;
