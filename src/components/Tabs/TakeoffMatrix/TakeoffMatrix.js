
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
    const { rows, weeks, jobs, headers, handleUpdate, toWeeks, toDays, toMS } = props;
    const [data, setData] = useState(null);
    const [loaded, setLoaded] = useState(true);
    const mainDataGrid = useRef(null);

    useEffect(() => {
        createColumns();
        createRows();
    }, [])

    const checkIfOnSameDate = (date, jobIndex) => {
        let foundOnSameDate = jobs.find((j, i) => {
            if (j.metalTakeoff && i != jobIndex) {
                return j.metalTakeoff.toLocaleDateString() === date.toLocaleDateString()
            }
        })
        return foundOnSameDate ? true : false;
    }

    const createRows = () => {
        let newRows = JSON.parse(JSON.stringify(rows));
        let cols = mainDataGrid.current.instance.option("columns");
        let columns = [...cols];
        columns.shift();

        jobs.forEach((job, jobIndex) => {
            let startOffset = 14;
            let metalTakeoffDate = new Date(job.start.getTime() + toMS(startOffset * 7));

            while (checkIfOnSameDate(metalTakeoffDate, jobIndex)) {
                startOffset += 1;
                metalTakeoffDate = new Date(job.start.getTime() - toMS(startOffset * 7));
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
        setData(newRows);
    }

    const createColumns = () => {
        let cols = mainDataGrid.current.instance.option("columns");
        headers.sort((x, y) => x.offset - y.offset).forEach(header => {
            cols.push({ dataField: header.dataField, caption: header.header, offset: header.offset, name: header.header })
        })
    }

    const rowInserted = (row) => {
        mainDataGrid.current.instance.addColumn({ dataField: row.data.header.split(" ").join(""), caption: row.data.header, offset: row.data.offset });

        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/takeoffmatrix/headers/${row.data.__KEY__}.json`, row.data)
            .then(response => createRows())
            .catch(error => console.log(error))
    }

    const rowUpdated = (row) => {
        let index = row.component.getRowIndexByKey(row.key) + 1;
        let datagrid = mainDataGrid.current.instance;

        // for some reason, I had to do this twice because otherwise the dataField and caption would not update at the same time
        datagrid.columnOption(index, { dataField: row.data.dataField, name: row.data.header });
        datagrid.columnOption(index, { caption: row.data.header });

        let c = mainDataGrid.current.instance.getVisibleColumns();
        c[index].dataField = row.data.dataField;
        c[index].name = row.data.header;
        c[index].caption = row.data.header;
        c[index].offset = row.data.offset;

        datagrid.option("columns")[index] = { dataField: row.data.dataField, caption: row.data.header, offset: row.data.offset, name: row.data.header }

        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/takeoffmatrix/headers/${row.data.__KEY__}.json`, row.data)
            .then(response => { createRows(); })
            .catch(error => console.log(error))
    }

    const rowRemoved = (row) => {
        mainDataGrid.current.instance.deleteColumn(row.data.header);
        axios.delete(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/takeoffmatrix/headers/${row.data.__KEY__}.json`)
            .then(response => createRows())
            .catch(error => console.log(error))
    }

    const rowPrepared = (row) => {
        row.rowElement.style.backgroundColor = row.rowIndex % 2 ? "#b5bdc9" : "white";
    }

    const editorPreparing = (row) => {
        if (row.row.data.dataField === "metalTakeoff") {
            row.cancel = true;
        }
        // row.cancel = row.row.data.dataField === "metalTakeoff" ? true : false;
    }

    return (
        <div>
            {loaded
                ? <div style={{ margin: '3vw' }}>
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
                                        onEditorPreparing={editorPreparing}
                                    >
                                        <Editing
                                            mode="cell"
                                            allowUpdating
                                            allowDeleting
                                            allowAddingonEditorPrepared
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
                                            dataField="dataField"
                                            caption="Data Field"
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

                        <GroupPanel visible={false} autoExpandAll />
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
