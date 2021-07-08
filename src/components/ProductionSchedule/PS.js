
import React, { useState, createRef } from 'react';
import { tasks, dependencies, resources, resourceAssignments } from '../../data.js';
import Gantt, { Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing, Toolbar, Item, Validation, ContextMenu } from 'devextreme-react/gantt';
import TabPanel from 'devextreme-react/tab-panel';
import ProductionScheduleChart from './PS_Chart.js';
import Gallery from 'devextreme-react/gallery';
import Graph from './PS_Graph.js';


const ProductionSchedule = (props) => {

    const [ selectedIndex, setSelectedIndex ] = useState(0);

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
            height={'100%'}
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
