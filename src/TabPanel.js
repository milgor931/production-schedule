import React from 'react';
import { useState } from 'react';

import ProductionSchedule from './components/ProductionSchedule/PS';
import TabPanel from 'devextreme-react/tab-panel';

const Panel = (props) => {
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
            <TabPanel
                dataSource={[
                    {
                        'ID': 1,
                        'name': 'Production Schedule',
                        'component': <ProductionSchedule />
                    }, 
                    {
                        'ID': 2,
                        'name': 'Shop Drawings',
                        'component': <div></div>
                    }, 
                    {
                        'ID': 3,
                        'name': 'Takeoff Matrix',
                        'component': <div></div>
                    }, 
                    {
                        'ID': 4,
                        'name': 'Panel Matrix',
                        'component': <div></div>
                    },
                    {
                        'ID': 5,
                        'name': 'Fab Matrix',
                        'component': <div></div>
                    }, 
                    {
                        'ID': 6,
                        'name': 'All Activities',
                        'component': <div></div>
                    }, 
                    {
                        'ID': 7,
                        'name': 'Glass & Gasket',
                        'component': <div></div>
                    }, 
                    {
                        'ID': 8,
                        'name': 'Metal',
                        'component': <div></div>
                    },
                    {
                        'ID': 9,
                        'name': 'Field',
                        'component': <div></div>
                    }, 
                    {
                        'ID': 10,
                        'name': 'Shop Drawing Activity',
                        'component': <div></div>
                    },
                    {
                        'ID': 11,
                        'name': 'Sales Model Matrix',
                        'component': <div></div>
                    }, 
                    {
                        'ID': 12,
                        'name': 'VSM',
                        'component': <div></div>
                    }
                ]}
            selectedIndex={selectedIndex}
            onOptionChanged={onSelectionChanged}
            itemTitleRender={itemTitleRender}
            itemRender={itemComponentRender}
            animationEnabled={false}
            swipeEnabled={false}
        />
    </div>
    )
}

export default Panel;
