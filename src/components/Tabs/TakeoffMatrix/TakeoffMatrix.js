
import React from 'react';
import DataGrid, {
    Column,
    Grouping,
    GroupPanel,
    SearchPanel,
    Editing,
    Button
} from 'devextreme-react/data-grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';

const TakeoffMatrix = (props) => {
    const { data, handleUpdate, takeoffData } = props;

    const takeoffmatrix = data.takeoffmatrix ? data.takeoffmatrix : [];

    const rowPrepared = (row) => {
        row.rowElement.style.backgroundColor = row.rowIndex % 2 ? "#b5bdc9" : "white";
    }

    const editorPreparing = (row) => {
        if (row.row.data.dataField === "metalTakeoff") {
            row.cancel = true;
        }
    }

    const rowUpdatedHandler = (rowData) => {
        const newData = { ...data, takeoffmatrix: takeoffmatrix };

        rowData.component.beginCustomLoading();
        handleUpdate(newData).then((response) => {
            rowData.component.endCustomLoading();
        }
        );
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
                            <DataGrid
                                dataSource={takeoffmatrix}
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
                                onEditorPreparing={editorPreparing}
                                onRowUpdated={rowUpdatedHandler}
                                onRowRemoved={rowUpdatedHandler}
                                onRowInserted={rowUpdatedHandler}
                            >
                                <Editing
                                    mode="cell"
                                    allowUpdating
                                    allowDeleting
                                    allowAdding
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
                dataSource={takeoffData}
                showBorders
                showRowLines
                allowColumnResizing
                columnAutoWidth
                highlightChanges
                repaintChangesOnly
                twoWayBindingEnabled
                columnResizingMode="widget"
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

                {takeoffmatrix.map(header => {
                    return (
                        <Column
                            key={header.__KEY__}
                            dataField={header.dataField}
                            caption={header.header}
                        />
                    )

                })}
                
            </DataGrid>
        </div>
    );
}

export default TakeoffMatrix;
