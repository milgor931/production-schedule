
import React, { useState, createRef } from 'react';
import { jobs, dependencies, resources, resourceAssignments } from '../../data.js';
import Gantt, { Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing, Toolbar, Item, Validation, ContextMenu } from 'devextreme-react/gantt';
import TabPanel from 'devextreme-react/tab-panel';
import ProductionScheduleChart from './PS_Chart.js';
import ProductionScheduleGantt from './PS_Gantt.js';
import Gallery from 'devextreme-react/gallery';
import Graph from './PS_Graph.js';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import TableChartIcon from '@material-ui/icons/TableChart';
import CheckBox from 'devextreme-react/check-box';
import MultiView from 'devextreme-react/multi-view';
import { Switch, View } from 'react-view-switch';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


// gantt chart view
// tooltip for gallery view

const useStyles = makeStyles({
    root: {
      width: 500,
    },
  });

const ProductionSchedule = (props) => {
    const [ selectedIndex, setSelectedIndex ] = useState();

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
                    'name': 'Gantt Chart',
                    'component': <ProductionScheduleGantt />
                },
                {
                    'ID': 1,
                    'name': 'Production Schedule',
                    'component': <ProductionScheduleChart />
                }, 
                {
                    'ID': 2,
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
