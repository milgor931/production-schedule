
import React, { useState, useEffect } from 'react';
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
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';

const ShopDrawings = (props) => {
    const { data, rows, handleUpdate, weeks, toWeeks, toMondayDate, addDays } = props;
    const [expanded, setExpanded] = useState(true);
    const [shopDrawingsData, setShopDrawingsData] = useState([]);
    const [columns, setColumns] = useState([]);

    const jobs = data.jobs ? data.jobs : [];
    const shopdrawings = data.shopdrawings ? data.shopdrawings : [];

    useEffect(() => {
        // also don't need if the dates are already date objects
        shopdrawings.forEach(activity => {
            activity.start = new Date(activity.start);
            activity.end = new Date(activity.end);
        })
        createColumns();
        createRows();
    }, [])

    const createRows = () => {
        let newRows = JSON.parse(JSON.stringify(rows));

        shopdrawings.forEach(activity => {
            let numWeeksForProject = toWeeks(activity.start, activity.end);

            let activityDates = [];
            let start = toMondayDate(activity.start);

            for (let i = 0; i <= numWeeksForProject; i++) {
                let date = addDays(start, i * 7);
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

        setShopDrawingsData(newRows);
    }

    const createColumns = () => {
        let cols = [...new Set(shopdrawings.map(item => item.employee))];
        setColumns(cols);
    }

    const rowUpdatedHandler = (rowData) => {
        const newData = { ...data, shopdrawings: shopdrawings };

        createColumns();

        rowData.component.beginCustomLoading();
        handleUpdate(newData).then((response) => {
            createRows();
            rowData.component.endCustomLoading();
        }
        );
    }

    const rowPrepared = (row) => {
        row.rowElement.style.backgroundColor = row.rowIndex % 2 ? "#b5bdc9" : "white";
    }

    return (
        <div style={{ margin: '3vw' }}>
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
                                dataSource={shopdrawings}
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
                                onRowUpdated={rowUpdatedHandler}
                                onRowRemoved={rowUpdatedHandler}
                                onRowInserted={rowUpdatedHandler}
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
                                        return <div style={{ flexDirection: "row", display: "flex", alignItems: "center", fontSize: "15px" }}>{row.value}</div>
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
                dataSource={shopDrawingsData}
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

                {columns.map(column => (
                    <Column
                        key={column}
                        dataField={column}
                        caption={column}
                    />
                ))}
            </DataGrid>

        </div>
    );
}

export default ShopDrawings;
