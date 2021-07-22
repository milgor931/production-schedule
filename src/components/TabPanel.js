import React from 'react';
import { useState } from 'react';

import ProductionSchedule from './ProductionSchedule/PS';
// import TabPanel from 'devextreme-react/tab-panel';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink
} from "react-router-dom"

const useStyles = makeStyles((theme) => ({
    link: {
        color: '#3f50b5',
        textDecoration: 'none',
        fontSize: '15px'
    },
    links: {
        listStyleType: 'none',
        // border: '1px solid #ccc',
    },
    linkContainer: {
        padding: '1vw',
    }
}));

const TabPanel = (props) => {
    const classes = useStyles();

    const links = props.tabs.map((tab, index) => 
        <Grid item key={index} className={classes.linkContainer}>
            <NavLink 
                className={classes.link} 
                to={tab.link}
                activeStyle={{
                    fontWeight: "bold",
                    color: "#002884"
                }}
            >
                {tab.name}
            </NavLink>
        </Grid>
    )

    return (
        <Paper elevation={5}>
            <Grid container direction="row" justifyContent="space-evenly"  alignItems="center" className={classes.links}>
                {links}
            </Grid>
        </Paper>
    )
}

export default TabPanel;

// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`full-width-tabpanel-${index}`}
//       aria-labelledby={`full-width-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box p={3}>
//           {children}
//         </Box>
//       )}
//     </div>
//   );
// }

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.any.isRequired,
//   value: PropTypes.any.isRequired,
// };

// function a11yProps(index) {
//   return {
//     id: `full-width-tab-${index}`,
//     'aria-controls': `full-width-tabpanel-${index}`,
//   };
// }

// const useStyles = makeStyles((theme) => ({
//   root: {
//     backgroundColor: theme.palette.background.paper,
//     width: '100%',
//     marginTop: 500
//   },
// }));

// export default function FullWidthTabs() {
//     const classes = useStyles();
//     const theme = useTheme();
//     const [value, setValue] = React.useState(0);
//     const [ tabsArray, setTabsArray ] = useState([
//         {
//             'ID': 1,
//             'name': 'Production Schedule',
//             'component': <ProductionSchedule />
//         }, 
//         {
//             'ID': 2,
//             'name': 'Shop Drawings',
//             'component': <div></div>
//         }, 
//         {
//             'ID': 3,
//             'name': 'Takeoff Matrix',
//             'component': <div></div>
//         }, 
//         {
//             'ID': 4,
//             'name': 'Panel Matrix',
//             'component': <div></div>
//         },
//         {
//             'ID': 5,
//             'name': 'Fab Matrix',
//             'component': <div></div>
//         }, 
//         {
//             'ID': 6,
//             'name': 'All Activities',
//             'component': <div></div>
//         }, 
//         {
//             'ID': 7,
//             'name': 'Glass & Gasket',
//             'component': <div></div>
//         }, 
//         {
//             'ID': 8,
//             'name': 'Metal',
//             'component': <div></div>
//         },
//         {
//             'ID': 9,
//             'name': 'Field',
//             'component': <div></div>
//         }, 
//         {
//             'ID': 10,
//             'name': 'Shop Drawing Activity',
//             'component': <div></div>
//         },
//         {
//             'ID': 11,
//             'name': 'Sales Model Matrix',
//             'component': <div></div>
//         }, 
//         {
//             'ID': 12,
//             'name': 'VSM',
//             'component': <div></div>
//         }
//     ])

    
//     const tabs = tabsArray.map((tab, index) => 
//         <Tab key={index} label={tab.name}  />
//     )

//     const tabPanels = tabsArray.map((tab, index) => 
//         <TabPanel key={index} value={index} index={index} dir={theme.direction}>
//           {tab.component}
//         </TabPanel>
//     )

//     const handleChange = (event, newValue) => {
//         setValue(newValue);
//     };

//     const handleChangeIndex = (index) => {
//         setValue(index);
//     };

//     return (
//     <div className={classes.root}>
//       <AppBar position="static" color="default">
//         <Tabs
//           value={value}
//           onChange={handleChange}
//           indicatorColor="primary"
//           textColor="primary"
//           variant="fullWidth"
//           aria-label="full width tabs example"
//         >
//           {tabs}
//         </Tabs>
//       </AppBar>
//       <SwipeableViews
//         axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
//         index={value}
//         onChangeIndex={handleChangeIndex}
//       >
//         {tabPanels}
//       </SwipeableViews>
//     </div>
//   );
// }

// const Panel = (props) => {
//     const [ selectedIndex, setSelectedIndex ] = useState(0);

//     const itemTitleRender = (tab) => {
//         return <span>{tab.name}</span>;
//     }

//     const itemComponentRender = (tab) => {
//         return tab.component;
//     }

//     const onSelectionChanged = (selected) => {
//         if (selected.name === "selectedIndex") {
//             setSelectedIndex(selected.ID);
//         }
//     }
//     return (
//         <div>
//             <TabPanel
//                 dataSource={[
//                     {
//                         'ID': 1,
//                         'name': 'Production Schedule',
//                         'component': <ProductionSchedule />
//                     }, 
//                     {
//                         'ID': 2,
//                         'name': 'Shop Drawings',
//                         'component': <div></div>
//                     }, 
//                     {
//                         'ID': 3,
//                         'name': 'Takeoff Matrix',
//                         'component': <div></div>
//                     }, 
//                     {
//                         'ID': 4,
//                         'name': 'Panel Matrix',
//                         'component': <div></div>
//                     },
//                     {
//                         'ID': 5,
//                         'name': 'Fab Matrix',
//                         'component': <div></div>
//                     }, 
//                     {
//                         'ID': 6,
//                         'name': 'All Activities',
//                         'component': <div></div>
//                     }, 
//                     {
//                         'ID': 7,
//                         'name': 'Glass & Gasket',
//                         'component': <div></div>
//                     }, 
//                     {
//                         'ID': 8,
//                         'name': 'Metal',
//                         'component': <div></div>
//                     },
//                     {
//                         'ID': 9,
//                         'name': 'Field',
//                         'component': <div></div>
//                     }, 
//                     {
//                         'ID': 10,
//                         'name': 'Shop Drawing Activity',
//                         'component': <div></div>
//                     },
//                     {
//                         'ID': 11,
//                         'name': 'Sales Model Matrix',
//                         'component': <div></div>
//                     }, 
//                     {
//                         'ID': 12,
//                         'name': 'VSM',
//                         'component': <div></div>
//                     }
//                 ]}
//             selectedIndex={selectedIndex}
//             onOptionChanged={onSelectionChanged}
//             itemTitleRender={itemTitleRender}
//             itemRender={itemComponentRender}
//             animationEnabled={false}
//             swipeEnabled={false}
//         />
//     </div>
//     )
// }

// export default Panel;
