// colorful blue #00c7d9
// dark blue #3f50b5





import React, { useState, useEffect } from 'react';
import TabPanel from './components/Navigation/TabPanel';
import Header from './components/Navigation/Header';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
  Redirect
} from "react-router-dom";
import ProductionSchedule from './components/Tabs/ProductionSchedule/PS';
import PanelMatrix from './components/Tabs/PanelMatrix/PanelMatrix';
import AllActivities from './components/Tabs/AllActivities/AllActivities';
import GlassGasket from './components/Tabs/GlassGasket/GlassGasket';
import ShopDrawings from './components/Tabs/ShopDrawings/ShopDrawings';
import TakeoffMatrix from './components/Tabs/TakeoffMatrix/TakeoffMatrix';
import FabMatrix from './components/Tabs/FabMatrix/FabMatrix';
import Metal from './components/Tabs/Metal/Metal';
import Field from './components/Tabs/Field/Field';

const tabs = [
    // {
    //     'ID': 0,
    //     'name': 'Home',
    //     'link': '/',
    //     'component': <div>Home</div>
    // },
    {
        'ID': 1,
        'name': 'Production Schedule',
        'link': '/production-schedule',
        'component': <ProductionSchedule />
    }, 
    {
        'ID': 2,
        'name': 'Shop Drawings',
        'link': '/shop-drawings',
        'component': <ShopDrawings />
    }, 
    {
        'ID': 3,
        'name': 'Takeoff Matrix',
        'link': '/takeoff-matrix',
        'component': <TakeoffMatrix />
    }, 
    {
        'ID': 4,
        'name': 'Panel Matrix',
        'link': '/panel-matrix',
        'component': <PanelMatrix />
    },
    {
        'ID': 5,
        'name': 'Fab Matrix',
        'link': '/fab-matrix',
        'component': <FabMatrix />
    }, 
    {
        'ID': 6,
        'name': 'All Activities',
        'link': '/all-activities',
        'component': <AllActivities />
    }, 
    {
        'ID': 7,
        'name': 'Glass & Gasket',
        'link': '/glass-and-gasket',
        'component': <GlassGasket />
    }, 
    {
        'ID': 8,
        'name': 'Metal',
        'link': '/metal',
        'component': <Metal />
    },
    {
        'ID': 9,
        'name': 'Field',
        'link': '/field',
        'component': <Field />
    }, 
    {
        'ID': 10,
        'name': 'Shop Drawing Activity',
        'link': '/shop-drawing-activity',
        'component': <div>shop drawing activity</div>
    },
    {
        'ID': 11,
        'name': 'Sales Model Matrix',
        'link': '/sales-model-matrix',
        'component': <div>sales model matrix</div>
    }, 
    {
        'ID': 12,
        'name': 'VSM',
        'link': '/VSM',
        'component': <div>vsm</div>
    }
]

const App = (props) => {

  const routes = tabs.map(tab => 
    <Route exact path={tab.link} component={props => tab.component}>
    </Route>
  )
  return (
      <div className="App">
          <Header tabs={tabs} />
          <TabPanel tabs={tabs}/>

          <Switch key="components">
            <Redirect exact from="/" to="/production-schedule" />  
            <div style={{margin: '3vw'}}>
                {routes}
            </div>
          </Switch>

      </div>
  );
}

export default withRouter(App);
