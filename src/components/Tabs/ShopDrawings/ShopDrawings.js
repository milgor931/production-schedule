
import React, { useState, useRef, useEffect } from 'react';
import Spinner from '../../UI/Spinner';
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  SearchPanel,
  Editing,
  Button,
  RequiredRule,
  Lookup
} from 'devextreme-react/data-grid';
import axios from 'axios';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckBox from 'devextreme-react/check-box';
import Grid from '@material-ui/core/Grid';

const ShopDrawings = (props) => {
    const { rows, weeks, activities, toDays, jobs, toWeeks, toMS, toMondayDate } = props;
    const [ data, setData] = useState(null);
    const [ loaded, setLoaded ] = useState(true);
    const [ expanded, setExpanded ] = useState(true);
    const [ columns, setColumns ] = useState([]);
    const mainDataGrid = useRef(null);

    useEffect(() => {
        activities.forEach(activity => {
            activity.start = new Date(activity.start);
            activity.end = new Date(activity.end);
        })
        createColumns();
        createRows();
    }, [])

    const createRows = () => {
        let newRows = JSON.parse(JSON.stringify(rows));
        let cols = mainDataGrid.current.instance.option("columns");
        let columns = [ ...cols ];
        columns.shift();

        activities.forEach(activity => {
            let numWeeksForProject = toWeeks(activity.start, activity.end);

            let activityDates = [];
            let start = toMondayDate(activity.start);

            for (let i = 0; i <= numWeeksForProject; i++) {
                let date = start.addDays(i * 7);
                activityDates.push(date);
            }

            for (let i = 0; i < weeks; i++) {
                activityDates.forEach(date => {
                    if (date.toLocaleDateString() === newRows[i].date) {
                        newRows[i][activity.employee] = activity.activity;
                    }
                })
            }
        })

        setData(newRows);
    }

    const createColumns = () => {
        let cols = mainDataGrid.current.instance.option("columns");
        let filteredActivities = [ ...new Set(activities.map(item => item.employee )) ];
        filteredActivities.forEach(header => cols.push({dataField: header, caption: header}))
    }

    const rowInserted = (row) => {
        let datagrid = mainDataGrid.current.instance;
        if (datagrid.getVisibleColumns().find(col => col.dataField === row.data.employee) === undefined) {
            datagrid.addColumn({dataField: row.data.employee })
        }

        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/shopdrawings/headers/${row.data.__KEY__}.json`, row.data)
        .then(response => createRows())
        .catch(error => console.log(error))
    }

    const rowUpdated = (row) => {
        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/shopdrawings/headers/${row.data.__KEY__}.json`, row.data)
        .then(response => createRows())
        .catch(error => console.log(error))
    }

    const rowRemoved = (row) => {
        let datagrid = mainDataGrid.current.instance;

        let isLastOne = activities.filter(activity => activity.employee === row.data.employee).length === 0;
        isLastOne && datagrid.deleteColumn(row.data.employee);
        
        axios.delete(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/shopdrawings/headers/${row.data.__KEY__}.json`)
        .then(response => createRows())
        .catch(error => console.log(error))
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
                        <input type="checkbox" style={{ width: "30px" }} id="expand" name="expand" defaultChecked value={expanded} onChange={() => setExpanded(!expanded)} />
                        <label htmlFor="expand">Expand All</label>
                    </Grid>
                    <Grid item>
                    <DataGrid
                        dataSource={activities}
                        showRowLines
                        showBorders
                        allowColumnResizing
                        columnAutoWidth
                        highlightChanges
                        repaintChangesOnly
                        twoWayBindingEnabled
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

                        <Grouping autoExpandAll={expanded} />

                        <Column 
                            dataField="employeeName" 
                            groupIndex={0} 
                            calculateGroupValue="employee"
                            groupCellRender={row => {
                                return <div style={{flexDirection: "row", display: "flex", alignItems: "center", fontSize: "15px"}}>{row.value}</div>
                            }}
                        />

                        <Column type="buttons">
                            <Button name="delete" />
                        </Column>
                        <Column
                            dataField="employee"
                            caption="Employee"
                            dataType="string"
                            alignment="left"
                        >
                            <RequiredRule />
                        </Column>
                        <Column
                            dataField="start"
                            caption="Start Date"
                            dataType="date"
                            alignment="center"
                            defaultSortOrder="asc"
                        >
                            <RequiredRule />
                        </Column>
                        <Column
                            dataField="end"
                            caption="End Date"
                            dataType="date"
                            alignment="center"
                        >
                            <RequiredRule />
                        </Column>
                        <Column
                            dataField="activity"
                            caption="Activity"
                            alignment="left"
                        >
                            <RequiredRule />
                        </Column>
                        <Column
                            dataField="jobName"
                            caption="Job"
                            alignment="left"
                            width={300}
                        >
                            <Lookup 
                                dataSource={jobs}
                                displayExpr="jobName"
                                valueExpr="jobName"
                            />
                        </Column>
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

export default ShopDrawings;
