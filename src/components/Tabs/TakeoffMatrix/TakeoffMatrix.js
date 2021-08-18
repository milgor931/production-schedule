
import React, { useState, useRef, useEffect } from 'react';
import Spinner from '../../UI/Spinner';
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  SearchPanel,
  Editing,
  Button
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
    const [ colHeaders, setColHeaders ] = useState(headers);
    const [ data, setData] = useState(null);
    const [ loaded, setLoaded ] = useState(true);
    const mainDataGrid = useRef(null);

    useEffect(() => {
        createColumns();
        createRows();
    }, [ ])

    const createRows = () => {
        let newRows = JSON.parse(JSON.stringify(rows));

        let cols = mainDataGrid.current.instance.option("columns");
        let columns = [ ...cols ];
        columns.shift();

        for (let index = 0; index < weeks; index++) {
            jobs.forEach(job => {
                if (job.start.toLocaleDateString() === newRows[index].date) {
                    let i = index - job.weeksToGoBack > 0 ? index - job.weeksToGoBack : 0;
                    while (newRows[i]["Metal Takeoff"] && i > 0) { i-- }
                    newRows[i]["Metal Takeoff"] = job.jobName;
                    columns.forEach(col => {
                        let newIndex = i + col.offset;
                        if (newIndex >= 0 && newIndex < weeks ) {
                            newRows[newIndex][col.dataField] = job.jobName;
                        }
                    })
                }
            })
        }

        let c = mainDataGrid.current.instance.getVisibleColumns();
        let c2 = mainDataGrid.current.instance.option("columns");

        setData(newRows);
    }

    const createColumns = () => {
        let cols = mainDataGrid.current.instance.option("columns");
        headers.sort((x, y) => x.offset - y.offset).forEach(header => {
            cols.push({dataField: header.header, caption: header.header, offset: header.offset})
        })
    }

    const rowInserted = (row) => {
        mainDataGrid.current.instance.addColumn({dataField: row.data.header, caption: row.data.header, offset: row.data.offset})
        createRows();
        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/takeoffmatrix/headers/${row.data.__KEY__}.json`, row.data)
    }

    const rowUpdated = (row) => {
        let index = row.component.getRowIndexByKey(row.key) + 1;

        // for some reason, I had to do this twice because otherwise the dataField and caption would not update at the same time
        mainDataGrid.current.instance.columnOption(index, { dataField: row.data.header, name: row.data.header } );
        mainDataGrid.current.instance.columnOption(index, { caption: row.data.header } );

        let c = mainDataGrid.current.instance.getVisibleColumns();
        c[index].dataField = row.data.header;
        c[index].name = row.data.header;
        c[index].caption = row.data.header;

        mainDataGrid.current.instance.option("columns")[index] = { dataField: row.data.header, caption: row.data.header, offset: row.data.offset, name: row.data.header }
    
        createRows();
        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/takeoffmatrix/headers/${row.data.__KEY__}.json`, row.data)
        .then(response => {
        })
    }

    const rowRemoved = (row) => {
        mainDataGrid.current.instance.deleteColumn(row.data.header)
        createRows();
        axios.delete(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/takeoffmatrix/headers/${row.data.__KEY__}.json`)
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
                        dataSource={colHeaders}
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
                            useIcons
                        />
                        <Column type="buttons">
                            <Button name="delete" />
                        </Column>
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
            ref={mainDataGrid}
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
        
          </DataGrid>
        </div>
        : 
        <Spinner />
      }
      </div>
    );
}

export default TakeoffMatrix;
