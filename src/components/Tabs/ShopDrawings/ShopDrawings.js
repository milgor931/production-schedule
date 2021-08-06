
import React, { useState, useEffect } from 'react';
import Spinner from '../../UI/Spinner';
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  SearchPanel,
  Editing
} from 'devextreme-react/data-grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import axios from 'axios';

const ShopDrawings = (props) => {
    const [ data, setData ] = useState([]);
    const [ loaded, setLoaded ] = useState(false);
    const [ headers, setHeaders ] = useState([]);
    const [ jobs, setJobs ] = useState(null);

    useEffect(() => {
        axios.get("https://ww-production-schedule-default-rtdb.firebaseio.com/shopdrawings/headers.json")
        .then(response => {
            response.data ? setHeaders(Object.values(response.data)) : setHeaders([]);
            setLoaded(true);
        })
        .catch(error => console.log(error))

        axios.get(`https://ww-production-schedule-default-rtdb.firebaseio.com/shopdrawings/data.json`) 
        .then(response => {
            response.data ? setData(Object.values(response.data)) : createRows();
        })
        .catch(error => console.log(error))

        axios.get(`https://ww-production-schedule-default-rtdb.firebaseio.com/jobs.json`)
        .then(response => {
            response.data ? setJobs(Object.values(response.data).map(job => job.jobName)) : setJobs([]);
        })
        .catch(error => console.log(error))

    }, [])

    const createRows = () => {
        let rows = [];
        let weeks = 100;

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
        setData(rows);

        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/shopdrawings/data.json`, rows) 
        .then(response => response)
        .catch(error => console.log(error))
    }

    const handleUpdate = (row) => {
        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/shopdrawings/data/${row.data.id}.json`, row.data)
        .then(response => response.data)
        .catch(error => alert(error))
    }

    const toMilliseconds = (days) => {
        return days * 24 * 60 * 60 * 1000;
    }

    return (
    <div>
      { loaded 
        ?   <div>
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
              mode="batch"
              allowUpdating
              useIcons
              allowSorting={false}
            />

            <Column
                dataField="date"
                fixedPosition="left"
                caption="Date"
                alignment="left"
                width={"auto"}
                allowEditing={false}
            />

            {headers.map((header, index) => 
                <Column
                    key={index}
                    dataField={header.employee}
                    caption={header.employee}
                    // editCellRender={ cell => {
                    //     <FormControl variant="outlined">
                    //         <InputLabel id="demo-simple-select-outlined-label">Job Name</InputLabel>
                    //         <Select
                    //             labelId="demo-simple-select-outlined-label"
                    //             id="demo-simple-select-outlined"
                    //             value={cell.data.header}
                    //             onChange={e => cell.data.header = e.target.value}
                    //             label="Job"
                    //         >
                    //             { jobs.map(job => <MenuItem key={job.jobName} value={job.jobName}> {job.jobName} </MenuItem>) }
                    //         </Select>
                    //     </FormControl>
                    //     }
                    // }
                />
            )}
        
          </DataGrid>
        </div>
      : <Spinner />
      }
      </div>
    );
}

export default ShopDrawings;
