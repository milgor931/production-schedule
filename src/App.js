// colorful blue #00c7d9
// dark blue #3f50b5

// database call --> passes props down through app ( only 1 database call at the start )
// pass down handlers
// fix takeoff matrix

// add shop ---> default colorkey error 


import React, { useState, useEffect } from 'react';
import TabPanel from './components/Navigation/TabPanel';
import Header from './components/Navigation/Header';
import {
  BrowserRouter as Router,
  Switch,
  Route,
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
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';

const tabs = [
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
    }
]

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: '100px'
    },
});

const App = () => {
    const classes = useStyles();
    const [ progress, setProgress ] = useState(0);
    const [ loaded, setLoaded ] = useState(false);
    const [ jobs, setJobs ] = useState([]);
    const [ shops, setShops ] = useState([]);
    const [ shopDrawingHeaders, setShopDrawingHeaders ] = useState([]);
    const [ fabHeaders, setFabHeaders ] = useState([]);
    const [ dateRows, setDateRows ] = useState([]);
    const [ takeoffHeaders, setTakeoffHeaders ] = useState([]);

    useEffect(() => {

        axios.get(`https://ww-production-schedule-default-rtdb.firebaseio.com/data.json`)
        .then(response => {
            if (response.data) {
                response.data.shops && setShops(Object.values(response.data.shops).sort((x, y) => { return x.index - y.index }));
                convertDates(Object.values(response.data.jobs));
                setShopDrawingHeaders(Object.values(response.data.shopdrawings.headers));
                setFabHeaders(Object.values(response.data.fabmatrix.headers));
                createRows();
                setTakeoffHeaders(Object.values(response.data.takeoffmatrix.headers));

                setProgress(100);
            }
        })
        .catch(error => console.log(error))

    }, [])

    useEffect(() => {
        progress >= 100 && setLoaded(true);
    }, [ progress ])

    const toMS = (days) => {
        return days * 24 * 60 * 60 * 1000;
    }

    const toDays = (ms) => {
        return Math.ceil( ms / (24 * 60 * 60 * 1000) );
    }

    const convertDates = (updatedJobs) => {
        updatedJobs.forEach(job => {
            job.start = new Date(job.start);
            job.fieldStart = new Date(job.fieldStart);

            let time = job.weeks * 7 * 24 * 60 * 60 * 1000;
            time = job.start.getTime() + time;
            job.end = new Date(time);
        })

        updatedJobs.sort(function(a,b) {
            return a.start.getTime() - b.start.getTime();
        })

        updatedJobs.forEach(job => getOffset(job, updatedJobs[0]));

        setJobs(updatedJobs);

        return updatedJobs;
    }
  
    const getOffset = (job, firstJob) => {
        let days = toDays(job.start.getTime());
        job.offset = Math.ceil((days - toDays(firstJob.start.getTime()))/7);
    }

    const handleUpdate = (row) => {
        row = row.data ? row.data : row;

        let copy = [...jobs];

        let index = copy.findIndex(job => job.id === row.id )

        copy[index]= row;

        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/jobs/${row.id}.json`, row)
        .then(response => {
            setJobs(copy);
        })
        .catch(error => alert(error))
    }

    const handleShopUpdate = (row) => {

        let copy = [...jobs];
        
        copy.filter(job => job.groupKey === row.data.__KEY__).forEach(job => {
            job.shop = row.data.shop
            handleUpdate(job)
        })

        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/shops/${row.data.__KEY__}.json`, row.data)
        .then(response => setShops([...shops]))
    }

    const handleShopDelete = (row) => {
        let jobsNotInShop = jobs.filter(job => job.groupKey !== row.data.__KEY__);
        // ensures that data is not pushed to database as an array
        let newJobsObject = jobsNotInShop.reduce((acc, cur) => ({ [cur.__KEY__]: cur , ...acc}), {});
        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/jobs.json`, newJobsObject)
        .then(response => setJobs(jobsNotInShop))
        .catch(error => console.log(error))

        axios.delete(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/shops/${row.data.__KEY__}.json`)
        .then(response => setShops([...shops]))
        .catch(error => console.log(error))
    }

    const rowRemoved = (row) => {
        axios.delete(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/jobs/${row.data.id}.json`)
        .then(response => setJobs([...jobs]))
        .catch(error => console.log(error))
    }

    const onRowInit = (row) => {
        row.data.groupIndex = shops.length;
        row.data.booked = false;
        row.data.shop = "";
        row.data.shopName = "";
        row.data.jobName = "job name";
        row.data.wallType = "wall type";
        row.data.weeks = 0;
        row.data.start = new Date();
        row.data.fieldStart = new Date();
        row.data.id = row.data.__KEY__;
    }

    const createRows = () => {
        let rows = [];
        let weeks = 100;

        for (let i = 0; i < weeks; i++) {
            let today = new Date();
            today = today.getTime() + toMS( 1 - today.getDay() );

            let date = today + toMS(i*7);

            date = new Date(date).toLocaleDateString();
            let obj = {  date: date, id: i }
            rows.push(obj);
        }
        setDateRows(rows);
    }

    return (
        <div className="App">
            
            {   loaded ?
                <div>
                    <Header tabs={tabs} />
                    <TabPanel tabs={tabs}/>

                    <Switch key="components">
                        <Redirect exact from="/" to="/production-schedule" />  

                            <Route path="/production-schedule">
                                <ProductionSchedule 
                                    jobs={jobs}
                                    shops={shops}
                                    handleUpdate={handleUpdate} 
                                    handleShopUpdate={handleShopUpdate}
                                    handleShopDelete={handleShopDelete}
                                    rowRemoved={rowRemoved}
                                    onRowInit={onRowInit} 
                                    toMS={toMS}
                                    toDays={toDays}
                                />
                            </Route>
                            <Route path="/shop-drawings">
                                <ShopDrawings 
                                    headers={shopDrawingHeaders}
                                    rows={dateRows}
                                />
                            </Route>
                            <Route path="/takeoff-matrix">
                                <TakeoffMatrix 
                                    jobs={jobs}
                                    rows={dateRows}
                                    toMS={toMS}
                                    toDays={toDays}
                                    handleUpdate={handleUpdate}
                                    headers={takeoffHeaders}
                                />
                            </Route>
                            <Route path="/panel-matrix">
                                <PanelMatrix 
                                    data={jobs}
                                    handleUpdate={handleUpdate}
                                    rowRemoved={rowRemoved}
                                    onRowInit={onRowInit}
                                />
                            </Route>
                            <Route path="/fab-matrix">
                                <FabMatrix 
                                    headers={fabHeaders}
                                    rows={dateRows}
                                />
                            </Route>
                            <Route path="/all-activities">
                                <AllActivities 
                                    data={jobs}
                                />
                            </Route>
                            <Route path="/glass-and-gasket">
                                <GlassGasket 
                                    data={jobs}
                                    handleUpdate={handleUpdate}
                                    rowRemoved={rowRemoved}
                                    onRowInit={onRowInit}
                                />
                            </Route>
                            <Route path="/metal">
                                <Metal 
                                    data={jobs}
                                    toMS={toMS}
                                    toDays={toDays}
                                />
                            </Route>
                            <Route path="/field">
                                <Field 
                                    data={jobs}
                                    toMS={toMS}
                                    toDays={toDays}
                                />
                            </Route>
                    </Switch>
                </div>
                :
                <div className={classes.root}>
                    <LinearProgress variant="determinate" value={progress} />
                </div>
            }
        </div>
    );
}

export default withRouter(App);
