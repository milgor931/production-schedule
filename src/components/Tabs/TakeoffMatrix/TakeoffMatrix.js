
import React, { useState, createRef, useEffect } from 'react';
import Spinner from '../../UI/Spinner';
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  SearchPanel,
  Editing,
  Button,
} from 'devextreme-react/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const TakeoffMatrix = (props) => {
    const [ data, setData] = useState(null);
    const [ jobs, setJobs ] = useState(null);
    const [ loaded, setLoaded ] = useState(false);
    const [ headers, setHeaders ] = useState(["Id's Drafting", "Check Model", "Pallet Schedule", "Metal Takeoff", "Glass Takeoff", "Door Schedule", "Shop Use Brakes and Steel", "Mock Ups", "Mock-Up Overflow"])

    useEffect(() => {
        axios.get("https://ww-production-schedule-default-rtdb.firebaseio.com/jobs.json")
        .then(response => {
            response.data && setJobs(Object.values(response.data).sort(function(a, b) {
                return a.offset - b.offset;
            }));
            setLoaded(true);
        })
        .catch(error => {
            alert(error);
        })

        axios.get(`https://ww-production-schedule-default-rtdb.firebaseio.com/takeoffmatrix.json`) 
        .then(response => {
            response.data ? setData(Object.values(response.data)) : createRows();
        })
        .catch(error => console.log(error))

    }, [])

    useEffect(() => {
        jobs && createRows();
    }, [ jobs ])

    const columns = headers.map(header => 
        <Column
            key={header}
            dataField={header}
            caption={header}
            dataType="string"
        />
    )

    const findRowIndex = ( rows, job, index ) => {
        
        let i = index - 2;
        let notDone = true;

        if ( i > 2 ) {
            while ( i > 0 && notDone ) {
                if ( rows[i]["Check Model"] ) {
                    i--;
                } else {
                    notDone = false;
                }
            }

            rows[i]["Check Model"] = job.jobName;
            
        }

        if (index > 0) {
            rows[index - 1]["Pallet Schedule"] = job.jobName;
            job.palletSchedule = rows[index - 1].date;
        }
        if (index < rows.length) {
            rows[index + 1]["Glass Takeoff"] = job.jobName;
            job.glassTakeoff = rows[index + 1].date;
            rows[index + 1]["Door Schedule"] = job.jobName;
            job.doorSchedule = rows[index + 1].date;
        }
        if (index < rows.length - 1) {
            rows[index + 2]["Shop Use Brakes and Steel"] = job.jobName;
            job.shopUseBrakesAndSteel = rows[index + 2].date;
        }

        if ( index - job.weeksToGoBack > 0 ) {
            index -= job.weeksToGoBack;
        } else {
            index = 0;
        }

        notDone = true;

        // find id's drafing index
        while ( index > 0 && notDone ) {
            if (rows[index]["Id's Drafting"]) {
                index--;
            } else {
                notDone = false;
            }
        }

        rows[index]["Id's Drafting"] = job.jobName + " " + job.weeksToGoBack;
    }

    const createRows = () => {
        let rows = [];

        let weeks = Math.floor(toDays(new Date(jobs[jobs.length - 1].start).getTime() - new Date(jobs[0].start).getTime())/7);

        for (let i = 0; i < weeks; i++) {
            let today = new Date();
            today = today.getTime() + toMilliseconds( 1 - today.getDay() );

            let date = today + toMilliseconds(i*7);

            date = new Date(date).toLocaleDateString();
            let obj = {
                date: date,
                id: i
            }

            rows.push(obj);
        }

        for (let i = 0; i < weeks; i++) {
            jobs.forEach((job, index) => {
                if (new Date(job.start).toLocaleDateString() === rows[i].date) {
                    rows[i]["Metal Takeoff"] = job.jobName;
                    findRowIndex(rows, job, i);
                }

                axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/jobs/${job.id}.json`, job) 
                .then(response => response.data)
                .catch(error => console.log(error))
            })
        }

        setData(rows);

        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/takeoffmatrix.json`, rows)
        .then(response => response.data)
        .catch(error => console.log(error))
    }

    const handleUpdate = (row) => {
        // axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/takeoffmatrix/${row.data.id}.json`, data)
        // .then(response => setData([ ...data ]))
        // .catch(error => alert(error))
    }

    const toMilliseconds = (days) => {
        return days * 24 * 60 * 60 * 1000;
    }

    const toDays = (ms) => {
        return Math.ceil( ms / (24 * 60 * 60 * 1000) );
    }

    return (
    <div>
      {loaded 
        ? <div>
          <DataGrid
            dataSource={data}
            showBorders
            showRowLines
            allowColumnResizing
            columnAutoWidth
            highlightChanges
            repaintChangesOnly
            twoWayBindingEnabled
            columnResizingMode="nextColumn"
            wordWrapEnabled
            autoExpandAll
            highlightChanges
            onRowUpdated={handleUpdate}
          >

            <GroupPanel visible={false} autoExpandAll/>
            <SearchPanel visible highlightCaseSensitive={false} />
            <Grouping autoExpandAll />

            <Editing
                mode="row"
                useIcons
                allowSorting={false}
            />

            <Column
                dataField="date"
                caption="Date"
                alignment="left"
                width={"auto"}
                allowEditing={false}
            />

            {columns}
        
          </DataGrid>
        </div>
        : 
        <Spinner />
      }
      </div>
    );
}

export default TakeoffMatrix;
