
import React, { useState } from 'react';
import DataGrid, {
    Column,
    Grouping,
    GroupPanel,
    SearchPanel,
    Editing,
    Sorting
} from 'devextreme-react/data-grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    blueColumn: {
        backgroundColor: "#00c7d9",
        color: 'white'
    }
}));

const PanelMatrix = (props) => {
    const { data, handleUpdate, toWeeks, addDays } = props;
    const classes = useStyles();

    const jobs = data.jobs ? data.jobs : [];

    const renderRow = (row) => {
        if (row.rowType === "data" && !row.data.booked) {
            row.rowElement.style.backgroundColor = "cyan";
        } else if (row.rowType === "data" && row.data.booked && row.data.engineering) {
            row.rowElement.style.backgroundColor = "#edada6";
        }
    }

    const panelFabsRender = (row) => {
        if (row.data.panelFabs) {
            const panelFabs = row.data.panelFabs ? row.data.panelFabs.toLocaleDateString() : "";
            row.data.panelFabsOffset = toWeeks(row.data.fieldStart, row.data.panelFabs);
            return (
                <div>
                    {panelFabs}
                    <br />
                    <p style={{ color: "#3f50b5" }}>{row.data.panelFabsOffset} weeks after field start</p>
                </div>
            )
        }
    }

    const panelFabsEdit = (row) => {
        let link = row.data.linkToField;
        return (
            <div>
                {link
                    ? <input
                        placeholder="weeks after field start"
                        onChange={e => {
                            let date = addDays(row.data.fieldStart, e.target.value * 7);
                            row.setValue(date);
                        }}
                    />
                    : <input
                        type="date"
                        value={row.data.panelFabs}
                        onChange={e => {
                            let d = new Date(e.target.value);
                            d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
                            row.setValue(d);
                        }}
                    />
                }
            </div>
        )
    }

    const panelReleaseRender = (row) => {
        if (row.data.panelRelease) {
            const panelRelease = row.data.panelRelease ? row.data.panelRelease.toLocaleDateString() : "";
            row.data.panelReleaseOffset = toWeeks(row.data.fieldStart, row.data.panelRelease);
            return (
                <div>
                    {panelRelease}
                    <br />
                    <p style={{ color: "#3f50b5" }}>{row.data.panelReleaseOffset} weeks after field start</p>
                </div>
            )
        }
    }

    const panelReleaseEdit = (row) => {
        let link = row.data.linkToField;
        return (
            <div>
                {link
                    ? <input
                        placeholder="weeks after field start"
                        onChange={e => {
                            let date = addDays(row.data.fieldStart, e.target.value * 7);
                            row.setValue(date);
                        }}
                    />
                    :
                    <input
                        type="date"
                        value={row.data.panelRelease}
                        onChange={e => {
                            let d = new Date(e.target.value);
                            d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
                            row.setValue(d);
                        }}
                    />

                }
            </div>
        )
    }

    const rowUpdatedHandler = (rowData) => {
        const newData = { ...data, jobs: jobs };

        rowData.component.beginCustomLoading();
        handleUpdate(newData).then((response) =>
            rowData.component.endCustomLoading()
        );
    };

    return (
        <div style={{ margin: '3vw' }}>
            <DataGrid
                dataSource={jobs}
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
                columnResizingMode="widget"
                onRowPrepared={renderRow}
                cellHintEnabled
                onRowInserted={rowUpdatedHandler}
                onRowRemoved={rowUpdatedHandler}
                onRowUpdated={rowUpdatedHandler}
            >

                <GroupPanel visible={false} autoExpandAll />
                <SearchPanel visible highlightCaseSensitive={false} />
                <Grouping autoExpandAll />
                <Sorting mode="multiple" />

                <Editing
                    mode="cell"
                    allowUpdating
                    useIcons
                    allowSorting
                />

                <Column
                    dataField="linkToField"
                    dataType="boolean"
                    caption="Link to Field Start"
                    calculateCellValue={row => row.linkToField ? row.linkToField : false}
                />

                <Column
                    dataField="jobNumber"
                    dataType="string"
                    caption="Job Number"
                    alignment="center"
                    allowEditing={false}
                    fixed
                >
                </Column>

                <Column
                    dataField="jobName"
                    dataType="string"
                    caption="Job Name"
                    alignment="left"
                    allowEditing={false}
                    fixed
                >
                </Column>

                <Column
                    dataField="start"
                    dataType="date"
                    caption="Metal Takeoff"
                    alignment="center"
                    allowEditing={false}
                >
                </Column>

                <Column
                    dataField="fieldStart"
                    dataType="date"
                    caption="Field Start"
                    alignment="center"
                >
                </Column>

                <Column
                    dataField="panelFabs"
                    dataType="date"
                    caption="Panel Fabs"
                    minWidth="160"
                    alignment="center"
                    cellRender={panelFabsRender}
                    editCellRender={panelFabsEdit}
                >
                </Column>

                <Column
                    dataField="panelRelease"
                    dataType="date"
                    caption="Panel Release"
                    alignment="center"
                    minWidth="160"
                    cellRender={panelReleaseRender}
                    editCellRender={panelReleaseEdit}
                >
                </Column>

                <Column
                    dataField="dollarAmount"
                    dataType="number"
                    caption="Dollar Amount"
                    alignment="center"
                    calculateDisplayValue={cell => cell.dollarAmount && `$ ${cell.dollarAmount}`}
                >
                </Column>

                <Column
                    dataField="sqft"
                    dataType="number"
                    caption="Sq. Ft."
                    alignment="center"
                >
                </Column>

                <Column
                    dataField="vendor"
                    dataType="string"
                    caption="Vendor"
                    alignment="center"
                >
                </Column>

                <Column
                    dataField="costPerSqft"
                    dataType="number"
                    caption="$ per Sq. Ft."
                    alignment="center"
                    allowEditing={false}
                    calculateCellValue={row => row.dollarAmount && `$ ${(row.dollarAmount / row.sqft).toFixed(2)}`}
                >
                </Column>

                <Column
                    dataField="panelRFQ"
                    dataType="boolean"
                    caption="Panel RFQ"
                    alignment="center"
                    calculateCellValue={row => row.panelRFQ ? row.panelRFQ : false}
                >
                </Column>

                <Column
                    dataField="proposedPanelReleases"
                    dataType="number"
                    caption="Proposed Panel Releases (from Sherwin)"
                    alignment="center"
                    cssClass={classes.blueColumn}
                >
                </Column>

                <Column
                    dataField="panelScope"
                    // dataType="number"
                    caption="Panel Scope"
                    alignment="center"
                    cssClass={classes.blueColumn}
                >
                </Column>

                <Column
                    dataField="vendorKickOffLetter"
                    dataType="string"
                    caption="Vendor Kick-Off Letter"
                    alignment="center"
                    cssClass={classes.blueColumn}
                >
                </Column>

                <Column
                    dataField="kickOffMeeting"
                    dataType="string"
                    caption="PM/Vendor Kick-Off Meeting"
                    alignment="center"
                    cssClass={classes.blueColumn}
                >
                </Column>
                <Column
                    dataField="finalPanelReleases"
                    dataType="number"
                    caption="Final Panel Releases"
                    alignment="center"
                    cssClass={classes.blueColumn}
                >
                </Column>

                <Column
                    dataField="keyNotes"
                    dataType="string"
                    caption="Key Notes for Scope"
                    alignment="center"
                    cssClass={classes.blueColumn}
                >
                </Column>

                <Column
                    dataField="finish"
                    dataType="string"
                    caption="Finish"
                    alignment="center"
                >
                </Column>

                <Column
                    dataField="certifiedMatchApproved"
                    dataType="boolean"
                    caption="Certified Match Approved"
                    alignment="center"
                    calculateCellValue={row => row.certifiedMatchApproved ? row.certifiedMatchApproved : false}
                >
                </Column>

                <Column
                    dataField="warranty"
                    dataType="string"
                    caption="Warranty"
                    alignment="center"
                >
                </Column>

                <Column
                    dataField="deliveryStartDateShop"
                    dataType="date"
                    caption="Delivery Start Date Shop"
                    alignment="center"
                >
                </Column>

                <Column
                    dataField="deliveryStartDateField"
                    dataType="date"
                    caption="Delivery Start Date Field"
                    alignment="center"
                >
                </Column>

                <Column
                    dataField="shopUseBrakes"
                    dataType="date"
                    caption="Shop Use Brakes Shape Release"
                    alignment="center"
                >
                </Column>

                <Column
                    dataField="shopUseSteel"
                    dataType="date"
                    caption="Shop Use Steel Release"
                    alignment="center"
                >
                </Column>

                <Column
                    dataField="glazeInPanelRelease"
                    dataType="date"
                    caption="Glaze-In Panel Release"
                    alignment="center"
                >
                </Column>

                <Column
                    dataField="fieldUsePanelRelease"
                    dataType="date"
                    caption="Field Use Panel Release"
                    alignment="center"
                >
                </Column>

                <Column
                    dataField="QC"
                    // dataType="date"
                    caption="QC"
                    alignment="center"
                >
                </Column>

                <Column
                    dataField="doorLeafs"
                    dataType="number"
                    caption="# of Door Leafs"
                    alignment="center"
                >
                </Column>

                <Column
                    dataField="notes"
                    dataType="string"
                    caption="Notes"
                    alignment="left"
                >
                </Column>

            </DataGrid>
        </div>
    );
}

export default PanelMatrix;
