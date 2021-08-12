
import React, { useState, createRef, useEffect } from 'react';
import Spinner from '../../UI/Spinner';
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Pager,
  Paging,
  RowDragging,
  SearchPanel,
  Editing,
  Summary, 
  Sorting,
  RequiredRule,
  TotalItem,
  MasterDetail,
  GroupItem,
  Button,
  FilterRow, 
  RemoteOperations
} from 'devextreme-react/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';


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
    const { data, handleUpdate, onRowInit, rowRemoved } = props;
    const [ loaded, setLoaded ] = useState(true);
    const classes = useStyles();

    const renderRow = (row) => {
      if (row.rowType === "data") {
        if (!row.data.booked) {
          row.rowElement.style.backgroundColor = "cyan";
        } else if (row.data.header) {
          row.rowElement.style.backgroundColor = "#a8a8a8";
        }
      } 
    }

    return (
    <div>
      {loaded 
        ? <div style={{margin: '3vw'}}>
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
            onInitNewRow={onRowInit}
            // onInitialized={onRowInit}
            onRowUpdated={handleUpdate}
            onRowInserted={handleUpdate}
            onRowRemoved={rowRemoved}
            // onCellPrepared={cellPrepared}
            onRowPrepared={renderRow}
            cellHintEnabled

          >

            <GroupPanel visible={false} autoExpandAll/>
            <SearchPanel visible highlightCaseSensitive={false} />
            <Grouping autoExpandAll />
            {/* <FilterRow visible={true} /> */}
            <Sorting mode="multiple" />

            <Editing
              mode="batch"
              allowUpdating
              allowAdding
              useIcons
              allowSorting
            />

            <Column
                dataField="jobNumber" 
                dataType="string"
                caption="Job Number" 
                alignment="center" 
            >
                <RequiredRule />
            </Column>

            <Column 
                dataField="jobName" 
                dataType="string"
                caption="Job Name" 
                alignment="left">
                    <RequiredRule />
            </Column>

            <Column
                dataField="start"
                dataType="date"
                caption="Metal Takeoff"
                alignment="center"
            >
                <RequiredRule />
            </Column>

            <Column
                dataField="fieldStart"
                dataType="date"
                caption="Field Start"
                alignment="center"
            >
                <RequiredRule />
            </Column>

            <Column
                dataField="panelFabs"
                dataType="date"
                caption="Panel Fabs"
                alignment="center"
            >
                <RequiredRule />
            </Column>

            <Column
                dataField="panelRelease"
                dataType="date"
                caption="Panel Release"
                alignment="center"
            >
                <RequiredRule />
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
                calculateCellValue={row => row.dollarAmount && `$ ${(row.dollarAmount/row.sqft).toFixed(2)}`}
            >
            </Column>

            <Column
                dataField="panelRFQ"
                dataType="boolean"
                caption="Panel RFQ"
                alignment="center"
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
      : <Spinner />
      }
      </div>
    );
}

export default PanelMatrix;
