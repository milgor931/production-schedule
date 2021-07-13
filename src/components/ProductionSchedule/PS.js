
import React, { useState, createRef } from 'react';
import { jobs, dependencies, resources, resourceAssignments } from '../../data.js';
import Gantt, { Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing, Toolbar, Item, Validation, ContextMenu } from 'devextreme-react/gantt';
import TabPanel from 'devextreme-react/tab-panel';
import ProductionScheduleChart from './PS_Chart.js';
import Gallery from 'devextreme-react/gallery';
import Graph from './PS_Graph.js';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import CheckBox from 'devextreme-react/check-box';
import MultiView from 'devextreme-react/multi-view';

const useStyles = makeStyles({
    root: {
      width: 500,
    },
  });

const ProductionSchedule = (props) => {

    const classes = useStyles();

    const [ selectedIndex, setSelectedIndex ] = useState(0);
    const [value, setValue] = useState(0);

    const itemTitleRender = (tab) => {
        return <span>{tab.name}</span>;
    }

    const itemComponentRender = (tab) => {
        return tab.component;
    }

    const onSelectionChanged = (selected) => {
        if (selected.name === "selectedIndex") {
            setSelectedIndex(selected.ID);
        }
    }

    return (
      <div>

        <Gallery
            id="gallery"
            dataSource={[
              {
                  'ID': 0,
                  'name': 'Production Schedule',
                  'component': <ProductionScheduleChart />
              }, 
              {
                  'ID': 1,
                  'name': 'Units Graph',
                  'component': <Graph />
              }
            ]}
            height={'auto'}
            slideshowDelay={0}
            showNavButtons={false}
            loop={false}
            showIndicator={true}
            selectedIndex={selectedIndex}
            onOptionChanged={onSelectionChanged}
            itemTitleRender={itemTitleRender}
            itemRender={itemComponentRender}
            animationEnabled={false}
            swipeEnabled={false}
            focusStateEnabled={false}
        />
      </div>
    );
}



export default ProductionSchedule;






// import React from 'react';
// import PropTypes from 'prop-types';
// import { makeStyles } from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
// import Typography from '@material-ui/core/Typography';
// import Box from '@material-ui/core/Box';
// import ProductionScheduleChart from './PS_Chart';

// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box p={3}>
//           <Typography>{children}</Typography>
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
//     id: `simple-tab-${index}`,
//     'aria-controls': `simple-tabpanel-${index}`,
//   };
// }

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//     backgroundColor: theme.palette.background.paper,
//   },
// }));

// const ProductionSchedule = (props) => {
//   const classes = useStyles();
//   const [value, setValue] = React.useState(0);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   return (
//     <div className={classes.root}>
//       <AppBar position="static">
//         <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
//           <Tab label="Schedule" {...a11yProps(0)} />
//           <Tab label="Graph" {...a11yProps(1)} />
//         </Tabs>
//       </AppBar>
//       <TabPanel value={value} index={0}>
//         <ProductionScheduleChart />
//       </TabPanel>
//       <TabPanel value={value} index={1}>
//         <Graph />
//       </TabPanel>
//     </div>
//   );
// }

// export default ProductionSchedule;
