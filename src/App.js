// colorful blue #00c7d9
// dark blue #3f50b5
// salmon color #edada6

import React, { useState, useEffect } from 'react';
import TabPanel from './components/Navigation/TabPanel';
import Header from './components/Navigation/Header';
import {
    BrowserRouter,
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
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';

const tabs = [
    {'name': 'Production Schedule','link': '/production-schedule'},
    {'name': 'Shop Drawings', 'link': '/shop-drawings'},
    {'name': 'Takeoff Matrix', 'link': '/takeoff-matrix'},
    {'name': 'Panel Matrix', 'link': '/panel-matrix'},
    {'name': 'Fab Matrix','link': '/fab-matrix'},
    {'name': 'All Activities', 'link': '/all-activities'},
    {'name': 'Glass & Gasket', 'link': '/glass-and-gasket'},
    {'name': 'Metal', 'link': '/metal'},
    {'name': 'Field', 'link': '/field'}
]

const App = () => {
    const [progress, setProgress] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [dateRows, setDateRows] = useState([]);
    const [weeks, setWeeks] = useState(0);
    const [takeoffData, setTakeoffData] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {

        axios.get(`https://ww-production-schedule-default-rtdb.firebaseio.com/data.json`)
            .then(response => {
                if (response.data) {
                    // let newData = JSON.parse(response.data) ;
                    let newData = { ...response.data }
                    newData = { ...newData, jobs: convertDates(newData.jobs) }
                    setData(newData);
                }
                setProgress(100);
                setLoaded(true);
            })
            .catch(error => console.log(error))
    }, [])

    useEffect(() => {
        data.takeoffmatrix && createRows(data.takeoffmatrix);
    }, [ data ])

    const toWeeks = (start, end) => {
        return Math.round((end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000)); 
    }

    const toMondayDate = (d) => {
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    const addDays = (d, days) => {
        const date = new Date(d.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    const convertDates = (updatedJobs) => {
        // this part is not needed if the backend data is already a Date object
        let dateFields = ["start", "fieldStart", "metalTakeoff", "orderWeekOf", "panelFabs", "panelRelease"];
        updatedJobs.forEach(job => {
            dateFields.forEach(field => {
                job[field] = job[field] ? new Date(job[field]) : new Date();
            })

            if (!job.stickwall && job.unitsPerWeek > 0) {
                job.weeks = Math.ceil(job.units / job.unitsPerWeek);
            }

            job.end = addDays(job.start, job.weeks);
        })

        updatedJobs.sort(function (a, b) {
            return a.start.getTime() - b.start.getTime();
        })

        updatedJobs.forEach(job => {
            job.offset = toWeeks(updatedJobs[0].start, job.start)
        });

        let calculatedWeeks = toWeeks(updatedJobs[0].start, updatedJobs[updatedJobs.length - 1].start);

        setWeeks(calculatedWeeks);
        createBasicRows(calculatedWeeks);

        return updatedJobs;
    }

    const handleUpdate = async (newData) => {
        let newState = JSON.stringify(newData);

        let response = await axios
            .put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data.json`, newData)
            .then((result) => {
                setData(newData);
                // setOpenNotification({
                //   open: true,
                //   message: "Item was updated successfully.",
                //   type: "success",
                // });
            })
            .catch((error) => {
                // setOpenNotification({
                //   open: true,
                //   message: "Item was not updated successfully.",
                //   type: "error",
                // });
                console.log(error)
            });

        return response;
    };

    const createBasicRows = (calculatedWeeks) => {
        let rows = [];
        let today = toMondayDate(new Date());

        for (let i = 0; i < calculatedWeeks; i++) {
            let date = addDays(today, i * 7).toLocaleDateString();
            let obj = { date: date, id: i }
            rows.push(obj);
        }
        setDateRows(rows);
    }

    const checkIfOnSameDate = (date, jobIndex) => {
        let foundOnSameDate = data.jobs.find((j, i) => {
            if (j.metalTakeoff && i != jobIndex) {
                return j.metalTakeoff.toLocaleDateString() === date.toLocaleDateString()
            }
        })
        return foundOnSameDate ? true : false;
    }

    const createRows = (cols) => {
        let newRows = JSON.parse(JSON.stringify(dateRows));
        let columns = cols.slice(0);

        data.jobs.forEach((job, jobIndex) => {
            let startOffset = job.weeksToGoBack * -1;
            let metalTakeoffDate = addDays(toMondayDate(job.start), startOffset * 7);

            while (checkIfOnSameDate(metalTakeoffDate, jobIndex)) {
                startOffset -= 1;
                metalTakeoffDate = addDays(toMondayDate(job.start), startOffset * 7);
            }

            job.metalTakeoff = metalTakeoffDate;

            columns.forEach(col => {
                job[col.dataField] = addDays(job.metalTakeoff, col.offset * 7);
            })
        })

        for (let i = 0; i < weeks; i++) {
            data.jobs.forEach(job => {
                columns.forEach(col => {
                    if (job[col.dataField].toLocaleDateString() === newRows[i].date) {
                        newRows[i][col.dataField] = job.jobName;
                    }
                })
            })
        }
        setTakeoffData(newRows);
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
                                data={data}
                                handleUpdate={handleUpdate}
                                toWeeks={toWeeks}
                                toMondayDate={toMondayDate}
                                addDays={addDays}
                            />
                        </Route>
                        <Route path="/shop-drawings">
                            <ShopDrawings
                                data={data}
                                handleUpdate={handleUpdate}
                                rows={dateRows}
                                weeks={weeks}
                                toWeeks={toWeeks}
                                toMondayDate={toMondayDate}
                                addDays={addDays}
                            />
                        </Route>
                        <Route path="/takeoff-matrix">
                            <TakeoffMatrix
                                data={data}
                                handleUpdate={handleUpdate}
                                takeoffData={takeoffData}
                                rows={dateRows}
                                weeks={weeks}
                                createRows={createRows}
                                toWeeks={toWeeks}
                                toMondayDate={toMondayDate}
                                addDays={addDays}
                            />
                        </Route>
                        <Route path="/panel-matrix">
                            <PanelMatrix
                                data={data}
                                handleUpdate={handleUpdate}
                                toWeeks={toWeeks}
                                toMondayDate={toMondayDate}
                                addDays={addDays}
                            />
                        </Route>
                        <Route path="/fab-matrix">
                            <FabMatrix
                                data={data}
                                handleUpdate={handleUpdate}
                                rows={dateRows}
                                weeks={weeks}
                                toWeeks={toWeeks}
                                toMondayDate={toMondayDate}
                                addDays={addDays}
                            />
                        </Route>
                        <Route path="/all-activities">
                            <AllActivities
                                data={data}
                                handleUpdate={handleUpdate}
                                toWeeks={toWeeks}
                                toMondayDate={toMondayDate}
                                addDays={addDays}
                            />
                        </Route>
                        <Route path="/glass-and-gasket">
                            <GlassGasket
                                data={data}
                                handleUpdate={handleUpdate}
                                toWeeks={toWeeks}
                                toMondayDate={toMondayDate}
                                addDays={addDays}
                            />
                        </Route>
                        <Route path="/metal">
                            <Metal
                                data={data}
                                handleUpdate={handleUpdate}
                                toWeeks={toWeeks}
                                toMondayDate={toMondayDate}
                                addDays={addDays}
                            />
                        </Route>
                        <Route path="/field">
                            <Field
                                data={data}
                                handleUpdate={handleUpdate}
                                toWeeks={toWeeks}
                                toMondayDate={toMondayDate}
                                addDays={addDays}
                            />
                        </Route>
                    </Switch>
                </div>
                :
                <div style={{width: "100%"}}>
                    <LinearProgress variant="determinate" value={progress} />
                </div>
            }
        </div>
    );
}

export default withRouter(App);
