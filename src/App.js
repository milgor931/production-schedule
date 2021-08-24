// colorful blue #00c7d9
// dark blue #3f50b5
// salmon color #edada6

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
        'link': '/production-schedule'
    },
    {
        'ID': 2,
        'name': 'Shop Drawings',
        'link': '/shop-drawings'
    },
    {
        'ID': 3,
        'name': 'Takeoff Matrix',
        'link': '/takeoff-matrix'
    },
    {
        'ID': 4,
        'name': 'Panel Matrix',
        'link': '/panel-matrix'
    },
    {
        'ID': 5,
        'name': 'Fab Matrix',
        'link': '/fab-matrix'
    },
    {
        'ID': 6,
        'name': 'All Activities',
        'link': '/all-activities'
    },
    {
        'ID': 7,
        'name': 'Glass & Gasket',
        'link': '/glass-and-gasket'
    },
    {
        'ID': 8,
        'name': 'Metal',
        'link': '/metal'
    },
    {
        'ID': 9,
        'name': 'Field',
        'link': '/field'
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
    const [progress, setProgress] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [shops, setShops] = useState([]);
    const [shopDrawingHeaders, setShopDrawingHeaders] = useState([]);
    const [fabHeaders, setFabHeaders] = useState([]);
    const [dateRows, setDateRows] = useState([]);
    const [takeoffHeaders, setTakeoffHeaders] = useState([]);
    const [weeks, setWeeks] = useState(0);
    const [metal, setMetal] = useState([]);
    const [takeoff, setTakeoff] = useState([]);
    const [field, setField] = useState([]);

    useEffect(() => {

        axios.get(`https://ww-production-schedule-default-rtdb.firebaseio.com/data.json`)
            .then(response => {
                if (response.data) {
                    response.data.shops && setShops(response.data.shops);
                    response.data.jobs && setJobs(convertDates(Object.values(response.data.jobs)));
                    response.data.shopdrawings.headers && setShopDrawingHeaders(Object.values(response.data.shopdrawings.headers));
                    response.data.fabmatrix && setFabHeaders(Object.values(response.data.fabmatrix.headers));
                    response.data.takeoffmatrix.headers && setTakeoffHeaders(Object.values(response.data.takeoffmatrix.headers));
                    response.data.metal && setMetal(Object.values(response.data.metal));
                    response.data.field && setField(Object.values(response.data.field));
                }
                setProgress(100);
                setLoaded(true);
            })
            .catch(error => console.log(error))
    }, [])

    useEffect(() => {
        createRows(takeoffHeaders);
    }, [ takeoffHeaders ])

    const toMS = (days) => {
        return days * 24 * 60 * 60 * 1000;
    }

    const toDays = (ms) => {
        return Math.ceil(ms / (24 * 60 * 60 * 1000));
    }

    const toWeeks = (start, end) => {
        return Math.ceil(toDays(end.getTime() - start.getTime()) / 7);
    }

    const toMondayDate = (d) => {
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    const convertDates = (updatedJobs) => {
        let dateFields = ["start", "fieldStart", "metalTakeoff", "orderWeekOf"]
        updatedJobs.forEach(job => {
            dateFields.forEach(field => {
                job[field] =  job[field] ? new Date(job[field]) : new Date();
            })

            if (!job.stickwall && job.unitsPerWeek > 0) {
                job.weeks = Math.ceil(job.units / job.unitsPerWeek);
            }

            job.end = job.start.addDays(job.weeks);
        })

        updatedJobs.sort(function (a, b) {
            return a.start.getTime() - b.start.getTime();
        })

        updatedJobs.forEach(job => getJobOffset(job, updatedJobs[0]));

        let calculatedWeeks = toWeeks(updatedJobs[0].start, updatedJobs[updatedJobs.length - 1].start);

        setWeeks(calculatedWeeks);

        createBasicRows(calculatedWeeks);

        return updatedJobs;
    }

    const getJobOffset = (job, firstJob) => {
        let jobMondayDate = toMondayDate(job.start);
        job.offset = toWeeks(firstJob.start, jobMondayDate);
    }

    const getOffset = (date, start) => {
        date = new Date(date);
        start = new Date(start);
        return toWeeks(start, date);
    }

    const handleUpdate = (row) => {
        row = row.data ? row.data : row;
        let copy = [...jobs];
        let index = copy.findIndex(job => job.__KEY__ === row.__KEY__)
        copy[index] = row;

        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/jobs/${row.__KEY__}.json`, row)
            .then(response => {
                setJobs(copy);
            })
            .catch(error => console.log(error))
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
        let newJobsObject = jobsNotInShop.reduce((acc, cur) => ({ [cur.__KEY__]: cur, ...acc }), {});
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
        row.data.jobName = "job name";
        row.data.wallType = "wall type";
        row.data.weeks = 0;
        row.data.start = new Date();
        row.data.fieldStart = new Date();
        row.data.id = row.data.__KEY__;
    }

    const createBasicRows = (calculatedWeeks) => {
        let rows = [];
        let today = toMondayDate(new Date()).getTime();

        for (let i = 0; i < calculatedWeeks; i++) {

            let date = today + toMS(i * 7);

            date = new Date(date).toLocaleDateString();
            let obj = { date: date, id: i }
            rows.push(obj);
        }
        setDateRows(rows);
    }

    const checkIfOnSameDate = (date, jobIndex) => {
        let foundOnSameDate = jobs.find((j, i) => {
            if (j.metalTakeoff && i != jobIndex) {
                return j.metalTakeoff.toLocaleDateString() === date.toLocaleDateString()
            }
        })
        return foundOnSameDate ? true : false;
    }

    const createRows = (cols) => {
        let newRows = JSON.parse(JSON.stringify(dateRows));
        let columns = [...cols];
        columns.find(col => col.dataField === "date") && columns.shift();

        jobs.forEach((job, jobIndex) => {
            let startOffset = job.weeksToGoBack;
            let metalTakeoffDate = new Date(toMondayDate(job.start).getTime() - toMS(startOffset * 7));

            while (checkIfOnSameDate(metalTakeoffDate, jobIndex)) {
                startOffset += 1;
                metalTakeoffDate = new Date(toMondayDate(job.start).getTime() - toMS(startOffset * 7));
            }

            job.metalTakeoff = metalTakeoffDate;

            columns.forEach(col => {
                job[col.dataField] = new Date(job.metalTakeoff.getTime() + toMS(col.offset * 7));
            })
        })

        for (let i = 0; i < weeks; i++) {
            jobs.forEach(job => {
                columns.forEach(col => {
                    if (job[col.dataField].toLocaleDateString() === newRows[i].date) {
                        newRows[i][col.dataField] = job.jobName;
                    }
                })
            })
        }

        setTakeoff(newRows);
    }

    const takeoffRowInserted = (row) => {
        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/takeoffmatrix/headers/${row.data.__KEY__}.json`, row.data)
            .then(response => setTakeoffHeaders([...takeoffHeaders]))
            .catch(error => console.log(error))
    }

    const takeoffRowUpdated = (row) => {
        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/takeoffmatrix/headers/${row.data.__KEY__}.json`, row.data)
            .then(response => setTakeoffHeaders([...takeoffHeaders]))
            .catch(error => console.log(error))
    }

    const takeoffRowRemoved = (row) => {
        axios.delete(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/takeoffmatrix/headers/${row.data.__KEY__}.json`)
            .then(response => setTakeoffHeaders([...takeoffHeaders]))
            .catch(error => console.log(error))
    }

    const metalRowInserted = (row) => {
        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/metal/${row.data.__KEY__}.json`, row.data)
        .then(response => setMetal([...metal]))
        .catch(error => console.log(error))
    }

    const metalRowUpdated = (row) => {
        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/metal/${row.data.__KEY__}.json`, row.data)
        .then(response => setMetal([...metal]))
        .catch(error => console.log(error))
    }

    const metalRowRemoved = (row) => {
        axios.delete(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/metal/${row.data.__KEY__}.json`)
        .then(response => setMetal([...metal]))
        .catch(error => console.log(error))
    }

    const fieldRowInserted = (row) => {
        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/field/${row.data.__KEY__}.json`, row.data)
        .then(response => setField([...field]))
        .catch(error => console.log(error))
    }

    const fieldRowUpdated = (row) => {
        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/field/${row.data.__KEY__}.json`, row.data)
        .then(response => setField([...field]))
        .catch(error => console.log(error))
    }

    const fieldRowRemoved = (row) => {
        axios.delete(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/field/${row.data.__KEY__}.json`)
        .then(response => setField([...field]))
        .catch(error => console.log(error))
    }

    return (
        <div className="App">

            {loaded ?
                <div>
                    <Header tabs={tabs} />
                    <TabPanel tabs={tabs} />

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
                                toMondayDate={toMondayDate}
                            />
                        </Route>
                        <Route path="/shop-drawings">
                            <ShopDrawings
                                jobs={jobs}
                                activities={shopDrawingHeaders}
                                rows={dateRows}
                                weeks={weeks}
                                toDays={toDays}
                                toMS={toMS}
                                handleUpdate={handleUpdate}
                                toWeeks={toWeeks}
                            />
                        </Route>
                        <Route path="/takeoff-matrix">
                            <TakeoffMatrix
                                jobs={jobs}
                                rows={dateRows}
                                weeks={weeks}
                                toMS={toMS}
                                toDays={toDays}
                                toWeeks={toWeeks}
                                handleUpdate={handleUpdate}
                                headers={takeoffHeaders}
                                createRows={createRows}
                                takeoff={takeoff}
                                rowInserted={takeoffRowInserted}
                                rowUpdated={takeoffRowUpdated}
                                rowRemoved={takeoffRowRemoved}
                            />
                        </Route>
                        <Route path="/panel-matrix">
                            <PanelMatrix
                                data={jobs}
                                handleUpdate={handleUpdate}
                                rowRemoved={rowRemoved}
                                onRowInit={onRowInit}
                                getOffset={getOffset}
                                toDays={toDays}
                                toMS={toMS}
                                toWeeks={toWeeks}
                            />
                        </Route>
                        <Route path="/fab-matrix">
                            <FabMatrix
                                jobs={jobs}
                                activities={fabHeaders}
                                rows={dateRows}
                                weeks={weeks}
                                toDays={toDays}
                                toMS={toMS}
                                toWeeks={toWeeks}
                                handleUpdate={handleUpdate}
                                getOffset={getOffset}
                                toMondayDate={toMondayDate}
                            />
                        </Route>
                        <Route path="/all-activities">
                            <AllActivities
                                jobs={jobs}
                                takeoff={takeoffHeaders}
                                shopdrawings={shopDrawingHeaders}
                                fabmatrix={fabHeaders}
                                handleUpdate={handleUpdate}
                            />
                        </Route>
                        <Route path="/glass-and-gasket">
                            <GlassGasket
                                jobs={jobs}
                                handleUpdate={handleUpdate}
                                toMS={toMS}
                                toDays={toDays}
                                toWeeks={toWeeks}
                                getOffset={getOffset}
                            />
                        </Route>
                        <Route path="/metal">
                            <Metal
                                metal={metal}
                                jobs={jobs}
                                shops={shops}
                                handleUpdate={handleUpdate}
                                toMS={toMS}
                                toDays={toDays}
                                toWeeks={toWeeks}
                                toMondayDate={toMondayDate}
                                rowInserted={metalRowInserted}
                                rowRemoved={metalRowRemoved}
                                rowUpdated={metalRowUpdated}
                            />
                        </Route>
                        <Route path="/field">
                            <Field
                                field={field}
                                jobs={jobs}
                                shops={shops}
                                handleUpdate={handleUpdate}
                                toMS={toMS}
                                toDays={toDays}
                                toWeeks={toWeeks}
                                toMondayDate={toMondayDate}
                                rowInserted={fieldRowInserted}
                                rowRemoved={fieldRowRemoved}
                                rowUpdated={fieldRowUpdated}
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
