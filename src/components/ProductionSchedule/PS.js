
import React, { useState, useEffect } from 'react';
import { jobs, dependencies, resources, resourceAssignments } from '../../data.js';
import Gantt, { Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing, Toolbar, Item, Validation, ContextMenu } from 'devextreme-react/gantt';
import TabPanel from 'devextreme-react/tab-panel';
import ProductionScheduleChart from './PS_Chart.js';
import ProductionScheduleGantt from './PS_Gantt.js';
import Gallery from 'devextreme-react/gallery';
import Graph from './PS_Graph.js';
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import Spinner from '../Spinner';
import { Tooltip } from 'devextreme-react/tooltip';
import DG_Grantt from './PS_DG_Gantt';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';

const useStyles = makeStyles({
    root: {
      width: 500,
    },
    radio: {

    }
  });

const ProductionSchedule = (props) => {
    const classes = useStyles();
    const [ tabs, setTabs ] = useState([]);
    const [ data, setData ] = useState(null);
    const [ loaded, setLoaded ] = useState(false);
    const [ selectedIndex, setSelectedIndex ] = useState(0);
    const [ startDate, setStartDate ] = useState();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        axios.get("https://ww-production-schedule-default-rtdb.firebaseio.com/jobs.json")
        .then(response => {
            response.data ? setData(Object.values(response.data)) : setData([]);
        })
        .catch(error => {
            alert(error);
        })
    }, [])

    useEffect(() => {
        if (data) {
            data.forEach(row => {
                convertDate(row)
                getOffset(row, data[getStartDateIndex()].start);
            })
            
            data.length > 0 && setStartDate(data[getStartDateIndex()].start);
        } 
        setTabs([
            {
                'ID': 0,
                'name': 'Gantt',
                'component': <DG_Grantt
                                data={data} 
                                handleUpdate={handleUpdate}
                                getStartDateIndex={getStartDateIndex}
                                getEndDateIndex={getEndDateIndex}
                             />
            },
            {
                'ID': 1,
                'name': 'Production Schedule',
                'component': <ProductionScheduleChart 
                                data={data} 
                                handleUpdate={handleUpdate}
                                rowAdded={handleUpdate}
                                rowRemoved={rowRemoved}
                                onRowInit={onRowInit}
                            />
            }, 
            {
                'ID': 2,
                'name': 'Units Graph',
                'component': <Graph 
                                data={data} 
                                handleUpdate={handleUpdate}
                             />
            },
            {
                'ID': 3,
                'name': 'Gantt Chart',
                'component': <ProductionScheduleGantt 
                                data={data} 
                                handleUpdate={handleUpdate}
                             />
            },
        ])

        setLoaded(true);

    }, [ data ])

    const convertDate = (row) => {
        row.start = new Date(row.start);
        row.fieldStart = new Date(row.fieldStart);
        let start = row.start.getTime();
        let weeks = Math.ceil(row.units/row.unitsPerWeek);
        row.weeks = weeks;
        let time = weeks * 7 * 24 * 60 * 60 * 1000;
        time = start + time;
        row.end = new Date(time);
    }
    
    const getStartDateIndex = () => {
        let s = convertMillisecondsToDays(new Date(data[0].start).getTime());
        let jobIndex = 0;
        data.forEach((job, index) => {
            if (convertMillisecondsToDays(new Date(job.start).getTime()) < s) {
                jobIndex = index;
                s = convertMillisecondsToDays(new Date(job.start).getTime());
            } 
        })
        return jobIndex;
    }

    const getEndDateIndex = () => {
        let s = convertMillisecondsToDays(new Date(data[0].start).getTime());
        let jobIndex = 0;
        data.forEach((job, index) => {
            if (convertMillisecondsToDays(new Date(job.start).getTime()) > s) {
                jobIndex = index;
                s = convertMillisecondsToDays(new Date(job.start).getTime());
            } 
        })
        return jobIndex;
    }
  
    const getOffset = (row, start) => {
        let days = convertMillisecondsToDays(new Date(row.start).getTime());
        row.offset = Math.ceil((days - convertMillisecondsToDays(new Date(start).getTime()))/7);
    }

    const convertMillisecondsToDays = (ms) => {
        return Math.ceil(ms / (24 * 60 * 60 * 1000));
    }

    const handleUpdate = (row) => {
        if (row.data) {
            row = row.data;
        }
        row.title = row.jobName;
        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/jobs/${row.id}.json`, row)
        .then(response => {
            setData([ ...data ])
        })
        .catch(error => alert(error))
    }

    const rowRemoved = (row) => {
        // setData([ Object.assign(data, row.data) ])
        axios.delete(`https://ww-production-schedule-default-rtdb.firebaseio.com/jobs/${row.data.id}.json`)
        .then(response => {
            // setData([ ...data ])
        })
        .catch(error => alert(error))
    }

    const onRowInit = (row) => {
        row.data.booked = false;
        row.data.shop = "";
        row.data.jobName = "job name";
        row.data.title = "job name";
        row.data.wallType = "wall type";
        row.data.start = new Date();
        row.data.fieldStart = new Date();
        row.data.id = row.data.__KEY__;
    }

    const inputs = ["gantt", "chart", "graph"].map((value, index) => 
        <Grid item>
            <Radio
                checked={selectedIndex === index}
                onChange={e => setSelectedIndex(index)}
                value={index}
                color="primary"
                name="radio-buttons"
                inputProps={{ 'aria-label': index }}
                size="small"
            />
        </Grid>
    )

    return (
      <div>
          { loaded
            ? 
            <div>
                <Grid container style={{marginTop: '20px'}} direction="row" alignItems="center" justifyContent="center">
                    {inputs}
                </Grid>

                <div style={{margin: '3vw'}}>
                    {data && tabs[selectedIndex].component}
                </div>
            </div>
            : 
            <Spinner />
          }
        
      </div>
    );
}



export default ProductionSchedule;
