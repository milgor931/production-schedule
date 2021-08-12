
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
    const { rows, jobs, headers, toMS, toDays } = props;
    const [ data, setData] = useState(null);
    const [ loaded, setLoaded ] = useState(false);
    const [ columns, setColumns ] = useState([]);

    useEffect(() => {
        createRows();
        setColumns(headers.map(header => 
            <Column
                key={header.header}
                dataField={header.header}
                caption={header.header}
                dataType="string"
            />
        ))
        setData(data)
        setLoaded(true);
    }, [ headers ])

    const findRowIndex = ( rows, job, index ) => {
        try {
            let i = index - job.weeksToGoBack;
            while (rows[i]["Metal Takeoff"]) { i-- }
            index = i;
            headers.forEach(header => rows[index + header.offset][header.header] = job.jobName )
        }
        catch(error) { console.log(error) }
    }

    const createRows = () => {
        let weeks = Math.floor(toDays(new Date(jobs[jobs.length - 1].start).getTime() - new Date(jobs[0].start).getTime())/7);

        for (let i = 0; i < weeks; i++) {
            jobs.forEach(job => {
                job.start.toLocaleDateString() === rows[i].date && findRowIndex(rows, job, i);

                // axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/jobs/${job.id}.json`, job) 
                // .then(response => response.data)
                // .catch(error => console.log(error))
            })
        }

        setData(rows);
    }

    const rowPrepared = (row) => {
        row.rowElement.style.backgroundColor = row.rowIndex % 2 ? "#b5bdc9" : "white";
    }

    const handleUpdate = (row) => {
        // axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/takeoffmatrix/headers.json`, headers)
        // .then(response =>  ))
        this.datagrid.instance.refresh();
    }

    return (
    <div>
      {loaded 
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
                        // onRowUpdated={rowUpdated}
                    >
                        <Editing
                        mode="cell"
                        allowUpdating
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
            // onRowUpdated={handleUpdate}
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
