
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

const useStyles = makeStyles({
    root: {
      width: 500,
    },
  });

const ProductionSchedule = (props) => {
    const [ tabs, setTabs ] = useState([]);
    const [ data, setData ] = useState(null);
    const [ loaded, setLoaded ] = useState(true);
    const [ selectedIndex, setSelectedIndex ] = useState(0);
    const [ startDate, setStartDate ] = useState();

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
                'name': 'Gantt Chart',
                'component': <ProductionScheduleGantt 
                                data={data} 
                                handleUpdate={handleUpdate}
                             />
            },
            {
                'ID': 1,
                'name': 'Production Schedule',
                'component': <ProductionScheduleChart 
                                data={data} 
                                handleUpdate={handleUpdate}
                                rowAdded={rowAdded}
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
            }
        ])
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
        row.data.title = row.data.jobName;
        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/jobs/${row.data.id}.json`, row.data)
        .then(response => {
            setData([ ...data ])
        })
        .catch(error => alert(error))
    }

    const rowAdded = (row) => {
        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/jobs/${row.data.id}.json`, row.data)
        .then(response => {
            // console.dir(data)
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
        let shop = prompt("What shop is the job for?");
        row.data.booked = false;
        row.data.shop = shop;
        row.data.jobName = "job name";
        row.data.title = "job name";
        row.data.wallType = "wall type";
        row.data.start = new Date();
        row.data.fieldStart = new Date();
        row.data.id = row.data.__KEY__;
    }

    // const inputs = ["gantt", "chart", "graph"].map((value, index) => {
    //     <input 
    //         defaultChecked
    //         id={value}
    //         type="radio" 
    //         name="view" 
    //         value={value} 
    //         onClick={e => {
    //             setSelectedIndex(index);
    //         }}
    //     />
    // })

    return (
      <div>
          { loaded
            ? 
            <div>
                <div style={{margin: '20px', textAlign:"center"}}>
                    {/* {inputs} */}
                    <input 
                        defaultChecked
                        id="gantt"
                        type="radio" 
                        name="view" 
                        value="gantt" 
                        onClick={e => {
                            setSelectedIndex(0);
                        }}
                    />
                     {/* <Tooltip
                        target="#gantt"
                        showEvent="dxhoverstart"
                        hideEvent="dxhoverend"
                        position="right"
                    >
                        <div>ExcelRemote IR</div>
                    </Tooltip> */}
                    <input 
                        id="chart"
                        type="radio" 
                        name="view" 
                        value="chart" 
                        onClick={e => setSelectedIndex(1)}
                    />
                     {/* <Tooltip
                        target="#chart"
                        showEvent="dxhoverstart"
                        hideEvent="dxhoverend"
                    >
                        <div>ExcelRemote IR</div>
                    </Tooltip> */}
                    <input 
                        id="graph"
                        type="radio" 
                        name="view" 
                        value="graph" 
                        onClick={e => setSelectedIndex(2)}
                    />
                     {/* <Tooltip
                        target="#graph"
                        showEvent="dxhoverstart"
                        hideEvent="dxhoverend"
                    >
                        <div>ExcelRemote IR</div>
                    </Tooltip> */}
                </div>

                <div>
                    {data && tabs[selectedIndex].component}
                </div>
            </div>

            // <Gallery
            //     id="gallery"
            //     dataSource={[
            //         {
            //             'ID': 0,
            //             'name': 'Gantt Chart',
            //             'component': <ProductionScheduleGantt 
            //                             data={data} 
            //                             handleUpdate={handleUpdate}
            //                          />
            //         },
            //         {
            //             'ID': 1,
            //             'name': 'Production Schedule',
            //             'component': <ProductionScheduleChart 
            //                             data={data} 
            //                             handleUpdate={handleUpdate}
            //                             rowAdded={rowAdded}
            //                             rowRemoved={rowRemoved}
            //                             onRowInit={onRowInit}
            //                         />
            //         }, 
            //         {
            //             'ID': 3,
            //             'name': 'Units Graph',
            //             'component': <Graph 
            //                             data={data} 
            //                             handleUpdate={handleUpdate}
            //                          />
            //         }
            //     ]}
            //     height={height}
            //     hoverStateEnabled
            //     slideshowDelay={0}
            //     showNavButtons={false}
            //     loop={false}
            //     showIndicator
            //     selectedIndex={selectedIndex}
            //     onOptionChanged={onSelectionChanged}
            //     itemRender={itemComponentRender}
            //     animationEnabled={false}
            //     swipeEnabled={false}
            // />
            : 
            <Spinner />
          }
        
      </div>
    );
}



export default ProductionSchedule;
