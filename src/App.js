import React, { useState, useEffect } from 'react';
import TabPanel from './components/TabPanel';
import Header from './components/Navigation/Header';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
  Redirect
} from "react-router-dom";
import { useHistory } from 'react-router-dom'
import ProductionSchedule from './components/ProductionSchedule/PS';

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
        'component': <div>shop drawings</div>
    }, 
    {
        'ID': 3,
        'name': 'Takeoff Matrix',
        'link': '/takeoff-matrix',
        'component': <div>takeoff matrix</div>
    }, 
    {
        'ID': 4,
        'name': 'Panel Matrix',
        'link': '/panel-matrix',
        'component': <div>panel matrix</div>
    },
    {
        'ID': 5,
        'name': 'Fab Matrix',
        'link': '/fab-matrix',
        'component': <div>fab matrix</div>
    }, 
    {
        'ID': 6,
        'name': 'All Activities',
        'link': '/all-activities',
        'component': <div>all activities</div>
    }, 
    {
        'ID': 7,
        'name': 'Glass & Gasket',
        'link': '/glass-and-gasket',
        'component': <div>glass and gasket</div>
    }, 
    {
        'ID': 8,
        'name': 'Metal',
        'link': '/metal',
        'component': <div>metal</div>
    },
    {
        'ID': 9,
        'name': 'Field',
        'link': '/field',
        'component': <div>field</div>
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
  const [ tabIndex, setTabIndex ] = useState(0);
  const history = useHistory();
  const [ pathname, setPathname ] = useState("/production-schedule");

  useEffect(() => {
    
  }, [ ]) 

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
            {routes}
          </Switch>

      </div>
  );
}

export default withRouter(App);
