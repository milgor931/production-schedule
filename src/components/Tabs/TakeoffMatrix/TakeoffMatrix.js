
import React, { useState, useRef, useEffect } from 'react';
import Spinner from '../../UI/Spinner';
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  SearchPanel,
  Editing
} from 'devextreme-react/data-grid';
import axios from 'axios';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';

const TakeoffMatrix = (props) => {
    const { rows, weeks, jobs, headers, toMS, toDays } = props;
    const [ data, setData] = useState(null);
    const [ loaded, setLoaded ] = useState(false);
    const [ columns, setColumns ] = useState([]);
    const [ taskHeaders, setHeaders ] = useState(headers);

    useEffect(() => {
        updateColumns();
        createRows();
        setLoaded(true);
    }, [ ])

    const createRows = () => {
        let newRows = [...rows];
        for (let index = 0; index < weeks; index++) {
            jobs.forEach(job => {
                if (job.start.toLocaleDateString() === rows[index].date) {
                    let i = index - job.weeksToGoBack > 0 ? index - job.weeksToGoBack : 0;
                    while (newRows[i]["Metal Takeoff"] && i > 0) { i-- }
                    newRows[i]["Metal Takeoff"] = job.jobName;
                    headers.forEach(header => {
                        let newIndex = i + header.offset;
                        if (newIndex >= 0 && newIndex < weeks ) {
                            newRows[newIndex][header.header] = job.jobName;
                        }
                    })
                }
                
                // axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/jobs/${job.id}.json`, job) 
                // .then(response => response.data)
                // .catch(error => console.log(error))
            })
        }

        setData(newRows);
    }

    const updateColumns = () => {
        setColumns(headers.map(header => 
            <Column
                key={header.header}
                dataField={header.header}
                caption={header.header}
                dataType="string"
            />
        ))
    }

    const rowInserted = (row) => {
        updateColumns();
        createRows();
        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/takeoffmatrix/headers.json`, headers)
        .then(response => setHeaders(response.data))
    }

    const rowUpdated = (row) => {
        updateColumns();
        createRows();
        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/takeoffmatrix/headers.json`, headers)
        .then(response => setHeaders(response.data))
    }

    const rowRemoved = (row) => {
        updateColumns();
        createRows();
        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/takeoffmatrix/headers.json`, headers)
        .then(response => setHeaders(response.data))
    }

    const rowPrepared = (row) => {
        row.rowElement.style.backgroundColor = row.rowIndex % 2 ? "#b5bdc9" : "white";
    }

    return (
    <div>
      { loaded 
        ? <div style={{margin: '3vw'}}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                <Typography>Adjust Columns</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Grid container direction="column">
                    <Grid item>
                    <DataGrid
                        dataSource={headers}
                        showRowLines
                        showBorders
                        allowColumnResizing
                        columnAutoWidth
                        highlightChanges
                        repaintChangesOnly
                        twoWayBindingEnabled
                        columnResizingMode="nextColumn"
                        wordWrapEnabled
                        autoExpandAll
                        highlightChanges
                        onRowUpdated={rowUpdated}
                        onRowRemoved={rowRemoved}
                        onRowInserted={rowInserted}
                    >
                        <Editing
                            mode="cell"
                            allowUpdating
                            allowDeleting
                            allowAdding
                        />
                        <Column
                        dataField="header"
                        caption="Header"
                        dataType="string"
                        alignment="left"
                        />
                        <Column
                        dataField="offset"
                        caption="Offset Amount"
                        dataType="number"
                        alignment="left"
                        />
                    </DataGrid>
                    </Grid>
                </Grid>
            </AccordionDetails>
          </Accordion>

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
            onRowPrepared={rowPrepared}
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
