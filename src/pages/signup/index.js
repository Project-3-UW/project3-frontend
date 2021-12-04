import {
    FormControlLabel,
    FormGroup,
    Switch,
    TextField,
    Button,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
  } from "@material-ui/core";
  import { useAlert } from "react-alert";
  import { Box } from "@material-ui/system";
  import styles from "./styles.module.css";
  import { Link, useNavigate } from "react-router-dom";
  import { useEffect, useState } from "react";
  import { signUp } from "./service/request";
  import { getLocation } from "../../utils/location";
  import { API } from "../../utils/API"
  
  const SignUp = () => {
    const navigate = useNavigate();
    
    // eslint-disable-next-line
  
    const alert = useAlert();
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [babyAge, setBabyAge] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [position, setPosition] = useState([]);
    const [allowLocation, setAllowLocation] = useState(true);
    const [bio, setBio] = useState("")
    
    useEffect(() => {
      if (allowLocation) {
        getLocation()
          .then((pos) => {
            setPosition(pos);
            console.log(pos);
          })
          .catch((err) => {
            alert.error(err);
          });
      } else {
        setPosition([]);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allowLocation]);
  
    const handleSubmit = async () => {
      if (!firstname || !lastname || !email || !password) {
        alert.error("Please enter all fields!");
        return;
      }
      if (password.length < 8) {
        alert.error("Password length must more than eight!");
        return;
      }
      if (password !== confirmedPassword) {
        alert.error("Password is not same as confirm password!!");
        return;
      }
      try {
        await API.signup(
          firstname,
          lastname,
          email,
          password,
          position[0],
          position[1]
        );
        alert.success("Success to sign up!!");
        setTimeout(() => {
          navigate("/signin");
        }, 1000);
      } catch (err) {
        // const errors = err.response.data.err.errors;
        console.log(err)
        // if (errors[0] && errors[0].message) {
        //   alert.error(errors[0].message);
        // }
        //alert.error(err.response.data);
      }
    };
  
    return (
      <div className={styles.wrapper}>
        <Box marginTop="40px">
          <Typography variant="h2" component="div" gutterBottom>
            Sign Up
          </Typography>
        </Box>
        <Box width="400px" marginTop="20px">
          <TextField
            fullWidth
            label="First name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            variant="outlined"
          />
        </Box>
        <Box width="400px" marginTop="20px">
          <TextField
            fullWidth
            label="Last name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            variant="outlined"
          />
        </Box>
        <Box width="400px" marginTop="20px">
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            variant="outlined"
          />
        </Box>
        <Box width="400px" marginTop="20px">
          <TextField
            fullWidth
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            variant="outlined"
          />
        </Box>
        <Box width="400px" marginTop="20px">
          <TextField
            fullWidth
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            label="Confirm Password"
            type="password"
            variant="outlined"
          />
        </Box>
        <Box width="400px" marginTop="20px">
          <TextField
            fullWidth
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            variant="outlined"
            multiline
            rows={2}
            rowsMax={4}
          />
        </Box>

        <Box width="400px" marginTop="20px">
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  defaultChecked={true}
                  value={allowLocation}
                  onChange={(e) => setAllowLocation(e.target.checked)}
                />
              }
              label="Share Location"
            />
          </FormGroup>
        </Box>
        
        <Box width="400px" marginTop="10px" display="flex" gap="10px">
          <Typography variant="body2">Already has Account?</Typography>
          <Link to="/signin">Login</Link>
        </Box>

        <Box width="400px" marginTop="40px">
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </Box>
      </div>
    );
  };
  
  export default SignUp;
  