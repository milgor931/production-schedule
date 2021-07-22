import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

const Header = (props) => {
  const classes = useStyles();
  const { tabs } = props;
  const [ title, setTitle ] = useState("");

  useEffect(() => {
    if (tabs) {
      let i = tabs.findIndex(tab => tab.link === window.location.pathname);
      tabs[i].name && setTitle(tabs[i].name);
    } 
  }, [ props ])

  return (
    <div className={classes.root}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {/* {title} */}
            Production Schedule
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;